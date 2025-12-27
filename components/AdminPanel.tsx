
import React, { useState } from 'react';
import { User, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { ref, push, remove, update, set } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { db, auth } from '../firebase';
import { Movie, Banner, MetadataItem, QUALITIES } from '../types';

interface AdminPanelProps {
  adminUser: User | null;
  movies: Movie[];
  banners: Banner[];
  categories: MetadataItem[];
  genres: MetadataItem[];
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ adminUser, movies, banners, categories, genres, onLogout }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [activeTab, setActiveTab] = useState<'movies' | 'banners' | 'metadata'>('movies');
  
  const [newCatName, setNewCatName] = useState('');
  const [newGenreName, setNewGenreName] = useState('');

  const [movieForm, setMovieForm] = useState<Partial<Movie>>({
    title: '',
    description: '',
    year: new Date().getFullYear().toString(),
    category: '',
    genres: [],
    thumbnailUrl: '',
    links: { server1: '', server2: '', server3: '' },
    downloads: { p480: '', p720: '', p1080: '' },
    featured: false,
    visible: true,
    quality: QUALITIES[0]
  });

  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({
    imageUrl: '',
    title: '',
    movieId: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err: any) {
      setError('Invalid credentials. Access denied.');
    }
  };

  const saveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    const movieData = {
      ...movieForm,
      category: movieForm.category || (categories.length > 0 ? categories[0].name : ''),
      createdAt: Date.now()
    };
    const moviesRef = ref(db, 'movies');
    await push(moviesRef, movieData);
    setShowAddMovie(false);
    resetMovieForm();
  };

  const deleteMovie = async (id: string) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      await remove(ref(db, `movies/${id}`));
    }
  };

  const toggleVisibility = async (movie: Movie) => {
    await update(ref(db, `movies/${movie.id}`), { visible: !movie.visible });
  };

  const toggleFeatured = async (movie: Movie) => {
    await update(ref(db, `movies/${movie.id}`), { featured: !movie.featured });
  };

  const resetMovieForm = () => {
    setMovieForm({
      title: '',
      description: '',
      year: new Date().getFullYear().toString(),
      category: categories.length > 0 ? categories[0].name : '',
      genres: [],
      thumbnailUrl: '',
      links: { server1: '', server2: '', server3: '' },
      downloads: { p480: '', p720: '', p1080: '' },
      featured: false,
      visible: true,
      quality: QUALITIES[0]
    });
  };

  const saveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const bannersRef = ref(db, 'banners');
    await push(bannersRef, bannerForm);
    setShowAddBanner(false);
    setBannerForm({ imageUrl: '', title: '', movieId: '' });
  };

  const deleteBanner = async (id: string) => {
    await remove(ref(db, `banners/${id}`));
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const refPath = ref(db, `metadata/categories`);
    await push(refPath, newCatName.trim());
    setNewCatName('');
  };

  const deleteCategory = async (id: string) => {
    await remove(ref(db, `metadata/categories/${id}`));
  };

  const addGenre = async () => {
    if (!newGenreName.trim()) return;
    const refPath = ref(db, `metadata/genres`);
    await push(refPath, newGenreName.trim());
    setNewGenreName('');
  };

  const deleteGenre = async (id: string) => {
    await remove(ref(db, `metadata/genres/${id}`));
  };

  if (!adminUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-4">
        <div className="w-full max-w-md glass p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="text-center mb-8">
            <i className="fas fa-lock text-4xl text-red-600 mb-4"></i>
            <h2 className="text-2xl font-bold">Admin Portal</h2>
            <p className="text-gray-400 mt-2">Restricted Access Only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-red-600/20 active:scale-95 transition-all">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 pb-32 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Dashboard</h1>
          <p className="text-gray-400">Welcome, {adminUser.email}</p>
        </div>
        <button onClick={onLogout} className="text-gray-400 hover:text-white flex items-center">
          <i className="fas fa-sign-out-alt mr-2"></i> Logout
        </button>
      </div>

      <div className="flex space-x-4 mb-8">
        <button 
          onClick={() => setActiveTab('movies')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'movies' ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-400'}`}
        >
          Movies
        </button>
        <button 
          onClick={() => setActiveTab('banners')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'banners' ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-400'}`}
        >
          Banners
        </button>
        <button 
          onClick={() => setActiveTab('metadata')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'metadata' ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-400'}`}
        >
          Settings
        </button>
      </div>

      {activeTab === 'movies' && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Movies Management</h2>
            <button 
              onClick={() => setShowAddMovie(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center shadow-lg"
            >
              <i className="fas fa-plus mr-2"></i> Add Movie
            </button>
          </div>
          <div className="grid gap-4">
            {movies.map(movie => (
              <div key={movie.id} className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <img src={movie.thumbnailUrl} className="w-16 h-24 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-bold">{movie.title}</h3>
                    <p className="text-xs text-gray-400">{movie.year} • {movie.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleVisibility(movie)} className="p-2 text-gray-400 hover:text-white" title="Toggle Visibility">
                    <i className={`fas ${movie.visible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                  <button onClick={() => toggleFeatured(movie)} className="p-2 text-gray-400 hover:text-yellow-500" title="Toggle Featured">
                    <i className="fas fa-star" style={{ color: movie.featured ? '#eab308' : 'inherit' }}></i>
                  </button>
                  <button onClick={() => deleteMovie(movie.id)} className="p-2 text-gray-400 hover:text-red-500" title="Delete">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'banners' && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Banner Management</h2>
            <button 
              onClick={() => setShowAddBanner(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center shadow-lg"
            >
              <i className="fas fa-plus mr-2"></i> Add Banner
            </button>
          </div>
          <div className="grid gap-4">
            {banners.map(banner => (
              <div key={banner.id} className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <img src={banner.imageUrl} className="w-24 h-14 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-bold">{banner.title}</h3>
                  </div>
                </div>
                <button onClick={() => deleteBanner(banner.id)} className="p-2 text-gray-400 hover:text-red-500">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'metadata' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="glass p-6 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="flex gap-2 mb-4">
              <input 
                className="flex-1 bg-slate-800 rounded-xl px-4 py-2 border border-white/5" 
                placeholder="New category name"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
              />
              <button onClick={addCategory} className="bg-red-600 text-white px-4 rounded-xl font-bold">Add</button>
            </div>
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                  <span>{cat.name}</span>
                  <button onClick={() => deleteCategory(cat.id)} className="text-gray-500 hover:text-red-500">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="glass p-6 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-4">Genres</h2>
            <div className="flex gap-2 mb-4">
              <input 
                className="flex-1 bg-slate-800 rounded-xl px-4 py-2 border border-white/5" 
                placeholder="New genre name"
                value={newGenreName}
                onChange={e => setNewGenreName(e.target.value)}
              />
              <button onClick={addGenre} className="bg-red-600 text-white px-4 rounded-xl font-bold">Add</button>
            </div>
            <div className="space-y-2">
              {genres.map(genre => (
                <div key={genre.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                  <span>{genre.name}</span>
                  <button onClick={() => deleteGenre(genre.id)} className="text-gray-500 hover:text-red-500">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddMovie && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 w-full max-w-4xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Add New Movie</h2>
            <form onSubmit={saveMovie} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <input 
                  placeholder="Title"
                  className="w-full bg-slate-800 rounded-xl px-4 py-3 border border-white/5"
                  value={movieForm.title}
                  onChange={e => setMovieForm({...movieForm, title: e.target.value})}
                  required
                />
                <textarea 
                  placeholder="Description"
                  className="w-full bg-slate-800 rounded-xl px-4 py-3 border border-white/5 h-32"
                  value={movieForm.description}
                  onChange={e => setMovieForm({...movieForm, description: e.target.value})}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="Year"
                    className="w-full bg-slate-800 rounded-xl px-4 py-3 border border-white/5"
                    value={movieForm.year}
                    onChange={e => setMovieForm({...movieForm, year: e.target.value})}
                    required
                  />
                  <select 
                    className="w-full bg-slate-800 rounded-xl px-4 py-3 border border-white/5"
                    value={movieForm.quality}
                    onChange={e => setMovieForm({...movieForm, quality: e.target.value})}
                  >
                    {QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <select 
                  className="w-full bg-slate-800 rounded-xl px-4 py-3 border border-white/5"
                  value={movieForm.category}
                  onChange={e => setMovieForm({...movieForm, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <input 
                  placeholder="Thumbnail URL"
                  className="w-full bg-slate-800 rounded-xl px-4 py-3 border border-white/5"
                  value={movieForm.thumbnailUrl}
                  onChange={e => setMovieForm({...movieForm, thumbnailUrl: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-4">
                <div>
                   <p className="text-sm font-bold mb-2">Select Genres</p>
                   <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto bg-slate-800/50 p-3 rounded-xl">
                      {genres.map(g => (
                        <label key={g.id} className="flex items-center text-xs cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="mr-2"
                            checked={movieForm.genres?.includes(g.name)}
                            onChange={e => {
                               const current = movieForm.genres || [];
                               if (e.target.checked) setMovieForm({...movieForm, genres: [...current, g.name]});
                               else setMovieForm({...movieForm, genres: current.filter(x => x !== g.name)});
                            }}
                          />
                          {g.name}
                        </label>
                      ))}
                   </div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                  <p className="text-sm font-bold mb-3">Streaming Servers</p>
                  <div className="space-y-2">
                    <input placeholder="Server 1 URL" className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm" value={movieForm.links?.server1} onChange={e => setMovieForm({...movieForm, links: {...movieForm.links!, server1: e.target.value}})} />
                    <input placeholder="Server 2 URL" className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm" value={movieForm.links?.server2} onChange={e => setMovieForm({...movieForm, links: {...movieForm.links!, server2: e.target.value}})} />
                    <input placeholder="Server 3 URL" className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm" value={movieForm.links?.server3} onChange={e => setMovieForm({...movieForm, links: {...movieForm.links!, server3: e.target.value}})} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2 accent-red-600" checked={movieForm.featured} onChange={e => setMovieForm({...movieForm, featured: e.target.checked})} />
                    Featured
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2 accent-red-600" checked={movieForm.visible} onChange={e => setMovieForm({...movieForm, visible: e.target.checked})} />
                    Visible
                  </label>
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setShowAddMovie(false)} className="flex-1 bg-slate-700 py-3 rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="flex-1 bg-red-600 py-3 rounded-xl font-bold">Save Movie</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Banner Modal */}
      {showAddBanner && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Add New Banner</h2>
            <form onSubmit={saveBanner} className="space-y-4">
              <input 
                placeholder="Banner Title"
                className="w-full bg-slate-800 rounded-xl px-4 py-3 border border-white/5"
                value={bannerForm.title}
                onChange={e => setBannerForm({...bannerForm, title: e.target.value})}
                required
              />
              <input 
                placeholder="Image URL"
                className="w-full bg-slate-800 rounded-xl px-4 py-3 border border-white/5"
                value={bannerForm.imageUrl}
                onChange={e => setBannerForm({...bannerForm, imageUrl: e.target.value})}
                required
              />
              <select 
                className="w-full bg-slate-800 rounded-xl px-4 py-3 border border-white/5"
                value={bannerForm.movieId}
                onChange={e => setBannerForm({...bannerForm, movieId: e.target.value})}
              >
                <option value="">Link to Movie (Optional)</option>
                {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowAddBanner(false)} className="flex-1 bg-slate-700 py-3 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-red-600 py-3 rounded-xl font-bold">Save Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
