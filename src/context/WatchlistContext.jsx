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
    if (watchlist.some((m) => String(m.id) === String(movie.id))) return;
    setWatchlist((prev) => [...prev, movie]);
    showToast(`Added "${movie.title || 'Movie'}" to Watchlist!`, 'add');
  };

  const removeFromWatchlist = (movieOrId) => {
    const id = typeof movieOrId === 'object' ? movieOrId.id : movieOrId;
    const targetMovie = typeof movieOrId === 'object' ? movieOrId : watchlist.find((m) => String(m.id) === String(id));

    if (watchlist.some((m) => String(m.id) === String(id))) {
      setWatchlist((prev) => prev.filter((m) => String(m.id) !== String(id)));
      showToast(`Removed "${targetMovie?.title || 'Movie'}" from Watchlist`, 'remove');
    }
  };

  const clearWatchlist = () => {
    if (watchlist.length === 0) return;
    setWatchlist([]);
    showToast('Cleared all items from Watchlist', 'remove');
  };

  const isInWatchlist = (movieId) => {
    if (!movieId) return false;
    return watchlist.some((m) => String(m.id) === String(movieId));
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
        clearWatchlist,
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

