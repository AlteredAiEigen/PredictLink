import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  Brain, 
  Store, 
  Package, 
  DollarSign, 
  Users,
  BarChart3,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Calendar,
  X
} from 'lucide-react';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const { data } = useData();
  const [selectedClient, setSelectedClient] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [trailElements, setTrailElements] = useState([]);
  const [trailEnabled, setTrailEnabled] = useState(false);
  const lastTrailTime = useRef(0);
  const clientChartRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Wait for Chart.js to load
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.Chart && data) {
        initializeChart();
      }
    }, 100);

    // Custom cursor functionality
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      setShowCursor(true);
      
      // Create trail element only if trail is enabled
      if (trailEnabled) {
        const now = Date.now();
        if (now - lastTrailTime.current > 30) { // Throttle to every 30ms for smoother trail
          lastTrailTime.current = now;
          
          const trailId = now + Math.random();
          const newTrail = {
            id: trailId,
            x: e.clientX - 8,
            y: e.clientY - 8
          };
          
          setTrailElements(prev => [...prev, newTrail]);
          
          // Remove trail element after animation completes
          setTimeout(() => {
            setTrailElements(prev => prev.filter(trail => trail.id !== trailId));
          }, 2000);
        }
      }
    };

    const handleMouseLeave = () => {
      setShowCursor(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function to destroy chart when component unmounts
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  const initializeChart = () => {
    // Destroy existing chart first
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (clientChartRef.current) {
      chartRef.current = new window.Chart(clientChartRef.current, {
        type: 'bar',
        data: {
          labels: data.chartData.clientLabels,
          datasets: [{
            label: 'Predicted Orders (Units)',
            data: data.chartData.clientData,
            backgroundColor: 'rgba(52, 152, 219, 0.8)',
            borderColor: '#3498db',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Client Demand Predictions',
              font: {
                size: 16,
                weight: 'bold',
                color: '#2c3e50'
              }
            },
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Clients',
                font: {
                  weight: 'bold'
                }
              },
              grid: {
                display: false
              }
            },
            y: {
              title: {
                display: true,
                text: 'Predicted Units',
                font: {
                  weight: 'bold'
                }
              },
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
          }
        }
      });
    }
  };

  const handleClientClick = (clientName) => {
    setSelectedClient(clientName);
  };

  const handleCloseClientModal = () => {
    setSelectedClient(null);
  };

  const handleProductsClick = () => {
    setShowProductsModal(true);
  };

  const handleCloseProductsModal = () => {
    setShowProductsModal(false);
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2);
  };

  const getConfidenceColor = (accuracy) => {
    if (accuracy >= 90) return 'high';
    if (accuracy >= 80) return 'medium';
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

  const toggleTrail = () => {
    setTrailEnabled(!trailEnabled);
    if (!trailEnabled) {
      setTrailElements([]); // Clear existing trails when disabling
    }
  };

  return (
    <div className="client-dashboard">
      <button 
        className={`trail-toggle ${trailEnabled ? 'active' : ''}`}
        onClick={toggleTrail}
      >
        {trailEnabled ? 'Trail ON' : 'Trail OFF'}
      </button>
      {showCursor && (
        <div 
          className={`custom-cursor ${!trailEnabled ? 'large' : ''}`}
          style={{
            left: cursorPosition.x - (trailEnabled ? 12 : 16),
            top: cursorPosition.y - (trailEnabled ? 12 : 16),
          }}
        />
      )}
      {trailEnabled && trailElements.map(trail => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: trail.x,
            top: trail.y,
          }}
        />
      ))}
      <div className="container">
        <div className="header">
          <Link to="/" className="back-button">
            <ArrowLeft size={16} />
            Back
          </Link>
          <div className="header-content">
            <h1>Singh Union Enterprises</h1>
            <p>AI-Powered Supply Chain Management Dashboard</p>
          </div>
          <div className="ai-badge">
            <Brain size={16} />
            AI-Powered
          </div>
        </div>

        <div className="dashboard-content">
          <div className="stats-overview">
            <div className="stat-card clients">
              <div className="stat-icon">
                <Store size={32} />
              </div>
              <div className="stat-value">{data.company.totalClients}</div>
              <div className="stat-label">Grocery Store Clients</div>
            </div>
            
            <div 
              className="stat-card products clickable"
              onClick={handleProductsClick}
            >
              <div className="stat-icon">
                <Package size={32} />
              </div>
              <div className="stat-value">{data.company.totalProducts}</div>
              <div className="stat-label">Products Tracked</div>
            </div>
            
            <div className="stat-card accuracy">
              <div className="stat-icon">
                <Brain size={32} />
              </div>
              <div className="stat-value">{data.company.predictionAccuracy}%</div>
              <div className="stat-label">AI Prediction Accuracy</div>
            </div>
            
            <div className="stat-card savings">
              <div className="stat-icon">
                <DollarSign size={32} />
              </div>
              <div className="stat-value">${(data.company.monthlySavings / 1000).toFixed(0)}K</div>
              <div className="stat-label">Monthly Savings</div>
            </div>
          </div>

          <div className="main-content">
            <div className="section">
              <h3>
                <BarChart3 size={20} />
                Client Demand Predictions
              </h3>
              <div className="chart-container">
                <canvas ref={clientChartRef}></canvas>
              </div>
            </div>
            
            <div className="section">
              <h3>
                <Users size={20} />
                Top Clients by Predicted Orders
              </h3>
              <div className="client-list">
                {Object.entries(data.clients).map(([clientName, client]) => (
                  <div 
                    key={clientName}
                    className="client-item"
                    onClick={() => handleClientClick(clientName)}
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
          </div>

          <div className="section">
            <h3>
              <ShoppingCart size={20} />
              Product Demand Predictions (Next 30 Days)
            </h3>
            <div className="products-grid">
              {Object.values(data.products).flat().slice(0, 8).map((product, index) => (
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

          <div className="section">
            <h3>
              <AlertTriangle size={20} />
              AI-Generated Alerts & Recommendations
            </h3>
            <div className="alerts-container">
              {data.alerts.map((alert, index) => (
                <div key={index} className={`alert-item ${alert.priority}`}>
                  <div className={`alert-icon ${alert.priority}`}>
                    {alert.priority === 'high' ? <AlertTriangle size={16} /> :
                     alert.priority === 'medium' ? <TrendingUp size={16} /> :
                     <Calendar size={16} />}
                  </div>
                  <div className="alert-content">
                    <h4>{alert.title}</h4>
                    <p>{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Client Modal */}
      {selectedClient && (
        <div className="client-modal">
          <div className="client-modal-content">
            <div className="client-modal-header">
              <h2>{selectedClient} - Order Predictions</h2>
              <span className="close-client-modal" onClick={handleCloseClientModal}>
                <X size={24} />
              </span>
            </div>
            
            <div className="client-summary">
              <div className="summary-card">
                <Package size={20} />
                <div className="summary-value">{data.clients[selectedClient].totalOrders}</div>
                <div className="summary-label">Total Units</div>
              </div>
              <div className="summary-card">
                <DollarSign size={20} />
                <div className="summary-value">${(data.clients[selectedClient].totalValue / 1000).toFixed(1)}K</div>
                <div className="summary-label">Total Value</div>
              </div>
              <div className="summary-card">
                <TrendingUp size={20} />
                <div className="summary-value">{data.clients[selectedClient].accuracy}%</div>
                <div className="summary-label">AI Accuracy</div>
              </div>
              <div className="summary-card">
                <Calendar size={20} />
                <div className="summary-value">{data.clients[selectedClient].products.length}</div>
                <div className="summary-label">Products</div>
              </div>
            </div>

            <h3>Product Orders & Predictions</h3>
            <div className="products-table-container">
              <table className="client-products-table">
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
                  {data.clients[selectedClient].products.map((product, index) => (
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
      )}

      {/* Products Modal */}
      {showProductsModal && (
        <div className="client-modal">
          <div className="client-modal-content">
            <div className="client-modal-header">
              <h2>All 25 Products - Demand Predictions</h2>
              <span className="close-client-modal" onClick={handleCloseProductsModal}>
                <X size={24} />
              </span>
            </div>
            
            <div className="client-summary">
              <div className="summary-card">
                <Package size={20} />
                <div className="summary-value">25</div>
                <div className="summary-label">Total Products</div>
              </div>
              <div className="summary-card">
                <TrendingUp size={20} />
                <div className="summary-value">{Object.values(data.products).flat().reduce((sum, product) => sum + product.totalUnits, 0).toLocaleString()}</div>
                <div className="summary-label">Total Units</div>
              </div>
              <div className="summary-card">
                <DollarSign size={20} />
                <div className="summary-value">${(Object.values(data.products).flat().reduce((sum, product) => sum + product.totalValue, 0) / 1000).toFixed(0)}K</div>
                <div className="summary-label">Total Value</div>
              </div>
              <div className="summary-card">
                <TrendingUp size={20} />
                <div className="summary-value">{Math.round(Object.values(data.products).flat().reduce((sum, product) => sum + product.avgConfidence, 0) / Object.values(data.products).flat().length)}%</div>
                <div className="summary-label">Avg Confidence</div>
              </div>
            </div>

            <h3>Complete Product Inventory & Predictions (Next 30 Days)</h3>
            <div className="products-table-container">
              <table className="client-products-table">
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
                  {Object.entries(data.products).map(([category, categoryProducts]) => (
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
      )}
    </div>
  );
};

export default ClientDashboard;
