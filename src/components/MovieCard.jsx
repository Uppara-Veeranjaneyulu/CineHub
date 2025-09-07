import React from 'react';
import { IMAGE_URL } from '../config';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, addToWatchlist, removeFromWatchlist, isWatchlist }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition duration-300">
      <Link to={`/movie/${movie.id}`}>
        <img src={IMAGE_URL + movie.poster_path} alt={movie.title} className="w-full h-72 object-cover"/>
      </Link>
      <div className="p-3">
        <h3 className="text-lg font-semibold">{movie.title}</h3>
        <p>Rating: {movie.vote_average}</p>
        {isWatchlist ? 
          <button onClick={() => removeFromWatchlist(movie)} className="mt-2 w-full bg-red-600 py-1 rounded hover:bg-red-500">Remove</button> :
          <button onClick={() => addToWatchlist(movie)} className="mt-2 w-full bg-orange-500 py-1 rounded hover:bg-orange-400">Add to Watchlist</button>
        }
      </div>
    </div>
  );
};

export default MovieCard;
