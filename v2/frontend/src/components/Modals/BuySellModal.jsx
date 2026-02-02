import React, { useState } from 'react';
import './Modals.css';

const BuySellModal = ({ stock, type, onClose, onConfirm }) => {
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

  const handleConfirm = () => {
    if (quantity < 1 || isNaN(quantity)) {
      setError('Invalid quantity');
      return;
    }
    onConfirm(stock, quantity, type);
  };

  const totalValue = stock.currentPrice * quantity;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content pixel-border" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{'>'} {type.toUpperCase()}_STOCK</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="trade-stock-info">
            <span className="trade-logo">{stock.logo}</span>
            <div>
              <div className="trade-name">{stock.name}</div>
              <div className="trade-symbol">{stock.symbol}</div>
            </div>
          </div>
          
          <div className="trade-price-info">
            <div className="trade-price-label">CURRENT PRICE:</div>
            <div className="trade-price-value">${stock.currentPrice.toFixed(2)}</div>
          </div>
          
          <div className="form-group">
            <label className="form-label">&gt; QUANTITY:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="terminal-input"
              min="1"
            />
            {error && <span className="error-text">{error}</span>}
          </div>
          
          <div className="trade-total">
            <span>TOTAL {type === 'buy' ? 'COST' : 'VALUE'}:</span>
            <span className="trade-total-value">${totalValue.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>CANCEL</button>
          <button 
            className={type === 'buy' ? 'btn-primary' : 'btn-danger'}
            onClick={handleConfirm}
            disabled={!!error || quantity < 1}
          >
            CONFIRM {type.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuySellModal;