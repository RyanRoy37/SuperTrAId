import React, { useState, useEffect, useCallback } from 'react';
import { bundleAPI, stockAPI } from '../services/api';
import Pagination from '../components/Pagination';

const Bundles = () => {
  const [bundles, setBundles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [stocksPage, setStocksPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedStocks: []
  });

  const fetchBundles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bundleAPI.getBundles({ page: pagination.page, limit: 20 });
      setBundles(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch bundles');
    } finally {
      setLoading(false);
    }
  }, [pagination.page]);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  const fetchStocksForBundle = async (page = 1) => {
    try {
      const response = await stockAPI.getStocks({ page, limit: 50 });
      setStocks(response.data.data);
      setStocksPage(page);
    } catch (error) {
      console.error('Failed to fetch stocks');
    }
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
    fetchStocksForBundle(1);
  };

  const handleStockToggle = (stockId) => {
    setFormData(prev => ({
      ...prev,
      selectedStocks: prev.selectedStocks.includes(stockId)
        ? prev.selectedStocks.filter(id => id !== stockId)
        : [...prev.selectedStocks, stockId]
    }));
  };

  const handleCreateBundle = async () => {
    if (!formData.name || formData.selectedStocks.length === 0) {
      setMessage('Please provide bundle name and select at least one stock');
      return;
    }

    try {
      await bundleAPI.createBundle({
        name: formData.name,
        description: formData.description,
        stockIds: formData.selectedStocks
      });
      setMessage('Bundle created successfully!');
      setShowCreateModal(false);
      setFormData({ name: '', description: '', selectedStocks: [] });
      fetchBundles();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create bundle');
    }
  };

  const handleBuyBundle = async (bundleId) => {
    try {
      await bundleAPI.buyBundle(bundleId);
      setMessage('Bundle purchased successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Purchase failed');
    }
  };

  if (loading) return <div className="loading">LOADING...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>[ SUPERBUNDLES ]</h1>
      
      {message && <div className={message.includes('success') ? 'card' : 'error'}>{message}</div>}

      <button onClick={handleCreateClick} className="btn" style={{ marginBottom: '20px' }}>
        CREATE NEW BUNDLE
      </button>

      {bundles.length > 0 ? (
        <>
          <div className="grid grid-2">
            {bundles.map((bundle) => (
              <div key={bundle._id} className="card">
                <h2>{bundle.name}</h2>
                <p style={{ color: '#888', marginTop: '10px' }}>{bundle.description}</p>
                <p style={{ marginTop: '15px' }}><strong>Stocks:</strong> {bundle.stocks.length}</p>
                <p><strong>Total Price:</strong> ₹{bundle.totalPrice.toFixed(2)}</p>
                <div style={{ marginTop: '10px' }}>
                  {bundle.stocks.map((stock, idx) => (
                    <span key={idx} style={{ marginRight: '10px', color: '#0f0' }}>{stock.symbol}</span>
                  ))}
                </div>
                <button 
                  onClick={() => handleBuyBundle(bundle._id)} 
                  className="btn" 
                  style={{ marginTop: '20px' }}
                >
                  BUY BUNDLE
                </button>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
          />
        </>
      ) : (
        <div className="card">No bundles created yet. Create your first bundle!</div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <h2>CREATE SUPERBUNDLE</h2>
            
            <div className="form-group">
              <label>BUNDLE NAME</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>DESCRIPTION</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>SELECT STOCKS ({formData.selectedStocks.length} selected)</label>
              <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #0f0', padding: '10px' }}>
                {stocks.map(stock => (
                  <div key={stock.id} style={{ marginBottom: '10px', cursor: 'pointer' }}>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={formData.selectedStocks.includes(stock.id)}
                        onChange={() => handleStockToggle(stock.id)}
                        style={{ marginRight: '10px' }}
                      />
                      <span>
                        {stock.symbol} - {stock.company_name} 
                        <span style={{ color: '#0f0', marginLeft: '10px' }}>
                          ₹{parseFloat(stock.latest_price || 0).toFixed(2)}
                        </span>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => fetchStocksForBundle(stocksPage - 1)} 
                  className="btn"
                  disabled={stocksPage === 1}
                >
                  PREV
                </button>
                <button 
                  onClick={() => fetchStocksForBundle(stocksPage + 1)} 
                  className="btn"
                >
                  NEXT
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleCreateBundle} className="btn">CREATE BUNDLE</button>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-danger">CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bundles;