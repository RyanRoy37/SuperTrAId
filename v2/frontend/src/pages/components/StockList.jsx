// frontend/src/pages/components/StockList.js

import React from 'react';

const StockList = ({ stocks, selectedStock, onSelectStock }) => {
  return (
    <div className="stock-list">
      <div className="stock-list-header">
        <h3>{'>'} AVAILABLE_STOCKS</h3>
      </div>

      <div className="stock-list-items">
        {stocks.length === 0 && (
          <div className="stock-list-empty">NO_STOCKS</div>
        )}

        {stocks.map(stock => (
          <div
            key={stock.id}
            className={`stock-list-item ${
              selectedStock?.id === stock.id ? 'selected' : ''
            }`}
            onClick={() => onSelectStock(stock)}
          >
            <span className="stock-list-logo">{stock.logo}</span>

            <div className="stock-list-info">
              <div className="stock-list-name">{stock.name}</div>
              <div className="stock-list-symbol">{stock.symbol}</div>
            </div>

            <div className="stock-list-price-info">
              <div className="stock-list-price">
                ₹{Number(stock.price).toFixed(2)}
              </div>

              <div
                className={`stock-list-change ${
                  stock.change >= 0 ? 'positive' : 'negative'
                }`}
              >
                {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockList;
