import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import '../styles/Pages.css';

const ASSET_TYPES = ['Stocks', 'Bonds', 'Mutual Funds', 'ETF', 'Cryptocurrency', 'Real Estate', 'Commodities', 'Other'];
const emptyForm = { investmentName: '', assetType: 'Stocks', quantity: '', purchasePrice: '', currentValue: '', purchaseDate: '' };

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchInvestments = async () => {
    try {
      const res = await api.get('/investments');
      setInvestments(res.data);
    } catch {
      setError('Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvestments(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        purchasePrice: parseFloat(formData.purchasePrice),
        currentValue: parseFloat(formData.currentValue),
      };
      if (editId) {
        await api.put(`/investments/${editId}`, payload);
      } else {
        await api.post('/investments', payload);
      }
      setShowForm(false);
      setFormData(emptyForm);
      setEditId(null);
      fetchInvestments();
    } catch {
      setError('Failed to save investment');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (inv) => {
    setFormData({
      investmentName: inv.investmentName,
      assetType: inv.assetType,
      quantity: inv.quantity,
      purchasePrice: inv.purchasePrice,
      currentValue: inv.currentValue,
      purchaseDate: inv.purchaseDate,
    });
    setEditId(inv.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this investment?')) return;
    try {
      await api.delete(`/investments/${id}`);
      fetchInvestments();
    } catch {
      setError('Failed to delete investment');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(emptyForm);
    setEditId(null);
    setError('');
  };

  const totalValue = investments.reduce((sum, i) => sum + parseFloat(i.currentValue || 0), 0);
  const totalCost = investments.reduce((sum, i) => sum + parseFloat(i.purchasePrice || 0) * parseFloat(i.quantity || 0), 0);
  const totalGainLoss = totalValue - totalCost;

  return (
    <div className="app-layout">
      <Navbar />
      <div className="content-area">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>Investments</h1>
              <p>
                Portfolio Value: <strong>${totalValue.toFixed(2)}</strong> |
                Gain/Loss: <strong style={{ color: totalGainLoss >= 0 ? '#4BC0C0' : '#FF6384' }}>
                  {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
                </strong>
              </p>
            </div>
            <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Investment</button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {showForm && (
            <div className="form-card">
              <h2>{editId ? 'Edit Investment' : 'Add Investment'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Investment Name</label>
                    <input name="investmentName" value={formData.investmentName} onChange={handleChange} required placeholder="e.g. Apple Inc." />
                  </div>
                  <div className="form-group">
                    <label>Asset Type</label>
                    <select name="assetType" value={formData.assetType} onChange={handleChange}>
                      {ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="0.0001" step="0.0001" />
                  </div>
                  <div className="form-group">
                    <label>Purchase Price ($)</label>
                    <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} required min="0.01" step="0.01" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Current Value ($)</label>
                    <input type="number" name="currentValue" value={formData.currentValue} onChange={handleChange} required min="0.01" step="0.01" />
                  </div>
                  <div className="form-group">
                    <label>Purchase Date</label>
                    <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required />
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
            <div className="table-card">
              {investments.length === 0 ? (
                <div className="empty-state">No investments yet. Click "Add Investment" to get started.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Purchase Price</th>
                      <th>Current Value</th>
                      <th>Gain/Loss</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((inv) => {
                      const cost = parseFloat(inv.purchasePrice) * parseFloat(inv.quantity);
                      const gainLoss = parseFloat(inv.currentValue) - cost;
                      return (
                        <tr key={inv.id}>
                          <td>{inv.investmentName}</td>
                          <td><span className="category-badge">{inv.assetType}</span></td>
                          <td>{parseFloat(inv.quantity).toFixed(4)}</td>
                          <td>${parseFloat(inv.purchasePrice).toFixed(2)}</td>
                          <td className="amount-cell">${parseFloat(inv.currentValue).toFixed(2)}</td>
                          <td className={gainLoss >= 0 ? 'gain' : 'loss'}>
                            {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}
                          </td>
                          <td>{inv.purchaseDate}</td>
                          <td>
                            <button className="btn-edit" onClick={() => handleEdit(inv)}>Edit</button>
                            <button className="btn-delete" onClick={() => handleDelete(inv.id)}>Delete</button>
                          </td>
                        </tr>
                      );
                    })}
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

export default Investments;
