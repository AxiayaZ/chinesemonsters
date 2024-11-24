import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryNav from '../components/CategoryNav';
import MonsterGrid from '../components/MonsterGrid';
import Pagination from '../components/Pagination';
import { getMonsters } from '../services/monsterService';

const ITEMS_PER_PAGE = 50;

const CategoryPage: React.FC = () => {
  const { type = '统领' } = useParams<{ type: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [monsters, setMonsters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMonsters({ 
          type, 
          search: searchTerm,
          page: currentPage,
          limit: ITEMS_PER_PAGE 
        });
        
        if (response.monsters && Array.isArray(response.monsters)) {
          setMonsters(response.monsters);
          setTotalPages(response.totalPages || 1);
        } else {
          setMonsters([]);
          setError('数据格式错误');
        }
      } catch (err) {
        setError('获取数据失败，请稍后重试');
        setMonsters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonsters();
  }, [type, searchTerm, currentPage]);

  const getSuggestions = (term: string) => {
    if (!term) return [];
    return monsters
      .filter((monster) => monster.name.toLowerCase().includes(term.toLowerCase()))
      .map((monster) => monster.name)
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={setSearchTerm}
        searchPlaceholder="搜索妖怪..."
        suggestions={getSuggestions(searchTerm)}
        onSuggestionClick={(name) => setSearchTerm(name)}
      />

      <div className="pt-20">
        <CategoryNav currentType={type} />
      </div>

      <main className="container mx-auto px-4 pt-6 pb-8">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-6">{error}</div>
        ) : monsters.length === 0 ? (
          <div className="text-center text-gray-600 py-6">暂无数据</div>
        ) : (
          <>
            <MonsterGrid monsters={monsters} />
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;