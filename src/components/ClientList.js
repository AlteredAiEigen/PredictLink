import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

const ClientList = ({ clients, onClientClick }) => {
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2);
  };

  const getConfidenceColor = (accuracy) => {
    if (accuracy >= 90) return 'high';
    if (accuracy >= 80) return 'medium';
    return 'low';
  };

  return (
    <div className="card">
      <div className="card-header">
        <Users size={20} />
        <h3>Top Clients by Predicted Orders</h3>
      </div>
      <div className="client-list">
        {Object.entries(clients).map(([clientName, client]) => (
          <div 
            key={clientName}
            className="client-item"
            onClick={() => onClientClick(clientName)}
          >
            <div className="client-info">
              <div className="client-avatar">
                {getInitials(clientName)}
              </div>
              <div className="client-details">
                <h4>{clientName}</h4>
                <p>Next Order: {client.totalOrders.toLocaleString()} units</p>
              </div>
            </div>
            <div className={`prediction-badge ${getConfidenceColor(client.accuracy)}`}>
              <TrendingUp size={12} />
              {client.accuracy}% Accuracy
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;

