import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Watchlist from './components/Watchlist';
import MovieDetails from './pages/MovieDetails';

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  </Router>
);

export default App;
