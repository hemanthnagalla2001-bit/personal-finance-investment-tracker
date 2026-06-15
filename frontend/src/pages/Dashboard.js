import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import ChartComponent from '../components/ChartComponent';
import api from '../services/api';
import '../styles/Dashboard.css';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatCurrency = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setSummary(res.data);
      } catch {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <div className="content-area">
          <Sidebar />
          <main className="main-content">
            <div className="loading-screen"><div className="spinner"></div></div>
          </main>
        </div>
      </div>
    );
  }

  const expenseCategoryData = summary?.expensesByCategory
    ? {
        labels: Object.keys(summary.expensesByCategory),
        datasets: [{
          data: Object.values(summary.expensesByCategory),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
          ],
        }],
      }
    : null;

  const monthlyData = summary?.monthlyIncomeExpense || [];
  const incomeVsExpenseData = {
    labels: monthlyData.map((d) => `${MONTH_NAMES[d.month - 1]} ${d.year}`),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map((d) => d.income),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'Expenses',
        data: monthlyData.map((d) => d.expense),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const investmentData = summary?.investmentsByAssetType
    ? {
        labels: Object.keys(summary.investmentsByAssetType),
        datasets: [{
          data: Object.values(summary.investmentsByAssetType),
          backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'],
        }],
      }
    : null;

  return (
    <div className="app-layout">
      <Navbar />
      <div className="content-area">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <h1>Dashboard</h1>
            <p>Your financial overview</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="cards-grid">
            <DashboardCard
              title="Total Income"
              value={formatCurrency(summary?.totalIncome)}
              icon="💰"
              color="#4BC0C0"
            />
            <DashboardCard
              title="Total Expenses"
              value={formatCurrency(summary?.totalExpenses)}
              icon="💸"
              color="#FF6384"
            />
            <DashboardCard
              title="Net Savings"
              value={formatCurrency(summary?.netSavings)}
              icon="🏦"
              color={summary?.netSavings >= 0 ? '#36A2EB' : '#FF6384'}
            />
            <DashboardCard
              title="Total Investments"
              value={formatCurrency(summary?.totalInvestmentValue)}
              icon="📈"
              color="#9966FF"
            />
          </div>

          {summary?.savingsGoalProgress?.length > 0 && (
            <div className="section-card">
              <h2>Savings Goals Progress</h2>
              <div className="goals-list">
                {summary.savingsGoalProgress.map((goal, idx) => (
                  <div key={idx} className="goal-item">
                    <div className="goal-header">
                      <span className="goal-name">{goal.goalName}</span>
                      <span className="goal-percent">{goal.progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="goal-amounts">
                      <span>{formatCurrency(goal.currentAmount)}</span>
                      <span>of {formatCurrency(goal.targetAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="charts-grid">
            {expenseCategoryData && (
              <div className="section-card">
                <h2>Spending by Category</h2>
                <div style={{ height: '300px' }}>
                  <ChartComponent type="pie" data={expenseCategoryData} />
                </div>
              </div>
            )}
            {monthlyData.length > 0 && (
              <div className="section-card">
                <h2>Income vs Expenses</h2>
                <div style={{ height: '300px' }}>
                  <ChartComponent type="bar" data={incomeVsExpenseData} />
                </div>
              </div>
            )}
            {investmentData && (
              <div className="section-card">
                <h2>Investment Allocation</h2>
                <div style={{ height: '300px' }}>
                  <ChartComponent type="doughnut" data={investmentData} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
