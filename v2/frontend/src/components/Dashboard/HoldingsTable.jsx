import React from 'react';
import './DashboardComponents.css';

const HoldingsTable = ({ holdings, onBuy, onSell, onViewChart }) => {
  const calculatePL = (qty, avgPrice, currentPrice) => {
    const invested = qty * avgPrice;
    const current = qty * currentPrice;
    const pl = current - invested;
    const plPercent = ((pl / invested) * 100).toFixed(2);
    return { pl, plPercent };
  };

  const calculateWeight = (holding, totalValue) => {
    const value = holding.qty * holding.currentPrice;
    return ((value / totalValue) * 100).toFixed(1);
  };

  const totalValue = holdings.reduce((sum, h) => sum + (h.qty * h.currentPrice), 0);

  return (
    <div className="holdings-table-container">
      <div className="table-header">
        <h2>{'>'} HOLDINGS_TABLE</h2>
      </div>
      <div className="holdings-table">
        <table>
          <thead>
            <tr>
              <th>STOCK</th>
              <th>QTY</th>
              <th>AVG_PRICE</th>
              <th>CURRENT</th>
              <th>INVESTED</th>
              <th>VALUE</th>
              <th>P/L</th>
              <th>WEIGHT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              const { pl, plPercent } = calculatePL(holding.qty, holding.avgPrice, holding.currentPrice);
              const invested = holding.qty * holding.avgPrice;
              const current = holding.qty * holding.currentPrice;
              const weight = calculateWeight(holding, totalValue);

              return (
                <tr key={holding.symbol}>
                  <td>
                    <div className="stock-cell">
                      <span className="stock-logo">{holding.logo}</span>
                      <div>
                        <div className="stock-name">{holding.name}</div>
                        <div className="stock-symbol">{holding.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td>{holding.qty}</td>
                  <td>${holding.avgPrice.toFixed(2)}</td>
                  <td>${holding.currentPrice.toFixed(2)}</td>
                  <td>${invested.toFixed(2)}</td>
                  <td>${current.toFixed(2)}</td>
                  <td className={pl >= 0 ? 'positive' : 'negative'}>
                    ${pl.toFixed(2)} ({plPercent}%)
                  </td>
                  <td>{weight}%</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action btn-buy" onClick={() => onBuy(holding)}>BUY</button>
                      <button className="btn-action btn-sell" onClick={() => onSell(holding)}>SELL</button>
                      <button className="btn-action btn-view" onClick={() => onViewChart(holding)}>📊</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable;