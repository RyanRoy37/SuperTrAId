import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Auth.css'; 

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = '> ERROR: Valid email is required';
    }
    if (!form.password) {
      newErrors.password = '> ERROR: Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitError('');

  if (!validate()) return;

  try {
    setLoading(true);

    const res = await api.post('/auth/login', form);

    localStorage.setItem('token', res.data.token);

    if (onLogin) {
      onLogin();   // ✅ ESLint happy
    }

    navigate('/dashboard');
  } catch (err) {
    setSubmitError(
      err.response?.data?.message || '> ERROR: Login failed'
    );
  } finally {
    setLoading(false);
  }
};


  const isFormValid = () => form.email && form.password;

  return (
    <div className="auth-container">
      <div className="scanlines"></div>

      <div className="auth-box pixel-border">
        <div className="terminal-header">
          <span className="terminal-title">{'>'} SYSTEM_LOGIN.EXE</span>
          <span className="blinking-cursor">█</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h1 className="auth-title">
            <span className="glitch" data-text="LOGIN">LOGIN</span>
          </h1>

          {submitError && (
            <div className="error-banner pixel-border">
              <span>⚠ {submitError}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">&gt; EMAIL:</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="terminal-input"
              placeholder="trader@stockterm.com"
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">&gt; PASSWORD:</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="terminal-input"
              placeholder="********"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary pixel-btn"
            disabled={!isFormValid() || loading}
          >
            {loading ? '> AUTHENTICATING...' : '> LOGIN'}
          </button>

          <div className="auth-links">
            <Link to="/signup" className="link">
              {'>'} Don&apos;t have an account?{' '}
              <span className="link-highlight">SIGN UP</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
