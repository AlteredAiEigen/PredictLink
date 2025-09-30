import React from 'react';
import { X, Package, DollarSign, Target, Calendar } from 'lucide-react';

const ClientModal = ({ clientName, clientData, onClose }) => {
  if (!clientData) return null;

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'high';
    if (confidence >= 80) return 'medium';
    return 'low';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Grocery Staples':
        return '🥘';
      case 'Fresh Produce':
        return '🥬';
      case 'Packaged Foods':
        return '📦';
      default:
        return '📦';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{clientName} - Order Predictions</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="client-summary">
            <div className="summary-card">
              <Package size={20} />
              <div className="summary-value">{clientData.totalOrders}</div>
              <div className="summary-label">Total Units</div>
            </div>
            <div className="summary-card">
              <DollarSign size={20} />
              <div className="summary-value">${(clientData.totalValue / 1000).toFixed(1)}K</div>
              <div className="summary-label">Total Value</div>
            </div>
            <div className="summary-card">
              <Target size={20} />
              <div className="summary-value">{clientData.accuracy}%</div>
              <div className="summary-label">AI Accuracy</div>
            </div>
            <div className="summary-card">
              <Calendar size={20} />
              <div className="summary-value">{clientData.products.length}</div>
              <div className="summary-label">Products</div>
            </div>
          </div>

          <h3>Product Orders & Predictions</h3>
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Value</th>
                  <th>Confidence</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {clientData.products.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <span className="category-icon">
                        {getCategoryIcon(product.category)}
                      </span>
                      {product.category}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>${product.unitPrice}</td>
                    <td>${(product.quantity * product.unitPrice).toLocaleString()}</td>
                    <td>
                      <span className={`confidence-badge ${getConfidenceColor(product.confidence)}`}>
                        {product.confidence}%
                      </span>
                    </td>
                    <td>{product.orderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;

