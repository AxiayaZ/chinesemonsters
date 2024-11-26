import React from 'react';
import { Link } from 'react-router-dom';

// CategoryCard组件属性接口定义
interface CategoryCardProps {
  type: string;
  imageUrl: string;
  description: string;
}

// 分类卡片组件
const CategoryCard: React.FC<CategoryCardProps> = ({ type, imageUrl, description }) => {
  return (
    <Link 
      to={`/category/${type}`} 
      className="relative flex-1 group overflow-hidden transition-transform duration-500 hover:scale-110"
    >
      <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-20 transition-opacity duration-300"></div>
      <img 
        src={imageUrl} 
        alt={type} 
        className="w-full h-full object-cover transition-transform duration-300"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="writing-vertical">
          <span 
            className="chinese-font text-9xl text-white tracking-wider"
            style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}
          >
            {type}
          </span>
        </div>
      </div>
      {description && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm">{description}</p>
        </div>
      )}
    </Link>
  );
};

export default CategoryCard;