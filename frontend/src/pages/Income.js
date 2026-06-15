import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import '../styles/Pages.css';

const emptyForm = { source: '', amount: '', incomeDate: '', notes: '' };

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchIncomes = async () => {
    try {
      const res = await api.get('/income');
      setIncomes(res.data);
    } catch {
      setError('Failed to load income records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIncomes(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      if (editId) {
        await api.put(`/income/${editId}`, payload);
      } else {
        await api.post('/income', payload);
      }
      setShowForm(false);
      setFormData(emptyForm);
      setEditId(null);
      fetchIncomes();
    } catch {
      setError('Failed to save income record');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (income) => {
    setFormData({
      source: income.source,
      amount: income.amount,
      incomeDate: income.incomeDate,
      notes: income.notes || '',
    });
    setEditId(income.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income record?')) return;
    try {
      await api.delete(`/income/${id}`);
      fetchIncomes();
    } catch {
      setError('Failed to delete income record');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(emptyForm);
    setEditId(null);
    setError('');
  };

  const total = incomes.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);

  return (
    <div className="app-layout">
      <Navbar />
      <div className="content-area">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>Income</h1>
              <p>Total: <strong>${total.toFixed(2)}</strong></p>
            </div>
            <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Income</button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {showForm && (
            <div className="form-card">
              <h2>{editId ? 'Edit Income' : 'Add Income'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Source</label>
                    <input name="source" value={formData.source} onChange={handleChange} required placeholder="e.g. Salary, Freelance" />
                  </div>
                  <div className="form-group">
                    <label>Amount ($)</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0.01" step="0.01" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" name="incomeDate" value={formData.incomeDate} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Notes (optional)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} />
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
            <div className="table-card">
              {incomes.length === 0 ? (
                <div className="empty-state">No income records yet. Click "Add Income" to get started.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes.map((i) => (
                      <tr key={i.id}>
                        <td>{i.source}</td>
                        <td className="amount-cell income">${parseFloat(i.amount).toFixed(2)}</td>
                        <td>{i.incomeDate}</td>
                        <td className="notes-cell">{i.notes || '-'}</td>
                        <td>
                          <button className="btn-edit" onClick={() => handleEdit(i)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(i.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Income;
