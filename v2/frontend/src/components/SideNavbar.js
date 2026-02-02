import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  return (
    <div className="side-navbar pixel-border">
      <div className="nav-logo">
        <div className="logo-main">$TOCK_TERM</div>
        <div className="logo-version">v1.0.0</div>
      </div>

      <nav className="nav-menu">
        <NavLink to="/dashboard" className="nav-item">Dashboard</NavLink>
        <NavLink to="/stocks" className="nav-item">Stocks</NavLink>
        <NavLink to="/superbundles" className="nav-item">SuperBundles</NavLink>
        <NavLink to="/portfolio" className="nav-item">Portfolio</NavLink>
        <NavLink to="/profile" className="nav-item">Profile</NavLink>
      </nav>

      <div className="nav-footer">
        <button className="nav-item logout-item" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
