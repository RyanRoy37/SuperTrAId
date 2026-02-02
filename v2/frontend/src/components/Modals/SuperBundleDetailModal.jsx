import React from 'react';
import './Modals.css';

const SuperBundleDetailModal = ({ bundle, onClose, onBuy }) => {
  if (!bundle) return null;

  const totalCost =
    bundle.totalCost ??
    bundle.stocks.reduce((sum, s) => sum + Number(s.price || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content pixel-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{'>'} BUNDLE_DETAILS</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="bundle-detail-header">
            <h3>{bundle.name}</h3>
            <div className="bundle-badge">
              {bundle.isPlatform ? '[PLATFORM]' : '[USER]'}
            </div>
          </div>

          {bundle.description && (
            <p className="bundle-detail-description">
              {bundle.description}
            </p>
          )}

          <div className="bundle-stocks-list">
            <h4>{'>'} STOCKS_IN_BUNDLE ({bundle.stocks.length})</h4>

            {bundle.stocks.map(stock => (
              <div key={stock.id} className="bundle-stock-item">
                <span className="bundle-stock-logo">📊</span>

                <div className="bundle-stock-info">
                  <div className="bundle-stock-name">{stock.name}</div>
                  <div className="bundle-stock-symbol">{stock.symbol}</div>
                </div>

                <div className="bundle-stock-price">
                  ₹{Number(stock.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="bundle-total">
            <span>TOTAL COST:</span>
            <span className="bundle-total-value">
              ₹{Number(totalCost).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            CANCEL
          </button>
          <button
            className="btn-primary"
            onClick={() => onBuy(bundle)}
          >
            BUY BUNDLE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperBundleDetailModal;
