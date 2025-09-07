import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies, addToWatchlist, removeFromWatchlist, isWatchlist }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
    {movies.map(movie => (
      <MovieCard 
        key={movie.id} 
        movie={movie} 
        addToWatchlist={addToWatchlist} 
        removeFromWatchlist={removeFromWatchlist} 
        isWatchlist={isWatchlist} 
      />
    ))}
  </div>
);

export default MovieList;
