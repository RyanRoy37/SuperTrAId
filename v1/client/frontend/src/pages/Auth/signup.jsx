import React, { useState } from 'react';
import './Auth.css';

const Signup = ({ onNavigate }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = '> ERROR: Full name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = '> ERROR: Valid email is required';
    }
    if (form.password.length < 6) {
      newErrors.password = '> ERROR: Password must be at least 6 characters';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = '> ERROR: Passwords do not match';
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
        localStorage.setItem('userName', form.fullName);
        localStorage.setItem('userEmail', form.email);
        onNavigate('login');
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
    return form.fullName && form.email && form.password.length >= 6 && 
           form.password === form.confirmPassword;
  };

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

          <div className="form-group">
            <label className="form-label">&gt; FULL_NAME:</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="terminal-input"
              placeholder="John Doe"
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

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
            <label className="form-label">
              &gt; PHONE: <span className="optional-text">[OPTIONAL]</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="terminal-input"
              placeholder="+1-234-567-8900"
            />
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

          <div className="form-group">
            <label className="form-label">&gt; CONFIRM_PASSWORD:</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className="terminal-input"
              placeholder="********"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className="btn-primary pixel-btn"
            disabled={!isFormValid()}
          >
            &gt; CREATE_ACCOUNT
          </button>

          <div className="auth-links">
            <span onClick={() => onNavigate('login')} className="link">
              {'>'} Already have an account? <span className="link-highlight">LOGIN</span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;