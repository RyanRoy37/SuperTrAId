import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { stockAPI, transactionAPI, wishlistAPI } from '../services/api';
import CandlestickChart from '../charts/CandlestickChart';

const StockDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const fetchStockDetails = useCallback(async () => {
    try {
      const response = await stockAPI.getStockDetails(id);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch stock details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStockDetails();
  }, [fetchStockDetails]);

  const handleBuy = async () => {
    try {
      await transactionAPI.buyStock({
        stockId: parseInt(data.stock.id),
        symbol: data.stock.symbol,
        quantity: parseInt(quantity)
      });
      setMessage('Stock purchased successfully!');
      setShowBuyModal(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Purchase failed');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await wishlistAPI.addToWishlist({
        stockId: data.stock.id,
        symbol: data.stock.symbol
      });
      setMessage('Added to wishlist!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add');
    }
  };

  if (loading) return <div className="loading">LOADING...</div>;
  if (!data) return <div className="error">Stock not found</div>;

  const latestPrice = parseFloat(data.stock.latest_price || 0);

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>[ {data.stock.symbol} ]</h1>
      
      {message && <div className={message.includes('success') ? 'card' : 'error'}>{message}</div>}

      <div className="grid grid-2">
        <div className="card">
          <h2>STOCK INFO</h2>
          <p style={{ marginTop: '15px' }}><strong>Company:</strong> {data.stock.company_name}</p>
          <p><strong>Exchange:</strong> {data.stock.exchange}</p>
          <p><strong>Sector:</strong> {data.stock.sector || 'N/A'}</p>
          <p><strong>ISIN:</strong> {data.stock.isin || 'N/A'}</p>
          <p style={{ marginTop: '20px', fontSize: '24px' }}>
            <strong>Price:</strong> ₹{latestPrice.toFixed(2)}
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => setShowBuyModal(true)} className="btn" disabled={latestPrice === 0}>
              BUY
            </button>
            <button onClick={handleAddToWishlist} className="btn btn-secondary">WISHLIST</button>
          </div>
        </div>

        <div className="card">
          <h2>90-DAY CHART</h2>
          {data.historicalPrices.length > 0 ? (
            <CandlestickChart data={data.historicalPrices} />
          ) : (
            <p>No historical data available</p>
          )}
        </div>
      </div>

      {showBuyModal && (
        <div className="modal-overlay" onClick={() => setShowBuyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>BUY {data.stock.symbol}</h2>
            <div className="form-group">
              <label>QUANTITY</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>
            <p><strong>Price per share:</strong> ₹{latestPrice.toFixed(2)}</p>
            <p><strong>Total cost:</strong> ₹{(quantity * latestPrice).toFixed(2)}</p>
            <div className="modal-actions">
              <button onClick={handleBuy} className="btn">CONFIRM BUY</button>
              <button onClick={() => setShowBuyModal(false)} className="btn btn-danger">CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetails;