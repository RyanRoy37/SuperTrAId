import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';
import './App.css';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Main Pages
import DashboardPage from './pages/DashboardPage';
import StocksPage from './pages/StocksPage';
import PortfolioPage from './pages/PortfolioPage';
import ProfilePage from './pages/ProfilePage';
  import SuperBundlesPage from './pages/SuperBundlesPage';
// Layout
import SideNavbar from './components/SideNavbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  return (
    <Router>
      {!isAuthenticated ? (
        // 🔐 AUTH SCREENS (NO SIDENAV)
        <Routes>
          <Route
  path="/login"
  element={<LoginPage onLogin={() => setIsAuthenticated(true)} />}
/>

          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        // 🖥️ MAIN APP LAYOUT
        <div className="app-container">
          <div className="scanlines"></div>

          <SideNavbar />

          <div className="main-content">
            <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/superbundles" element={<SuperBundlesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>

          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
