import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand ms-2" to="/">
          <h1 className="gradient-heading text-white mb-0 fs-3">Cine Hub</h1>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-lg-4 text-center">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                <i className="bi bi-house-heart m-1"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#Swiper">
                <i className="bi bi-film m-1"></i>Movies
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/profile">
                <i className="bi bi-person m-1"></i>Profile
              </Link>
            </li>
          </ul>
          <div className="d-flex justify-content-center align-items-center mt-3 mt-lg-0 me-lg-4">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-white-50 small d-none d-sm-inline">Hi, {user.username}</span>
                <button onClick={handleLogout} className="btn btn-outline-danger text-white">Logout</button>
              </div>
            ) : (
              <Link to="/login">
                <button className="btn btn-danger btn-outline-dark text-white px-4">Login</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar