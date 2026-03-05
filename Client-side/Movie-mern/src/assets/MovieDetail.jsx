import React from "react";
import { useParams, Link } from "react-router-dom";
import Theaters from "./Theaters";
import Navbar from "./Navbar";
import axios from 'axios'
import { useEffect, useState } from "react";

function MovieDetail({ movies }) {
  const { id } = useParams();
  const [movieTheaters, setMovieTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate 7 days starting from today
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const [selectedDate, setSelectedDate] = useState(dates[0]);

  useEffect(() => {
    setLoading(true);
    const dateStr = selectedDate.toISOString().split('T')[0];
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    axios.get(`${API_URL}/theaters/movie/${id}?date=${dateStr}`)
      .then(res => {
        setMovieTheaters(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching theaters for movie:", err);
        setLoading(false);
      });
  }, [id, selectedDate]);

  const movie = movies.find((m) => String(m._id) === id);

  return (
    <div className="Movie-Back bg-white min-vh-100">
      {/* Use the shared Navbar component instead of re-defining it */}
      <Navbar />

      {/* Movie details */}
      <div className="container mt-5">
        {movie ? (
          <>
            <h2 className="text-dark">{movie.title} - (Tamil)</h2>

            <div className="d-flex flex-wrap gap-2 mt-3">
              <button className="Movie-Details-btn btn-primary">
                Runtime: {movie.runtime}
              </button>
              <button className="Movie-Cert-btn btn-primary">
                {movie.certification}
              </button>
              <button className="Movie-Genre-btn btn-primary">
                {movie.description}
              </button>
            </div>

            <hr />

            {/* Dynamic Date buttons with original style - made scrollable for mobile */}
            <div className="d-flex overflow-auto pb-2 gap-2 mt-3 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
              {dates.map((date, index) => {
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = date.getDate();
                const month = date.toLocaleDateString('en-US', { month: 'short' });

                // Use original class names from index.css (capping at -5)
                const buttonClass = index === 0 ? "Date-Button" : `Date-Button-${Math.min(index, 5)}`;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`${buttonClass} btn btn-danger flex-shrink-0`}
                    style={{
                      ...(isSelected ? { backgroundColor: 'red', color: 'white' } : {}),
                      width: 'auto',
                      minWidth: '60px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {dayNum} {month}
                  </button>
                );
              })}
            </div>

            <hr className="my-4" />

            {/* Theaters appear below the dates */}
            {loading ? (
              <p className="text-muted">Loading showtimes...</p>
            ) : (
              <Theaters key={selectedDate.toISOString()} Theaters={movieTheaters} />
            )}
          </>
        ) : (
          <p className="text-muted">Movie not found.</p>
        )}
      </div>
    </div>
  );
}

export default MovieDetail;