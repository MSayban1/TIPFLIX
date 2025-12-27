
import React from 'react';
import { View } from '../types';

interface BottomNavProps {
  activeView: View;
  onNavClick: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavClick }) => {
  const items = [
    { view: View.Home, icon: 'fas fa-home', label: 'Home' },
    { view: View.Categories, icon: 'fas fa-th-large', label: 'Browse' },
    { view: View.Search, icon: 'fas fa-search', label: 'Search' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 px-4 h-20 md:hidden flex items-center justify-around">
      {items.map((item) => (
        <button
          key={item.view}
          onClick={() => onNavClick(item.view)}
          className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
            activeView === item.view ? 'text-red-600' : 'text-gray-400'
          }`}
        >
          <div className={`p-2 rounded-xl ${activeView === item.view ? 'bg-red-600/10' : ''}`}>
            <i className={`${item.icon} text-lg`}></i>
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
