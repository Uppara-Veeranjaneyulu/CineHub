import React from 'react';
import MovieList from './MovieList';
import { useWatchlist } from '../context/WatchlistContext';
import { Link } from 'react-router-dom';

const Watchlist = () => {
  const { watchlist, clearWatchlist } = useWatchlist();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-[70vh]">
      <div className="flex justify-between items-center mb-8 border-b border-amber-500/10 pb-4">
        <div>
          <h2 className="text-3xl font-black text-gray-100 tracking-tight">Your Watchlist</h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            {watchlist.length === 1 ? '1 saved title' : `${watchlist.length} saved titles`}
          </p>
        </div>
        {watchlist.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your entire watchlist?')) {
                clearWatchlist();
              }
            }}
            className="px-4 py-2.5 bg-rose-600/90 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-lg shadow-rose-950/40"
          >
            Clear Entire Watchlist
          </button>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-24 bg-[#0D111D]/60 border border-gray-800/80 rounded-3xl p-10 max-w-2xl mx-auto shadow-2xl">
          <h3 className="text-2xl font-black text-gray-200">Your watchlist is empty</h3>
          <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Explore movies and TV series from the home page and click "Add to Watchlist" to save them for later!
          </p>
          <Link
            to="/"
            className="inline-block mt-8 px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-gray-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-transform transform hover:scale-105 shadow-xl shadow-amber-500/20"
          >
            Explore Movies & TV Series
          </Link>
        </div>
      ) : (
        <MovieList movies={watchlist} isWatchlistPage={true} />
      )}
    </div>
  );
};

export default Watchlist;
