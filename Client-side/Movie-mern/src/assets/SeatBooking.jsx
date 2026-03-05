import axios from 'axios';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SeatBooking() {
  const { showId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsToUnbook, setSeatsToUnbook] = useState([]);
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/shows/${showId}`)
      .then(res => {
        setShow(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching show details:", err);
        setLoading(false);
      });
  }, [showId]);

  const handleSeatClick = (seatNumber) => {
    const isBooked = show.booked_seats.includes(seatNumber);

    if (isBooked) {
      if (seatsToUnbook.includes(seatNumber)) {
        setSeatsToUnbook(seatsToUnbook.filter(s => s !== seatNumber));
      } else {
        setSeatsToUnbook([...seatsToUnbook, seatNumber]);
      }
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBookNow = () => {
    if (selectedSeats.length === 0) return;

    axios.patch(`http://localhost:5000/api/shows/${showId}/book`, { seats: selectedSeats })
      .then(res => {
        alert(`Booking successful for seats: ${selectedSeats.join(", ")}`);
        setShow(prev => ({ ...prev, booked_seats: res.data.booked_seats }));
        setSelectedSeats([]);
      })
      .catch(err => {
        alert(err.response?.data?.message || "Booking failed");
      });
  };

  const handleUnbookNow = () => {
    if (seatsToUnbook.length === 0) return;

    axios.patch(`http://localhost:5000/api/shows/${showId}/unbook`, { seats: seatsToUnbook })
      .then(res => {
        alert(`Unbooked seats: ${seatsToUnbook.join(", ")}`);
        setShow(prev => ({ ...prev, booked_seats: res.data.booked_seats }));
        setSeatsToUnbook([]);
      })
      .catch(err => {
        alert(err.response?.data?.message || "Unbooking failed");
      });
  };

  const rows = 5;
  const cols = 8;
  const pricePerSeat = show?.price || 200;
  const totalPrice = selectedSeats.length * pricePerSeat;

  if (loading) return <div className="booking-wrapper bg-white min-vh-100 p-4 text-center">Loading show details...</div>;
  if (!show) return <div className="booking-wrapper bg-white min-vh-100 p-4 text-center">Show not found.</div>;

  return (
    <div className="booking-wrapper bg-white min-vh-100 p-2 p-md-4">
      <div className="container-fluid">
        <div className="row g-4">
          {/* Main Seat Selection */}
          <div className="col-md-8">
            <div className="booking-header text-center mb-4">
              <h2 className="text-dark">{show.screen_id?.screen_name}</h2>
              <p className="text-muted">Show Time: {show.show_time || new Date(show.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            <div className="screen-container text-center mb-5">
              <div className="screen mx-auto" style={{ width: '80%', background: '#ccc', height: '10px', borderRadius: '50% / 100% 100% 0 0' }}></div>
              <p className="small text-muted mt-2">All eyes this way please!</p>
            </div>

            <div className="seat-container mx-auto" style={{ maxWidth: 'fit-content' }}>
              {[...Array(rows)].map((_, rowIndex) => (
                <div className="seat-row d-flex justify-content-center" key={rowIndex}>
                  {[...Array(cols)].map((_, colIndex) => {
                    const seatNumber = rowIndex * cols + (colIndex + 1);
                    const isBooked = show.booked_seats.includes(seatNumber);
                    const isSelected = selectedSeats.includes(seatNumber);
                    const isToUnbook = seatsToUnbook.includes(seatNumber);

                    return (
                      <div
                        key={seatNumber}
                        className={`seat m-1 d-flex align-items-center justify-content-center rounded border
                          ${isBooked ? (isToUnbook ? "bg-warning text-dark border-dark" : "bg-secondary text-white cursor-pointer") :
                            isSelected ? "bg-success text-white" : "bg-light text-dark cursor-pointer"}`}
                        style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                        onClick={() => handleSeatClick(seatNumber)}
                        title={isBooked ? "Click to unbook" : "Click to select"}
                      >
                        {seatNumber}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="legend d-flex flex-wrap justify-content-center gap-3 gap-md-4 mt-5">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-light border" style={{ width: '20px', height: '20px' }}></div> <span className="small">Available</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="bg-success" style={{ width: '20px', height: '20px' }}></div> <span className="small">Selected</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="bg-secondary" style={{ width: '20px', height: '20px' }}></div> <span className="small">Booked</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="bg-warning border border-dark" style={{ width: '20px', height: '20px' }}></div> <span className="small">To Unbook</span>
              </div>
            </div>
          </div>

          {/* Booking Summary Panel */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 p-3 p-md-4 sticky-top" style={{ top: '80px', background: '#f8f9fa', minHeight: '400px', height: 'auto', maxWidth: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {/* Top half of card */}
              <div>
                <h4 className="border-bottom pb-2 mb-3">Booking Summary</h4>

                <div className="mb-3">
                  <label className="text-muted small d-block">Movie</label>
                  <span className="fw-bold fs-5">{show.movie_id?.title}</span>
                </div>

                <div className="mb-3">
                  <label className="text-muted small d-block">Theater</label>
                  <span className="fw-bold">{show.screen_id?.theater_id?.name || show.screen_id?.theater_id?.title || "Theater Info"}</span>
                </div>

                <div className="mb-3">
                  <label className="text-muted small d-block">Screen</label>
                  <span className="fw-bold">{show.screen_id?.screen_name || "Screen Info"}</span>
                </div>

                <div className="mb-3">
                  <label className="text-muted small d-block">Selected Seats</label>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {selectedSeats.length > 0 ? (
                      selectedSeats.map(s => (
                        <span key={s} className="badge bg-success text-white">{s}</span>
                      ))
                    ) : (
                      <span className="text-muted italic small">No seats selected</span>
                    )}
                  </div>
                </div>

                {seatsToUnbook.length > 0 && (
                  <div className="mb-3">
                    <label className="text-muted small d-block text-warning fw-bold">Seats to Unbook</label>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {seatsToUnbook.map(s => (
                        <span key={s} className="badge bg-warning text-dark border border-dark">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom half of card */}
              <div className="mt-auto">
                <hr />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="text-muted">Total Amount</span>
                  <span className="fw-bold fs-4 text-danger">₹{totalPrice}</span>
                </div>

                {selectedSeats.length > 0 && (
                  <button className="btn btn-danger w-100 py-2 fw-bold mb-2" onClick={handleBookNow}>
                    BOOK NOW
                  </button>
                )}

                {seatsToUnbook.length > 0 && (
                  <button className="btn btn-warning w-100 py-2 fw-bold border border-dark mb-2" onClick={handleUnbookNow}>
                    UNBOOK SELECTED
                  </button>
                )}

                {(selectedSeats.length === 0 && seatsToUnbook.length === 0) && (
                  <button className="btn btn-secondary w-100 py-2 fw-bold disabled opacity-50 mb-2" disabled>
                    SELECT SEATS
                  </button>
                )}

                <p className="text-center small text-muted mt-3 mb-4">
                  * Prices inclusive of all taxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatBooking;