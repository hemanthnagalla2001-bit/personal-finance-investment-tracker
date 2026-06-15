import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import '../styles/Pages.css';

const emptyForm = { goalName: '', targetAmount: '', currentAmount: '0', targetDate: '' };

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/savings-goals');
      setGoals(res.data);
    } catch {
      setError('Failed to load savings goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || 0),
      };
      if (editId) {
        await api.put(`/savings-goals/${editId}`, payload);
      } else {
        await api.post('/savings-goals', payload);
      }
      setShowForm(false);
      setFormData(emptyForm);
      setEditId(null);
      fetchGoals();
    } catch {
      setError('Failed to save savings goal');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (goal) => {
    setFormData({
      goalName: goal.goalName,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate,
    });
    setEditId(goal.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this savings goal?')) return;
    try {
      await api.delete(`/savings-goals/${id}`);
      fetchGoals();
    } catch {
      setError('Failed to delete savings goal');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(emptyForm);
    setEditId(null);
    setError('');
  };

  const getProgress = (current, target) => {
    if (!target || target <= 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="content-area">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>Savings Goals</h1>
              <p>Track your financial goals</p>
            </div>
            <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Goal</button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {showForm && (
            <div className="form-card">
              <h2>{editId ? 'Edit Goal' : 'Add Savings Goal'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Goal Name</label>
                    <input name="goalName" value={formData.goalName} onChange={handleChange} required placeholder="e.g. Emergency Fund" />
                  </div>
                  <div className="form-group">
                    <label>Target Date</label>
                    <input type="date" name="targetDate" value={formData.targetDate} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Target Amount ($)</label>
                    <input type="number" name="targetAmount" value={formData.targetAmount} onChange={handleChange} required min="0.01" step="0.01" />
                  </div>
                  <div className="form-group">
                    <label>Current Amount ($)</label>
                    <input type="number" name="currentAmount" value={formData.currentAmount} onChange={handleChange} min="0" step="0.01" />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editId ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="loading-screen"><div className="spinner"></div></div>
          ) : (
            <div className="goals-grid">
              {goals.length === 0 ? (
                <div className="empty-state">No savings goals yet. Click "Add Goal" to get started.</div>
              ) : (
                goals.map((goal) => {
                  const progress = getProgress(parseFloat(goal.currentAmount), parseFloat(goal.targetAmount));
                  return (
                    <div key={goal.id} className="goal-card">
                      <div className="goal-card-header">
                        <h3>{goal.goalName}</h3>
                        <div className="goal-actions">
                          <button className="btn-edit" onClick={() => handleEdit(goal)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(goal.id)}>Delete</button>
                        </div>
                      </div>
                      <div className="goal-progress-section">
                        <div className="goal-progress-bar">
                          <div className="goal-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="goal-progress-text">{progress.toFixed(1)}% complete</div>
                      </div>
                      <div className="goal-details">
                        <div className="goal-detail">
                          <span>Saved</span>
                          <strong>${parseFloat(goal.currentAmount).toFixed(2)}</strong>
                        </div>
                        <div className="goal-detail">
                          <span>Target</span>
                          <strong>${parseFloat(goal.targetAmount).toFixed(2)}</strong>
                        </div>
                        <div className="goal-detail">
                          <span>By</span>
                          <strong>{goal.targetDate}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SavingsGoals;
