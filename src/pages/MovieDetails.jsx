import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_KEY, BASE_URL, IMAGE_URL } from '../config';
import { useWatchlist } from '../context/WatchlistContext';
import MovieList from '../components/MovieList';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [video, setVideo] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const [movieRes, videoRes, creditsRes, similarRes] = await Promise.all([
          axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`),
        ]);

        setMovie(movieRes.data);

        const trailer = videoRes.data.results?.find(
          (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
        );
        setVideo(trailer?.key || null);

        setCast(creditsRes.data.cast?.slice(0, 10) || []);
        setSimilarMovies(similarRes.data.results?.slice(0, 6) || []);
      } catch (err) {
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-300">Movie not found</h2>
        <Link to="/" className="inline-block mt-4 text-orange-400 hover:underline">
          ← Return to Home
        </Link>
      </div>
    );
  }

  const formatRuntime = (mins) => {
    if (!mins) return null;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}h ${remainingMins}m`;
  };

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : null;
  const posterSrc = !imgError && movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : null;
  const backdropSrc = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null;

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Backdrop Banner */}
      <div className="relative w-full h-[350px] md:h-[450px] bg-gray-900 overflow-hidden">
        {backdropSrc && (
          <img
            src={backdropSrc}
            alt={movie.title}
            className="w-full h-full object-cover opacity-35 filter brightness-90"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
      </div>

      {/* Main Movie Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-40 md:-mt-52 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Card */}
          <div className="w-48 sm:w-64 md:w-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900 mx-auto md:mx-0">
            {posterSrc ? (
              <img
                src={posterSrc}
                alt={movie.title}
                onError={() => setImgError(true)}
                className="w-full aspect-[2/3] object-cover"
              />
            ) : (
              <div className="w-full aspect-[2/3] flex flex-col items-center justify-center p-6 text-center bg-gray-800 text-gray-400">
                <span className="text-4xl mb-2">🎬</span>
                <span>{movie.title}</span>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex-1 text-gray-100">
            <Link to="/" className="text-xs font-semibold text-orange-400 hover:underline mb-3 inline-block">
              ← Back to Explore
            </Link>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {movie.title} {releaseYear && <span className="text-gray-400 font-normal">({releaseYear})</span>}
            </h1>

            {movie.tagline && (
              <p className="text-orange-400/90 italic mt-1 text-sm md:text-base font-medium">
                "{movie.tagline}"
              </p>
            )}

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-3 my-4 text-xs font-semibold text-gray-300">
              {movie.vote_average !== undefined && (
                <div className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                  <span>★</span>
                  <span>{Number(movie.vote_average).toFixed(1)} / 10</span>
                  {movie.vote_count > 0 && <span className="text-gray-400">({movie.vote_count})</span>}
                </div>
              )}

              {movie.runtime && (
                <div className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-full">
                  ⏱ {formatRuntime(movie.runtime)}
                </div>
              )}

              {movie.release_date && (
                <div className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-full">
                  📅 {movie.release_date}
                </div>
              )}
            </div>

            {/* Genre Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="bg-gray-900 border border-gray-800 text-gray-300 text-xs px-3 py-1 rounded-lg font-medium"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-6">
              <h3 className="text-sm uppercase font-bold text-gray-400 tracking-wider mb-2">Overview</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">{movie.overview || 'No overview available.'}</p>
            </div>

            {/* Watchlist Action Button */}
            <div className="mb-8">
              <button
                onClick={() => toggleWatchlist(movie)}
                className={`px-6 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2 cursor-pointer ${
                  isInWatchlist(movie.id)
                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/30'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-orange-500/20 transform hover:scale-105'
                }`}
              >
                <span>{isInWatchlist(movie.id) ? '✓ Added' : '+ Add to Watchlist'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Trailer Section */}
        {video && (
          <div className="mt-12">
            <h3 className="text-xl font-extrabold text-gray-100 mb-4 flex items-center gap-2">
              <span>🎥</span> Official Trailer
            </h3>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video}`}
                title={`${movie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Top Cast & Crew */}
        {cast.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-extrabold text-gray-100 mb-4 flex items-center gap-2">
              <span>🎭</span> Top Cast
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
              {cast.map((actor) => (
                <div key={actor.id} className="bg-gray-900 border border-gray-800 rounded-xl p-2 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-2 bg-gray-800">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-lg">
                        {actor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-gray-200 line-clamp-1">{actor.name}</h4>
                  <p className="text-[10px] text-gray-400 line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-extrabold text-gray-100 mb-4 flex items-center gap-2">
              <span>✨</span> You Might Also Like
            </h3>
            <MovieList movies={similarMovies} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;

