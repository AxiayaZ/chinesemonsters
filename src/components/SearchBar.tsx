import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

// 搜索栏组件属性接口
interface SearchBarProps {
  onSearch: (term: string) => void;
  suggestions: string[];
  onSuggestionClick: (name: string) => void;
}

// 搜索栏组件
const SearchBar: React.FC<SearchBarProps> = ({ onSearch, suggestions, onSuggestionClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭建议列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 处理搜索输入
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
    setShowSuggestions(true);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="搜索妖怪..."
          className="w-full px-4 py-2 pl-10 bg-white/90 backdrop-blur-md rounded-lg
                   border border-gray-200 focus:border-gray-400 focus:ring-2 
                   focus:ring-gray-300 transition-all duration-300"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* 搜索建议下拉框 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg 
                      border border-gray-200 max-h-60 overflow-y-auto z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => {
                onSuggestionClick(suggestion);
                setSearchTerm(suggestion);
                setShowSuggestions(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;