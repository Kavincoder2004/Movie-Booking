import React from 'react';
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/bundle';

import { Navigation } from 'swiper/modules';

function Moviecards({ movies }) {
  return (
    <div className=" container mt-5" id='Swiper'>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        loop={true}
        breakpoints={{
          320: { slidesPerView: 1 },   // mobile
          768: { slidesPerView: 2 },   // tablet
          1024: { slidesPerView: 4 },  // desktop
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie._id}>
            <Link to={`/movies/${movie._id}`} className="text-decoration-none">
              <div className="card h-100">
                <img
                  src={movie.image}
                  className="card-img-top rounded-top"
                  alt={movie.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text">{movie.description}</p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Moviecards;