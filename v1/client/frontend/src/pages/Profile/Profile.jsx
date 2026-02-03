import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: localStorage.getItem('userName') || 'John Trader',
    email: localStorage.getItem('userEmail') || 'trader@stockterm.com',
    phone: '+1-234-567-8900',
    accountCreated: '2024-01-15',
    totalInvested: 58432.50,
    portfolioValue: 65280.30,
    totalTrades: 142
  });

  const [editForm, setEditForm] = useState({ ...profile });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...profile });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...profile });
    setErrors({});
  };

  const handleSave = () => {
    const newErrors = {};
    if (!editForm.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!editForm.phone.trim()) newErrors.phone = 'Phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setProfile({ ...editForm });
    localStorage.setItem('userName', editForm.fullName);
    setIsEditing(false);
    setErrors({});
    alert('✅ Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    const newErrors = {};
    if (!passwordForm.currentPassword) newErrors.currentPassword = 'Current password required';
    if (passwordForm.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert('✅ Password changed successfully!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
    setErrors({});
  };

  const totalPL = profile.portfolioValue - profile.totalInvested;
  const totalPLPercent = ((totalPL / profile.totalInvested) * 100).toFixed(2);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="page-title">
          <span className="title-icon">👤</span>
          USER_PROFILE
        </h1>
        <div className="profile-subtitle">Manage your account settings</div>
      </div>

      <div className="profile-stats pixel-border">
        <div className="profile-stat-item">
          <span className="profile-stat-icon">💰</span>
          <div>
            <div className="profile-stat-value">${profile.totalInvested.toFixed(2)}</div>
            <div className="profile-stat-label">TOTAL INVESTED</div>
          </div>
        </div>
        <div className="profile-stat-item">
          <span className="profile-stat-icon">📈</span>
          <div>
            <div className="profile-stat-value">${profile.portfolioValue.toFixed(2)}</div>
            <div className="profile-stat-label">PORTFOLIO VALUE</div>
          </div>
        </div>
        <div className="profile-stat-item">
          <span className="profile-stat-icon">{totalPL >= 0 ? '✅' : '❌'}</span>
          <div>
            <div className={`profile-stat-value ${totalPL >= 0 ? 'positive' : 'negative'}`}>
              ${totalPL.toFixed(2)} ({totalPLPercent}%)
            </div>
            <div className="profile-stat-label">TOTAL P/L</div>
          </div>
        </div>
        <div className="profile-stat-item">
          <span className="profile-stat-icon">📊</span>
          <div>
            <div className="profile-stat-value">{profile.totalTrades}</div>
            <div className="profile-stat-label">TOTAL TRADES</div>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-section pixel-border">
          <div className="section-header">
            <h2>{'>'} PERSONAL_INFORMATION</h2>
            {!isEditing && (
              <button className="btn-secondary" onClick={handleEdit}>
                EDIT
              </button>
            )}
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <label className="profile-label">FULL NAME:</label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                className="terminal-input"
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </>
          ) : (
            <div className="profile-value">{profile.fullName}</div>
          )}
        </div>

        <div className="profile-info-item">
          <label className="profile-label">EMAIL:</label>
          <div className="profile-value">{profile.email}</div>
          <div className="profile-note">Email cannot be changed</div>
        </div>

        <div className="profile-info-item">
          <label className="profile-label">PHONE:</label>
          {isEditing ? (
            <>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="terminal-input"
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </>
          ) : (
            <div className="profile-value">{profile.phone}</div>
          )}
        </div>

        <div className="profile-info-item">
          <label className="profile-label">ACCOUNT CREATED:</label>
          <div className="profile-value">{profile.accountCreated}</div>
        </div>
      </div>

      {isEditing && (
        <div className="profile-actions">
          <button className="btn-secondary" onClick={handleCancel}>
            CANCEL
          </button>
          <button className="btn-primary" onClick={handleSave}>
            SAVE CHANGES
          </button>
        </div>
      )}
    </div>

    <div className="profile-section pixel-border">
      <div className="section-header">
        <h2>{'>'} SECURITY</h2>
      </div>

      {!showPasswordForm ? (
        <button className="btn-secondary" onClick={() => setShowPasswordForm(true)}>
          CHANGE PASSWORD
        </button>
      ) : (
        <div className="password-form">
          <div className="form-group">
            <label className="form-label">&gt; CURRENT PASSWORD:</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="terminal-input"
            />
            {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">&gt; NEW PASSWORD:</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="terminal-input"
            />
            {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">&gt; CONFIRM NEW PASSWORD:</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="terminal-input"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <div className="profile-actions">
            <button className="btn-secondary" onClick={() => {
              setShowPasswordForm(false);
              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
              setErrors({});
            }}>
              CANCEL
            </button>
            <button className="btn-primary" onClick={handlePasswordChange}>
              UPDATE PASSWORD
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
</div>
  );
};
export default Profile;
