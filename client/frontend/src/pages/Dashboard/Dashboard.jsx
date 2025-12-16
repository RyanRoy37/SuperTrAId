import React, { useState, useEffect } from 'react';
import './Dashboard.css';

import SummaryCard from '../../components/Dashboard/SummaryCard';
import HoldingsTable from '../../components/Dashboard/HoldingsTable';
import WishlistTable from '../../components/Dashboard/WishlistTable';
import ActivityFeed from '../../components/Dashboard/ActivityFeed';
import SuperBundleCard from '../../components/Dashboard/SuperBundleCard';
import PortfolioLineChart from '../../components/Charts/PortfolioLineChart';
import AssetAllocationPie from '../../components/Charts/AssetAllocationPie';

import SuperBundleDetailModal from '../../components/Modals/SuperBundleDetailModal';
import CreateBundleModal from '../../components/Modals/CreateBundleModal';
import BuySellModal from '../../components/Modals/BuySellModal';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';

import { MOCK_HOLDINGS, MOCK_WISHLIST, MOCK_BUNDLES, MOCK_ACTIVITIES } from '../../utils/mockData';

const Dashboard = () => {
  const [holdings, setHoldings] = useState(MOCK_HOLDINGS);
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST);
  const [bundles, setBundles] = useState(MOCK_BUNDLES);
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [timeframe, setTimeframe] = useState('1M');

  // Modal states
  const [bundleDetailModal, setBundleDetailModal] = useState(null);
  const [createBundleModal, setCreateBundleModal] = useState(null);
  const [buySellModal, setBuySellModal] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const totalInvested = holdings.reduce((sum, h) => sum + (h.qty * h.avgPrice), 0);
  const currentValue = holdings.reduce((sum, h) => sum + (h.qty * h.currentPrice), 0);
  const totalPL = currentValue - totalInvested;
  const totalPLPercent = ((totalPL / totalInvested) * 100).toFixed(2);

  const portfolioChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [50000, 52000, 51500, 54000, 56000, currentValue]
  };

  const assetAllocationData = {
    labels: ['Tech', 'Finance', 'Healthcare', 'Energy', 'Consumer'],
    values: [45, 25, 15, 10, 5]
  };

  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

  const handleBuy = (stock) => {
    setBuySellModal({ stock, type: 'buy' });
  };

  const handleSell = (stock) => {
    setBuySellModal({ stock, type: 'sell' });
  };

  const handleBuySellConfirm = (stock, quantity, type) => {
    console.log(`${type} ${quantity} shares of ${stock.symbol}`);
    setBuySellModal(null);
    // Add to activities
    const newActivity = {
      id: Date.now(),
      type: type,
      message: `${type === 'buy' ? 'Bought' : 'Sold'} ${quantity} shares of ${stock.symbol}`,
      timestamp: 'Just now',
      icon: type === 'buy' ? '📈' : '📉'
    };
    setActivities([newActivity, ...activities]);
  };

  const handleViewChart = (stock) => {
    console.log('View chart for', stock.symbol);
  };

  const handleAddToHoldings = (stock) => {
    setBuySellModal({ 
      stock: { ...stock, currentPrice: stock.price, avgPrice: stock.price }, 
      type: 'buy' 
    });
  };

  const handleRemoveFromWishlist = (stock) => {
    setWishlist(wishlist.filter(w => w.symbol !== stock.symbol));
  };

  const handleViewBundle = (bundle) => {
    setBundleDetailModal(bundle);
  };

  const handleBuyBundle = (bundle) => {
    setConfirmationModal({
      title: 'BUY_BUNDLE',
      message: `Are you sure you want to buy "${bundle.name}" for $${bundle.cost.toFixed(2)}?`,
      onConfirm: () => {
        console.log('Buying bundle:', bundle);
        setConfirmationModal(null);
        setBundleDetailModal(null);
        const newActivity = {
          id: Date.now(),
          type: 'buy',
          message: `Bought ${bundle.name} bundle`,
          timestamp: 'Just now',
          icon: '📦'
        };
        setActivities([newActivity, ...activities]);
      }
    });
  };

  const handleEditBundle = (bundle) => {
    setCreateBundleModal(bundle);
  };

  const handleSaveBundle = (bundle) => {
    if (bundle.id && bundles.find(b => b.id === bundle.id)) {
      setBundles(bundles.map(b => b.id === bundle.id ? bundle : b));
    } else {
      setBundles([...bundles, bundle]);
    }
    setCreateBundleModal(null);
  };

  const handleDeleteBundle = (bundle) => {
    setConfirmationModal({
      title: 'DELETE_BUNDLE',
      message: `Are you sure you want to delete "${bundle.name}"?`,
      onConfirm: () => {
        setBundles(bundles.filter(b => b.id !== bundle.id));
        setConfirmationModal(null);
        setCreateBundleModal(null);
      },
      isDanger: true,
      confirmText: 'DELETE'
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="page-title">
          <span className="title-icon">◉</span>
          PORTFOLIO_TRACKER_DASHBOARD
        </h1>
        <div className="dashboard-subtitle">Welcome back, Trader!</div>
      </div>

      {/* Summary Metrics */}
      <div className="summary-metrics">
        <SummaryCard
          icon="💰"
          title="TOTAL_INVESTED"
          value={`$${totalInvested.toFixed(2)}`}
          subtitle="Initial capital"
        />
        <SummaryCard
          icon="📈"
          title="CURRENT_VALUE"
          value={`$${currentValue.toFixed(2)}`}
          subtitle="Portfolio value"
        />
        <SummaryCard
          icon={totalPL >= 0 ? "✅" : "❌"}
          title="TOTAL_P/L"
          value={`$${totalPL.toFixed(2)}`}
          subtitle={`${totalPLPercent}%`}
          isPositive={totalPL >= 0}
        />
        <SummaryCard
          icon="🏦"
          title="CASH_BALANCE"
          value="$25,432.18"
          subtitle="Available funds"
        />
      </div>

      {/* Portfolio Performance */}
      <div className="portfolio-performance section-card pixel-border">
        <div className="section-header">
          <h2>{'>'} PORTFOLIO_PERFORMANCE</h2>
          <div className="timeframe-selector">
            {timeframes.map(tf => (
              <button
                key={tf}
                className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <PortfolioLineChart data={portfolioChartData} timeframe={timeframe} />
      </div>

      {/* Holdings Table */}
      <div className="section-card">
        <HoldingsTable
          holdings={holdings}
          onBuy={handleBuy}
          onSell={handleSell}
          onViewChart={handleViewChart}
        />
      </div>

      {/* SuperBundles Section */}
      <div className="superbundles-section section-card pixel-border">
        <div className="section-header">
          <h2>{'>'} SUPERBUNDLES</h2>
          <button className="btn-primary" onClick={() => setCreateBundleModal({})}>
            + CREATE_BUNDLE
          </button>
        </div>
        <div className="bundles-grid">
          {bundles.map(bundle => (
            <SuperBundleCard
              key={bundle.id}
              bundle={bundle}
              onView={handleViewBundle}
              onBuy={handleBuyBundle}
              onEdit={handleEditBundle}
            />
          ))}
        </div>
      </div>

      {/* Wishlist and Activity Feed */}
      <div className="dashboard-row">
        <div className="dashboard-col">
          <WishlistTable
            wishlist={wishlist}
            onAddToHoldings={handleAddToHoldings}
            onRemove={handleRemoveFromWishlist}
          />
        </div>
        <div className="dashboard-col">
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="asset-allocation section-card pixel-border">
        <div className="section-header">
          <h2>{'>'} ASSET_ALLOCATION</h2>
        </div>
        <AssetAllocationPie data={assetAllocationData} />
      </div>

      {/* Modals */}
      {bundleDetailModal && (
        <SuperBundleDetailModal
          bundle={bundleDetailModal}
          onClose={() => setBundleDetailModal(null)}
          onBuy={handleBuyBundle}
        />
      )}

      {createBundleModal && (
        <CreateBundleModal
          bundle={createBundleModal.id ? createBundleModal : null}
          onClose={() => setCreateBundleModal(null)}
          onSave={handleSaveBundle}
          onDelete={handleDeleteBundle}
        />
      )}

      {buySellModal && (
        <BuySellModal
          stock={buySellModal.stock}
          type={buySellModal.type}
          onClose={() => setBuySellModal(null)}
          onConfirm={handleBuySellConfirm}
        />
      )}

      {confirmationModal && (
        <ConfirmationModal
          title={confirmationModal.title}
          message={confirmationModal.message}
          onClose={() => setConfirmationModal(null)}
          onConfirm={confirmationModal.onConfirm}
          confirmText={confirmationModal.confirmText}
          isDanger={confirmationModal.isDanger}
        />
      )}
    </div>
  );
};

export default Dashboard;