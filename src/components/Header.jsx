import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';

const Header = () => {
  const { watchlist } = useWatchlist();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xl px-2.5 py-1 rounded-lg shadow-md group-hover:scale-105 transition-transform">
          CH
        </div>
        <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent tracking-wide">
          CineHub
        </span>
      </Link>
      
      <nav className="flex items-center gap-4">
        <Link 
          to="/" 
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/' ? 'text-orange-400 bg-orange-500/10' : 'text-gray-300 hover:text-orange-400'
          }`}
        >
          Explore
        </Link>
        <Link 
          to="/watchlist" 
          className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            location.pathname === '/watchlist' ? 'text-orange-400 bg-orange-500/10' : 'text-gray-300 hover:text-orange-400'
          }`}
        >
          <span>Watchlist</span>
          {watchlist.length > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              {watchlist.length}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
};

export default Header;

