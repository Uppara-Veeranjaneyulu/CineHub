import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import { API_KEY, BASE_URL } from '../config';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [watchlist, setWatchlist] = useState(JSON.parse(localStorage.getItem('watchlist')) || []);

  useEffect(() => {
    fetchTrending();
    fetchGenres();
  }, []);

  const fetchTrending = async () => {
    const { data } = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    setMovies(data.results);
  };

  const fetchGenres = async () => {
    const { data } = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    setGenres(data.genres);
  };

  const handleSearch = async () => {
    if (!search) return;
    const { data } = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${search}`);
    setMovies(data.results);
  };

  const filterByGenre = async (genreId) => {
    setSelectedGenre(genreId);
    const { data } = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
    setMovies(data.results);
  };

  const addToWatchlist = (movie) => {
    const updatedList = [...watchlist, movie];
    setWatchlist(updatedList);
    localStorage.setItem('watchlist', JSON.stringify(updatedList));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 p-4 items-center">
        <input type="text" placeholder="Search movies..." value={search} onChange={e => setSearch(e.target.value)}
          className="p-2 rounded text-black flex-grow"/>
        <button onClick={handleSearch} className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-400">Search</button>
      </div>
      <div className="flex gap-2 p-4 overflow-x-auto">
        {genres.map(g => (
          <button 
            key={g.id} 
            onClick={() => filterByGenre(g.id)}
            className={`px-3 py-1 rounded ${selectedGenre===g.id?'bg-orange-500':'bg-gray-700'} hover:bg-orange-400`}
          >{g.name}</button>
        ))}
      </div>
      <MovieList movies={movies} addToWatchlist={addToWatchlist} isWatchlist={false} />
    </div>
  );
};

export default Home;
