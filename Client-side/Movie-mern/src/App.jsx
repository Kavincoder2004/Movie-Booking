import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { useEffect, useState } from "react";

import Navbar from './assets/Navbar';
import axios from 'axios'
import Poster from './assets/Poster';
import Below from './assets/Below';
import Moviecards from './assets/Moviecard';
import Footer from './assets/Footer';
import MovieDetail from './assets/MovieDetail';
import Theaters from './assets/Theaters';
import SeatBooking from './assets/SeatBooking';
import Login from './assets/Login';
import Register from './assets/Register';
import Profile from './assets/Profile'


import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/movies")
      .then(res => setMovies(res.data))
      .catch(err => {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies. Please check if your backend is running.");
      });

    axios.get("http://localhost:5000/api/theaters")
      .then(res => {
        console.log("Fetched theaters:", res.data);
        setTheaters(res.data);
      })
      .catch(err => console.error("Error fetching theaters:", err));
  }, []);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        {error ? (
          <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
            <h2>{error}</h2>
          </div>
        ) : movies.length === 0 ? (
          <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
            <h2>Loading Movies...</h2>
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Poster />
                  <Below />
                  <Moviecards movies={movies} />
                  <Footer />
                </>
              }
            />
            <Route path="/movies/:id" element={<MovieDetail movies={movies} />} />
            <Route path="/booking/:showId" element={<SeatBooking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
             <Route path="/profile" element={<Profile />} />

          </Routes>
        )}
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;