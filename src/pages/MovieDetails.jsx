import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_KEY, BASE_URL, IMAGE_URL } from '../config';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState({});
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const { data } = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
      setMovie(data);
    };
    const fetchVideo = async () => {
      const { data } = await axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
      const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      setVideo(trailer?.key || null);
    };
    fetchMovie();
    fetchVideo();
  }, [id]);

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      <img src={IMAGE_URL + movie.poster_path} alt={movie.title} className="w-full md:w-1/3 rounded"/>
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{movie.title}</h1>
        <p className="my-2">{movie.overview}</p>
        <p>Rating: {movie.vote_average}</p>
        {video && 
          <iframe className="w-full h-64 mt-4" src={`https://www.youtube.com/embed/${video}`} title="trailer" allowFullScreen></iframe>
        }
      </div>
    </div>
  );
};

export default MovieDetails;
