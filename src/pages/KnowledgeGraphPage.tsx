import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import KnowledgeGraph from '../components/KnowledgeGraph';
import neo4jService from '../services/neo4jService';

interface Book {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  era: string;
  author?: string;
  content?: string;
}

const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: '山海经',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73',
    description: '中国古代神话地理著作，记载了众多神异生物',
    era: '战国',
    author: '佚名',
    content: '《山海经》是中国先秦重要的古籍，记载了中国古代神话、地理、物产、医药、民俗等内容。'
  },
  {
    id: '2',
    title: '搜神记',
    imageUrl: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27',
    description: '记录魏晋时期的志怪故事',
    era: '东晋',
    author: '干宝',
    content: '《搜神记》是中国古代志怪小说的代表作，收录了大量神仙鬼怪故事。'
  },
  {
    id: '3',
    title: '聊斋志异',
    imageUrl: 'https://images.unsplash.com/photo-1533327325824-76bc4e62d560',
    description: '清代蒲松龄创作的志怪小说集',
    era: '清代',
    author: '蒲松龄',
    content: '《聊斋志异》是一部文言文短篇小说集，以描写狐鬼花妖的故事为主。'
  }
];

const KnowledgeGraphPage: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGraphData = async () => {
      if (selectedBook) {
        try {
          setLoading(true);
          setError(null);
          const data = await neo4jService.getBookKnowledgeGraph(selectedBook.title);
          setGraphData(data);
        } catch (error) {
          console.error('获取知识图谱数据失败:', error);
          setError('连接数据库失败，请稍后重试');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGraphData();
  }, [selectedBook]);

  const filteredBooks = MOCK_BOOKS.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={setSearchTerm}
        searchPlaceholder="搜索书籍..."
      />

      <main className="container mx-auto px-4 pt-20 pb-8 max-w-4xl">
        {error && (
          <div className="fixed top-16 right-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
            <p>{error}</p>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {!selectedBook ? (
            <div className="space-y-4 pt-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer
                           hover:shadow-md transition-all duration-300
                           flex h-48"
                >
                  {/* 左侧图片 */}
                  <div className="w-36 flex-shrink-0">
                    <div className="aspect-[3/4] h-full">
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* 右侧内容 */}
                  <div className="flex-grow p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-gray-900">《{book.title}》</h2>
                        <span className="text-xs text-gray-500">{book.era}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">作者：{book.author}</p>
                      <p className="text-gray-600 text-sm line-clamp-2">{book.content}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{book.description}</span>
                      <span className="text-blue-600 hover:text-blue-800 text-sm">
                        查看知识图谱 →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">《{selectedBook.title}》知识图谱</h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200
                           transition-colors duration-200"
                >
                  返回列表
                </button>
              </div>
              <div className="h-[800px] w-full border border-gray-200 rounded-lg">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                  </div>
                ) : graphData ? (
                  <KnowledgeGraph data={graphData} />
                ) : null}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default KnowledgeGraphPage;