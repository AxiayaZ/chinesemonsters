import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

interface HeaderProps {
  onSearch: (term: string) => void;
  searchPlaceholder: string;
  suggestions?: string[];
  onSuggestionClick?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  searchPlaceholder,
  suggestions = [],
  onSuggestionClick 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const searchRef = React.useRef<HTMLDivElement>(null);

  const currentPath = location.pathname;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
    setShowSuggestions(true);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getButtonClass = (path: string) => {
    const isActive = (currentPath === '/' && path === '/') ||
                    (path !== '/' && currentPath.includes(path));
    return `px-4 py-2 rounded-lg text-lg transition-colors duration-300 writing-vertical-rl tracking-[0.5em]
           ${isActive 
             ? 'bg-red-900 text-white' 
             : 'text-gray-300 hover:text-white hover:bg-gray-800'}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
          {/* Logo区域 */}
          <div className="w-40 h-20 flex items-center justify-center ml-4">
            <img 
              src="https://i.ibb.co/B371b9M/xixi.jpg" 
              alt="Chinese Monsters Logo" 
              className="h-16 w-auto object-contain rounded-lg"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
          </div>

          {/* 导航按钮 */}
          <nav className="flex items-center gap-8 flex-grow justify-center h-20">
            <button
              onClick={() => navigate('/')}
              className={getButtonClass('/')}
            >
              首页
            </button>
            <button
              onClick={() => navigate('/category/妖')}
              className={getButtonClass('/category')}
            >
              妖怪
            </button>
            <button
              onClick={() => navigate('/knowledge-graph')}
              className={getButtonClass('/knowledge-graph')}
            >
              图谱
            </button>
            <button
              onClick={() => navigate('/map')}
              className={getButtonClass('/map')}
            >
              地图
            </button>
          </nav>

          {/* 搜索栏 */}
          <div ref={searchRef} className="relative w-64 mr-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className="w-full px-4 py-2 pl-10 bg-gray-800 rounded-lg
                       border border-gray-700 focus:border-gray-600 
                       focus:ring-2 focus:ring-gray-600 transition-all duration-300
                       text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            {showSuggestions && suggestions.length > 0 && onSuggestionClick && (
              <div className="absolute w-full mt-2 bg-gray-800 rounded-lg shadow-xl 
                            border border-gray-700 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      onSuggestionClick(suggestion);
                      setSearchTerm(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300
                             hover:text-white transition-colors duration-200"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;