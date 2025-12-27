
import React from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-16 flex items-center px-4 justify-between">
      <div className="flex items-center cursor-pointer" onClick={onLogoClick}>
        <img src="https://i.postimg.cc/CZjRWCtd/tipflix.jpg" alt="Tipflix Logo" className="h-10 w-10 rounded-lg mr-3 shadow-lg border border-red-600/30" />
        <h1 className="text-2xl font-black tracking-tighter text-white">
          TIP<span className="text-red-600">FLIX</span>
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <a 
          href="/admin.html" 
          className="text-gray-500 text-[10px] hover:text-white transition-colors uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100"
        >
          Staff
        </a>
      </div>
    </header>
  );
};

export default Header;
