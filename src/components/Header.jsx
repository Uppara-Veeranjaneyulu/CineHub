import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';

const Header = () => {
  const { watchlist } = useWatchlist();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-[#07090E]/90 backdrop-blur-xl border-b border-amber-500/10 px-4 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center transition-all duration-300 shadow-2xl">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
          CineHub
        </span>
      </Link>

      {/* Navigation & Watchlist Pill */}
      <nav className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all ${
            location.pathname === '/'
              ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-sm'
              : 'text-gray-300 hover:text-amber-400 hover:bg-gray-900/60'
          }`}
        >
          Explore
        </Link>
        <Link
          to="/watchlist"
          className={`relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all flex items-center gap-1.5 sm:gap-2 ${
            location.pathname === '/watchlist'
              ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-sm'
              : 'text-gray-300 hover:text-amber-400 hover:bg-gray-900/60'
          }`}
        >
          <span>Watchlist</span>
          {watchlist.length > 0 && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-md shadow-amber-500/30">
              {watchlist.length}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
};

export default Header;
