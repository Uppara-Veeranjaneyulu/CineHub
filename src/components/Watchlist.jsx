import React, { useState, useEffect } from 'react';
import MovieList from './MovieList';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState(JSON.parse(localStorage.getItem('watchlist')) || []);

  const removeFromWatchlist = (movie) => {
    const updatedList = watchlist.filter(m => m.id !== movie.id);
    setWatchlist(updatedList);
    localStorage.setItem('watchlist', JSON.stringify(updatedList));
  };

  return (
    <div>
      <h2 className="text-2xl p-4">Your Watchlist</h2>
      {watchlist.length === 0 ? <p className="p-4">No movies added yet!</p> :
        <MovieList movies={watchlist} removeFromWatchlist={removeFromWatchlist} isWatchlist={true}/>
      }
    </div>
  );
};

export default Watchlist;
