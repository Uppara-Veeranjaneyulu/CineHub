import React, { useState } from 'react';
import { IMAGE_URL } from '../config';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';

const MovieCard = ({ movie, isWatchlistPage, onPlayTrailer }) => {
  const { watchlist, toggleWatchlist } = useWatchlist();
  const [imgError, setImgError] = useState(false);

  const title = movie.title || movie.name || 'Untitled';
  const releaseDate = movie.release_date || movie.first_air_date;
  const releaseYear = releaseDate ? releaseDate.split('-')[0] : null;
  const isTV = !movie.title && !!movie.name;

  const inWatchlist = watchlist.some((m) => String(m.id) === String(movie.id));
  const posterSrc = !imgError && movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : null;

  return (
    <div className="group bg-gray-900 border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-orange-500/15 hover:border-orange-500/40 transform hover:-translate-y-1.5 transition duration-300 flex flex-col justify-between">
      <div className="relative overflow-hidden aspect-[2/3] bg-gray-800 block">
        <Link to={`/movie/${movie.id}`} className="w-full h-full block">
          {posterSrc ? (
            <img
              src={posterSrc}
              alt={title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-gray-800 to-gray-900">
              <span className="text-4xl mb-2">{isTV ? '📺' : '🎬'}</span>
              <span className="text-sm font-semibold text-gray-300 line-clamp-3">{title}</span>
            </div>
          )}
        </Link>
        
        {/* Rating Badge */}
        {movie.vote_average !== undefined && (
          <div className="absolute top-2.5 right-2.5 bg-gray-950/85 backdrop-blur-md text-amber-400 text-xs font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg pointer-events-none border border-amber-500/20">
            <span>★</span>
            <span>{Number(movie.vote_average).toFixed(1)}</span>
          </div>
        )}

        {/* Media Type Badge (TV or Movie) */}
        <div className="absolute top-2.5 left-2.5 bg-gray-950/85 backdrop-blur-md text-gray-300 text-[11px] font-bold px-2.5 py-1 rounded-lg pointer-events-none border border-gray-800">
          {isTV ? 'TV' : 'MOVIE'}
        </div>

        {/* Quick Play Trailer Button Overlay */}
        {onPlayTrailer && (
          <button
            onClick={() => onPlayTrailer(movie)}
            className="absolute inset-0 bg-gray-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-auto cursor-pointer"
            title="Play Trailer"
          >
            <span className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl shadow-2xl transform group-hover:scale-110 transition-transform pl-1">
              ▶
            </span>
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <Link to={`/movie/${movie.id}`}>
            <h3 className="text-base font-extrabold text-gray-100 group-hover:text-orange-400 transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>
          {releaseYear && (
            <p className="text-xs font-medium text-gray-400 mt-1">{releaseYear}</p>
          )}
        </div>

        {isWatchlistPage ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWatchlist({ ...movie, title });
            }}
            className="mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white shadow-md cursor-pointer"
          >
            <span>✕ Remove</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWatchlist({ ...movie, title });
            }}
            className={`mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
              inWatchlist
                ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/30'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-orange-500/20 active:scale-95'
            }`}
          >
            <span>{inWatchlist ? '✓ Added' : '+ Add to Watchlist'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;


