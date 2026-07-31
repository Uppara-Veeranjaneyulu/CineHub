import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#07090E] border-t border-amber-500/10 text-gray-400 text-xs py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              CineHub
            </span>
          </Link>
          <p className="text-gray-500 max-w-sm text-center md:text-left text-[11px] leading-relaxed">
            Your destination for discovering movies, TV series, ratings, official trailers, and managing your personal watchlist.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-8 font-extrabold text-xs">
          <Link to="/" className="hover:text-amber-400 transition-colors">
            Explore
          </Link>
          <Link to="/watchlist" className="hover:text-amber-400 transition-colors">
            Watchlist
          </Link>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors text-amber-400/80"
          >
            TMDB API
          </a>
        </div>

        {/* TMDB Attribution & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-1.5 text-gray-500 text-[11px]">
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
          <p>© {new Date().getFullYear()} CineHub. Built with React & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
