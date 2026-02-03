import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tradingPurpose: 'learning',
    virtualCapital: 100000,
    riskPreference: 'medium'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.signup(formData);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>[ SIGNUP ]</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>PASSWORD</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>TRADING PURPOSE</label>
            <select name="tradingPurpose" value={formData.tradingPurpose} onChange={handleChange}>
              <option value="learning">LEARNING</option>
              <option value="swing">SWING TRADING</option>
              <option value="long-term">LONG-TERM INVESTING</option>
            </select>
          </div>
          <div className="form-group">
            <label>VIRTUAL CAPITAL (₹)</label>
            <input
              type="number"
              name="virtualCapital"
              value={formData.virtualCapital}
              onChange={handleChange}
              min="10000"
              step="10000"
            />
          </div>
          <div className="form-group">
            <label>RISK PREFERENCE</label>
            <select name="riskPreference" value={formData.riskPreference} onChange={handleChange}>
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
            </select>
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>CREATE ACCOUNT</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <Link to="/login" style={{ color: '#0f0' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;