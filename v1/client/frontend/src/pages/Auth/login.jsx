import React, { useState } from 'react';
import './Auth.css';

const Login = ({ onNavigate, onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    if (validate()) {
      setTimeout(() => {
        localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
        onLogin();
      }, 500);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const isFormValid = () => {
    return form.email && form.password;
  };

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
            {errors.email && <span className="error-text">{errors.email}</span>}
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
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="btn-primary pixel-btn"
            disabled={!isFormValid()}
          >
            &gt; LOGIN
          </button>

          <div className="auth-links">
            <span onClick={() => onNavigate('signup')} className="link">
              {'>'} Don't have an account? <span className="link-highlight">SIGN UP</span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;