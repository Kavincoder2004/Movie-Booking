import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          
          {/* Navigation Links */}
          <div className="d-flex gap-4">
            <a href="#home" className="text-light text-decoration-none">Home</a>
            <a href="#movies" className="text-light text-decoration-none">Movies</a>
            <a href="#about" className="text-light text-decoration-none">About</a>
            <a href="#contact" className="text-light text-decoration-none">Contact</a>
          </div>

          {/* Social Media Links */}
          <div className="d-flex gap-3">
            <a href="#" className="text-light text-decoration-none "><i class="bi bi-facebook m-1"></i>Facebook</a>
            <a href="#" className="text-light text-decoration-none"><i class="bi bi-twitter-x m-1"></i>Twitter</a>
            <a href="#" className="text-light text-decoration-none"><i class="bi bi-instagram m-1"></i>Instagram</a>
          </div>
        </div>

        <hr className="border-light my-3" />
        <div className="text-center">
          <small>© 2026 Movie Booking. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;