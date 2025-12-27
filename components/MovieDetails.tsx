
import React, { useState, useEffect, useRef } from 'react';
import { Movie } from '../types';

interface MovieDetailsProps {
  movie: Movie;
  onBack: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onBack }) => {
  const [activeServer, setActiveServer] = useState<'server1' | 'server2' | 'server3'>('server1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introUrl = "https://cdn.jsdelivr.net/gh/MSayban1/Sabchat-SFX@main/Animation.mp4";

  const handlePlay = () => {
    setShowIntro(true);
    setIsPlaying(true);
  };

  const handleIntroEnd = () => {
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] pb-24">
      <div className="relative">
        {/* Player Section */}
        <div className="w-full aspect-video bg-black sticky top-16 z-40 shadow-2xl overflow-hidden group">
          {!isPlaying ? (
            <div className="w-full h-full relative">
              <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover blur-sm opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={handlePlay}
                  className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-2xl hover:scale-110 active:scale-95 transition-all animate-pulse"
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
                    className="absolute top-4 right-4 h-8 w-8 rounded opacity-50 hover:opacity-100 transition-opacity pointer-events-none"
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="px-4 py-6 md:px-12">
          <button 
            onClick={onBack}
            className="mb-6 text-gray-400 hover:text-white flex items-center transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back to Home
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 max-w-[300px] hidden md:block">
              <img src={movie.thumbnailUrl} alt={movie.title} className="w-full rounded-2xl shadow-2xl border border-white/10" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter italic">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">{movie.quality}</span>
                <span className="text-gray-400 font-medium">{movie.year}</span>
                <span className="text-gray-400 font-medium">•</span>
                <span className="text-gray-400 font-medium">{movie.category}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {movie.genres.map(genre => (
                  <span key={genre} className="bg-slate-800 text-gray-300 text-xs px-3 py-1.5 rounded-full border border-white/5">
                    {genre}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-bold text-gray-200 mb-2">Overview</h3>
              <p className="text-gray-400 leading-relaxed mb-8">{movie.description}</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-200 mb-4">Switch Server</h3>
                  <div className="flex flex-wrap gap-4">
                    {['server1', 'server2', 'server3'].map((server) => (
                      <button
                        key={server}
                        onClick={() => setActiveServer(server as any)}
                        className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-bold transition-all border-2 ${
                          activeServer === server 
                            ? 'bg-red-600 border-red-600 text-white' 
                            : 'bg-slate-800/50 border-white/10 text-gray-400 hover:border-red-600/50'
                        }`}
                      >
                        <i className="fas fa-server mr-2"></i>
                        Server {server.slice(-1)}
                      </button>
                    ))}
                  </div>
                </div>

                {movie.downloads && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-200 mb-4">Download Movie</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {movie.downloads.p480 && (
                        <a href={movie.downloads.p480} target="_blank" rel="noopener noreferrer" className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl flex items-center justify-between group">
                          <div>
                            <p className="text-sm font-bold text-white">480p SD</p>
                            <p className="text-[10px] text-gray-400 uppercase">External Link</p>
                          </div>
                          <i className="fas fa-download text-red-600 group-hover:scale-125 transition-transform"></i>
                        </a>
                      )}
                      {movie.downloads.p720 && (
                        <a href={movie.downloads.p720} target="_blank" rel="noopener noreferrer" className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl flex items-center justify-between group">
                          <div>
                            <p className="text-sm font-bold text-white">720p HD</p>
                            <p className="text-[10px] text-gray-400 uppercase">External Link</p>
                          </div>
                          <i className="fas fa-download text-red-600 group-hover:scale-125 transition-transform"></i>
                        </a>
                      )}
                      {movie.downloads.p1080 && (
                        <a href={movie.downloads.p1080} target="_blank" rel="noopener noreferrer" className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl flex items-center justify-between group">
                          <div>
                            <p className="text-sm font-bold text-white">1080p Full HD</p>
                            <p className="text-[10px] text-gray-400 uppercase">External Link</p>
                          </div>
                          <i className="fas fa-download text-red-600 group-hover:scale-125 transition-transform"></i>
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
