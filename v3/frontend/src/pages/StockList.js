import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { stockAPI } from '../services/api';
import Pagination from '../components/Pagination';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await stockAPI.getStocks({ page: pagination.page, limit: 20, search });
      setStocks(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, search]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  if (loading) return <div className="loading">LOADING...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>[ STOCKS ]</h1>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="SEARCH STOCKS..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="grid grid-3">
        {stocks.map(stock => (
          <div 
            key={stock.id} 
            className="stock-card"
            onClick={() => navigate(`/stocks/${stock.id}`)}
          >
            <h3>{stock.symbol}</h3>
            <p style={{ color: '#888', fontSize: '12px' }}>{stock.company_name}</p>
            <p style={{ color: '#888', fontSize: '12px', marginTop: '5px' }}>{stock.exchange} | {stock.sector}</p>
            <div className="price" style={{ marginTop: '15px' }}>
              ₹{parseFloat(stock.latest_price || 0).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={(page) => setPagination({ ...pagination, page })}
      />
    </div>
  );
};

export default StockList;