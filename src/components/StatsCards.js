import React from 'react';
import { Store, Package, Brain, DollarSign } from 'lucide-react';

const StatsCards = ({ data, onProductsClick }) => {
  const stats = [
    {
      icon: <Store size={24} />,
      value: data.totalClients,
      label: 'Grocery Store Clients',
      color: 'blue'
    },
    {
      icon: <Package size={24} />,
      value: data.totalProducts,
      label: 'Products Tracked',
      color: 'green',
      clickable: true,
      onClick: onProductsClick
    },
    {
      icon: <Brain size={24} />,
      value: `${data.predictionAccuracy}%`,
      label: 'AI Prediction Accuracy',
      color: 'purple'
    },
    {
      icon: <DollarSign size={24} />,
      value: `$${(data.monthlySavings / 1000).toFixed(0)}K`,
      label: 'Monthly Savings',
      color: 'orange'
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`stat-card ${stat.color} ${stat.clickable ? 'clickable' : ''}`}
          onClick={stat.clickable ? stat.onClick : undefined}
        >
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

