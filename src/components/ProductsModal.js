import React from 'react';
import { X, Package, DollarSign, Target, TrendingUp } from 'lucide-react';

const ProductsModal = ({ products, onClose }) => {
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

  // Calculate totals
  let totalProducts = 0;
  let totalUnits = 0;
  let totalValue = 0;
  let avgConfidence = 0;
  let confidenceSum = 0;

  Object.values(products).forEach(category => {
    category.forEach(product => {
      totalProducts++;
      totalUnits += product.totalUnits;
      totalValue += product.totalValue;
      confidenceSum += product.avgConfidence;
    });
  });

  avgConfidence = Math.round(confidenceSum / totalProducts);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>All 25 Products - Demand Predictions</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="client-summary">
            <div className="summary-card">
              <Package size={20} />
              <div className="summary-value">{totalProducts}</div>
              <div className="summary-label">Total Products</div>
            </div>
            <div className="summary-card">
              <TrendingUp size={20} />
              <div className="summary-value">{totalUnits.toLocaleString()}</div>
              <div className="summary-label">Total Units</div>
            </div>
            <div className="summary-card">
              <DollarSign size={20} />
              <div className="summary-value">${(totalValue / 1000).toFixed(0)}K</div>
              <div className="summary-label">Total Value</div>
            </div>
            <div className="summary-card">
              <Target size={20} />
              <div className="summary-value">{avgConfidence}%</div>
              <div className="summary-label">Avg Confidence</div>
            </div>
          </div>

          <h3>Complete Product Inventory & Predictions (Next 30 Days)</h3>
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Product Name</th>
                  <th>Total Predicted Units</th>
                  <th>Avg Unit Price</th>
                  <th>Total Value</th>
                  <th>Avg Confidence</th>
                  <th>Top Client</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(products).map(([category, categoryProducts]) => (
                  <React.Fragment key={category}>
                    <tr className="category-header">
                      <td colSpan="7">
                        <span className="category-icon">
                          {getCategoryIcon(category)}
                        </span>
                        {category}
                      </td>
                    </tr>
                    {categoryProducts.map((product, index) => (
                      <tr key={`${category}-${index}`}>
                        <td></td>
                        <td>{product.name}</td>
                        <td>{product.totalUnits.toLocaleString()}</td>
                        <td>${product.avgPrice}</td>
                        <td>${product.totalValue.toLocaleString()}</td>
                        <td>
                          <span className={`confidence-badge ${getConfidenceColor(product.avgConfidence)}`}>
                            {product.avgConfidence}%
                          </span>
                        </td>
                        <td>{product.topClient}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsModal;

