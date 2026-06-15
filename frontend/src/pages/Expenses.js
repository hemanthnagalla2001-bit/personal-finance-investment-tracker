import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import '../styles/Pages.css';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Utilities', 'Other'];

const emptyForm = { title: '', category: 'Food', amount: '', expenseDate: '', notes: '' };

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      if (editId) {
        await api.put(`/expenses/${editId}`, payload);
      } else {
        await api.post('/expenses', payload);
      }
      setShowForm(false);
      setFormData(emptyForm);
      setEditId(null);
      fetchExpenses();
    } catch (err) {
      setError('Failed to save expense');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      expenseDate: expense.expenseDate,
      notes: expense.notes || '',
    });
    setEditId(expense.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch {
      setError('Failed to delete expense');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(emptyForm);
    setEditId(null);
    setError('');
  };

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  return (
    <div className="app-layout">
      <Navbar />
      <div className="content-area">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>Expenses</h1>
              <p>Total: <strong>${total.toFixed(2)}</strong></p>
            </div>
            <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Expense</button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {showForm && (
            <div className="form-card">
              <h2>{editId ? 'Edit Expense' : 'Add Expense'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Grocery shopping" />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Amount ($)</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0.01" step="0.01" />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" name="expenseDate" value={formData.expenseDate} onChange={handleChange} required />
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
              {expenses.length === 0 ? (
                <div className="empty-state">No expenses recorded yet. Click "Add Expense" to get started.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((e) => (
                      <tr key={e.id}>
                        <td>{e.title}</td>
                        <td><span className="category-badge">{e.category}</span></td>
                        <td className="amount-cell">${parseFloat(e.amount).toFixed(2)}</td>
                        <td>{e.expenseDate}</td>
                        <td className="notes-cell">{e.notes || '-'}</td>
                        <td>
                          <button className="btn-edit" onClick={() => handleEdit(e)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(e.id)}>Delete</button>
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

export default Expenses;
