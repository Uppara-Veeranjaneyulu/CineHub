import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900/90 border-t border-gray-800 text-gray-400 text-xs py-8 mt-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm px-2 py-0.5 rounded-md shadow">
              CH
            </div>
            <span className="text-lg font-black bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              CineHub
            </span>
          </Link>
          <p className="text-gray-500 max-w-sm text-center md:text-left">
            Your ultimate destination for discovering movies, TV series, ratings, trailers, and managing your personal watchlist.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-6 font-medium">
          <Link to="/" className="hover:text-orange-400 transition-colors">
            Explore
          </Link>
          <Link to="/watchlist" className="hover:text-orange-400 transition-colors">
            Watchlist
          </Link>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange-400 transition-colors flex items-center gap-1"
          >
            <span>TMDB API</span>
            <span className="text-[10px]">↗</span>
          </a>
        </div>

        {/* TMDB Attribution & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-1 text-gray-500 text-[11px]">
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
          <p>© {new Date().getFullYear()} CineHub. Built with React & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
