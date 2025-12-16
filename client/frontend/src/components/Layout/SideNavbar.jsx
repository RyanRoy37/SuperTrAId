import React from 'react';
import './SideNavbar.css';

const SideNavbar = ({ activePage, onNavigate, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '◉', ascii: '[DASH]' },
    { id: 'stocks', label: 'Stocks', icon: '📊', ascii: '[STCK]' },
    { id: 'bundles', label: 'SuperBundles', icon: '📦', ascii: '[BNDL]' },
    { id: 'transactions', label: 'Transactions', icon: '📜', ascii: '[TXNS]' },
    { id: 'profile', label: 'Profile', icon: '👤', ascii: '[USER]' }
  ];

  return (
    <div className="side-navbar pixel-border">
      <div className="nav-logo">
        <div className="logo-main">$TOCK_TERM</div>
        <div className="logo-version">v1.0.0</div>
        <div className="logo-status">
          <span className="status-dot"></span>
          <span>ONLINE</span>
        </div>
      </div>

      <nav className="nav-menu">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            <span className="nav-ascii">{item.ascii}</span>
          </div>
        ))}
      </nav>

      <div className="nav-footer">
        <div className="nav-item logout-item" onClick={onLogout}>
          <span className="nav-icon">⎋</span>
          <span className="nav-label">Logout</span>
          <span className="nav-ascii">[EXIT]</span>
        </div>
        <div className="footer-info">
          <div>© 2025 STOCK_TERM</div>
          <div className="footer-ticker">
            <span className="ticker-item">AAPL: 182.5</span>
            <span className="ticker-item">MSFT: 335.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;