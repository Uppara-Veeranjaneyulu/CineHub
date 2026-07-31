import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies, isWatchlistPage, onPlayTrailer }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {movies.map((movie) => (
      <MovieCard
        key={movie.id}
        movie={movie}
        isWatchlistPage={isWatchlistPage}
        onPlayTrailer={onPlayTrailer}
      />
    ))}
  </div>
);

export default MovieList;


