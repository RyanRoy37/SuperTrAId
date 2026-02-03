import React, { useState, useEffect } from 'react';
import { goalAPI } from '../services/api';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ goalName: '', targetAmount: '', deadline: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await goalAPI.getGoals();
      setGoals(response.data);
    } catch (error) {
      console.error('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    try {
      await goalAPI.createGoal(formData);
      setMessage('Goal created successfully!');
      setShowModal(false);
      fetchGoals();
      setFormData({ goalName: '', targetAmount: '', deadline: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to create goal');
    }
  };

  if (loading) return <div className="loading">LOADING...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>[ INVESTMENT GOALS ]</h1>
      
      {message && <div className="card">{message}</div>}

      <button onClick={() => setShowModal(true)} className="btn" style={{ marginBottom: '20px' }}>
        CREATE NEW GOAL
      </button>

      {goals.length > 0 ? (
        <div className="grid grid-2">
          {goals.map((goal) => (
            <div key={goal._id} className="card">
              <h2>{goal.goalName}</h2>
              <p style={{ marginTop: '15px' }}>
                <strong>Target:</strong> ₹{goal.targetAmount.toLocaleString()}
              </p>
              <p><strong>Current:</strong> ₹{goal.currentAmount.toLocaleString()}</p>
              <p>
                <strong>Progress:</strong> {((goal.currentAmount / goal.targetAmount) * 100).toFixed(2)}%
              </p>
              {goal.deadline && (
                <p><strong>Deadline:</strong> {new Date(goal.deadline).toLocaleDateString()}</p>
              )}
              <p className={goal.status === 'active' ? 'positive' : ''}><strong>Status:</strong> {goal.status.toUpperCase()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">No investment goals set yet.</div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>CREATE GOAL</h2>
            <div className="form-group">
              <label>GOAL NAME</label>
              <input
                type="text"
                value={formData.goalName}
                onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>TARGET AMOUNT (₹)</label>
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>DEADLINE</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleCreateGoal} className="btn">CREATE</button>
              <button onClick={() => setShowModal(false)} className="btn btn-danger">CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;