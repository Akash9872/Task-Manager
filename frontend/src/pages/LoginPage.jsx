import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, token, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    const stored =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token || stored) {
      navigate('/dashboard', { replace: true });
    }
  }, [authLoading, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });
      login(response.data.user, response.data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error;
      setError(
        msg ||
          (err.code === 'ERR_NETWORK'
            ? 'API is not running. In the project folder run: npm run api  (or double-click start-api.bat). Keep that window open, then refresh this page.'
            : 'Login failed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Team Task Manager</h1>
        <p className="auth-subtitle">Sign in with the email and password you used at sign up</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="link-button"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
