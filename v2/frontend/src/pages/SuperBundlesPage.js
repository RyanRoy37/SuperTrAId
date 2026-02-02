import React, { useEffect, useState } from 'react';
import '../styles/SuperBundles.css';
import api from '../services/api';

import SuperBundleCard from '../components/Dashboard/SuperBundleCard';
import SuperBundleDetailModal from '../components/Modals/SuperBundleDetailModal';
import CreateBundleModal from '../components/Modals/CreateBundleModal';
import ConfirmationModal from '../components/Modals/ConfirmationModal';

const SuperBundlesPage = () => {
  const [bundles, setBundles] = useState([]);
  const [filter, setFilter] = useState('all');

  const [bundleDetailModal, setBundleDetailModal] = useState(null);
  const [createBundleModal, setCreateBundleModal] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  /* ========================
     FETCH BUNDLES (REAL)
  ======================== */
  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const res = await api.get('/superbundles');
      setBundles(res.data);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to load bundles');
    }
  };

  /* ========================
     FILTERING (OLD UX)
  ======================== */
  const filteredBundles = bundles.filter(bundle => {
    if (filter === 'platform') return bundle.isPublic;
    if (filter === 'user') return !bundle.isPublic;
    return true;
  });

  /* ========================
     ACTIONS
  ======================== */
  const handleViewBundle = (bundle) => {
    setBundleDetailModal(bundle);
  };

  const handleBuyBundle = (bundle) => {
    setConfirmationModal({
      title: 'BUY_BUNDLE',
      message: `Confirm purchase of "${bundle.name}"`,
      onConfirm: async () => {
        try {
          await api.post(`/superbundles/${bundle._id}/buy`);
          alert('✅ Bundle purchased successfully');
          setConfirmationModal(null);
          setBundleDetailModal(null);
        } catch (err) {
          alert(err.response?.data?.message || '❌ Purchase failed');
        }
      }
    });
  };

  const handleSaveBundle = async (bundle) => {
    try {
      if (bundle._id) {
        await api.put(`/superbundles/${bundle._id}`, bundle);
        alert('✅ Bundle updated');
      } else {
        await api.post('/superbundles', bundle);
        alert('✅ Bundle created');
      }
      setCreateBundleModal(null);
      fetchBundles();
    } catch (err) {
      alert(err.response?.data?.message || '❌ Save failed');
    }
  };

  const handleDeleteBundle = (bundle) => {
    setConfirmationModal({
      title: 'DELETE_BUNDLE',
      message: `Delete "${bundle.name}" permanently?`,
      isDanger: true,
      confirmText: 'DELETE',
      onConfirm: async () => {
        try {
          await api.delete(`/superbundles/${bundle._id}`);
          alert('✅ Bundle deleted');
          setConfirmationModal(null);
          setCreateBundleModal(null);
          fetchBundles();
        } catch (err) {
          alert('❌ Delete failed');
        }
      }
    });
  };

  /* ========================
     COUNTERS (OLD UI)
  ======================== */
  const platformCount = bundles.filter(b => b.isPublic).length;
  const userCount = bundles.filter(b => !b.isPublic).length;

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
            <div className="stat-value">{platformCount}</div>
            <div className="stat-label">PLATFORM</div>
          </div>
        </div>
        <div className="bundle-stat-item">
          <span className="stat-icon">👤</span>
          <div>
            <div className="stat-value">{userCount}</div>
            <div className="stat-label">USER</div>
          </div>
        </div>
        <div className="bundle-stat-item">
          <span className="stat-icon">📊</span>
          <div>
            <div className="stat-value">{bundles.length}</div>
            <div className="stat-label">TOTAL</div>
          </div>
        </div>
      </div>

      <div className="bundles-filters">
        {['all', 'platform', 'user'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bundles-grid-large">
        {filteredBundles.map(bundle => (
          <SuperBundleCard
            key={bundle._id}
            bundle={bundle}
            onView={handleViewBundle}
            onBuy={handleBuyBundle}
            onEdit={() => setCreateBundleModal(bundle)}
          />
        ))}
      </div>

      {bundleDetailModal && (
        <SuperBundleDetailModal
          bundle={bundleDetailModal}
          onClose={() => setBundleDetailModal(null)}
          onBuy={handleBuyBundle}
        />
      )}

      {createBundleModal && (
        <CreateBundleModal
          bundle={createBundleModal._id ? createBundleModal : null}
          onClose={() => setCreateBundleModal(null)}
          onSave={handleSaveBundle}
          onDelete={handleDeleteBundle}
        />
      )}

      {confirmationModal && (
        <ConfirmationModal {...confirmationModal} onClose={() => setConfirmationModal(null)} />
      )}
    </div>
  );
};

export default SuperBundlesPage;
