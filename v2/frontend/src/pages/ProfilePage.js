import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Profile.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, dashboardRes] = await Promise.all([
          api.get('/profile/me'),
          api.get('/dashboard'),
        ]);

        setProfile(profileRes.data);
        setDashboard(dashboardRes.data);
        setEditForm({
          purpose: profileRes.data.purpose,
          risk: profileRes.data.risk,
        });
      } catch (err) {
        console.error('Profile load failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="profile-container">LOADING_PROFILE...</div>;
  }

  if (!profile || !dashboard) {
    return <div className="profile-container">ERROR_LOADING_PROFILE</div>;
  }

  const { wallet, portfolio } = dashboard;
  const totalPL = portfolio.currentValue - wallet.invested;
  const totalPLPercent =
    wallet.invested > 0
      ? ((totalPL / wallet.invested) * 100).toFixed(2)
      : '0.00';

  const handleSave = async () => {
    const newErrors = {};
    if (!editForm.purpose) newErrors.purpose = 'Purpose required';
    if (!editForm.risk) newErrors.risk = 'Risk required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.put('/profile', editForm);
      setProfile({ ...profile, ...editForm });
      setIsEditing(false);
      setErrors({});
      alert('✅ PROFILE_UPDATED');
    } catch (err) {
      alert('❌ UPDATE_FAILED');
    }
  };

  return (
    <div className="profile-container">
      {/* HEADER */}
      <div className="profile-header">
        <h1 className="page-title">
          <span className="title-icon">👤</span>
          USER_PROFILE
        </h1>
        <div className="profile-subtitle">
          Account configuration & stats
        </div>
      </div>

      {/* STATS */}
      <div className="profile-stats pixel-border">
        <div className="profile-stat-item">
          <span className="profile-stat-icon">💰</span>
          <div>
            <div className="profile-stat-value">
              ₹{wallet.invested.toLocaleString()}
            </div>
            <div className="profile-stat-label">TOTAL INVESTED</div>
          </div>
        </div>

        <div className="profile-stat-item">
          <span className="profile-stat-icon">📈</span>
          <div>
            <div className="profile-stat-value">
              ₹{portfolio.currentValue.toLocaleString()}
            </div>
            <div className="profile-stat-label">PORTFOLIO VALUE</div>
          </div>
        </div>

        <div className="profile-stat-item">
          <span className="profile-stat-icon">
            {totalPL >= 0 ? '✅' : '❌'}
          </span>
          <div>
            <div
              className={`profile-stat-value ${
                totalPL >= 0 ? 'positive' : 'negative'
              }`}
            >
              ₹{totalPL.toFixed(2)} ({totalPLPercent}%)
            </div>
            <div className="profile-stat-label">TOTAL P/L</div>
          </div>
        </div>

        <div className="profile-stat-item">
          <span className="profile-stat-icon">📊</span>
          <div>
            <div className="profile-stat-value">
              {portfolio.holdings.length}
            </div>
            <div className="profile-stat-label">ACTIVE HOLDINGS</div>
          </div>
        </div>
      </div>

      {/* PROFILE SECTION */}
      <div className="profile-section pixel-border">
        <div className="section-header">
          <h2>{'>'} ACCOUNT_SETTINGS</h2>
          {!isEditing && (
            <button className="btn-secondary" onClick={() => setIsEditing(true)}>
              EDIT
            </button>
          )}
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <label className="profile-label">EMAIL:</label>
            <div className="profile-value">{profile.email}</div>
            <div className="profile-note">Immutable</div>
          </div>

          <div className="profile-info-item">
            <label className="profile-label">PURPOSE:</label>
            {isEditing ? (
              <>
                <input
                  value={editForm.purpose}
                  onChange={(e) =>
                    setEditForm({ ...editForm, purpose: e.target.value })
                  }
                  className="terminal-input"
                />
                {errors.purpose && (
                  <span className="error-text">{errors.purpose}</span>
                )}
              </>
            ) : (
              <div className="profile-value">{profile.purpose}</div>
            )}
          </div>

          <div className="profile-info-item">
            <label className="profile-label">RISK_LEVEL:</label>
            {isEditing ? (
              <>
                <select
                  value={editForm.risk}
                  onChange={(e) =>
                    setEditForm({ ...editForm, risk: e.target.value })
                  }
                  className="terminal-input"
                >
                  <option value="">SELECT</option>
                  <option value="low">LOW</option>
                  <option value="medium">MEDIUM</option>
                  <option value="high">HIGH</option>
                </select>
                {errors.risk && (
                  <span className="error-text">{errors.risk}</span>
                )}
              </>
            ) : (
              <div className="profile-value">{profile.risk.toUpperCase()}</div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="profile-actions">
            <button
              className="btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setErrors({});
                setEditForm({
                  purpose: profile.purpose,
                  risk: profile.risk,
                });
              }}
            >
              CANCEL
            </button>
            <button className="btn-primary" onClick={handleSave}>
              SAVE
            </button>
          </div>
        )}
      </div>

      {/* SECURITY */}
      <div className="profile-section pixel-border">
        <div className="section-header">
          <h2>{'>'} SECURITY</h2>
        </div>

        <div className="muted">
          PASSWORD_CHANGE_API_NOT_IMPLEMENTED
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
