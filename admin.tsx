
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
    onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
    });

    // Database Listeners
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
    });

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

    const categoriesRef = ref(db, 'metadata/categories');
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, name: data[key] }));
        setCategories(list);
      } else {
        setCategories([]);
      }
    });

    const genresRef = ref(db, 'metadata/genres');
    onValue(genresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, name: data[key] }));
        setGenres(list);
      } else {
        setGenres([]);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
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
      {adminUser && (
        <div className="fixed bottom-4 left-4">
           <a href="/index.html" className="text-gray-500 hover:text-white flex items-center text-sm font-medium">
             <i className="fas fa-arrow-left mr-2"></i> Return to Main Site
           </a>
        </div>
      )}
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
