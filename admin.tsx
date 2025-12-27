
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { onAuthStateChanged, signOut, User } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { db, auth } from './firebase';
import { Movie, Banner, MetadataItem } from './types';
import AdminPanel from './components/AdminPanel';

const AdminApp: React.FC = () => {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<MetadataItem[]>([]);
  const [genres, setGenres] = useState<MetadataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
    });

    // Movies Listener
    const moviesRef = ref(db, 'movies');
    const unsubscribeMovies = onValue(moviesRef, (snapshot) => {
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
    });

    // Banners Listener
    const bannersRef = ref(db, 'banners');
    const unsubscribeBanners = onValue(bannersRef, (snapshot) => {
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

    // Categories Listener
    const categoriesRef = ref(db, 'metadata/categories');
    const unsubscribeCats = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, name: data[key] }));
        setCategories(list);
      } else {
        setCategories([]);
      }
    });

    // Genres Listener
    const genresRef = ref(db, 'metadata/genres');
    const unsubscribeGenres = onValue(genresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, name: data[key] }));
        setGenres(list);
      } else {
        setGenres([]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMovies();
      unsubscribeBanners();
      unsubscribeCats();
      unsubscribeGenres();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a]">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium tracking-widest uppercase text-xs">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <AdminPanel 
        adminUser={adminUser} 
        movies={movies} 
        banners={banners} 
        categories={categories}
        genres={genres}
        onLogout={() => signOut(auth)} 
      />
      
      <div className="fixed bottom-6 left-6 z-[100]">
        <a href="/index.html" className="group flex items-center bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-2xl transition-all active:scale-95">
          <i className="fas fa-arrow-left text-red-600 mr-2 group-hover:-translate-x-1 transition-transform"></i>
          <span className="text-xs font-bold text-gray-300">MAIN SITE</span>
        </a>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AdminApp />
    </React.StrictMode>
  );
}
