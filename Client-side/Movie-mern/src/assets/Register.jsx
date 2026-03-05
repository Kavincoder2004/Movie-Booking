import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            await axios.post(`${API_URL}/auth/register`, { username, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div className="login-card p-4 p-md-5" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '450px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div className="text-center mb-4">
                    <h2 className="text-white fw-bold mb-1">Create Account</h2>
                    <p className="text-white-50 small">Join Cine Hub to start booking movies</p>
                </div>

                {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="text-white-50 small mb-2 ms-1">Username</label>
                        <input
                            type="text"
                            className="form-control text-white"
                            placeholder="Pick a username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.07)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                color: '#fff'
                            }}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="text-white-50 small mb-2 ms-1">Email</label>
                        <input
                            type="email"
                            className="form-control text-white"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.07)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                color: '#fff'
                            }}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-white-50 small mb-2 ms-1">Password</label>
                        <input
                            type="password"
                            className="form-control text-white"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.07)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                color: '#fff'
                            }}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-danger w-100 fw-bold mb-4 py-2" style={{
                        borderRadius: '12px',
                        background: 'linear-gradient(45deg, #e50914, #ff4b2b)',
                        border: 'none',
                        boxShadow: '0 10px 20px rgba(229, 9, 20, 0.3)'
                    }}>
                        {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-white-50 small mb-0">Already have an account? <Link to="/login" className="text-danger text-decoration-none fw-bold">Log In</Link></p>
                    <Link to="/" className="text-muted small text-decoration-none mt-3 d-inline-block">Back to Home</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
