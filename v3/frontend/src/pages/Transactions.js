import React, { useState, useEffect, useCallback } from 'react';
import { transactionAPI } from '../services/api';
import Pagination from '../components/Pagination';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getTransactions({ page: pagination.page, limit: 20 });
      setTransactions(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [pagination.page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (loading) return <div className="loading">LOADING...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>[ TRANSACTIONS ]</h1>

      {transactions.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>TYPE</th>
                <th>SYMBOL</th>
                <th>QUANTITY</th>
                <th>PRICE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn._id}>
                  <td>{new Date(txn.createdAt).toLocaleString()}</td>
                  <td className={txn.type === 'BUY' ? 'positive' : 'negative'}>{txn.type}</td>
                  <td>{txn.symbol}</td>
                  <td>{txn.quantity}</td>
                  <td>₹{txn.price.toFixed(2)}</td>
                  <td>₹{txn.totalAmount.toFixed(2)}</td>
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
        <div className="card">No transactions yet.</div>
      )}
    </div>
  );
};

export default Transactions;