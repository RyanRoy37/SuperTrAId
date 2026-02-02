import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { withPageContainer } from './PageContainer';

function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    api.get('/portfolio').then(res => setPortfolio(res.data));
  }, []);

  return (
    <div className="section-card">
      {portfolio ? (
        <ul>
          {portfolio.holdings.map(h => (
            <li key={h.stockId}>{h.symbol}: {h.quantity} @ ₹{h.avgBuyPrice}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default withPageContainer(PortfolioPage, 'Portfolio');
