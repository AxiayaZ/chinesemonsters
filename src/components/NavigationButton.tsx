import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapIcon, NetworkIcon } from 'lucide-react';

interface NavigationButtonProps {
  type: 'map' | 'graph';
  position: 'left' | 'right';
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ type, position }) => {
  const navigate = useNavigate();
  
  const Icon = type === 'map' ? MapIcon : NetworkIcon;
  const text = type === 'map' ? '互动地图' : '知识图谱';
  const path = type === 'map' ? '/map' : '/knowledge-graph';
  
  return (
    <button
      onClick={() => navigate(path)}
      className={`fixed bottom-8 ${position === 'left' ? 'left-8' : 'right-8'} 
        flex items-center gap-2 bg-black/90 px-6 py-3 rounded-full
        text-yellow-400 hover:bg-black hover:text-yellow-300 
        transition-all duration-300 shadow-lg hover:shadow-xl`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
};

export default NavigationButton;