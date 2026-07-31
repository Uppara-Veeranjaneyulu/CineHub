import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Watchlist from './components/Watchlist';
import MovieDetails from './pages/MovieDetails';
import { WatchlistProvider } from './context/WatchlistContext';
import { ToastProvider } from './context/ToastContext';

const App = () => (
  <ToastProvider>
    <WatchlistProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WatchlistProvider>
  </ToastProvider>
);

export default App;


