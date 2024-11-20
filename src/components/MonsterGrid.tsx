import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Monster {
  _id: string;
  name: string;
  imageUrl: string;
  type: string;
}

interface MonsterGridProps {
  monsters: Monster[];
}

const MonsterGrid: React.FC<MonsterGridProps> = ({ monsters }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-5 gap-9 p-8 max-w-6xl mx-auto">
      {monsters.map((monster) => (
        <div
          key={monster._id}
          onClick={() => navigate(`/monster/${monster._id}`)}
          className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md 
                   transition-all duration-300 hover:-translate-y-1 cursor-pointer
                   w-[180px] mx-auto"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={monster.imageUrl}
              alt={monster.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3 text-center bg-white">
            <h3 className="text-lg font-medium text-gray-800">
              {monster.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonsterGrid;