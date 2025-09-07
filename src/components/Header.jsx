import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="flex justify-between items-center p-4 bg-gray-800">
    <Link to="/"><h1 className="text-2xl font-bold text-orange-500">CineHub</h1></Link>
    <nav>
      <Link className="px-4 hover:text-orange-400" to="/watchlist">Watchlist</Link>
    </nav>
  </header>
);

export default Header;
