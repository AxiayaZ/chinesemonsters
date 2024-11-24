import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import * as d3 from 'd3';

interface NodeData {
  id: string;
  name: string;
  type: 'Book' | 'Monster' | 'Location';
  description?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

interface LinkData {
  source: NodeData;
  target: NodeData;
  type: string;
  description?: string;
}

interface KnowledgeGraphProps {
  data: {
    nodes: NodeData[];
    links: LinkData[];
  };
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<SVGGElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [showLocations, setShowLocations] = useState(true);

  const visibleData = useMemo(() => {
    const visibleNodes = data.nodes.filter(node => 
      node.type !== 'Location' || showLocations
    );
    const visibleNodeIds = new Set(visibleNodes.map(node => node.id));
    
    const visibleLinks = data.links.filter(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId);
    });

    return { nodes: visibleNodes, links: visibleLinks };
  }, [data, showLocations]);

  const simulation = useMemo(() => {
    if (!visibleData.nodes.length) return null;
    
    return d3.forceSimulation(visibleData.nodes)
      .force('link', d3.forceLink(visibleData.links)
        .id((d: any) => d.id)
        .distance(150))
      .force('charge', d3.forceManyBody()
        .strength(d => d.type === 'Book' ? -2000 : -1000)
        .distanceMax(500))
      .force('collision', d3.forceCollide()
        .radius(d => d.type === 'Book' ? 80 : 50)
        .strength(0.5))
      .force('x', d3.forceX()
        .strength(0.02))
      .force('y', d3.forceY()
        .strength(0.02))
      .velocityDecay(0.8)
      .alpha(0.3)
      .alphaDecay(0.02);
  }, [visibleData]);

  const renderGraph = useCallback(() => {
    if (!svgRef.current || !simulation || !visibleData.nodes.length) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    const container = svg.append('g');
    containerRef.current = container.node();

    const zoomBehavior = d3.zoom()
      .scaleExtent([0.2, 2])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior as any)
       .call(zoomBehavior.transform as any, 
         d3.zoomIdentity
           .translate(width / 2, height / 2)
           .scale(0.8));

    const link = container.append('g')
      .selectAll('line')
      .data(visibleData.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1);

    const node = container.append('g')
      .selectAll('g')
      .data(visibleData.nodes)
      .join('g')
      .on('click', (event, d: NodeData) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .call(d3.drag<any, NodeData>()
        .on('start', (event, d) => {
          if (!event.active && simulation) simulation.alphaTarget(0.1).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active && simulation) simulation.alphaTarget(0);
          if (d.type !== 'Book') {
            d.fx = null;
            d.fy = null;
          }
        }) as any);

    node.append('circle')
      .attr('r', d => d.type === 'Book' ? 40 : 25)
      .attr('fill', d => {
        switch (d.type) {
          case 'Book': return '#1E40AF';
          case 'Monster': return '#DC2626';
          case 'Location': return '#047857';
          default: return '#999';
        }
      })
      .attr('fill-opacity', 0.8)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node.append('text')
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'Book' ? 50 : 35)
      .attr('fill', '#333')
      .style('font-size', d => d.type === 'Book' ? '14px' : '12px')
      .style('font-weight', 'bold');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    svg.on('click', () => setSelectedNode(null));

  }, [visibleData, simulation]);

  useEffect(() => {
    renderGraph();
  }, [renderGraph, showLocations]);

  const colorMap = {
    'Book': '#1E40AF',    // 深蓝色 - 典籍
    'Monster': '#6B7280', // 灰色 - 妖怪
    'Location': '#047857' // 绿色 - 地点
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10">
        <h3 className="text-sm font-semibold mb-2">图例说明</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#1E40AF] mr-2"></div>
            <span className="text-sm">典籍</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#6B7280] mr-2"></div>
            <span className="text-sm">妖怪</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-[#047857] mr-2"></div>
              <span className="text-sm">地点</span>
            </div>
            <input
              type="checkbox"
              checked={showLocations}
              onChange={e => setShowLocations(e.target.checked)}
              className="ml-2 h-4 w-4 rounded border-gray-300 
                         text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
        <div className="mb-2">缩放: {(zoom * 100).toFixed(0)}%</div>
        <button 
          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          onClick={() => {
            if (svgRef.current && containerRef.current) {
              const width = svgRef.current.clientWidth;
              const height = svgRef.current.clientHeight;
              d3.select(svgRef.current)
                .transition()
                .duration(750)
                .call(
                  (d3.zoom() as any).transform,
                  d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(0.8)
                );
            }
          }}
        >
          重置视图
        </button>
      </div>

      {selectedNode && (
        <div 
          className="absolute top-32 left-4 bg-white p-4 rounded-lg shadow-xl z-20 
                     max-w-md border border-gray-200"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold">{selectedNode.name}</h3>
            <button
              className="text-gray-400 hover:text-gray-600 p-1"
              onClick={() => setSelectedNode(null)}
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium mr-2">类型:</span>
              <span>{selectedNode.type}</span>
            </div>
            {selectedNode.description && (
              <div className="text-sm text-gray-600">
                <span className="font-medium mr-2">描述:</span>
                <span>{selectedNode.description}</span>
              </div>
            )}
            {visibleData.links.some(link => 
              link.source.id === selectedNode.id || link.target.id === selectedNode.id
            ) && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-500">关联关系:</span>
                <ul className="mt-1 space-y-1">
                  {Array.from(new Set(visibleData.links
                    .filter(link => link.source.id === selectedNode.id || link.target.id === selectedNode.id)
                    .map(link => {
                      const isSource = link.source.id === selectedNode.id;
                      const otherNode = isSource ? link.target : link.source;
                      return {
                        name: (otherNode as NodeData).name,
                        description: link.description,
                        direction: isSource ? '→' : '←'
                      };
                    })
                    .map(item => JSON.stringify(item))
                  )).map(itemStr => {
                    const item = JSON.parse(itemStr);
                    return (
                      <li key={itemStr} className="text-xs text-gray-600">
                        {`${item.direction} ${item.name}`}
                        {item.description && ` (${item.description})`}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <svg
        ref={svgRef}
        className="w-full h-full rounded-lg bg-white"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '85vh'
        }}
      />
    </div>
  );
};

export default KnowledgeGraph;