import React, { useState } from 'react';
import { MOCK_STOCKS } from '../../utils/mockData';
import './Modals.css';

const CreateBundleModal = ({ bundle, onClose, onSave, onDelete }) => {
  const [name, setName] = useState(bundle ? bundle.name : '');
  const [selectedStocks, setSelectedStocks] = useState(bundle ? bundle.stocks : []);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = MOCK_STOCKS.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStock = (symbol) => {
    if (selectedStocks.includes(symbol)) {
      setSelectedStocks(selectedStocks.filter(s => s !== symbol));
    } else {
      setSelectedStocks([...selectedStocks, symbol]);
    }
  };

  const handleSave = () => {
    if (name.trim() && selectedStocks.length > 0) {
      const totalCost = selectedStocks.reduce((sum, symbol) => {
        const stock = MOCK_STOCKS.find(s => s.symbol === symbol);
        return sum + (stock ? stock.price : 0);
      }, 0);

      onSave({
        id: bundle ? bundle.id : Date.now(),
        name: name.trim(),
        stocks: selectedStocks,
        cost: totalCost,
        isPlatform: false,
        performance: 0
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content pixel-border large-modal" onClick={(e) => e.stopPropagation()}>
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
            <div className="stocks-grid">
              {filteredStocks.map(stock => (
                <div
                  key={stock.symbol}
                  className={`stock-select-item ${selectedStocks.includes(stock.symbol) ? 'selected' : ''}`}
                  onClick={() => toggleStock(stock.symbol)}
                >
                  <span className="stock-select-logo">{stock.logo}</span>
                  <div className="stock-select-info">
                    <div className="stock-select-symbol">{stock.symbol}</div>
                    <div className="stock-select-name">{stock.name}</div>
                    <div className="stock-select-price">${stock.price.toFixed(2)}</div>
                  </div>
                  {selectedStocks.includes(stock.symbol) && (
                    <span className="stock-selected-check">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          {bundle && (
            <button className="btn-danger" onClick={() => onDelete(bundle)}>DELETE</button>
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