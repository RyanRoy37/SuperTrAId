import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Auth.css';

const SignupPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    purpose: '',
    capital: '',
    risk: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = '> ERROR: Valid email is required';
    }

    if (!form.password || form.password.length < 6) {
      newErrors.password = '> ERROR: Password must be at least 6 characters';
    }

    if (!form.purpose) {
      newErrors.purpose = '> ERROR: Purpose is required';
    }

    if (!form.capital || Number(form.capital) <= 0) {
      newErrors.capital = '> ERROR: Valid capital is required';
    }

    if (!form.risk) {
      newErrors.risk = '> ERROR: Risk preference is required';
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

      await api.post('/auth/signup', {
        email: form.email,
        password: form.password,
        purpose: form.purpose,
        capital: Number(form.capital),
        risk: form.risk
      });

      navigate('/login');
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || '> ERROR: Signup failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () =>
    form.email &&
    form.password.length >= 6 &&
    form.purpose &&
    form.capital &&
    form.risk;

  return (
    <div className="auth-container">
      <div className="scanlines"></div>

      <div className="auth-box pixel-border">
        <div className="terminal-header">
          <span className="terminal-title">{'>'} SYSTEM_SIGNUP.EXE</span>
          <span className="blinking-cursor">█</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h1 className="auth-title">
            <span className="glitch" data-text="SIGN UP">SIGN UP</span>
          </h1>

          {submitError && (
            <div className="error-banner pixel-border">
              <span>⚠ {submitError}</span>
            </div>
          )}

          {/* EMAIL */}
          <div className="form-group">
            <label className="form-label">&gt; EMAIL:</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="terminal-input"
              placeholder="trader@supertrade.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label className="form-label">&gt; PASSWORD:</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="terminal-input"
              placeholder="********"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* PURPOSE */}
          <div className="form-group">
            <label className="form-label">&gt; PURPOSE:</label>
            <select
              className="terminal-input"
              value={form.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
            >
              <option value="">SELECT PURPOSE</option>
              <option value="learning">Learning</option>
              <option value="swing">Swing Trading</option>
              <option value="long-term">Long Term</option>
            </select>
            {errors.purpose && <span className="error-text">{errors.purpose}</span>}
          </div>

          {/* CAPITAL */}
          <div className="form-group">
            <label className="form-label">&gt; INITIAL_CAPITAL (₹):</label>
            <input
              type="number"
              value={form.capital}
              onChange={(e) => handleChange('capital', e.target.value)}
              className="terminal-input"
              placeholder="1000000"
            />
            {errors.capital && <span className="error-text">{errors.capital}</span>}
          </div>

          {/* RISK */}
          <div className="form-group">
            <label className="form-label">&gt; RISK_LEVEL:</label>
            <select
              className="terminal-input"
              value={form.risk}
              onChange={(e) => handleChange('risk', e.target.value)}
            >
              <option value="">SELECT RISK</option>
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
            </select>
            {errors.risk && <span className="error-text">{errors.risk}</span>}
          </div>

          <button
            type="submit"
            className="btn-primary pixel-btn"
            disabled={!isFormValid() || loading}
          >
            {loading ? '> CREATING_ACCOUNT...' : '> CREATE_ACCOUNT'}
          </button>

          <div className="auth-links">
            <Link to="/login" className="link">
              {'>'} Already have an account?{' '}
              <span className="link-highlight">LOGIN</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
