
import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div 
      className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
      onClick={onClick}
    >
      <div className="aspect-movie rounded-2xl overflow-hidden bg-slate-800 shadow-xl ring-1 ring-white/10 relative">
        <img 
          src={movie.thumbnailUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
          {movie.quality}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-12">
           <p className="text-white font-bold text-sm truncate">{movie.title}</p>
           <p className="text-gray-400 text-xs mt-1">{movie.year} • {movie.category}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
