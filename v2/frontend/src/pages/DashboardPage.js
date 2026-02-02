import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import api from '../services/api';

// OLD UI COMPONENTS (REUSED)
import SummaryCard from '../components/Dashboard/SummaryCard';
import HoldingsTable from '../components/Dashboard/HoldingsTable';
import ActivityFeed from '../components/Dashboard/ActivityFeed';
import PortfolioLineChart from '../components/Charts/PortfolioLineChart';

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [timeframe, setTimeframe] = useState('1M');
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH REAL DASHBOARD
  ========================= */
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboard) {
    return <div className="terminal-loading">{'> LOADING_DASHBOARD...'}</div>;
  }

  const { wallet, portfolio, activities } = dashboard;

  /* =========================
     DERIVED VALUES
  ========================= */
  const totalPL = portfolio.unrealizedPnL;
  const totalPLPercent =
    wallet.invested > 0
      ? ((totalPL / wallet.invested) * 100).toFixed(2)
      : 0;

  /* =========================
     FAKE CHART (FOR NOW)
     (Real chart later from tx history)
  ========================= */
  const chartData = {
    labels: ['Start', 'Now'],
    values: [wallet.invested, portfolio.currentValue]
  };

  /* =========================
     ACTIVITY TRANSFORM
  ========================= */
  const activityFeed = activities.map(a => ({
    id: a._id,
    message: `${a.action.replace('_', ' ')}`,
    timestamp: new Date(a.createdAt).toLocaleString(),
    icon: a.action.includes('BUY') ? '📈' : '📉'
  }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="page-title">
          <span className="title-icon">◉</span>
          PORTFOLIO_TRACKER_DASHBOARD
        </h1>
        <div className="dashboard-subtitle">
          Welcome back, Trader
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="summary-metrics">
        <SummaryCard
          icon="💰"
          title="TOTAL_INVESTED"
          value={`₹${wallet.invested.toFixed(2)}`}
          subtitle="Capital deployed"
        />
        <SummaryCard
          icon="📈"
          title="CURRENT_VALUE"
          value={`₹${portfolio.currentValue.toFixed(2)}`}
          subtitle="Live portfolio"
        />
        <SummaryCard
          icon={totalPL >= 0 ? '✅' : '❌'}
          title="TOTAL_P/L"
          value={`₹${totalPL.toFixed(2)}`}
          subtitle={`${totalPLPercent}%`}
          isPositive={totalPL >= 0}
        />
        <SummaryCard
          icon="🏦"
          title="CASH_BALANCE"
          value={`₹${wallet.balance.toFixed(2)}`}
          subtitle="Available funds"
        />
      </div>

      {/* ================= CHART ================= */}
      <div className="section-card pixel-border">
        <div className="section-header">
          <h2>{'>'} PORTFOLIO_PERFORMANCE</h2>
        </div>
        <PortfolioLineChart data={chartData} timeframe={timeframe} />
      </div>

      {/* ================= HOLDINGS ================= */}
      <div className="section-card">
        <HoldingsTable
          holdings={portfolio.holdings.map(h => ({
            symbol: h.symbol,
            qty: h.quantity,
            avgPrice: h.avgBuyPrice,
            currentPrice: h.currentPrice,
            pnl: h.pnl
          }))}
        />
      </div>

      {/* ================= ACTIVITY ================= */}
      <div className="section-card pixel-border">
        <div className="section-header">
          <h2>{'>'} ACTIVITY_LOG</h2>
        </div>
        <ActivityFeed activities={activityFeed} />
      </div>
    </div>
  );
};

export default DashboardPage;
