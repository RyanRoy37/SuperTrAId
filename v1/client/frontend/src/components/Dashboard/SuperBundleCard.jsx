import React from 'react';
import './DashboardComponents.css';

const SuperBundleCard = ({ bundle, onView, onBuy, onEdit }) => {
  return (
    <div className="bundle-card pixel-border">
      <div className="bundle-header">
        <div className="bundle-title">{bundle.name}</div>
        <div className="bundle-badge">
          {bundle.isPlatform ? '[PLATFORM]' : '[USER]'}
        </div>
      </div>
      
      {bundle.description && (
        <div className="bundle-description">{bundle.description}</div>
      )}
      
      <div className="bundle-stats">
        <div className="bundle-stat">
          <span className="stat-label">STOCKS:</span>
          <span className="stat-value">{bundle.stocks.length}</span>
        </div>
        <div className="bundle-stat">
          <span className="stat-label">COST:</span>
          <span className="stat-value">${bundle.cost.toFixed(2)}</span>
        </div>
        <div className="bundle-stat">
          <span className="stat-label">PERFORMANCE:</span>
          <span className={`stat-value ${bundle.performance >= 0 ? 'positive' : 'negative'}`}>
            {bundle.performance >= 0 ? '+' : ''}{bundle.performance}%
          </span>
        </div>
      </div>
      
      <div className="bundle-stocks-preview">
        {bundle.stocks.slice(0, 4).map(stock => (
          <span key={stock} className="stock-chip">{stock}</span>
        ))}
        {bundle.stocks.length > 4 && <span className="stock-chip">+{bundle.stocks.length - 4}</span>}
      </div>
      
      <div className="bundle-actions">
        <button className="btn-secondary" onClick={() => onView(bundle)}>VIEW</button>
        <button className="btn-primary" onClick={() => onBuy(bundle)}>BUY</button>
        {!bundle.isPlatform && (
          <button className="btn-edit" onClick={() => onEdit(bundle)}>EDIT</button>
        )}
      </div>
    </div>
  );
};

export default SuperBundleCard;