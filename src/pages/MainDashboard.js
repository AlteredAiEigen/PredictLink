import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Link as LinkIcon,
  Settings
} from 'lucide-react';
import './MainDashboard.css';

const MainDashboard = () => {
  const supplyChartRef = useRef(null);
  const cashFlowChartRef = useRef(null);
  const competitiveChartRef = useRef(null);
  const chartsRef = useRef({});
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [trailElements, setTrailElements] = useState([]);
  const [trailEnabled, setTrailEnabled] = useState(false);
  const lastTrailTime = useRef(0);

  useEffect(() => {
    // Wait for Chart.js to load
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.Chart) {
        initializeCharts();
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

    // Cleanup function to destroy charts when component unmounts
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      Object.values(chartsRef.current).forEach(chart => {
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, []);

  const initializeCharts = () => {
    // Destroy existing charts first
    Object.values(chartsRef.current).forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
    chartsRef.current = {};

    // Supply Inefficiencies Chart
    if (supplyChartRef.current) {
      chartsRef.current.supply = new window.Chart(supplyChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Stockouts', 'Overstocks', 'Waste', 'Emergency Costs'],
          datasets: [{
            data: [35, 25, 30, 10],
            backgroundColor: ['#e74c3c', '#f39c12', '#27ae60', '#9b59b6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            }
          }
        }
      });
    }

    // Cash Flow Chart
    if (cashFlowChartRef.current) {
      chartsRef.current.cashFlow = new window.Chart(cashFlowChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [{
            label: 'Cash Flow ($M)',
            data: [2.1, 1.8, 2.3, 1.9],
            backgroundColor: '#f39c12',
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Competitive Chart
    if (competitiveChartRef.current) {
      chartsRef.current.competitive = new window.Chart(competitiveChartRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Market Share %',
            data: [12, 15, 18, 16, 20, 22],
            borderColor: '#9b59b6',
            backgroundColor: 'rgba(155, 89, 182, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  };

  const openModal = () => {
    const modal = document.getElementById('sourcesModal');
    if (modal) {
      modal.style.display = 'block';
    }
  };

  const closeModal = () => {
    const modal = document.getElementById('sourcesModal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  const toggleTrail = () => {
    setTrailEnabled(!trailEnabled);
    if (!trailEnabled) {
      setTrailElements([]); // Clear existing trails when disabling
    }
  };

  return (
    <div className="main-dashboard">
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
          <h1>Grocery Supply Chain Analytics</h1>
          <p>Comprehensive analysis of supply chain inefficiencies, cash flow constraints, and competitive disadvantages affecting grocery and produce suppliers in 2023-2025</p>
        </div>

        <div className="stats-grid">
          {/* Supply Inefficiencies Section */}
          <div className="stat-card supply-inefficiencies">
            <h3>Supply Inefficiencies</h3>
            <div className="chart-container">
              <canvas ref={supplyChartRef}></canvas>
            </div>
            <ul className="stat-list">
              <li>
                <span className="stat-description">Global losses from stockouts & overstocks (2023)</span>
                <span className="stat-value">$1.8T</span>
              </li>
              <li>
                <span className="stat-description">U.S. food supply wasted annually</span>
                <span className="stat-value">31%</span>
              </li>
              <li>
                <span className="stat-description">Produce share of U.S. food waste</span>
                <span className="stat-value">43.7%</span>
              </li>
              <li>
                <span className="stat-description">Cost increase from emergency deliveries</span>
                <span className="stat-value">30%</span>
              </li>
              <li>
                <span className="stat-description">Brands with inventory accuracy &lt;80%</span>
                <span className="stat-value">58%</span>
              </li>
            </ul>
          </div>

          {/* Cash Flow Constraints Section */}
          <div className="stat-card cash-flow">
            <h3>Cash Flow Constraints</h3>
            <div className="chart-container">
              <canvas ref={cashFlowChartRef}></canvas>
            </div>
            <ul className="stat-list">
              <li>
                <span className="stat-description">SMBs with &lt;4 months cash reserves</span>
                <span className="stat-value">70%</span>
              </li>
              <li>
                <span className="stat-description">Revenue absorbed by operating costs</span>
                <span className="stat-value">90%</span>
              </li>
              <li>
                <span className="stat-description">SMBs using gut-based ordering</span>
                <span className="stat-value">50%+</span>
              </li>
              <li>
                <span className="stat-description">B2B invoices paid late (2024-2025)</span>
                <span className="stat-value">50%</span>
              </li>
              <li>
                <span className="stat-description">Surplus inventory value (2023)</span>
                <span className="stat-value">$108B</span>
              </li>
            </ul>
          </div>

          {/* Competitive Disadvantage Section */}
          <div className="stat-card competitive">
            <h3>Competitive Disadvantage</h3>
            <div className="chart-container">
              <canvas ref={competitiveChartRef}></canvas>
            </div>
            <ul className="stat-list">
              <li>
                <span className="stat-description">Stockout reduction with automation</span>
                <span className="stat-value">40%</span>
              </li>
              <li>
                <span className="stat-description">Suppliers dependent on reactive planning</span>
                <span className="stat-value">60%+</span>
              </li>
              <li>
                <span className="stat-description">Consumers with negative stockout perception</span>
                <span className="stat-value">65%</span>
              </li>
              <li>
                <span className="stat-description">Bad debt affecting credit sales</span>
                <span className="stat-value">8%</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="summary-section">
          <h2>Key Impact Summary</h2>
          <div className="key-insights">
            <div className="insight-card">
              <div className="insight-number">$1.8T</div>
              <div className="insight-text">Global losses from supply inefficiencies</div>
            </div>
            <div className="insight-card">
              <div className="insight-number">70%</div>
              <div className="insight-text">SMBs with insufficient cash reserves</div>
            </div>
            <div className="insight-card">
              <div className="insight-number">60%+</div>
              <div className="insight-text">Suppliers using reactive planning</div>
            </div>
            <div className="insight-card">
              <div className="insight-number">31%</div>
              <div className="insight-text">U.S. food supply wasted annually</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <button className="sources-button" onClick={openModal}>
        <LinkIcon size={20} />
        View Sources
      </button>
      
      <Link to="/predictive" className="how-it-works-button">
        <Settings size={20} />
        How It Works
      </Link>

      {/* Sources Modal */}
      <div id="sourcesModal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2><i className="fas fa-external-link-alt"></i> Research Sources</h2>
            <span className="close" onClick={closeModal}>&times;</span>
          </div>
          <ul className="sources-list">
            <li>
              <div className="source-number">1</div>
              <div>
                <a href="https://refed.org/downloads/2024-refed-food-waste-report-updated-4-18-2025.pdf" className="source-link" target="_blank" rel="noopener noreferrer">
                  ReFED 2024 Food Waste Report
                </a>
                <div className="source-description">Comprehensive analysis of U.S. food waste statistics and economic impact</div>
              </div>
            </li>
            <li>
              <div className="source-number">2</div>
              <div>
                <a href="https://altavantconsulting.com/reduce-stockouts-improve-income/" className="source-link" target="_blank" rel="noopener noreferrer">
                  Altavant Consulting - Stockout Reduction Study
                </a>
                <div className="source-description">Research on inventory distortion and supply chain optimization</div>
              </div>
            </li>
            <li>
              <div className="source-number">3</div>
              <div>
                <a href="https://www.linkedin.com/pulse/why-cash-flow-management-critical-smbs-2025-what-you-can-mosenson-xrmde" className="source-link" target="_blank" rel="noopener noreferrer">
                  LinkedIn - SMB Cash Flow Management 2025
                </a>
                <div className="source-description">Analysis of cash flow challenges for small and medium businesses</div>
              </div>
            </li>
            <li>
              <div className="source-number">4</div>
              <div>
                <a href="https://blog.creditkey.com/smbs-are-facing-a-cash-flow-crisis-what-happens-when-working-capital-disappears" className="source-link" target="_blank" rel="noopener noreferrer">
                  CreditKey - SMB Cash Flow Crisis Report
                </a>
                <div className="source-description">Study on working capital challenges in small businesses</div>
              </div>
            </li>
            <li>
              <div className="source-number">5</div>
              <div>
                <a href="https://www.biocycle.net/2024-food-waste-index/" className="source-link" target="_blank" rel="noopener noreferrer">
                  BioCycle 2024 Food Waste Index
                </a>
                <div className="source-description">Global food waste statistics and environmental impact</div>
              </div>
            </li>
            <li>
              <div className="source-number">6</div>
              <div>
                <a href="https://www.wastemanaged.co.uk/our-news/food-waste/food-waste-facts-statistics/" className="source-link" target="_blank" rel="noopener noreferrer">
                  WasteManaged - Food Waste Facts & Statistics
                </a>
                <div className="source-description">UK and global food waste statistics and trends</div>
              </div>
            </li>
            <li>
              <div className="source-number">7</div>
              <div>
                <a href="https://sdg2advocacyhub.org/wp-content/uploads/2024/03/food_waste_index_report_2024.pdf" className="source-link" target="_blank" rel="noopener noreferrer">
                  SDG2 Advocacy Hub - Food Waste Index Report 2024
                </a>
                <div className="source-description">UN-backed comprehensive food waste analysis</div>
              </div>
            </li>
            <li>
              <div className="source-number">8</div>
              <div>
                <a href="https://www.mckinsey.com/capabilities/operations/our-insights/agile-supply-chain-management" className="source-link" target="_blank" rel="noopener noreferrer">
                  McKinsey - Agile Supply Chain Management
                </a>
                <div className="source-description">Global supply chain transformation insights and best practices</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
