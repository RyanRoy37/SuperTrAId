import React, { useEffect, useState, useCallback } from 'react';
import '../styles/Stocks.css';

import StockList from './components/StockList';
import StockChart from './components/StockChart';
import TimeframeSelector from './components/TimeframeSelector';
import BuySellPanel from './components/BuySellPanel';

import api from '../services/api';

const TIMEFRAME_MAP = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
};

const StocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeframe, setTimeframe] = useState('1M');
  const [loading, setLoading] = useState(false);

  // Fetch stocks
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await api.get('/stocks?page=1&limit=50');
        const rows = Array.isArray(res.data?.data) ? res.data.data : [];

        const normalized = rows.map(s => ({
          id: s.id,
          symbol: s.symbol,
          name: s.company_name,
          price: Number(s.latest_price || 0),
          change: 0,
          logo: '📈',
        }));

        setStocks(normalized);
        if (normalized.length > 0) setSelectedStock(normalized[0]);
      } catch (err) {
        console.error('Failed to load stocks', err);
      }
    };

    fetchStocks();
  }, []);

  // Fetch history
const fetchPriceHistory = useCallback(async (stockId, tf) => {
  setLoading(true);

  try {
    const days = TIMEFRAME_MAP[tf] || 30;

    const res = await api.get(`/stocks/${stockId}/history?limit=${days}`);

    if (!Array.isArray(res.data) || res.data.length === 0) {
      setPriceHistory([]);
      return;
    }

    const formatted = res.data.map(row => ({
      label: new Date(row.x).toLocaleDateString(),
      price: row.c,
    }));

    setPriceHistory(formatted);
  } catch (err) {
    console.error('History fetch failed', err);
    setPriceHistory([]);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    if (selectedStock) {
      fetchPriceHistory(selectedStock.id, timeframe);
    }
  }, [selectedStock, timeframe, fetchPriceHistory]);

  const handleBuy = async (quantity) => {
    await api.post('/portfolio/buy', {
      stockId: selectedStock.id,
      symbol: selectedStock.symbol,
      quantity,
      price: selectedStock.price,
    });
  };

  const handleSell = async (quantity) => {
    await api.post('/portfolio/sell', {
      stockId: selectedStock.id,
      symbol: selectedStock.symbol,
      quantity,
      price: selectedStock.price,
    });
  };

  if (!selectedStock) {
    return (
      <div className="stocks-container">
        <div className="chart-loading">LOADING_STOCKS...</div>
      </div>
    );
  }

  return (
    <div className="stocks-container">
      <div className="stocks-layout">
        <div className="stocks-sidebar">
          <StockList
            stocks={stocks}
            selectedStock={selectedStock}
            onSelectStock={setSelectedStock}
          />
        </div>

        <div className="stocks-main">
          <div className="stock-header-card pixel-border">
            <h2>{selectedStock.name} ({selectedStock.symbol})</h2>
            <div className="stock-price-value">
              ₹{selectedStock.price.toFixed(2)}
            </div>
          </div>

          <div className="chart-section pixel-border">
            <TimeframeSelector
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />

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

export default StocksPage;
