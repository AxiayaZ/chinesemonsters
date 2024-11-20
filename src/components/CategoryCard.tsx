import React from 'react';
import { useNavigate } from 'react-router-dom';

// CategoryCard组件属性接口定义
interface CategoryCardProps {
  type: string;
  imageUrl: string;
  description: string;
}

// 分类卡片组件
const CategoryCard: React.FC<CategoryCardProps> = ({ type, imageUrl, description }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/category/${type}`)}
      className="relative h-screen w-1/4 cursor-pointer overflow-hidden group"
    >
      {/* 背景图片 */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300" />
      
      {/* 内容区域 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-6xl font-bold mb-4 writing-vertical-rl">{type}</h2>
        <p className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 writing-vertical-rl">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CategoryCard;