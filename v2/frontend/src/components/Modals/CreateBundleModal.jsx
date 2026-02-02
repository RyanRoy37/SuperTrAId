import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './Modals.css';

const CreateBundleModal = ({ bundle, onClose, onSave, onDelete }) => {
  const [name, setName] = useState(bundle ? bundle.name : '');
  const [stocks, setStocks] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState(
    bundle ? bundle.stocks.map(s => s.id) : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  /* ----------------------------------------
     Fetch stocks from backend
  ---------------------------------------- */
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const res = await api.get('/stocks');
        setStocks(res.data);
      } catch (err) {
        console.error('Failed to load stocks', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  /* ----------------------------------------
     Helpers
  ---------------------------------------- */
  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStock = (stockId) => {
    setSelectedStocks(prev =>
      prev.includes(stockId)
        ? prev.filter(id => id !== stockId)
        : [...prev, stockId]
    );
  };

  const handleSave = async () => {
    if (!name.trim() || selectedStocks.length === 0) return;

    const payload = {
      name: name.trim(),
      stockIds: selectedStocks
    };

    try {
      if (bundle) {
        await api.put(`/superbundles/${bundle.id}`, payload);
      } else {
        await api.post('/superbundles', payload);
      }
      onSave(); // parent will refetch bundles
    } catch (err) {
      console.error('Failed to save bundle', err);
      alert('❌ Failed to save bundle');
    }
  };

  /* ----------------------------------------
     Render
  ---------------------------------------- */
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content pixel-border large-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{'>'} {bundle ? 'EDIT' : 'CREATE'}_BUNDLE</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">&gt; BUNDLE_NAME:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="terminal-input"
              placeholder="My Custom Bundle"
            />
          </div>

          <div className="form-group">
            <label className="form-label">&gt; SEARCH_STOCKS:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="terminal-input"
              placeholder="Search by symbol or name..."
            />
          </div>

          <div className="stocks-selection">
            <h4>{'>'} SELECT_STOCKS ({selectedStocks.length} selected)</h4>

            {loading ? (
              <div className="loading-text">LOADING_STOCKS...</div>
            ) : (
              <div className="stocks-grid">
                {filteredStocks.map(stock => (
                  <div
                    key={stock.id}
                    className={`stock-select-item ${
                      selectedStocks.includes(stock.id) ? 'selected' : ''
                    }`}
                    onClick={() => toggleStock(stock.id)}
                  >
                    <div className="stock-select-info">
                      <div className="stock-select-symbol">{stock.symbol}</div>
                      <div className="stock-select-name">{stock.name}</div>
                      <div className="stock-select-price">
                        ₹{Number(stock.price).toFixed(2)}
                      </div>
                    </div>

                    {selectedStocks.includes(stock.id) && (
                      <span className="stock-selected-check">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          {bundle && (
            <button className="btn-danger" onClick={() => onDelete(bundle)}>
              DELETE
            </button>
          )}
          <button className="btn-secondary" onClick={onClose}>CANCEL</button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!name.trim() || selectedStocks.length === 0}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBundleModal;
