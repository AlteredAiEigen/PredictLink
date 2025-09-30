import React from 'react';
import { Brain, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

const Alerts = ({ alerts }) => {
  const getAlertIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} />;
      case 'medium':
        return <TrendingUp size={16} />;
      case 'low':
        return <Calendar size={16} />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <Brain size={20} />
        <h3>AI-Generated Alerts & Recommendations</h3>
      </div>
      <div className="alerts-container">
        {alerts.map((alert, index) => (
          <div key={index} className={`alert-item ${alert.priority}`}>
            <div className={`alert-icon ${alert.priority}`}>
              {getAlertIcon(alert.priority)}
            </div>
            <div className="alert-content">
              <h4>{alert.title}</h4>
              <p>{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;

