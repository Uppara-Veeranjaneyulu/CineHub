import React from 'react';
import MovieList from './MovieList';
import { useWatchlist } from '../context/WatchlistContext';
import { Link } from 'react-router-dom';

const Watchlist = () => {
  const { watchlist, clearWatchlist } = useWatchlist();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-100">Your Watchlist</h2>
          <p className="text-sm text-gray-400 mt-1">
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
            className="px-4 py-2 bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/40 font-bold text-xs rounded-xl transition cursor-pointer shadow flex items-center gap-1.5"
          >
            <span>🗑️ Clear Entire Watchlist</span>
          </button>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
          <div className="text-6xl mb-4">🍿</div>
          <h3 className="text-xl font-bold text-gray-200">Your watchlist is empty</h3>
          <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
            Explore movies from the home page and click "+ Add to Watchlist" to save them here for later!
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-400 hover:to-amber-400 transition-transform transform hover:scale-105 shadow-lg"
          >
            Explore Movies
          </Link>
        </div>
      ) : (
        <MovieList movies={watchlist} isWatchlistPage={true} />
      )}
    </div>
  );
};

export default Watchlist;

