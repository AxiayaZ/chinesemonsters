import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CategoryCard from './components/CategoryCard';
import NavigationButton from './components/NavigationButton';
import CategoryPage from './pages/CategoryPage';
import MonsterDetailPage from './pages/MonsterDetailPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import MapPage from './pages/MapPage';
import ErrorBoundary from './components/ErrorBoundary';

// 定义分类数据
const categories = [
  {
    type: '妖',
    imageUrl: 'https://i.ibb.co/Xxfgmk3/3.jpg',
    description: ''
  },
  {
    type: '精',
    imageUrl: 'https://i.ibb.co/VvMjqmm/4.jpg',
    description: ''
  },
  {
    type: '鬼',
    imageUrl: 'https://i.ibb.co/MkvhrfT/1.jpg',
    description: ''
  },
  {
    type: '怪',
    imageUrl: 'https://i.ibb.co/7Jnb34y/2.jpg',
    description: ''
  }
];

// 首页组件
const HomePage = () => (
  <div className="flex h-screen overflow-hidden">
    {categories.map((category) => (
      <CategoryCard
        key={category.type}
        type={category.type}
        imageUrl={category.imageUrl}
        description={category.description}
      />
    ))}
    <NavigationButton type="map" position="left" />
    <NavigationButton type="graph" position="right" />
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category" element={<Navigate to="/category/妖" replace />} />
          <Route path="/category/:type" element={<CategoryPage />} />
          <Route path="/monster/:id" element={<MonsterDetailPage />} />
          <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;