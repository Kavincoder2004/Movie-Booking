import React from 'react'

function Poster() {
  const handleTrailer = () => {
    window.open("https://www.youtube.com/watch?v=fJaAYcERf3Y&list=RDfJaAYcERf3Y&start_radio=1", "_blank");
  }
  return (
    <div className='Poster'>
      <div className="d-flex flex-wrap gap-2">
        <button onClick={handleTrailer} className=' btn Trailer-button '><i className="bi bi-play"></i>Watch Trailer</button>
      </div>
    </div>
  )
}

export default Poster