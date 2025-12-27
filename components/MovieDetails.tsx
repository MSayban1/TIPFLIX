
import React, { useState, useRef } from 'react';
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
    <div className="min-h-full bg-[#0f172a] pb-32 overflow-x-hidden">
      <div className="relative w-full">
        {/* Player Section - Fixed position on mobile for better focus, or relative for flow */}
        <div className="w-full aspect-video bg-black sticky top-0 md:top-0 z-40 shadow-2xl overflow-hidden group">
          {!isPlaying ? (
            <div className="w-full h-full relative">
              <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover blur-sm opacity-60" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button 
                  onClick={handlePlay}
                  className="bg-red-600 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white text-2xl md:text-4xl shadow-2xl hover:scale-110 active:scale-95 transition-all animate-pulse"
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
                  {/* Logo Overlay */}
                  <img 
                    src="https://i.postimg.cc/CZjRWCtd/tipflix.jpg" 
                    alt="Logo" 
                    className="absolute top-4 right-4 h-6 w-6 md:h-10 md:w-10 rounded opacity-40 pointer-events-none"
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
            className="mb-8 text-gray-400 hover:text-white flex items-center transition-colors font-medium"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back to Discovery
          </button>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="w-full lg:w-1/3 max-w-[320px] mx-auto lg:mx-0">
              <img src={movie.thumbnailUrl} alt={movie.title} className="w-full rounded-2xl shadow-2xl border border-white/10" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tighter italic text-white leading-tight">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg shadow-red-600/20">{movie.quality}</span>
                <span className="text-gray-300 font-semibold">{movie.year}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300 font-semibold">{movie.category}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {movie.genres.map(genre => (
                  <span key={genre} className="bg-slate-800/80 text-gray-400 text-xs px-4 py-2 rounded-full border border-white/5">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-bold text-white mb-3">The Story</h3>
                <p className="text-gray-400 leading-relaxed text-base md:text-lg">
                  {movie.description}
                </p>
              </div>

              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-bold text-white mb-5 flex items-center">
                    <i className="fas fa-layer-group text-red-600 mr-3"></i>
                    Change Streaming Server
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['server1', 'server2', 'server3'].map((server) => (
                      <button
                        key={server}
                        onClick={() => setActiveServer(server as any)}
                        className={`py-4 px-4 rounded-2xl font-bold transition-all border-2 flex items-center justify-center gap-3 ${
                          activeServer === server 
                            ? 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-600/20' 
                            : 'bg-slate-800/50 border-white/10 text-gray-400 hover:border-red-600/50'
                        }`}
                      >
                        <i className="fas fa-server"></i>
                        Server {server.slice(-1)}
                      </button>
                    ))}
                  </div>
                </div>

                {movie.downloads && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-5 flex items-center">
                      <i className="fas fa-cloud-download-alt text-red-600 mr-3"></i>
                      Direct Downloads
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {movie.downloads.p480 && (
                        <a href={movie.downloads.p480} target="_blank" rel="noopener noreferrer" className="bg-slate-800/80 hover:bg-slate-700 p-5 rounded-2xl flex items-center justify-between group border border-white/5 transition-all">
                          <div>
                            <p className="text-sm font-bold text-white">480p SD</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">FAST DOWNLOAD</p>
                          </div>
                          <i className="fas fa-download text-red-600 group-hover:translate-y-1 transition-transform"></i>
                        </a>
                      )}
                      {movie.downloads.p720 && (
                        <a href={movie.downloads.p720} target="_blank" rel="noopener noreferrer" className="bg-slate-800/80 hover:bg-slate-700 p-5 rounded-2xl flex items-center justify-between group border border-white/5 transition-all">
                          <div>
                            <p className="text-sm font-bold text-white">720p HD</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">HIGH DEFINITION</p>
                          </div>
                          <i className="fas fa-download text-red-600 group-hover:translate-y-1 transition-transform"></i>
                        </a>
                      )}
                      {movie.downloads.p1080 && (
                        <a href={movie.downloads.p1080} target="_blank" rel="noopener noreferrer" className="bg-slate-800/80 hover:bg-slate-700 p-5 rounded-2xl flex items-center justify-between group border border-white/5 transition-all">
                          <div>
                            <p className="text-sm font-bold text-white">1080p Ultra</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">BEST QUALITY</p>
                          </div>
                          <i className="fas fa-download text-red-600 group-hover:translate-y-1 transition-transform"></i>
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
