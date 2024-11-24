import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Header from '../components/Header';
import { getMonsters } from '../services/monsterService';

interface MonsterLocation {
  _id: string;
  id: string;
  name: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  imageUrl: string;
}

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedMonster, setSelectedMonster] = useState<MonsterLocation | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [monsters, setMonsters] = useState<MonsterLocation[]>([]);
  const clickHandlerRef = useRef<((e: any) => void) | null>(null);

  // 加载所有妖怪数据
  useEffect(() => {
    const loadAllMonsters = async () => {
      try {
        const response = await getMonsters();
        setMonsters(response.monsters.filter(monster => 
          monster.location && monster.location.lat && monster.location.lng
        ));
      } catch (error) {
        console.error('Failed to load monsters:', error);
      }
    };
    loadAllMonsters();
  }, []);

  // 计算弹窗位置
  const calculatePopupPosition = (markerPosition: any, mapSize: any) => {
    const popupWidth = 320;
    const popupHeight = 400;
    const offset = 20;
    const markerSize = 12;

    let x = markerPosition.x;
    let y = markerPosition.y;

    // 优先尝试在右侧显示
    if (x + markerSize + offset + popupWidth <= mapSize.width) {
      x = x + markerSize + offset;
      y = y - popupHeight / 2;
    }
    // 否则尝试在左侧显示
    else if (x - markerSize - offset - popupWidth >= 0) {
      x = x - markerSize - offset - popupWidth;
      y = y - popupHeight / 2;
    }
    // 如果左右都不行，则显示在上方或下方
    else {
      x = x - popupWidth / 2;
      if (y - popupHeight - offset >= 0) {
        y = y - popupHeight - offset;
      } else {
        y = y + markerSize + offset;
      }
    }

    // 确保弹窗不会超出地图边界
    x = Math.max(0, Math.min(x, mapSize.width - popupWidth));
    y = Math.max(0, Math.min(y, mapSize.height - popupHeight));

    return { x, y };
  };

  // 创建标记点内容
  const createMarkerContent = (isSelected: boolean) => {
    const div = document.createElement('div');
    div.className = 'marker-content';
    div.style.width = '12px';
    div.style.height = '12px';
    div.style.borderRadius = '50%';
    div.style.backgroundColor = isSelected ? '#dc2626' : '#4a5568';
    div.style.border = '2px solid white';
    div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    div.style.transition = 'all 0.3s ease';
    div.style.cursor = 'pointer';
    return div;
  };

  // 更新标记点状态
  const updateMarkerStates = (selectedId: string | null) => {
    markers.forEach((marker) => {
      const monsterId = marker.getExtData().monsterId;  // 获取存储在标记点中的妖怪ID
      marker.setContent(createMarkerContent(monsterId === selectedId));
    });
  };

  // 初始化地图
  useEffect(() => {
    if (mapContainer.current && !map && window.AMap) {
      const mapInstance = new window.AMap.Map(mapContainer.current, {
        zoom: 5,
        center: [104.195397, 35.86166],
        mapStyle: 'amap://styles/whitesmoke'
      });

      // 点击地图空白处时重置所有标记点状态
      clickHandlerRef.current = () => {
        updateMarkerStates(null);
        setSelectedMarkerId(null);
        setSelectedMonster(null);
      };

      mapInstance.on('click', clickHandlerRef.current);
      setMap(mapInstance);
    }

    return () => {
      if (map && clickHandlerRef.current) {
        map.off('click', clickHandlerRef.current);
      }
    };
  }, []);

  // 更新标记点
  useEffect(() => {
    if (map && monsters.length > 0) {
      // 清除现有标记
      markers.forEach(marker => marker.remove());
      
      // 创建新标记
      const newMarkers = monsters.map(monster => {
        const marker = new window.AMap.Marker({
          position: [monster.location.lng, monster.location.lat],
          content: createMarkerContent(monster._id === selectedMarkerId),  // 使用 _id 替代 id
          offset: new window.AMap.Pixel(-6, -6),
          zIndex: 100,
          extData: { monsterId: monster._id }  // 存储 _id 而不是 id
        });

        marker.on('click', () => {
          // 阻止事件冒泡到地图
          if (clickHandlerRef.current) {
            map.off('click', clickHandlerRef.current);
            setTimeout(() => {
              map.on('click', clickHandlerRef.current);
            }, 0);
          }
          
          // 更新标记点状态
          updateMarkerStates(monster._id);  // 使用 _id 替代 id
          setSelectedMarkerId(monster._id);
          
          // 计算弹窗位置
          const pixel = map.lngLatToContainer([monster.location.lng, monster.location.lat]);
          const mapSize = map.getSize();
          const position = calculatePopupPosition(pixel, mapSize);
          
          setPopupPosition(position);
          setSelectedMonster(monster);
        });

        map.add(marker);
        return marker;
      });

      setMarkers(newMarkers);
    }

    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [map, monsters, selectedMarkerId]);

  // 处理搜索
  const handleSearch = (term: string) => {
    if (!term) return;
    
    const foundMonster = monsters.find(m => m.name.includes(term));
    if (foundMonster) {
      // 更新标记点状态
      updateMarkerStates(foundMonster.id);
      setSelectedMarkerId(foundMonster.id);
      
      // 设置地图中心和缩放级别
      map.setCenter([foundMonster.location.lng, foundMonster.location.lat]);
      map.setZoom(8);
      
      // 计算并设置弹窗位置
      const pixel = map.lngLatToContainer([foundMonster.location.lng, foundMonster.location.lat]);
      const mapSize = map.getSize();
      const position = calculatePopupPosition(pixel, mapSize);
      
      setPopupPosition(position);
      setSelectedMonster(foundMonster);
    }
  };

  return (
    <div className="h-screen relative">
      <Header
        onSearch={handleSearch}
        searchPlaceholder="搜索妖怪..."
      />

      <div className="pt-24 h-full">
        <div ref={mapContainer} className="w-full h-full" />

        {selectedMonster && (
          <div 
            style={{
              position: 'absolute',
              left: `${popupPosition.x}px`,
              top: `${popupPosition.y}px`,
            }}
            className="w-80 bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="relative h-40">
              <img
                src={selectedMonster.imageUrl}
                alt={selectedMonster.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 w-full p-4 text-white">
                <h2 className="text-xl font-bold mb-1">{selectedMonster.name}</h2>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm opacity-90">
                    {`${selectedMonster.location.lat.toFixed(4)}, ${selectedMonster.location.lng.toFixed(4)}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm mb-3">
                {selectedMonster.type}
              </span>
              <p className="text-gray-600 text-sm">{selectedMonster.description}</p>
              <button
                onClick={() => navigate(`/monster/${selectedMonster._id}`)}
                className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg
                         hover:bg-gray-800 transition-colors duration-300"
              >
                查看详情
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;