import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Database,
  Brain, 
  BarChart3, 
  Settings,
  TrendingUp,
  DollarSign,
  Users,
  Trophy,
  CreditCard,
  Bot,
  Eye
} from 'lucide-react';
import './PredictivePage.css';

const PredictivePage = () => {
  const predictionChartRef = useRef(null);
  const chartRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [trailElements, setTrailElements] = useState([]);
  const [trailEnabled, setTrailEnabled] = useState(false);
  const lastTrailTime = useRef(0);

  useEffect(() => {
    // Wait for Chart.js to load
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.Chart) {
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
  }, []);

  const initializeChart = () => {
    // Destroy existing chart first
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (predictionChartRef.current) {
      // Generate sample data for the prediction chart
      const labels = [];
      const actualData = [];
      const predictedData = [];
      const today = new Date();
      
      for (let i = -30; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        if (i < 0) {
          // Historical data
          actualData.push(Math.random() * 100 + 50);
          predictedData.push(null);
        } else {
          // Future predictions
          actualData.push(null);
          predictedData.push(Math.random() * 100 + 50);
        }
      }

      chartRef.current = new window.Chart(predictionChartRef.current, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Actual Orders',
            data: actualData,
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            tension: 0.4,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 6,
            hidden: true
          }, {
            label: 'AI Predictions',
            data: predictedData,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderDash: [5, 5],
            tension: 0.4,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 6,
            hidden: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Client Order Predictions vs Actual Orders',
              font: {
                size: 16,
                weight: 'bold'
              },
              color: '#2c3e50'
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date',
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
                text: 'Order Volume (Units)',
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
          elements: {
            point: {
              hoverBackgroundColor: '#fff',
              hoverBorderWidth: 2
            }
          }
        }
      });
    }
  };

  const toggleTrail = () => {
    setTrailEnabled(!trailEnabled);
    if (!trailEnabled) {
      setTrailElements([]); // Clear existing trails when disabling
    }
  };

  return (
    <div className="predictive-page">
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
            Back to Dashboard
          </Link>
          <h1>Predictive Supply Chain Intelligence</h1>
          <p>Transform your reactive inventory management into predictive supply planning through our AI-powered demand forecasting platform</p>
        </div>

        <div className="content">
          {/* How It Works Section */}
          <div className="section">
            <h2>How Our AI-Powered Solution Works</h2>
            <div className="process-flow">
              <div className="process-step step-1">
                <div className="step-icon">
                  <Database size={48} />
                </div>
                <div className="step-title">Data Collection & Analysis</div>
                <div className="step-description">
                  We analyze your historical sales data, customer ordering patterns, seasonal trends, and market indicators to build comprehensive demand profiles for each product category.
                </div>
              </div>

              <div className="process-step step-2">
                <div className="step-icon">
                  <Brain size={48} />
                </div>
                <div className="step-title">AI Prediction Engine</div>
                <div className="step-description">
                  Our machine learning algorithms process multiple data streams to predict exactly what your local clients will order, when they'll order it, and in what quantities.
                </div>
              </div>

              <div className="process-step step-3">
                <div className="step-icon">
                  <BarChart3 size={48} />
                </div>
                <div className="step-title">Demand Forecasting</div>
                <div className="step-description">
                  Generate accurate 30-90 day demand forecasts for each client and product, helping you plan production schedules and inventory levels with confidence.
                </div>
              </div>

              <div className="process-step step-4">
                <div className="step-icon">
                  <Settings size={48} />
                </div>
                <div className="step-title">Automated Optimization</div>
                <div className="step-description">
                  Automatically adjust production schedules, optimize inventory levels, and send proactive alerts to ensure you're always prepared for upcoming demand.
                </div>
              </div>
            </div>
          </div>

          {/* Prediction Demo Section */}
          <div className="section">
            <h2>See the Prediction in Action</h2>
            <div className="prediction-demo">
              <h3 style={{textAlign: 'center', color: '#2c3e50', marginBottom: '20px'}}>Client Order Prediction Dashboard</h3>
              <p style={{textAlign: 'center', color: '#7f8c8d', marginBottom: '20px', fontSize: '0.9rem'}}>
                Click on the legend items below to enable/disable data series
              </p>
              <div className="demo-chart">
                <canvas ref={predictionChartRef}></canvas>
              </div>
              
              <div className="prediction-cards">
                <div className="prediction-card">
                  <div className="prediction-value">87%</div>
                  <div className="prediction-label">Prediction Accuracy</div>
                </div>
                <div className="prediction-card">
                  <div className="prediction-value">$2.3M</div>
                  <div className="prediction-label">Cost Savings Annually</div>
                </div>
                <div className="prediction-card">
                  <div className="prediction-value">45%</div>
                  <div className="prediction-label">Reduction in Waste</div>
                </div>
                <div className="prediction-card">
                  <div className="prediction-value">92%</div>
                  <div className="prediction-label">On-Time Delivery Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Benefits Section */}
          <div className="section">
            <h2>Key Benefits for Your Business</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <BarChart3 size={48} />
                </div>
                <div className="benefit-title">Predictive Accuracy</div>
                <div className="benefit-description">
                  Know exactly what your clients will order 30-90 days in advance with 85%+ accuracy, eliminating guesswork and reducing waste.
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <DollarSign size={48} />
                </div>
                <div className="benefit-title">Cost Reduction</div>
                <div className="benefit-description">
                  Reduce production costs by 25-40% through optimized scheduling, reduced waste, and eliminated emergency production runs.
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <Users size={48} />
                </div>
                <div className="benefit-title">Client Satisfaction</div>
                <div className="benefit-description">
                  Improve customer relationships with reliable delivery schedules and reduced stockouts, leading to higher retention rates.
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <Trophy size={48} />
                </div>
                <div className="benefit-title">Competitive Advantage</div>
                <div className="benefit-description">
                  Stay ahead of competitors with superior demand intelligence and proactive supply chain management.
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <CreditCard size={48} />
                </div>
                <div className="benefit-title">Cash Flow Optimization</div>
                <div className="benefit-description">
                  Better inventory management frees up working capital and improves cash flow predictability for better financial planning.
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <Bot size={48} />
                </div>
                <div className="benefit-title">Automated Intelligence</div>
                <div className="benefit-description">
                  AI continuously learns and improves predictions based on new data, ensuring your forecasting gets better over time.
                </div>
              </div>
            </div>
          </div>

          {/* Live Demo Section */}
          <div className="section">
            <h2>See It In Action - Live Client Dashboard</h2>
            <div style={{textAlign: 'center', margin: '30px 0'}}>
              <p style={{fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '30px'}}>
                Experience how Singh Union Enterprises uses our platform to manage 10 local clients and 20 products with AI-powered predictions.
              </p>
              <Link to="/client-dashboard" className="cta-button" style={{background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 25px rgba(231, 76, 60, 0.4)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
                <Eye size={20} />
                View Live Client Dashboard
              </Link>
            </div>
          </div>

          {/* Call to Action */}
          <div className="cta-section">
            <div className="cta-title">Ready to Transform Your Supply Chain?</div>
            <div className="cta-description">
              Join the first Vendors in your industry with predictive supply intelligence. Start your risk-free evaluation today.
            </div>
            <button className="cta-button" onClick={() => alert('Contact us to start your POC evaluation!')}>
              Start Your POC Evaluation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictivePage;
