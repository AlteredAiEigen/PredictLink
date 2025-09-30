import React from 'react';
import { ShoppingCart, TrendingUp } from 'lucide-react';

const ProductPredictions = ({ products }) => {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'high';
    if (confidence >= 80) return 'medium';
    return 'low';
  };

  const getTopProducts = () => {
    const allProducts = [];
    Object.values(products).forEach(category => {
      allProducts.push(...category);
    });
    return allProducts
      .sort((a, b) => b.totalUnits - a.totalUnits)
      .slice(0, 8);
  };

  const topProducts = getTopProducts();

  return (
    <div className="card">
      <div className="card-header">
        <ShoppingCart size={20} />
        <h3>Product Demand Predictions (Next 30 Days)</h3>
      </div>
      <div className="products-grid">
        {topProducts.map((product, index) => (
          <div key={index} className="product-card">
            <div className="product-name">{product.name}</div>
            <div className="product-prediction">
              Predicted: {product.totalUnits.toLocaleString()} units
            </div>
            <div className={`product-accuracy ${getConfidenceColor(product.avgConfidence)}`}>
              <TrendingUp size={12} />
              Accuracy: {product.avgConfidence}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPredictions;

