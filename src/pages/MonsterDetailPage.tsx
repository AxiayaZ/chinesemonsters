import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getMonsterById, getMonsters } from '../services/monsterService';

const MonsterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [monster, setMonster] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [prevMonsterId, setPrevMonsterId] = useState<string | null>(null);
  const [nextMonsterId, setNextMonsterId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonster = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getMonsterById(id);
        
        if (!data) {
          setError('妖怪不存在');
          return;
        }

        setMonster(data);
        
        // 获取前后妖怪ID
        const allMonsters = await getMonsters();
        if (Array.isArray(allMonsters.monsters)) {
          const currentIndex = allMonsters.monsters.findIndex(m => m._id === id);
          if (currentIndex > 0) {
            setPrevMonsterId(allMonsters.monsters[currentIndex - 1]._id);
          } else {
            setPrevMonsterId(null);
          }
          if (currentIndex < allMonsters.monsters.length - 1) {
            setNextMonsterId(allMonsters.monsters[currentIndex + 1]._id);
          } else {
            setNextMonsterId(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch monster:', err);
        setError('获取数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchMonster();
  }, [id]);

  const handleSearch = async (term: string) => {
    try {
      if (term.trim()) {
        const response = await getMonsters({ search: term });
        const suggestions = response.monsters.map((m: { name: string }) => m.name);
        setSearchSuggestions(suggestions);
      } else {
        setSearchSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSearchSuggestions([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !monster) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '妖怪不存在'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            返回上一页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={handleSearch}
        searchPlaceholder="搜索妖怪..."
        suggestions={searchSuggestions}
        onSuggestionClick={(name) => handleSearch(name)}
      />

      <div className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 上半部分 */}
          <div className="flex p-5 border-b border-gray-200">
            {/* 左侧图片 */}
            <div className="w-1/3">
              <div className="aspect-[3/4] rounded-lg overflow-hidden">
                <img
                  src={monster.imageUrl}
                  alt={monster.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 右侧信息 */}
            <div className="w-2/3 pl-6">
              <h1 className="text-2xl font-bold mb-4">{monster.name}</h1>
              <div className="space-y-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-700">种类</h2>
                  <p className="mt-1 text-sm">{monster.type}</p>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-700">外形</h2>
                  <p className="mt-1 text-sm">{monster.appearance}</p>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-700">分布</h2>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {Array.isArray(monster.distribution) 
                      ? monster.distribution.map((location: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                          >
                            {location}
                          </span>
                        ))
                      : (
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {monster.distribution}
                          </span>
                        )
                    }
                  </div>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-700">能力</h2>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {monster.abilities.map((ability: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 下半部分 */}
          <div className="p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold mb-2">基本介绍</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{monster.description}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">文献资料</h2>
              <div className="space-y-3">
                {monster.sources.map((source: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-medium text-sm mb-1">《{source.book}》</h3>
                    <p className="text-sm text-gray-600">{source.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 翻页按钮 */}
          <div className="flex justify-between items-center p-4 border-t border-gray-200">
            <button
              onClick={() => prevMonsterId && navigate(`/monster/${prevMonsterId}`)}
              disabled={!prevMonsterId}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg
                       bg-gray-100 hover:bg-gray-200 disabled:opacity-50
                       disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>上一个</span>
            </button>
            <button
              onClick={() => nextMonsterId && navigate(`/monster/${nextMonsterId}`)}
              disabled={!nextMonsterId}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg
                       bg-gray-100 hover:bg-gray-200 disabled:opacity-50
                       disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span>下一个</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MonsterDetailPage;