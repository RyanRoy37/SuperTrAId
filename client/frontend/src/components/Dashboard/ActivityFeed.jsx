import React from 'react';
import './DashboardComponents.css';

const ActivityFeed = ({ activities }) => {
  return (
    <div className="activity-feed-container pixel-border">
      <div className="feed-header">
        <h3>{'>'} RECENT_ACTIVITY</h3>
      </div>
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <span className="activity-icon">{activity.icon}</span>
            <div className="activity-content">
              <div className="activity-message">{activity.message}</div>
              <div className="activity-time">{activity.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;