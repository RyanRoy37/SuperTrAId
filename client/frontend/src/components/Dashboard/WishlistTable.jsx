import React from 'react';
import './DashboardComponents.css';

const WishlistTable = ({ wishlist, onAddToHoldings, onRemove }) => {
  return (
    <div className="wishlist-container">
      <div className="table-header">
        <h2>{'>'} WISHLIST</h2>
      </div>
      <div className="wishlist-grid">
        {wishlist.map((stock) => (
          <div key={stock.symbol} className="wishlist-card pixel-border">
            <div className="wishlist-header">
              <span className="wishlist-logo">{stock.logo}</span>
              <div className="wishlist-info">
                <div className="wishlist-name">{stock.name}</div>
                <div className="wishlist-symbol">{stock.symbol}</div>
              </div>
            </div>
            <div className="wishlist-price">${stock.price.toFixed(2)}</div>
            <div className={`wishlist-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
              {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change)}%
            </div>
            {stock.notes && <div className="wishlist-notes">Note: {stock.notes}</div>}
            <div className="wishlist-actions">
              <button className="btn-secondary" onClick={() => onAddToHoldings(stock)}>
                + ADD TO HOLDINGS
              </button>
              <button className="btn-remove" onClick={() => onRemove(stock)}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistTable;