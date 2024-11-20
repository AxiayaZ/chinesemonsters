import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CategoryCard from './components/CategoryCard';
import NavigationButton from './components/NavigationButton';
import CategoryPage from './pages/CategoryPage';
import MonsterDetailPage from './pages/MonsterDetailPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import MapPage from './pages/MapPage';

// 定义分类数据
const categories = [
  {
    type: '妖',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9',
    description: '具有神通变化之力的精怪'
  },
  {
    type: '精',
    imageUrl: 'https://images.unsplash.com/photo-1490077476659-095159692ab5',
    description: '天地精华所化之物'
  },
  {
    type: '鬼',
    imageUrl: 'https://images.unsplash.com/photo-1536599524557-5f784dd53282',
    description: '亡者之魂所化'
  },
  {
    type: '怪',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
    description: '异于常态之物'
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

function App() {
  return (
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
  );
}

export default App;