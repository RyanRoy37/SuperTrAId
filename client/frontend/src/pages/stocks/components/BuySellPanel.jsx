import React, { useState } from 'react';

const BuySellPanel = ({ stock, onBuy, onSell }) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const handleQuantityChange = (value) => {
    const qty = parseInt(value);
    if (isNaN(qty) || qty < 1) {
      setError('Quantity must be at least 1');
      setQuantity(value);
    } else {
      setError('');
      setQuantity(qty);
    }
  };

  const handleBuy = () => {
    if (quantity < 1 || isNaN(quantity)) {
      setError('Invalid quantity');
      return;
    }
    onBuy(quantity);
    setQuantity(1);
    setError('');
  };

  const handleSell = () => {
    if (quantity < 1 || isNaN(quantity)) {
      setError('Invalid quantity');
      return;
    }
    onSell(quantity);
    setQuantity(1);
    setError('');
  };

  const totalCost = (stock.price * quantity).toFixed(2);

  return (
    <div className="buy-sell-panel pixel-border">
      <div className="panel-header">
        <h3>{'>'} TRADE_PANEL</h3>
      </div>
      
      <div className="panel-body">
        <div className="trade-stock-display">
          <span className="trade-display-logo">{stock.logo}</span>
          <div>
            <div className="trade-display-name">{stock.name}</div>
            <div className="trade-display-symbol">{stock.symbol}</div>
          </div>
          <div className="trade-display-price">${stock.price.toFixed(2)}</div>
        </div>

        <div className="trade-input-group">
          <label className="trade-label">&gt; QUANTITY:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="terminal-input trade-input"
            min="1"
          />
          {error && <span className="error-text">{error}</span>}
        </div>

        <div className="trade-total-display">
          <span className="trade-total-label">TOTAL:</span>
          <span className="trade-total-value">${totalCost}</span>
        </div>

        <div className="trade-buttons">
          <button 
            className="btn-primary trade-btn-buy"
            onClick={handleBuy}
            disabled={!!error || quantity < 1}
          >
            {'>'} BUY
          </button>
          <button 
            className="btn-danger trade-btn-sell"
            onClick={handleSell}
            disabled={!!error || quantity < 1}
          >
            {'>'} SELL
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuySellPanel;