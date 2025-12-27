
import React from 'react';

interface AZFilterProps {
  activeLetter: string;
  onLetterChange: (letter: string) => void;
}

const AZFilter: React.FC<AZFilterProps> = ({ activeLetter, onLetterChange }) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex space-x-2 overflow-x-auto no-scrollbar py-4 border-t border-white/5 mt-4">
      <button
        onClick={() => onLetterChange('All')}
        className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
          activeLetter === 'All' ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-500'
        }`}
      >
        ALL
      </button>
      {letters.map((letter) => (
        <button
          key={letter}
          onClick={() => onLetterChange(letter)}
          className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
            activeLetter === letter ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-500'
          }`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default AZFilter;
