
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <i className="fas fa-search text-gray-500"></i>
      </div>
      <input
        type="text"
        placeholder="Search movies, TV shows, genres..."
        className="w-full bg-slate-800/80 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-red-600 text-lg transition-all backdrop-blur-md"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white"
        >
          <i className="fas fa-times-circle"></i>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
