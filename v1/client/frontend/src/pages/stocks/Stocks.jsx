import React, { useState, useEffect, useCallback } from 'react';
import './Stocks.css';

import StockList from './components/StockList';
import StockChart from './components/StockChart';
import TimeframeSelector from './components/TimeframeSelector';
import BuySellPanel from './components/BuySellPanel';

import { MOCK_STOCKS, generatePriceHistory } from '../../utils/mockData';

const Stocks = () => {
  // eslint-disable-next-line no-unused-vars
  const [stocks, setStocks] = useState(MOCK_STOCKS);
  const [selectedStock, setSelectedStock] = useState(MOCK_STOCKS[0]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeframe, setTimeframe] = useState('1M');
  const [loading, setLoading] = useState(false);



  const fetchPriceHistory = useCallback((symbol, tf) => {
  setLoading(true);

  setTimeout(() => {
    const points = getPointsForTimeframe(tf);
    const history = generatePriceHistory(symbol ? selectedStock.price : 0, points);
    setPriceHistory(history);
    setLoading(false);
  }, 500);
}, [selectedStock?.price]);

  useEffect(() => {
  if (selectedStock) {
    fetchPriceHistory(selectedStock.symbol, timeframe);
  }
}, [selectedStock, timeframe, fetchPriceHistory]);

  const getPointsForTimeframe = (tf) => {
    const map = {
      '1D': 24,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '1Y': 365
    };
    return map[tf] || 30;
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handleTimeframeChange = (tf) => {
    setTimeframe(tf);
  };

  const handleBuy = (quantity) => {
    console.log(`Buy ${quantity} shares of ${selectedStock.symbol}`);
    alert(`✅ Successfully bought ${quantity} shares of ${selectedStock.symbol}!`);
  };

  const handleSell = (quantity) => {
    console.log(`Sell ${quantity} shares of ${selectedStock.symbol}`);
    alert(`✅ Successfully sold ${quantity} shares of ${selectedStock.symbol}!`);
  };

  return (
    <div className="stocks-container">
      <div className="stocks-header">
        <h1 className="page-title">
          <span className="title-icon">📊</span>
          STOCKS_MARKET
        </h1>
        <div className="stocks-subtitle">Real-time market data and trading</div>
      </div>

      <div className="stocks-layout">
        <div className="stocks-sidebar">
          <StockList 
            stocks={stocks} 
            selectedStock={selectedStock}
            onSelectStock={handleStockSelect}
          />
        </div>

        <div className="stocks-main">
          <div className="stock-header-card pixel-border">
            <div className="stock-header-info">
              <span className="stock-header-logo">{selectedStock.logo}</span>
              <div>
                <h2 className="stock-header-name">{selectedStock.name}</h2>
                <div className="stock-header-symbol">{selectedStock.symbol}</div>
              </div>
            </div>
            <div className="stock-header-price">
              <div className="stock-price-value">${selectedStock.price.toFixed(2)}</div>
              <div className={`stock-price-change ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
                {selectedStock.change >= 0 ? '▲' : '▼'} {Math.abs(selectedStock.change)}%
              </div>
            </div>
          </div>

          <div className="chart-section pixel-border">
            <div className="chart-controls">
              <TimeframeSelector 
                timeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
              />
            </div>
            <StockChart 
              data={priceHistory}
              loading={loading}
              stockName={selectedStock.name}
            />
          </div>

          <BuySellPanel 
            stock={selectedStock}
            onBuy={handleBuy}
            onSell={handleSell}
          />
        </div>
      </div>
    </div>
  );
};

export default Stocks;