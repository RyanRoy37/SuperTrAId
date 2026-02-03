import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">LOADING...</div>;
  if (!data) return <div className="error">Failed to load dashboard</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>[ DASHBOARD ]</h1>
      
      <div className="grid grid-4">
        <div className="stat-box">
          <div className="label">VIRTUAL CAPITAL</div>
          <div className="value">₹{data.virtualCapital.toLocaleString()}</div>
        </div>
        <div className="stat-box">
          <div className="label">AVAILABLE CAPITAL</div>
          <div className="value">₹{data.availableCapital.toLocaleString()}</div>
        </div>
        <div className="stat-box">
          <div className="label">PORTFOLIO VALUE</div>
          <div className="value">₹{data.portfolioValue.toLocaleString()}</div>
        </div>
        <div className="stat-box">
          <div className="label">PROFIT/LOSS</div>
          <div className={`value ${data.profitLoss >= 0 ? 'positive' : 'negative'}`}>
            ₹{data.profitLoss.toLocaleString()} ({data.profitLossPercentage}%)
          </div>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: '30px' }}>
        <div className="card">
          <h2>HOLDINGS</h2>
          <div style={{ fontSize: '32px', textAlign: 'center', marginTop: '20px' }}>
            {data.holdingsCount}
          </div>
        </div>
        <div className="card">
          <h2>SUPERBUNDLES</h2>
          <div style={{ fontSize: '32px', textAlign: 'center', marginTop: '20px' }}>
            {data.bundlesCount}
          </div>
        </div>
        <div className="card">
          <h2>ACTIVE GOALS</h2>
          <div style={{ fontSize: '32px', textAlign: 'center', marginTop: '20px' }}>
            {data.goals}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h2>RECENT ACTIVITY</h2>
        {data.recentActivity.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>ACTION</th>
                <th>DETAILS</th>
                <th>TIME</th>
              </tr>
            </thead>
            <tbody>
              {data.recentActivity.map((activity, idx) => (
                <tr key={idx}>
                  <td>{activity.action}</td>
                  <td>{JSON.stringify(activity.details)}</td>
                  <td>{new Date(activity.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;