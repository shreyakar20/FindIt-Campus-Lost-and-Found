import React from 'react';
import { Layers, AlertCircle, PackageSearch, HeartHandshake } from 'lucide-react';

const DashboardStats = ({ stats, activeStatusFilter, onSelectStatusFilter }) => {
  const statCards = [
    {
      id: 'All',
      title: 'Total Reported',
      count: stats.total,
      description: 'All items logged in portal',
      icon: Layers,
      colorClass: 'stat-total'
    },
    {
      id: 'Lost',
      title: 'Lost Items',
      count: stats.lost,
      description: 'Awaiting discovery',
      icon: AlertCircle,
      colorClass: 'stat-lost'
    },
    {
      id: 'Found',
      title: 'Found Items',
      count: stats.found,
      description: 'Ready to be claimed',
      icon: PackageSearch,
      colorClass: 'stat-found'
    },
    {
      id: 'Returned',
      title: 'Returned / Reunited',
      count: stats.returned,
      description: 'Successfully resolved',
      icon: HeartHandshake,
      colorClass: 'stat-returned'
    }
  ];

  return (
    <section className="dashboard-stats-section">
      <div className="section-header">
        <h2 className="section-title">Dashboard Overview</h2>
        <span className="section-subtitle">Real-time statistics from MongoDB database</span>
      </div>

      <div className="stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeStatusFilter === card.id;

          return (
            <div
              key={card.id}
              className={`stat-card ${card.colorClass} ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectStatusFilter(card.id)}
              role="button"
              tabIndex={0}
              title={`Click to filter by ${card.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectStatusFilter(card.id);
                }
              }}
            >
              <div className="stat-card-header">
                <span className="stat-card-title">{card.title}</span>
                <div className="stat-icon-container">
                  <Icon size={20} />
                </div>
              </div>

              <div className="stat-number">{card.count}</div>
              <div className="stat-footer">
                <span className="stat-desc">{card.description}</span>
                {isSelected && <span className="stat-badge-active">Filter Active</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardStats;
