import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import * as d3 from 'd3';

// 扩展 NodeData 接口以兼容 D3 的 SimulationNodeDatum
interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: string;
  description?: string;
  properties?: { [key: string]: any };
}

interface LinkData extends d3.SimulationLinkDatum<NodeData> {
  type: string;
  description?: string;
}

interface KnowledgeGraphProps {
  data: {
    nodes: NodeData[];
    links: LinkData[];
  };
}

interface DragEvent {
  active: boolean;
  subject: NodeData;
  x: number;
  y: number;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [zoom, setZoom] = useState(1);
  
  // 定义拖拽函数
  const dragstarted = useCallback((event: DragEvent, simulation: d3.Simulation<NodeData, LinkData>) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }, []);

  const dragged = useCallback((event: DragEvent) => {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }, []);

  const dragended = useCallback((event: DragEvent, simulation: d3.Simulation<NodeData, LinkData>) => {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }, []);
  
  // 使用 useMemo 缓存力导向模拟配置
  const simulation = useMemo(() => {
    if (!data.nodes.length) return null;
    
    return d3.forceSimulation<NodeData, LinkData>(data.nodes)
      .force('link', d3.forceLink<NodeData, LinkData>(data.links)
        .id(d => d.id)
        .distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('collision', d3.forceCollide().radius(60))
      .stop();
  }, [data.nodes, data.links]);

  // 修改渲染函数
  const renderGraph = useCallback(() => {
    if (!svgRef.current || !simulation || !data.nodes.length) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // 修改缩放行为，添加范围限制
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.1, 4])
      .translateExtent([[0, 0], [width, height]]) // 限制平移范围
      .extent([[0, 0], [width, height]])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        setZoom(event.transform.k);
      });

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .call(zoomBehavior as any);

    // 创建一个背景矩形来捕获点击事件
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('click', () => setSelectedNode(null));

    // 创建一个容器组来包含所有元素
    const container = svg.append('g');

    // 定义箭头标记
    const defs = container.append('defs');
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 30)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', '#999')
      .attr('d', 'M0,-5L10,0L0,5');

    // 创建连接线
    const link = container.append('g')
      .selectAll('g')
      .data(data.links)
      .join('g');

    // 添加连接线
    link.append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow)');

    // 添加关系类型标签
    link.append('text')
      .attr('dy', -5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .style('font-size', '10px')
      .text((d: LinkData) => d.type);

    // 修改节点组，移除 mouseover 事件
    const node = container.append('g')
      .selectAll<SVGGElement, NodeData>('g')
      .data(data.nodes)
      .join('g')
      .call(d3.drag<SVGGElement, NodeData>()
        .on('start', (event) => dragstarted(event as unknown as DragEvent, simulation))
        .on('drag', (event) => dragged(event as unknown as DragEvent))
        .on('end', (event) => dragended(event as unknown as DragEvent, simulation)))
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // 添加节点外圈
    node.append('circle')
      .attr('r', 25)
      .attr('fill', 'white')
      .attr('stroke', (d: NodeData) => getNodeColor(d.type))
      .attr('stroke-width', 3);

    // 添加节点内圈
    node.append('circle')
      .attr('r', 23)
      .attr('fill', (d: NodeData) => getNodeColor(d.type))
      .attr('fill-opacity', 0.3);

    // 添加节点文本
    node.append('text')
      .text((d: NodeData) => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .attr('fill', '#333')
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    // 更新位置时添加边界检查
    simulation.on('tick', () => {
      requestAnimationFrame(() => {
        // 添加边界限制
        data.nodes.forEach(d => {
          d.x = Math.max(30, Math.min(width - 30, d.x || 0));
          d.y = Math.max(30, Math.min(height - 30, d.y || 0));
        });

        link.select('line')
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        link.select('text')
          .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
          .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

        node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
      });
    });

    simulation.restart();

  }, [data, simulation, dragstarted, dragged, dragended]);

  // 获取节点颜色
  const getNodeColor = useCallback((type: string) => {
    const colorMap: { [key: string]: string } = {
      Book: '#4CAF50',
      Monster: '#FF5722',
      Location: '#2196F3'
    };
    return colorMap[type] || '#9E9E9E';
  }, []);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      renderGraph();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderGraph]);

  // 初始渲染
  useEffect(() => {
    renderGraph();
  }, [renderGraph]);

  return (
    <div className="relative w-full h-full">
      {/* 控制面板 */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
        <div className="mb-2">缩放: {(zoom * 100).toFixed(0)}%</div>
        <button 
          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          onClick={() => {
            if (svgRef.current) {
              d3.select(svgRef.current)
                .transition()
                .duration(750)
                .call(d3.zoom().transform as any, d3.zoomIdentity);
            }
          }}
        >
          重置视图
        </button>
      </div>

      {/* 节点详情面板 */}
      {selectedNode && (
        <div className="absolute left-4 top-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-xs">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{selectedNode.name}</h3>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="text-sm text-gray-600 mb-2">类型: {selectedNode.type}</div>
          {selectedNode.description && (
            <p className="text-sm mb-2">{selectedNode.description}</p>
          )}
          {selectedNode.properties && Object.entries(selectedNode.properties).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="font-medium">{key}:</span> {value}
            </div>
          ))}
        </div>
      )}

      <svg
        ref={svgRef}
        className="w-full h-full rounded-lg bg-white"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '700px'
        }}
      />
    </div>
  );
};

export default KnowledgeGraph;