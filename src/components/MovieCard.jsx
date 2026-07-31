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
    <div className="group relative bg-[#0D111D] border border-amber-500/15 hover:border-amber-400/50 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_15px_40px_rgba(245,158,11,0.18)] transform hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      {/* Poster Image Container */}
      <div className="relative overflow-hidden aspect-[2/3] bg-[#07090E] block">
        <Link to={`/movie/${movie.id}`} className="w-full h-full block relative">
          {posterSrc ? (
            <>
              <img
                src={posterSrc}
                alt={title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out filter brightness-95 group-hover:brightness-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D111D] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-gray-900 to-[#07090E]">
              <span className="text-xs sm:text-sm font-extrabold text-gray-300 line-clamp-3">{title}</span>
            </div>
          )}
        </Link>

        {/* Rating Badge */}
        {movie.vote_average !== undefined && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-950/90 backdrop-blur-md text-amber-300 text-[10px] sm:text-xs font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl flex items-center gap-0.5 sm:gap-1 shadow-lg border border-amber-500/30 pointer-events-none">
            <span className="text-amber-400">★</span>
            <span>{Number(movie.vote_average).toFixed(1)}</span>
          </div>
        )}

        {/* Media Type Badge (TV or Movie) */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gray-950/90 backdrop-blur-md text-amber-400/90 text-[9px] sm:text-[10px] font-black tracking-widest uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border border-amber-500/20 shadow-md pointer-events-none">
          {isTV ? 'TV' : 'MOVIE'}
        </div>

        {/* Play Trailer Overlay Button */}
        {onPlayTrailer && (
          <button
            onClick={() => onPlayTrailer(movie)}
            className="absolute inset-0 bg-gray-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-auto cursor-pointer"
            title="Play Trailer"
          >
            <div className="relative flex items-center justify-center">
              <span className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-gray-950 flex items-center justify-center text-lg sm:text-xl font-black shadow-2xl transform group-hover:scale-110 transition-transform pl-0.5">
                ▶
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-grow bg-gradient-to-b from-[#0D111D] via-[#0A0D17] to-[#07090E]">
        <div>
          <Link to={`/movie/${movie.id}`}>
            <h3 className="text-xs sm:text-sm font-extrabold text-gray-100 group-hover:text-amber-400 transition-colors line-clamp-1 leading-snug">
              {title}
            </h3>
          </Link>
          {releaseYear && (
            <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 mt-0.5 sm:mt-1">{releaseYear}</p>
          )}
        </div>

        {/* Watchlist Action Button */}
        {isWatchlistPage ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWatchlist({ ...movie, title });
            }}
            className="mt-3 sm:mt-4 w-full py-2 px-2.5 sm:py-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-black transition-all duration-300 flex items-center justify-center bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 active:scale-95 cursor-pointer"
          >
            <span>Remove</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWatchlist({ ...movie, title });
            }}
            className={`mt-3 sm:mt-4 w-full py-2 px-2.5 sm:py-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg active:scale-95 ${
              inWatchlist
                ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/40 border border-green-400/40'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-gray-950 shadow-amber-500/25'
            }`}
          >
            <span>{inWatchlist ? 'Added' : 'Add to Watchlist'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
