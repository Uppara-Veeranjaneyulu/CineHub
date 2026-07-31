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
  const [watchProviders, setWatchProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const { watchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const [movieRes, videoRes, creditsRes, similarRes, providersRes] = await Promise.all([
          axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`).catch(() => ({ data: { results: {} } })),
        ]);

        setMovie(movieRes.data);

        const trailer = videoRes.data.results?.find(
          (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
        );
        setVideo(trailer?.key || null);

        setCast(creditsRes.data.cast?.slice(0, 10) || []);
        setSimilarMovies(similarRes.data.results?.slice(0, 5) || []);

        const results = providersRes.data?.results || {};
        const regionData = results.US || results.IN || (Object.keys(results).length > 0 ? results[Object.keys(results)[0]] : null);
        setWatchProviders(regionData);
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
      <div className="flex justify-center items-center min-h-[65vh]">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-300">Title not found</h2>
        <Link to="/" className="inline-block mt-4 text-amber-400 hover:underline font-bold text-xs sm:text-sm">
          ← Return to Explore
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
  const isSaved = watchlist.some((m) => String(m.id) === String(movie.id));

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      {/* Hero Backdrop Banner */}
      <div className="relative w-full h-[280px] sm:h-[400px] md:h-[520px] bg-[#07090E] overflow-hidden border-b border-amber-500/15">
        {backdropSrc && (
          <img
            src={backdropSrc}
            alt={movie.title}
            className="w-full h-full object-cover opacity-40 filter brightness-90 saturate-120"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090E]/90 via-transparent to-transparent" />
      </div>

      {/* Main Movie Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-24 sm:-mt-44 md:-mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-center md:items-start text-center md:text-left">
          {/* Poster Card */}
          <div className="w-44 sm:w-64 md:w-80 flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl border border-amber-500/25 bg-[#0D111D] transform hover:scale-[1.02] transition-transform duration-300">
            {posterSrc ? (
              <img
                src={posterSrc}
                alt={movie.title}
                onError={() => setImgError(true)}
                className="w-full aspect-[2/3] object-cover"
              />
            ) : (
              <div className="w-full aspect-[2/3] flex flex-col items-center justify-center p-6 text-center bg-gray-900 text-gray-400 font-bold">
                <span>{movie.title}</span>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex-1 text-gray-100 w-full">
            <Link to="/" className="text-xs font-black text-amber-400 hover:underline mb-3 sm:mb-4 inline-block tracking-wider uppercase">
              ← Back to Explore
            </Link>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-2 sm:mb-3 drop-shadow-lg">
              {movie.title} {releaseYear && <span className="text-gray-400 font-normal">({releaseYear})</span>}
            </h1>

            {movie.tagline && (
              <p className="text-amber-400/90 italic font-bold text-sm sm:text-base md:text-xl mb-4 sm:mb-5">
                "{movie.tagline}"
              </p>
            )}

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 my-4 sm:my-5 text-[10px] sm:text-xs font-black">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/10">
                <span className="text-amber-400">★</span>
                <span>{Number(movie.vote_average || 0).toFixed(1)} / 10</span>
                {movie.vote_count > 0 && <span className="text-gray-400 font-normal">({movie.vote_count})</span>}
              </span>

              {movie.runtime && (
                <span className="bg-[#0D111D] border border-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-gray-300 shadow-md">
                  {formatRuntime(movie.runtime)}
                </span>
              )}

              <span className="bg-[#0D111D] border border-amber-500/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-amber-400 font-black tracking-widest uppercase shadow-md">
                4K ULTRA HD
              </span>

              {movie.release_date && (
                <span className="bg-[#0D111D] border border-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-gray-300 shadow-md">
                  {movie.release_date}
                </span>
              )}
            </div>

            {/* Genre Pills */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="bg-[#0D111D] border border-gray-800 text-gray-300 text-[11px] sm:text-xs px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl font-bold shadow-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-6 text-center md:text-left">
              <h3 className="text-xs uppercase font-black text-gray-400 tracking-widest mb-2">Overview</h3>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl">{movie.overview || 'No overview available.'}</p>
            </div>

            {/* Where to Stream Section */}
            <div className="mb-8 p-4 sm:p-5 bg-[#0D111D] border border-amber-500/20 rounded-2xl max-w-3xl text-left shadow-lg">
              <h3 className="text-xs uppercase font-black text-amber-400 tracking-widest mb-3">Where to Stream</h3>
              {watchProviders && (watchProviders.flatrate || watchProviders.rent || watchProviders.buy) ? (
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    {watchProviders.flatrate?.map((p) => (
                      <div key={p.provider_id} className="flex items-center gap-2 bg-gray-950/80 border border-gray-800 px-3 py-1.5 rounded-xl shadow">
                        {p.logo_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                            alt={p.provider_name}
                            className="w-5 h-5 rounded-md object-cover"
                          />
                        )}
                        <span className="text-xs font-bold text-gray-200">{p.provider_name}</span>
                      </div>
                    ))}
                    {watchProviders.rent?.slice(0, 3).map((p) => (
                      <div key={p.provider_id} className="flex items-center gap-2 bg-gray-950/80 border border-gray-800 px-3 py-1.5 rounded-xl opacity-75 shadow">
                        {p.logo_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                            alt={p.provider_name}
                            className="w-5 h-5 rounded-md object-cover"
                          />
                        )}
                        <span className="text-xs font-semibold text-gray-400">{p.provider_name} (Rent)</span>
                      </div>
                    ))}
                  </div>
                  {watchProviders.link && (
                    <a
                      href={watchProviders.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-400 hover:underline"
                    >
                      <span>Check all streaming & watch options on JustWatch</span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-xs text-gray-400 font-medium">
                  Streaming options vary by provider and region. You can check availability on{' '}
                  <a
                    href={`https://www.themoviedb.org/movie/${id}/watch`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline font-bold"
                  >
                    TMDB / JustWatch ↗
                  </a>
                </div>
              )}
            </div>

            {/* Watchlist Action Button */}
            <div className="mb-8">
              <button
                onClick={() => toggleWatchlist({ ...movie, title: movie.title })}
                className={`w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                  isSaved
                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/30'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-gray-950 shadow-amber-500/25'
                }`}
              >
                <span>{isSaved ? 'Added' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Trailer Section */}
        {video && (
          <div className="mt-12 sm:mt-16">
            <h3 className="text-xl sm:text-2xl font-black text-gray-100 mb-4 sm:mb-6 flex items-center justify-center md:justify-start gap-2.5">
              <span>Official Trailer</span>
            </h3>
            <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20 bg-black">
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
          <div className="mt-12 sm:mt-16">
            <h3 className="text-xl sm:text-2xl font-black text-gray-100 mb-4 sm:mb-6 flex items-center justify-center md:justify-start gap-2.5">
              <span>Top Cast</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3.5">
              {cast.map((actor) => (
                <div key={actor.id} className="bg-[#0D111D] border border-amber-500/10 hover:border-amber-400/40 rounded-2xl p-2.5 sm:p-3 text-center group transition shadow-md">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full overflow-hidden mb-2 sm:mb-2.5 bg-gray-950 border-2 border-amber-500/20 group-hover:border-amber-400 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] transition duration-300">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-extrabold text-base sm:text-lg">
                        {actor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-gray-200 line-clamp-1 group-hover:text-amber-400 transition">{actor.name}</h4>
                  <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h3 className="text-xl sm:text-2xl font-black text-gray-100 mb-4 sm:mb-6 flex items-center justify-center md:justify-start gap-2.5">
              <span>You Might Also Like</span>
            </h3>
            <MovieList movies={similarMovies} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
