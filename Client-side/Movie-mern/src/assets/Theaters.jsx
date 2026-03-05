import React, { useState } from "react";
import { Link } from "react-router-dom";

function Theaters({ Theaters }) {
  // Track selected screen ID for each theater
  const [selectedScreens, setSelectedScreens] = useState({});

  const handleScreenClick = (theaterId, screenId) => {
    setSelectedScreens(prev => ({
      ...prev,
      [theaterId]: String(prev[theaterId]) === String(screenId) ? null : screenId
    }));
  };

  return (
    <div className="container mt-4 px-2 px-md-3">
      <h3 className="text-dark mb-3 text-center text-md-start">Theaters</h3>
      <div className="list-group">
        {Theaters.map((theater) => {
          const selectedScreenId = selectedScreens[theater._id];
          const selectedScreen = theater.screens?.find(s => String(s._id) === String(selectedScreenId));
          const visibleShowtimes = selectedScreen ? selectedScreen.showtimes : [];

          return (
            <div key={theater._id} className="list-group-item ">
              <h5 className="mb-1 d-flex align-items-center">
                {theater.title || theater.name}
                <span className="ms-2 text-muted fw-normal" style={{ fontSize: '0.9rem' }}>({theater.location})</span>
              </h5>

              <div className="mt-1">
                <span className="text-secondary small">Screens (Click to see times): </span>
                {theater.screens?.map((screen) => (
                  <span
                    key={screen._id}
                    onClick={() => handleScreenClick(theater._id, screen._id)}
                    className={`badge border me-1 cursor-pointer ${String(selectedScreenId) === String(screen._id) ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {screen.screen_name}
                  </span>
                ))}
              </div>

              <div className="mt-2 d-flex flex-wrap gap-2">
                {selectedScreenId ? (
                  visibleShowtimes.length > 0 ? (
                    visibleShowtimes.map((time, index) => (
                      <Link
                        key={index}
                        to={`/booking/${time.id}`}
                        className="badge bg-danger text-white text-decoration-none p-2"
                      >
                        {time.time}
                      </Link>
                    ))
                  ) : (
                    <span className="text-muted small italic">No shows scheduled for {selectedScreen.screen_name}</span>
                  )
                ) : (
                  <span className="text-muted small italic">Please select a screen to view showtimes</span>
                )}
              </div>

              <p className="text-muted mt-2">
                {theater.cancellable ? "Cancellable" : "Non-cancellable"} • {theater.audio}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Theaters;