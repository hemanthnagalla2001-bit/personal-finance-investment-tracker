import React from 'react';
import '../styles/DashboardCard.css';

const DashboardCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <div className="dashboard-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="card-header">
        <div className="card-icon" style={{ color }}>
          {icon}
        </div>
        <div className="card-title">{title}</div>
      </div>
      <div className="card-value" style={{ color }}>
        {value}
      </div>
      {subtitle && <div className="card-subtitle">{subtitle}</div>}
    </div>
  );
};

export default DashboardCard;
