import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  // state to hold user data after fetch
  const [user, setUser] = useState(null);

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    axios.get(`http://localhost:5000/api/users/${userId}`)
      .then(res => {
        console.log("Fetched user:", res.data);
        setUser(res.data);
      })
      .catch(err => console.error("Error fetching user:", err));
  }, [userId, navigate]);

  return (
    <div className="bg-white min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            {!user ? (
              <div className="text-center text-dark fs-4">
                Loading profile...
              </div>
            ) : (
              <div
                className="card border-0 shadow-lg rounded-4 w-100"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
                }}
              >
                <div className="card-body text-center py-5">
                  {/* Profile Header */}
                  <div className="position-relative d-inline-block mb-4">
                    <div
                      className="rounded-circle border-4 border-primary d-flex align-items-center justify-content-center bg-gradient"
                      style={{
                        width: "120px",
                        height: "120px",
                        fontSize: "60px",
                        background:
                          "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
                      }}
                    >
                      👤
                    </div>
                    <div
                      className="position-absolute bottom-0 end-0 bg-success rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "35px",
                        height: "35px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                      }}
                    >
                      <span className="text-white fw-bold">✓</span>
                    </div>
                  </div>
                  <h2
                    className="card-title mb-3 fw-bold text-dark fs-3 fs-md-2"
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                  >
                    {user.username || "Unnamed User"}
                  </h2>
                  <p className="text-muted mb-0 fs-6 fs-md-5">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;