import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Fetch user info using the access token
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });

                const { sub: googleId, email, name } = userInfo.data;

                const res = await axios.post('http://localhost:5000/api/auth/google-auth', {
                    googleId,
                    email,
                    name
                });

                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/');
            } catch (err) {
                setError('Google Login failed');
                console.error(err);
            }
        },
        onError: () => setError('Google Login Failed'),
        prompt: 'select_account'
    });

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
                    <h2 className="text-white fw-bold mb-1">Welcome Back</h2>
                    <p className="text-white-50 small">Enter your credentials to access your account</p>
                </div>

                {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

                <form onSubmit={handleLogin}>
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
                        {loading ? 'LOGGING IN...' : 'LOG IN'}
                    </button>
                </form>

                <div className="d-flex align-items-center mb-4">
                    <hr className="flex-grow-1" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />
                    <span className="mx-3 text-white-50 small">OR CONTINUE WITH</span>
                    <hr className="flex-grow-1" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />
                </div>

                <div className="row g-2 mb-4">
                    <div className="col-12">
                        <button
                            onClick={() => googleLogin()}
                            className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: '#fff',
                                padding: '12px'
                            }}
                        >
                            <i className="bi bi-google text-danger"></i>
                            <span className="small">Continue with Google</span>
                        </button>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-white-50 small mb-0">Don't have an account? <Link to="/register" className="text-danger text-decoration-none fw-bold">Sign Up</Link></p>
                    <Link to="/" className="text-muted small text-decoration-none mt-3 d-inline-block">Back to Home</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
