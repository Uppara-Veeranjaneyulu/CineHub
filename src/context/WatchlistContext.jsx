import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { showToast } = useToast();
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error reading watchlist from localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error('Error saving watchlist to localStorage:', e);
    }
  }, [watchlist]);

  const addToWatchlist = (movie) => {
    if (watchlist.some((m) => m.id === movie.id)) return;
    setWatchlist((prev) => [...prev, movie]);
    showToast(`Added "${movie.title || 'Movie'}" to Watchlist!`, 'add');
  };

  const removeFromWatchlist = (movieOrId) => {
    const id = typeof movieOrId === 'object' ? movieOrId.id : movieOrId;
    const targetMovie = typeof movieOrId === 'object' ? movieOrId : watchlist.find((m) => m.id === id);

    if (watchlist.some((m) => m.id === id)) {
      setWatchlist((prev) => prev.filter((m) => m.id !== id));
      showToast(`Removed "${targetMovie?.title || 'Movie'}" from Watchlist`, 'remove');
    }
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  };

  const toggleWatchlist = (movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        toggleWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

