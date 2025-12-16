import React, { useState } from 'react';
import './SuperBundles.css';

import SuperBundleCard from '../../components/Dashboard/SuperBundleCard';
import SuperBundleDetailModal from '../../components/Modals/SuperBundleDetailModal';
import CreateBundleModal from '../../components/Modals/CreateBundleModal';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';

import { MOCK_BUNDLES } from '../../utils/mockData';

const SuperBundles = () => {
  const [bundles, setBundles] = useState(MOCK_BUNDLES);
  const [filter, setFilter] = useState('all');
  const [bundleDetailModal, setBundleDetailModal] = useState(null);
  const [createBundleModal, setCreateBundleModal] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const filteredBundles = bundles.filter(bundle => {
    if (filter === 'platform') return bundle.isPlatform;
    if (filter === 'user') return !bundle.isPlatform;
    return true;
  });

  const handleViewBundle = (bundle) => {
    setBundleDetailModal(bundle);
  };

  const handleBuyBundle = (bundle) => {
    setConfirmationModal({
      title: 'BUY_BUNDLE',
      message: `Are you sure you want to buy "${bundle.name}" for $${bundle.cost.toFixed(2)}? This will purchase 1 share of each stock in the bundle.`,
      onConfirm: () => {
        console.log('Buying bundle:', bundle);
        alert(`✅ Successfully purchased ${bundle.name}!`);
        setConfirmationModal(null);
        setBundleDetailModal(null);
      }
    });
  };

  const handleEditBundle = (bundle) => {
    setCreateBundleModal(bundle);
  };

  const handleSaveBundle = (bundle) => {
    if (bundle.id && bundles.find(b => b.id === bundle.id)) {
      setBundles(bundles.map(b => b.id === bundle.id ? bundle : b));
      alert(`✅ Bundle "${bundle.name}" updated successfully!`);
    } else {
      setBundles([...bundles, bundle]);
      alert(`✅ Bundle "${bundle.name}" created successfully!`);
    }
    setCreateBundleModal(null);
  };

  const handleDeleteBundle = (bundle) => {
    setConfirmationModal({
      title: 'DELETE_BUNDLE',
      message: `Are you sure you want to delete "${bundle.name}"? This action cannot be undone.`,
      onConfirm: () => {
        setBundles(bundles.filter(b => b.id !== bundle.id));
        alert(`✅ Bundle "${bundle.name}" deleted successfully!`);
        setConfirmationModal(null);
        setCreateBundleModal(null);
      },
      isDanger: true,
      confirmText: 'DELETE'
    });
  };

  const platformBundlesCount = bundles.filter(b => b.isPlatform).length;
  const userBundlesCount = bundles.filter(b => !b.isPlatform).length;

  return (
    <div className="superbundles-container">
      <div className="superbundles-header">
        <div>
          <h1 className="page-title">
            <span className="title-icon">📦</span>
            SUPERBUNDLES
          </h1>
          <div className="superbundles-subtitle">
            Curated stock collections for smart investing
          </div>
        </div>
        <button className="btn-primary" onClick={() => setCreateBundleModal({})}>
          + CREATE_NEW_BUNDLE
        </button>
      </div>

      <div className="bundles-stats pixel-border">
        <div className="bundle-stat-item">
          <span className="stat-icon">🏢</span>
          <div>
            <div className="stat-value">{platformBundlesCount}</div>
            <div className="stat-label">PLATFORM BUNDLES</div>
          </div>
        </div>
        <div className="bundle-stat-item">
          <span className="stat-icon">👤</span>
          <div>
            <div className="stat-value">{userBundlesCount}</div>
            <div className="stat-label">USER BUNDLES</div>
          </div>
        </div>
        <div className="bundle-stat-item">
          <span className="stat-icon">📊</span>
          <div>
            <div className="stat-value">{bundles.length}</div>
            <div className="stat-label">TOTAL BUNDLES</div>
          </div>
        </div>
      </div>

      <div className="bundles-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          ALL BUNDLES
        </button>
        <button
          className={`filter-btn ${filter === 'platform' ? 'active' : ''}`}
          onClick={() => setFilter('platform')}
        >
          PLATFORM
        </button>
        <button
          className={`filter-btn ${filter === 'user' ? 'active' : ''}`}
          onClick={() => setFilter('user')}
        >
          MY BUNDLES
        </button>
      </div>

      <div className="bundles-grid-large">
        {filteredBundles.length > 0 ? (
          filteredBundles.map(bundle => (
            <SuperBundleCard
              key={bundle.id}
              bundle={bundle}
              onView={handleViewBundle}
              onBuy={handleBuyBundle}
              onEdit={handleEditBundle}
            />
          ))
        ) : (
          <div className="no-bundles-message pixel-border">
            <div className="no-bundles-icon">📦</div>
            <div className="no-bundles-text">
              No bundles found in this category
            </div>
            {filter === 'user' && (
              <button className="btn-primary" onClick={() => setCreateBundleModal({})}>
                CREATE YOUR FIRST BUNDLE
              </button>
            )}
          </div>
        )}
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

export default SuperBundles;