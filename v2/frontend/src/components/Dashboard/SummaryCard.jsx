import React from 'react';
import './DashboardComponents.css';

const SummaryCard = ({ title, value, subtitle, isPositive, icon }) => {
  return (
    <div className="summary-card pixel-border">
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <span className="card-title">{title}</span>
      </div>
      <div className={`card-value ${isPositive !== undefined ? (isPositive ? 'positive' : 'negative') : ''}`}>
        {value}
      </div>
      {subtitle && <div className="card-subtitle">{subtitle}</div>}
    </div>
  );
};

export default SummaryCard;