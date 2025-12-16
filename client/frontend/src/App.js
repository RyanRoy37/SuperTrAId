import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Auth Pages
import Signup from './pages/Auth/signup';
import Login from './pages/Auth/login';
import "./chartSetup";

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Stocks from './pages/stocks/Stocks';
import SuperBundles from './pages/SuperBundles/SuperBundles';
import Transactions from './pages/Transactions/Transactions';
import Profile from './pages/Profile/Profile';

// Layout
import SideNavbar from './components/Layout/SideNavbar';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    if (currentPage === 'signup') {
      return <Signup onNavigate={handleNavigate} />;
    }
    return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <div className="scanlines"></div>
      <SideNavbar activePage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} />
      <div className="main-content">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'stocks' && <Stocks />}
        {currentPage === 'bundles' && <SuperBundles />}
        {currentPage === 'transactions' && <Transactions />}
        {currentPage === 'profile' && <Profile />}
      </div>
    </div>
  );
}

export default App;