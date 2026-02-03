import React, { useState, useEffect, useCallback } from 'react';
import { portfolioAPI, transactionAPI } from '../services/api';
import Pagination from '../components/Pagination';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const response = await portfolioAPI.getPortfolio({ page: pagination.page, limit: 20 });
      setPortfolio(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  }, [pagination.page]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handleSellClick = (stock) => {
    setSelectedStock(stock);
    setSellQuantity(1);
    setShowSellModal(true);
  };

  const handleSell = async () => {
    try {
      await transactionAPI.sellStock({
        stockId: selectedStock.stockId,
        quantity: parseInt(sellQuantity),
        price: parseFloat(selectedStock.currentPrice)
      });
      setMessage('Stock sold successfully!');
      setShowSellModal(false);
      fetchPortfolio();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Sale failed');
    }
  };

  if (loading) return <div className="loading">LOADING...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>[ PORTFOLIO ]</h1>
      
      {message && <div className={message.includes('success') ? 'card' : 'error'}>{message}</div>}

      {portfolio.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>QUANTITY</th>
                <th>AVG BUY PRICE</th>
                <th>CURRENT PRICE</th>
                <th>INVESTED</th>
                <th>CURRENT VALUE</th>
                <th>P/L</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((stock) => (
                <tr key={stock._id}>
                  <td>{stock.symbol}</td>
                  <td>{stock.quantity}</td>
                  <td>₹{stock.avgBuyPrice.toFixed(2)}</td>
                  <td>₹{stock.currentPrice.toFixed(2)}</td>
                  <td>₹{stock.totalInvested.toFixed(2)}</td>
                  <td>₹{stock.currentValue.toFixed(2)}</td>
                  <td className={stock.unrealizedPL >= 0 ? 'positive' : 'negative'}>
                    ₹{stock.unrealizedPL.toFixed(2)}
                  </td>
                  <td>
                    <button onClick={() => handleSellClick(stock)} className="btn btn-danger">SELL</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
          />
        </>
      ) : (
        <div className="card">No holdings yet. Start trading!</div>
      )}

      {showSellModal && selectedStock && (
        <div className="modal-overlay" onClick={() => setShowSellModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>SELL {selectedStock.symbol}</h2>
            <div className="form-group">
              <label>QUANTITY (Max: {selectedStock.quantity})</label>
              <input
                type="number"
                value={sellQuantity}
                onChange={(e) => setSellQuantity(e.target.value)}
                min="1"
                max={selectedStock.quantity}
              />
            </div>
            <p><strong>Price per share:</strong> ₹{selectedStock.currentPrice.toFixed(2)}</p>
            <p><strong>Total value:</strong> ₹{(sellQuantity * selectedStock.currentPrice).toFixed(2)}</p>
            <div className="modal-actions">
              <button onClick={handleSell} className="btn">CONFIRM SELL</button>
              <button onClick={() => setShowSellModal(false)} className="btn btn-danger">CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;