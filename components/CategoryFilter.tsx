
import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
      <button
        onClick={() => onCategoryChange('All')}
        className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
          activeCategory === 'All' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-slate-800 text-gray-400 border border-white/5'
        }`}
      >
        All Movies
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
            activeCategory === category ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-slate-800 text-gray-400 border border-white/5'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
