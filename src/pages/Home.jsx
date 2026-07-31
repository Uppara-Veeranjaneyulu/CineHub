import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import TrailerModal from '../components/TrailerModal';
import { API_KEY, BASE_URL } from '../config';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [mediaType, setMediaType] = useState('movie'); // 'movie' or 'tv'
  const [category, setCategory] = useState('trending'); // 'trending', 'top_rated', 'popular', 'upcoming'
  const [sortBy, setSortBy] = useState('default'); // 'default', 'rating_desc', 'release_desc', 'title_asc'
  
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Trailer Modal State
  const [activeTrailer, setActiveTrailer] = useState(null);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { showToast } = useToast();
  const searchTimeoutRef = useRef(null);

  // Fetch initial content when mediaType or category changes
  useEffect(() => {
    fetchMediaList(1, true);
    fetchGenres();
  }, [mediaType, category]);

  // Fetch Genres for current media type
  const fetchGenres = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}`);
      setGenres(data.genres || []);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  // Main fetch function for category listings
  const fetchMediaList = async (pageNum = 1, isInitial = false) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (category === 'trending') {
        endpoint = `${BASE_URL}/trending/${mediaType}/week?api_key=${API_KEY}&page=${pageNum}`;
      } else if (category === 'top_rated') {
        endpoint = `${BASE_URL}/${mediaType}/top_rated?api_key=${API_KEY}&page=${pageNum}`;
      } else if (category === 'popular') {
        endpoint = `${BASE_URL}/${mediaType}/popular?api_key=${API_KEY}&page=${pageNum}`;
      } else if (category === 'upcoming') {
        const sub = mediaType === 'movie' ? 'upcoming' : 'on_the_air';
        endpoint = `${BASE_URL}/${mediaType}/${sub}?api_key=${API_KEY}&page=${pageNum}`;
      }

      const { data } = await axios.get(endpoint);
      let results = data.results || [];

      if (isInitial && results.length < 10 && data.total_pages > 1) {
        try {
          const p2Endpoint = endpoint.replace(`page=${pageNum}`, 'page=2');
          const p2 = await axios.get(p2Endpoint);
          results = [...results, ...(p2.data.results || [])];
          pageNum = 2;
        } catch (e) {
          console.error(e);
        }
      }

      if (isInitial) {
        setMovies(results);
        if (results.length > 0) {
          setFeaturedMovie(results[0]);
        }
      } else {
        setMovies((prev) => [...prev, ...results]);
      }

      setHasMore(pageNum < data.total_pages && results.length >= 12);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching media list:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Search Input Change with Debounced Suggestions
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (query.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const { data } = await axios.get(
            `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`
          );
          const filtered = (data.results || [])
            .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
            .slice(0, 5);
          setSuggestions(filtered);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Submit Search
  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setSelectedGenre(null);
    setShowSuggestions(false);
    setActiveSearch(search);

    try {
      const { data } = await axios.get(
        `${BASE_URL}/search/${mediaType}?api_key=${API_KEY}&query=${encodeURIComponent(search)}&page=1`
      );
      let results = data.results || [];
      let currentPage = 1;

      if (results.length > 0 && results.length < 10 && data.total_pages > 1) {
        try {
          const p2 = await axios.get(
            `${BASE_URL}/search/${mediaType}?api_key=${API_KEY}&query=${encodeURIComponent(search)}&page=2`
          );
          results = [...results, ...(p2.data.results || [])];
          currentPage = 2;
        } catch (e) {
          console.error(e);
        }
      }

      setMovies(results);
      setPage(currentPage);
      setHasMore(currentPage < data.total_pages && results.length >= 12);
      showToast(`Showing results for "${search}"`, 'info');
    } catch (err) {
      console.error('Error searching:', err);
      showToast('Search failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch('');
    setActiveSearch('');
    setSelectedGenre(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setPage(1);
    fetchMediaList(1, true);
    showToast('Filters reset', 'info');
  };

  const filterByGenre = async (genreId) => {
    if (selectedGenre === genreId) {
      clearSearch();
      return;
    }
    setLoading(true);
    setSearch('');
    setActiveSearch('');
    setSelectedGenre(genreId);

    try {
      const { data } = await axios.get(
        `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&with_genres=${genreId}&page=1`
      );
      let results = data.results || [];
      let currentPage = 1;

      if (results.length > 0 && results.length < 10 && data.total_pages > 1) {
        try {
          const p2 = await axios.get(
            `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&with_genres=${genreId}&page=2`
          );
          results = [...results, ...(p2.data.results || [])];
          currentPage = 2;
        } catch (e) {
          console.error(e);
        }
      }

      setMovies(results);
      setPage(currentPage);
      setHasMore(currentPage < data.total_pages && results.length >= 12);
      const genreName = genres.find((g) => g.id === genreId)?.name;
      if (genreName) {
        showToast(`Filtered by genre: ${genreName}`, 'info');
      }
    } catch (err) {
      console.error('Error filtering by genre:', err);
      showToast('Failed to filter by genre.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      let endpoint = '';
      if (activeSearch) {
        endpoint = `${BASE_URL}/search/${mediaType}?api_key=${API_KEY}&query=${encodeURIComponent(activeSearch)}&page=${nextPage}`;
      } else if (selectedGenre) {
        endpoint = `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&with_genres=${selectedGenre}&page=${nextPage}`;
      } else if (category === 'trending') {
        endpoint = `${BASE_URL}/trending/${mediaType}/week?api_key=${API_KEY}&page=${nextPage}`;
      } else if (category === 'top_rated') {
        endpoint = `${BASE_URL}/${mediaType}/top_rated?api_key=${API_KEY}&page=${nextPage}`;
      } else if (category === 'popular') {
        endpoint = `${BASE_URL}/${mediaType}/popular?api_key=${API_KEY}&page=${nextPage}`;
      } else if (category === 'upcoming') {
        const sub = mediaType === 'movie' ? 'upcoming' : 'on_the_air';
        endpoint = `${BASE_URL}/${mediaType}/${sub}?api_key=${API_KEY}&page=${nextPage}`;
      }

      const { data } = await axios.get(endpoint);
      const newResults = data.results || [];
      setMovies((prev) => [...prev, ...newResults]);
      setPage(nextPage);
      setHasMore(nextPage < data.total_pages && newResults.length >= 10);
    } catch (err) {
      console.error('Error loading more:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open Trailer Modal for any movie/tv show
  const handlePlayTrailer = async (item) => {
    const itemType = item.media_type || mediaType;
    const title = item.title || item.name || 'Trailer';
    try {
      const { data } = await axios.get(`${BASE_URL}/${itemType}/${item.id}/videos?api_key=${API_KEY}`);
      const trailer = data.results?.find(
        (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
      );
      if (trailer?.key) {
        setActiveTrailer({ videoKey: trailer.key, title });
      } else {
        showToast(`No trailer video found for "${title}"`, 'error');
      }
    } catch (err) {
      console.error('Error fetching trailer:', err);
      showToast('Could not load trailer video.', 'error');
    }
  };

  // Client-side Sorting
  const getSortedMovies = useCallback(() => {
    if (sortBy === 'default') return movies;
    const list = [...movies];
    if (sortBy === 'rating_desc') {
      return list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    }
    if (sortBy === 'release_desc') {
      return list.sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date || 0);
        const dateB = new Date(b.release_date || b.first_air_date || 0);
        return dateB - dateA;
      });
    }
    if (sortBy === 'title_asc') {
      return list.sort((a, b) =>
        (a.title || a.name || '').localeCompare(b.title || b.name || '')
      );
    }
    return list;
  }, [movies, sortBy]);

  const displayedMovies = getSortedMovies();

  return (
    <div className="min-h-screen">
      {/* Featured Hero Banner */}
      {!activeSearch && !selectedGenre && featuredMovie && (
        <div className="relative w-full h-[450px] md:h-[520px] overflow-hidden bg-gray-900 mb-8">
          {featuredMovie.backdrop_path && (
            <img
              src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
              alt={featuredMovie.title || featuredMovie.name}
              className="w-full h-full object-cover opacity-40 filter brightness-90"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent flex flex-col justify-end p-6 md:p-12 max-w-4xl">
            <span className="inline-block w-fit text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/20 border border-orange-500/30 px-3 py-1 rounded-full mb-3">
              ★ #1 Featured {mediaType === 'movie' ? 'Movie' : 'TV Show'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">
              {featuredMovie.title || featuredMovie.name}
            </h1>
            <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6 max-w-2xl">
              {featuredMovie.overview}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => handlePlayTrailer(featuredMovie)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-400 hover:to-amber-400 transition transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <span>▶ Play Trailer</span>
              </button>
              <Link
                to={`/movie/${featuredMovie.id}`}
                className="px-6 py-3 bg-gray-800/80 backdrop-blur-md text-gray-200 border border-gray-700 hover:bg-gray-700 font-semibold rounded-xl transition"
              >
                View Details
              </Link>
              <button
                onClick={() =>
                  toggleWatchlist({
                    ...featuredMovie,
                    title: featuredMovie.title || featuredMovie.name,
                  })
                }
                className={`px-6 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2 cursor-pointer ${
                  isInWatchlist(featuredMovie.id)
                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/30'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-orange-500/20'
                }`}
              >
                <span>{isInWatchlist(featuredMovie.id) ? '✓ Added' : '+ Add to Watchlist'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Top Controls Bar: Movies / TV Toggle & Category Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Media Type Toggle */}
          <div className="bg-gray-900 border border-gray-800 p-1 rounded-xl flex items-center gap-1 w-full md:w-auto">
            <button
              onClick={() => {
                setMediaType('movie');
                setSelectedGenre(null);
                setSearch('');
                setActiveSearch('');
              }}
              className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition ${
                mediaType === 'movie'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎬 Movies
            </button>
            <button
              onClick={() => {
                setMediaType('tv');
                setSelectedGenre(null);
                setSearch('');
                setActiveSearch('');
              }}
              className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition ${
                mediaType === 'tv'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📺 TV Shows
            </button>
          </div>

          {/* Quick Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full scrollbar-none">
            {[
              { id: 'trending', label: '🔥 Trending' },
              { id: 'top_rated', label: '⭐ Top Rated' },
              { id: 'popular', label: '🍿 Popular' },
              { id: 'upcoming', label: mediaType === 'movie' ? '📅 Upcoming' : '📡 On Air' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setCategory(tab.id);
                  setSelectedGenre(null);
                  setSearch('');
                  setActiveSearch('');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  category === tab.id && !selectedGenre && !activeSearch
                    ? 'bg-gray-800 text-orange-400 border border-orange-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 border border-gray-800 text-gray-200 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-orange-500"
            >
              <option value="default">Default Order</option>
              <option value="rating_desc">★ Highest Rating</option>
              <option value="release_desc">📅 Newest Date</option>
              <option value="title_asc">🔤 Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Search Bar with Live Auto-Suggestions */}
        <div className="relative mb-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder={`Search ${mediaType === 'movie' ? 'movies' : 'TV shows'} by title...`}
                value={search}
                onChange={handleSearchChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="w-full bg-gray-900 border border-gray-800 focus:border-orange-500 text-gray-100 placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm px-2 py-1"
                >
                  ✕ Clear
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-400 hover:to-amber-400 transition shadow-md whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {/* Auto-Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 z-40 bg-gray-900/95 border border-gray-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
              {suggestions.map((item) => {
                const title = item.title || item.name;
                const releaseYear = (item.release_date || item.first_air_date || '').split('-')[0];
                return (
                  <Link
                    key={item.id}
                    to={`/movie/${item.id}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition border-b border-gray-800/50 last:border-none"
                  >
                    <div className="w-10 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                      {item.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          🎬
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-bold text-gray-200 truncate">{title}</h4>
                      <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 bg-gray-800 rounded">
                          {item.media_type}
                        </span>
                        {releaseYear && <span>{releaseYear}</span>}
                        {item.vote_average && (
                          <span className="text-amber-400 font-bold">★ {Number(item.vote_average).toFixed(1)}</span>
                        )}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Genre Selector Pills */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {activeSearch
                ? `Search Results for "${activeSearch}"`
                : `Filter ${mediaType === 'movie' ? 'Movies' : 'TV Shows'} by Genre`}
            </h3>
            {(activeSearch || selectedGenre) && (
              <button
                onClick={clearSearch}
                className="text-xs text-orange-400 hover:underline font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={clearSearch}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                !selectedGenre && !activeSearch
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              All {mediaType === 'movie' ? 'Movies' : 'TV Shows'}
            </button>
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => filterByGenre(g.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedGenre === g.id
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Movie Results */}
        {displayedMovies.length > 0 ? (
          <>
            <MovieList
              movies={displayedMovies}
              onPlayTrailer={handlePlayTrailer}
            />

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-10 mb-12">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-orange-400 hover:text-orange-300 font-bold rounded-xl transition shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Loading...' : `Load More ${mediaType === 'movie' ? 'Movies' : 'TV Shows'}`}
                </button>
              </div>
            )}
          </>
        ) : !loading ? (
          <div className="text-center py-16 bg-gray-900/40 rounded-2xl border border-gray-800">
            <span className="text-5xl block mb-3">🔍</span>
            <h3 className="text-lg font-bold text-gray-300">No results found</h3>
            <p className="text-gray-500 text-sm mt-1">Try searching for a different keyword or genre.</p>
            <button
              onClick={clearSearch}
              className="mt-4 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-400"
            >
              Back to Home
            </button>
          </div>
        ) : null}
      </div>

      {/* Instant Trailer Modal */}
      {activeTrailer && (
        <TrailerModal
          videoKey={activeTrailer.videoKey}
          title={activeTrailer.title}
          onClose={() => setActiveTrailer(null)}
        />
      )}
    </div>
  );
};

export default Home;
