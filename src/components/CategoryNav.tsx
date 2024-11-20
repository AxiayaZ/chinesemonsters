import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CategoryNavProps {
  currentType: string;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ currentType }) => {
  const navigate = useNavigate();
  const categories = ['统领', '妖', '精', '鬼', '怪'];

  const getButtonClass = (type: string) => {
    const isActive = currentType === type;
    return `px-8 py-3 text-lg transition-colors duration-300 
           ${isActive 
             ? 'bg-gray-900 text-white' 
             : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
           rounded-lg`;
  };

  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-8 py-4">
          {categories.map((type) => (
            <button
              key={type}
              onClick={() => navigate(`/category/${type}`)}
              className={getButtonClass(type)}
            >
              {type}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CategoryNav;