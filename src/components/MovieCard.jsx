import React, { useState } from 'react';
import { IMAGE_URL } from '../config';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';

const MovieCard = ({ movie, isWatchlist: isWatchlistProp }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [imgError, setImgError] = useState(false);

  const inWatchlist = isWatchlistProp ?? isInWatchlist(movie.id);

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : null;
  const posterSrc = !imgError && movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : null;

  return (
    <div className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-orange-500/10 hover:border-orange-500/30 transform hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
      <Link to={`/movie/${movie.id}`} className="relative overflow-hidden aspect-[2/3] bg-gray-800 block">
        {posterSrc ? (
          <img
            src={posterSrc}
            alt={movie.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-3xl mb-2">🎬</span>
            <span className="text-sm font-medium text-gray-300 line-clamp-3">{movie.title}</span>
          </div>
        )}
        
        {/* Rating Badge */}
        {movie.vote_average !== undefined && (
          <div className="absolute top-2 right-2 bg-gray-950/80 backdrop-blur-sm text-amber-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow">
            <span>★</span>
            <span>{Number(movie.vote_average).toFixed(1)}</span>
          </div>
        )}
      </Link>

      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          <Link to={`/movie/${movie.id}`}>
            <h3 className="text-sm font-bold text-gray-100 group-hover:text-orange-400 transition-colors line-clamp-1">
              {movie.title}
            </h3>
          </Link>
          {releaseYear && (
            <p className="text-xs text-gray-400 mt-0.5">{releaseYear}</p>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWatchlist(movie);
          }}
          className={`mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            inWatchlist
              ? 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white'
              : 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500 hover:text-white'
          }`}
        >
          <span>{inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}</span>
        </button>
      </div>
    </div>
  );
};

export default MovieCard;

