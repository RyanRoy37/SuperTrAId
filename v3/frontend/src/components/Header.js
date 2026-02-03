import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Header = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="header">
      <h1>[ SUPERTRADE ]</h1>
      {token && (
        <nav>
          <Link to="/dashboard" className={isActive('/dashboard')}>DASHBOARD</Link>
          <Link to="/stocks" className={isActive('/stocks')}>STOCKS</Link>
          <Link to="/portfolio" className={isActive('/portfolio')}>PORTFOLIO</Link>
          <Link to="/transactions" className={isActive('/transactions')}>TRANSACTIONS</Link>
          <Link to="/bundles" className={isActive('/bundles')}>BUNDLES</Link>
          <Link to="/wishlist" className={isActive('/wishlist')}>WISHLIST</Link>
          <Link to="/goals" className={isActive('/goals')}>GOALS</Link>
          <button onClick={handleLogout} className="btn">LOGOUT</button>
        </nav>
      )}
    </header>
  );
};

export default Header;