
import React, { useState } from 'react';
import { Movie } from '../types';

interface MovieDetailsProps {
  movie: Movie;
  onBack: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onBack }) => {
  const [activeServer, setActiveServer] = useState<'server1' | 'server2' | 'server3'>('server1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const introUrl = "https://cdn.jsdelivr.net/gh/MSayban1/Sabchat-SFX@main/Animation.mp4";

  const handlePlay = () => {
    setShowIntro(true);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIntroEnd = () => {
    setShowIntro(false);
  };

  return (
    <div className="min-h-full bg-[#0f172a] pb-32">
      <div className="relative w-full">
        {/* Player Section */}
        <div className="w-full aspect-video bg-black sticky top-0 md:relative z-40 shadow-2xl overflow-hidden">
          {!isPlaying ? (
            <div className="w-full h-full relative">
              <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover blur-sm opacity-60" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button 
                  onClick={handlePlay}
                  className="bg-red-600 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl md:text-4xl shadow-2xl hover:scale-110 active:scale-95 transition-all animate-pulse"
                >
                  <i className="fas fa-play ml-1"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              {showIntro ? (
                <video 
                  autoPlay 
                  onEnded={handleIntroEnd}
                  className="w-full h-full object-contain"
                  src={introUrl}
                />
              ) : (
                <>
                  <iframe
                    src={movie.links[activeServer]}
                    className="w-full h-full border-none"
                    allowFullScreen
                    title="Movie Player"
                  />
                  <img 
                    src="https://i.postimg.cc/CZjRWCtd/tipflix.jpg" 
                    alt="Logo" 
                    className="absolute top-3 right-3 h-5 w-5 sm:h-8 sm:w-8 rounded opacity-40 pointer-events-none"
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="px-4 py-6 md:px-12 max-w-7xl mx-auto">
          <button 
            onClick={onBack}
            className="mb-6 text-gray-400 hover:text-white flex items-center transition-colors font-medium text-sm sm:text-base"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back
          </button>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
            <div className="w-full lg:w-1/3 max-w-[280px] sm:max-w-[320px] mx-auto lg:mx-0">
              <img src={movie.thumbnailUrl} alt={movie.title} className="w-full rounded-2xl shadow-2xl border border-white/10" />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tighter italic text-white leading-tight uppercase">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
                <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded shadow-lg">{movie.quality}</span>
                <span className="text-gray-300 font-semibold text-sm">{movie.year}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300 font-semibold text-sm">{movie.category}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(genre => (
                  <span key={genre} className="bg-slate-800/80 text-gray-400 text-[10px] sm:text-xs px-3 py-1.5 rounded-full border border-white/5">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-2">Synopsis</h3>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                  {movie.description}
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <i className="fas fa-layer-group text-red-600 mr-2"></i>
                    Servers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    {['server1', 'server2', 'server3'].map((server) => (
                      <button
                        key={server}
                        onClick={() => setActiveServer(server as any)}
                        className={`py-3 px-4 rounded-xl font-bold transition-all border-2 text-sm flex items-center justify-center gap-2 ${
                          activeServer === server 
                            ? 'bg-red-600 border-red-600 text-white shadow-lg' 
                            : 'bg-slate-800/50 border-white/10 text-gray-400 hover:border-red-600/50'
                        }`}
                      >
                        <i className="fas fa-server text-xs"></i>
                        Server {server.slice(-1)}
                      </button>
                    ))}
                  </div>
                </div>

                {movie.downloads && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <i className="fas fa-download text-red-600 mr-2"></i>
                      Downloads
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {movie.downloads.p480 && (
                        <a href={movie.downloads.p480} target="_blank" rel="noopener noreferrer" className="bg-slate-800/80 hover:bg-slate-700 p-4 rounded-xl flex items-center justify-between group border border-white/5 transition-all">
                          <div>
                            <p className="text-xs font-bold text-white">480p SD</p>
                          </div>
                          <i className="fas fa-download text-red-600 text-xs"></i>
                        </a>
                      )}
                      {movie.downloads.p720 && (
                        <a href={movie.downloads.p720} target="_blank" rel="noopener noreferrer" className="bg-slate-800/80 hover:bg-slate-700 p-4 rounded-xl flex items-center justify-between group border border-white/5 transition-all">
                          <div>
                            <p className="text-xs font-bold text-white">720p HD</p>
                          </div>
                          <i className="fas fa-download text-red-600 text-xs"></i>
                        </a>
                      )}
                      {movie.downloads.p1080 && (
                        <a href={movie.downloads.p1080} target="_blank" rel="noopener noreferrer" className="bg-slate-800/80 hover:bg-slate-700 p-4 rounded-xl flex items-center justify-between group border border-white/5 transition-all">
                          <div>
                            <p className="text-xs font-bold text-white">1080p Ultra</p>
                          </div>
                          <i className="fas fa-download text-red-600 text-xs"></i>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
