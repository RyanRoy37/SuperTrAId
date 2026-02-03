import React, { useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';
import Pagination from '../components/Pagination';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const response = await wishlistAPI.getWishlist({ page: pagination.page, limit: 20 });
      setWishlist(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  }, [pagination.page]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (stockId) => {
    try {
      await wishlistAPI.removeFromWishlist(stockId);
      setMessage('Removed from wishlist!');
      fetchWishlist();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to remove');
    }
  };

  if (loading) return <div className="loading">LOADING...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>[ WISHLIST ]</h1>
      
      {message && <div className="card">{message}</div>}

      {wishlist.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>ADDED ON</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item) => (
                <tr key={item._id}>
                  <td>{item.symbol}</td>
                  <td>{new Date(item.addedAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleRemove(item.stockId)} className="btn btn-danger">REMOVE</button>
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
        <div className="card">Your wishlist is empty.</div>
      )}
    </div>
  );
};

export default Wishlist;