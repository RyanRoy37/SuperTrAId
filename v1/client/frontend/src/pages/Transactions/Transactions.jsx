import React, { useState } from 'react';
import './Transactions.css';

import { MOCK_TRANSACTIONS } from '../../utils/mockData';

const Transactions = () => {
  // eslint-disable-next-line no-unused-vars
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTransactions = transactions.filter(txn => {
    if (filter === 'all') return true;
    return txn.type.toLowerCase().includes(filter.toLowerCase());
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalVolume = transactions.reduce((sum, txn) => sum + txn.total, 0);
  const successCount = transactions.filter(txn => txn.status === 'success').length;
  const failedCount = transactions.filter(txn => txn.status === 'failed').length;

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1 className="page-title">
          <span className="title-icon">📜</span>
          TRANSACTIONS_HISTORY
        </h1>
        <div className="transactions-subtitle">
          Complete record of all trading activities
        </div>
      </div>

      <div className="transactions-stats pixel-border">
        <div className="txn-stat-item">
          <span className="txn-stat-icon">💵</span>
          <div>
            <div className="txn-stat-value">${totalVolume.toFixed(2)}</div>
            <div className="txn-stat-label">TOTAL VOLUME</div>
          </div>
        </div>
        <div className="txn-stat-item">
          <span className="txn-stat-icon">✅</span>
          <div>
            <div className="txn-stat-value positive">{successCount}</div>
            <div className="txn-stat-label">SUCCESSFUL</div>
          </div>
        </div>
        <div className="txn-stat-item">
          <span className="txn-stat-icon">❌</span>
          <div>
            <div className="txn-stat-value negative">{failedCount}</div>
            <div className="txn-stat-label">FAILED</div>
          </div>
        </div>
        <div className="txn-stat-item">
          <span className="txn-stat-icon">📊</span>
          <div>
            <div className="txn-stat-value">{transactions.length}</div>
            <div className="txn-stat-label">TOTAL TRANSACTIONS</div>
          </div>
        </div>
      </div>

      <div className="transactions-filters">
        <button
          className={`txn-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => { setFilter('all'); setCurrentPage(1); }}
        >
          ALL
        </button>
        <button
          className={`txn-filter-btn ${filter === 'buy' ? 'active' : ''}`}
          onClick={() => { setFilter('buy'); setCurrentPage(1); }}
        >
          BUY
        </button>
        <button
          className={`txn-filter-btn ${filter === 'sell' ? 'active' : ''}`}
          onClick={() => { setFilter('sell'); setCurrentPage(1); }}
        >
          SELL
        </button>
        <button
          className={`txn-filter-btn ${filter === 'bundle' ? 'active' : ''}`}
          onClick={() => { setFilter('bundle'); setCurrentPage(1); }}
        >
          BUNDLE
        </button>
        <button
          className={`txn-filter-btn ${filter === 'dividend' ? 'active' : ''}`}
          onClick={() => { setFilter('dividend'); setCurrentPage(1); }}
        >
          DIVIDEND
        </button>
      </div>

      <div className="transactions-table-container pixel-border">
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>TIMESTAMP</th>
                <th>TYPE</th>
                <th>STOCK/BUNDLE</th>
                <th>QTY</th>
                <th>PRICE</th>
                <th>TOTAL</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length > 0 ? (
                currentTransactions.map((txn) => (
                  <tr key={txn.id}>
                    <td>#{txn.id}</td>
                    <td>{txn.timestamp}</td>
                    <td>
                      <span className={`txn-type-badge ${txn.type.toLowerCase().replace(' ', '-')}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="txn-stock-name">{txn.stock}</td>
                    <td>{txn.qty}</td>
                    <td>${txn.price.toFixed(2)}</td>
                    <td className="txn-total">${txn.total.toFixed(2)}</td>
                    <td>
                      <span className={`txn-status-badge ${txn.status}`}>
                        {txn.status === 'success' ? '✓' : '✗'} {txn.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-transactions">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← PREV
            </button>
            <div className="pagination-info">
              PAGE {currentPage} OF {totalPages}
            </div>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              NEXT →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;