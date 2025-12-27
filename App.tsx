
import React, { useState, useEffect } from 'react';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { db } from './firebase';
import { Movie, Banner, View, MetadataItem } from './types';

// Components
import MovieCard from './components/MovieCard';
import BannerSlider from './components/BannerSlider';
import BottomNav from './components/BottomNav';
import MovieDetails from './components/MovieDetails';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import AZFilter from './components/AZFilter';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Home);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<MetadataItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLetter, setActiveLetter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Movies Listener
    const moviesRef = ref(db, 'movies');
    onValue(moviesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const movieList = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        })) as Movie[];
        setMovies(movieList.sort((a, b) => b.createdAt - a.createdAt));
      } else {
        setMovies([]);
      }
      setLoading(false);
    });

    // Banners Listener
    const bannersRef = ref(db, 'banners');
    onValue(bannersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bannerList = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        })) as Banner[];
        setBanners(bannerList);
      } else {
        setBanners([]);
      }
    });

    // Categories Listener - Fetches existing categories from Firebase
    const categoriesRef = ref(db, 'metadata/categories');
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const catList = Object.keys(data).map(key => ({
          id: key,
          name: data[key]
        }));
        setCategories(catList);
      } else {
        setCategories([]);
      }
    });
  }, []);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentView(View.Details);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const filteredMovies = movies.filter(movie => {
    if (!movie.visible) return false;
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          movie.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || movie.category === activeCategory;
    const matchesLetter = activeLetter === 'All' || movie.title.toUpperCase().startsWith(activeLetter);
    return matchesSearch && matchesCategory && matchesLetter;
  });

  const featuredMovies = movies.filter(m => m.featured && m.visible);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (currentView) {
      case View.Home:
        return (
          <div className="w-full pb-32">
            <BannerSlider banners={banners} onBannerClick={(movieId) => {
              const movie = movies.find(m => m.id === movieId);
              if (movie) handleMovieClick(movie);
            }} />
            
            <div className="px-4 mt-8 max-w-7xl mx-auto">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="w-1 h-6 bg-red-600 rounded mr-3"></span>
                Featured
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {featuredMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} onClick={() => handleMovieClick(movie)} />
                ))}
              </div>
            </div>

            <div className="px-4 mt-12 max-w-7xl mx-auto">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="w-1 h-6 bg-red-600 rounded mr-3"></span>
                Latest Releases
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.filter(m => m.visible).slice(0, 20).map(movie => (
                  <MovieCard key={movie.id} movie={movie} onClick={() => handleMovieClick(movie)} />
                ))}
              </div>
            </div>
          </div>
        );

      case View.Categories:
        return (
          <div className="px-4 pb-32 pt-4 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Browse Categories</h1>
            <CategoryFilter categories={categories.map(c => c.name)} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
              {filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} onClick={() => handleMovieClick(movie)} />
              ))}
              {filteredMovies.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500">
                  No movies found in this category.
                </div>
              )}
            </div>
          </div>
        );

      case View.Search:
        return (
          <div className="px-4 pb-32 pt-4 max-w-7xl mx-auto">
            <div className="mb-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <AZFilter activeLetter={activeLetter} onLetterChange={setActiveLetter} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} onClick={() => handleMovieClick(movie)} />
              ))}
              {filteredMovies.length === 0 && searchQuery && (
                <div className="col-span-full py-20 text-center text-gray-500">
                  No matches for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        );

      case View.Details:
        return selectedMovie ? (
          <MovieDetails movie={selectedMovie} onBack={() => {
            setCurrentView(View.Home);
            window.scrollTo(0, 0);
          }} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      <Header onLogoClick={() => {
        setCurrentView(View.Home);
        window.scrollTo(0, 0);
      }} />
      {/* Ensure main container is scrollable and starts below header */}
      <main className="flex-grow pt-16 w-full relative">
        {renderContent()}
      </main>
      <BottomNav activeView={currentView} onNavClick={setCurrentView} />
    </div>
  );
};

export default App;
