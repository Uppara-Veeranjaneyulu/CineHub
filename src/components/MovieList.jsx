import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies, isWatchlist }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
    {movies.map((movie) => (
      <MovieCard
        key={movie.id}
        movie={movie}
        isWatchlist={isWatchlist}
      />
    ))}
  </div>
);

export default MovieList;

