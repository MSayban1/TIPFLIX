
import React, { useState, useEffect } from 'react';
import { Banner } from '../types';

interface BannerSliderProps {
  banners: Banner[];
  onBannerClick: (movieId?: string) => void;
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners, onBannerClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return (
    <div className="h-64 md:h-96 w-full bg-slate-800 animate-pulse rounded-b-3xl"></div>
  );

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden group">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => onBannerClick(banner.movieId)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/30 z-10" />
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-16 left-0 right-0 px-6 z-20 text-center md:text-left md:left-12 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl mb-4 tracking-tighter italic">
              {banner.title}
            </h2>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all flex items-center mx-auto md:mx-0 shadow-xl shadow-red-600/20 active:scale-95">
              <i className="fas fa-play mr-2"></i> WATCH NOW
            </button>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-30">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex ? 'bg-red-600 w-8' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
