import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StockList from './pages/StockList';
import StockDetails from './pages/StockDetails';
import Portfolio from './pages/Portfolio';
import Transactions from './pages/Transactions';
import Bundles from './pages/Bundles';
import Wishlist from './pages/Wishlist';
import Goals from './pages/Goals';
import Header from './components/Header';
import { AuthProvider, useAuth } from './utils/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { token } = useAuth();
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/stocks" element={<PrivateRoute><StockList /></PrivateRoute>} />
          <Route path="/stocks/:id" element={<PrivateRoute><StockDetails /></PrivateRoute>} />
          <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
          <Route path="/bundles" element={<PrivateRoute><Bundles /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;