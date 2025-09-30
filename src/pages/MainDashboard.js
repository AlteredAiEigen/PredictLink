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
  const [showStatsControl, setShowStatsControl] = useState(false);
  const trailRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lastTrailTime = useRef(0);
  
  // Default stats configuration
  const defaultStatsConfig = {
    supply: {
      globalLosses: true,
      foodWaste: true,
      produceWaste: true,
      emergencyCosts: true,
      inventoryAccuracy: true
    },
    cashFlow: {
      cashReserves: true,
      operatingCosts: true,
      gutBasedOrdering: true,
      latePayments: true,
      surplusInventory: true
    },
    competitive: {
      stockoutReduction: true,
      reactivePlanning: true,
      negativePerception: true,
      badDebt: true
    },
    keyImpact: {
      globalLosses: true,
      cashReserves: true,
      reactivePlanning: true,
      foodWaste: true
    }
  };

  // Load stats from localStorage or use default
  const loadStatsFromStorage = () => {
    try {
      const savedStats = localStorage.getItem('dashboardStatsConfig');
      if (savedStats) {
        return JSON.parse(savedStats);
      }
    } catch (error) {
      console.warn('Failed to load stats from localStorage:', error);
    }
    return defaultStatsConfig;
  };

  // Stats control state
  const [visibleStats, setVisibleStats] = useState(loadStatsFromStorage);

  useEffect(() => {
    // Load stats from localStorage on component mount
    const savedStats = loadStatsFromStorage();
    setVisibleStats(savedStats);
  }, []);

  // Trail animation loop
  useEffect(() => {
    if (trailEnabled) {
      const animateTrails = () => {
        const now = Date.now();
        trailRef.current = trailRef.current.filter(trail => {
          const age = now - trail.timestamp;
          trail.opacity = Math.max(0, 1 - (age / 2000));
          trail.scale = Math.max(0.1, 1 - (age / 2000) * 0.9);
          return age < 2000;
        });
        
        setTrailElements([...trailRef.current]);
        animationFrameRef.current = requestAnimationFrame(animateTrails);
      };
      
      animationFrameRef.current = requestAnimationFrame(animateTrails);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setTrailElements([]);
      trailRef.current = [];
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trailEnabled]);

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
        if (now - lastTrailTime.current > 30) { // Throttle to 30ms
          lastTrailTime.current = now;
          const newTrail = {
            id: now + Math.random(),
            x: e.clientX,
            y: e.clientY,
            timestamp: now,
            opacity: 1,
            scale: 1
          };
          
          trailRef.current.push(newTrail);
          
          // Limit trail elements to prevent memory issues
          if (trailRef.current.length > 50) {
            trailRef.current = trailRef.current.slice(-30);
          }
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

    // Cash Flow Chart - Working Capital Crisis
    if (cashFlowChartRef.current) {
      chartsRef.current.cashFlow = new window.Chart(cashFlowChartRef.current, {
        type: 'bar',
        data: {
          labels: ['SMBs with <4 months cash', 'Revenue absorbed by ops', 'SMBs using gut-based ordering'],
          datasets: [{
            label: 'Percentage (%)',
            data: [70, 90, 50],
            backgroundColor: ['#e74c3c', '#c0392b', '#f39c12'],
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.parsed.y;
                  const labels = ['70% of SMBs hold less than 4 months cash reserves', '90% of revenue absorbed by operating costs', '50%+ of SMBs use gut-based ordering'];
                  return labels[context.dataIndex];
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Percentage (%)',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Critical Cash Flow Issues',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              },
              ticks: {
                maxRotation: 0,
                minRotation: 0,
                font: {
                  size: 10
                }
              }
            }
          }
        }
      });
    }

    // Competitive Chart - Market Share Impact
    if (competitiveChartRef.current) {
      chartsRef.current.competitive = new window.Chart(competitiveChartRef.current, {
        type: 'line',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [{
            label: 'Reactive Planning',
            data: [100, 95, 88, 80, 72],
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            tension: 0.4,
            fill: false
          }, {
            label: 'Proactive Planning',
            data: [100, 105, 112, 120, 130],
            borderColor: '#27ae60',
            backgroundColor: 'rgba(39, 174, 96, 0.1)',
            tension: 0.4,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const datasetLabel = context.dataset.label;
                  const value = context.parsed.y;
                  return `${datasetLabel}: ${value}% market position`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Market Position (%)',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Time Period',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
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
    if (trailEnabled) {
      // Clear existing trails when disabling
      setTrailElements([]);
      trailRef.current = [];
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const toggleStatsControl = () => {
    setShowStatsControl(!showStatsControl);
  };

  // Save stats to localStorage
  const saveStatsToStorage = (statsConfig) => {
    try {
      localStorage.setItem('dashboardStatsConfig', JSON.stringify(statsConfig));
    } catch (error) {
      console.warn('Failed to save stats to localStorage:', error);
    }
  };

  const toggleStat = (category, statKey) => {
    const newStats = {
      ...visibleStats,
      [category]: {
        ...visibleStats[category],
        [statKey]: !visibleStats[category][statKey]
      }
    };
    setVisibleStats(newStats);
    saveStatsToStorage(newStats);
  };

  const resetAllStats = () => {
    const resetStats = {
      supply: {
        globalLosses: true,
        foodWaste: true,
        produceWaste: true,
        emergencyCosts: true,
        inventoryAccuracy: true
      },
      cashFlow: {
        cashReserves: true,
        operatingCosts: true,
        gutBasedOrdering: true,
        latePayments: true,
        surplusInventory: true
      },
      competitive: {
        stockoutReduction: true,
        reactivePlanning: true,
        negativePerception: true,
        badDebt: true
      },
      keyImpact: {
        globalLosses: true,
        cashReserves: true,
        reactivePlanning: true,
        foodWaste: true
      }
    };
    setVisibleStats(resetStats);
    saveStatsToStorage(resetStats);
  };

  const clearStatsStorage = () => {
    try {
      localStorage.removeItem('dashboardStatsConfig');
      const defaultStats = loadStatsFromStorage();
      setVisibleStats(defaultStats);
    } catch (error) {
      console.warn('Failed to clear stats from localStorage:', error);
    }
  };

  return (
    <div className="main-dashboard">
      <button 
        className={`stats-control-toggle ${showStatsControl ? 'active' : ''}`}
        onClick={toggleStatsControl}
      >
        📊 Stats Control
      </button>
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
            left: trail.x - 6,
            top: trail.y - 6,
            opacity: trail.opacity,
            transform: `scale(${trail.scale})`,
          }}
        />
      ))}
      <div className="container">
        <div className="header">
          <h1>PredictLink - Supply Chain Intelligence</h1>
          <p>AI-powered demand forecasting platform transforming reactive inventory management into predictive supply planning for grocery and produce suppliers</p>
        </div>

        <div className="stats-grid">
          {/* Supply Inefficiencies Section */}
          <div className="stat-card supply-inefficiencies">
            <h3>Supply Inefficiencies</h3>
            <div className="chart-container">
              <canvas ref={supplyChartRef}></canvas>
            </div>
            <ul className="stat-list">
              {visibleStats.supply.globalLosses && (
                <li>
                  <span className="stat-description">Global losses from stockouts & overstocks (2023)</span>
                  <span className="stat-value">$1.8T</span>
                </li>
              )}
              {visibleStats.supply.foodWaste && (
                <li>
                  <span className="stat-description">U.S. food supply wasted annually</span>
                  <span className="stat-value">31%</span>
                </li>
              )}
              {visibleStats.supply.produceWaste && (
                <li>
                  <span className="stat-description">Produce share of U.S. food waste</span>
                  <span className="stat-value">43.7%</span>
                </li>
              )}
              {visibleStats.supply.emergencyCosts && (
                <li>
                  <span className="stat-description">Cost increase from emergency deliveries</span>
                  <span className="stat-value">30%</span>
                </li>
              )}
              {visibleStats.supply.inventoryAccuracy && (
                <li>
                  <span className="stat-description">Brands with inventory accuracy &lt;80%</span>
                  <span className="stat-value">58%</span>
                </li>
              )}
            </ul>
          </div>

          {/* Cash Flow Constraints Section */}
          <div className="stat-card cash-flow">
            <h3>Cash Flow Constraints</h3>
            <div className="chart-container">
              <canvas ref={cashFlowChartRef}></canvas>
            </div>
            <ul className="stat-list">
              {visibleStats.cashFlow.cashReserves && (
                <li>
                  <span className="stat-description">SMBs with &lt;4 months cash reserves</span>
                  <span className="stat-value">70%</span>
                </li>
              )}
              {visibleStats.cashFlow.operatingCosts && (
                <li>
                  <span className="stat-description">Revenue absorbed by operating costs</span>
                  <span className="stat-value">90%</span>
                </li>
              )}
              {visibleStats.cashFlow.gutBasedOrdering && (
                <li>
                  <span className="stat-description">SMBs using gut-based ordering</span>
                  <span className="stat-value">50%+</span>
                </li>
              )}
              {visibleStats.cashFlow.latePayments && (
                <li>
                  <span className="stat-description">B2B invoices paid late (2024-2025)</span>
                  <span className="stat-value">50%</span>
                </li>
              )}
              {visibleStats.cashFlow.surplusInventory && (
                <li>
                  <span className="stat-description">Surplus inventory value (2023)</span>
                  <span className="stat-value">$108B</span>
                </li>
              )}
            </ul>
          </div>

          {/* Competitive Disadvantage Section */}
          <div className="stat-card competitive">
            <h3>Competitive Disadvantage</h3>
            <div className="chart-container">
              <canvas ref={competitiveChartRef}></canvas>
            </div>
            <ul className="stat-list">
              {visibleStats.competitive.stockoutReduction && (
                <li>
                  <span className="stat-description">Stockout reduction with automation</span>
                  <span className="stat-value">40%</span>
                </li>
              )}
              {visibleStats.competitive.reactivePlanning && (
                <li>
                  <span className="stat-description">Suppliers dependent on reactive planning</span>
                  <span className="stat-value">60%+</span>
                </li>
              )}
              {visibleStats.competitive.negativePerception && (
                <li>
                  <span className="stat-description">Consumers with negative stockout perception</span>
                  <span className="stat-value">65%</span>
                </li>
              )}
              {visibleStats.competitive.badDebt && (
                <li>
                  <span className="stat-description">Bad debt affecting credit sales</span>
                  <span className="stat-value">8%</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="summary-section">
          <h2>Key Impact Summary</h2>
          <div className="key-insights">
            {visibleStats.keyImpact.globalLosses && (
              <div className="insight-card">
                <div className="insight-number">$1.8T</div>
                <div className="insight-text">Global losses from supply inefficiencies</div>
              </div>
            )}
            {visibleStats.keyImpact.cashReserves && (
              <div className="insight-card">
                <div className="insight-number">70%</div>
                <div className="insight-text">SMBs with insufficient cash reserves</div>
              </div>
            )}
            {visibleStats.keyImpact.reactivePlanning && (
              <div className="insight-card">
                <div className="insight-number">60%+</div>
                <div className="insight-text">Suppliers using reactive planning</div>
              </div>
            )}
            {visibleStats.keyImpact.foodWaste && (
              <div className="insight-card">
                <div className="insight-number">31%</div>
                <div className="insight-text">U.S. food supply wasted annually</div>
              </div>
            )}
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

      {/* Stats Control Panel */}
      {showStatsControl && (
        <div className="stats-control-panel">
          <div className="stats-control-header">
            <h3>📊 Customize Statistics Display</h3>
            <button className="close-stats-control" onClick={toggleStatsControl}>×</button>
          </div>
          
          <div className="stats-categories">
            {/* Supply Inefficiencies */}
            <div className="stats-category">
              <h4>Supply Inefficiencies</h4>
              <div className="stats-checkboxes">
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.supply.globalLosses}
                    onChange={() => toggleStat('supply', 'globalLosses')}
                  />
                  Global losses ($1.8T)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.supply.foodWaste}
                    onChange={() => toggleStat('supply', 'foodWaste')}
                  />
                  U.S. food waste (31%)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.supply.produceWaste}
                    onChange={() => toggleStat('supply', 'produceWaste')}
                  />
                  Produce waste (43.7%)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.supply.emergencyCosts}
                    onChange={() => toggleStat('supply', 'emergencyCosts')}
                  />
                  Emergency costs (30%)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.supply.inventoryAccuracy}
                    onChange={() => toggleStat('supply', 'inventoryAccuracy')}
                  />
                  Inventory accuracy (58%)
                </label>
              </div>
            </div>

            {/* Cash Flow Constraints */}
            <div className="stats-category">
              <h4>Cash Flow Constraints</h4>
              <div className="stats-checkboxes">
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.cashFlow.cashReserves}
                    onChange={() => toggleStat('cashFlow', 'cashReserves')}
                  />
                  Cash reserves &lt;4 months (70%)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.cashFlow.operatingCosts}
                    onChange={() => toggleStat('cashFlow', 'operatingCosts')}
                  />
                  Operating costs (90%)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.cashFlow.gutBasedOrdering}
                    onChange={() => toggleStat('cashFlow', 'gutBasedOrdering')}
                  />
                  Gut-based ordering (50%+)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.cashFlow.latePayments}
                    onChange={() => toggleStat('cashFlow', 'latePayments')}
                  />
                  Late payments (50%)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.cashFlow.surplusInventory}
                    onChange={() => toggleStat('cashFlow', 'surplusInventory')}
                  />
                  Surplus inventory ($108B)
                </label>
              </div>
            </div>

            {/* Competitive Disadvantage */}
            <div className="stats-category">
              <h4>Competitive Disadvantage</h4>
              <div className="stats-checkboxes">
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.competitive.stockoutReduction}
                    onChange={() => toggleStat('competitive', 'stockoutReduction')}
                  />
                  Stockout reduction (40%)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.competitive.reactivePlanning}
                    onChange={() => toggleStat('competitive', 'reactivePlanning')}
                  />
                  Reactive planning (60%+)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.competitive.negativePerception}
                    onChange={() => toggleStat('competitive', 'negativePerception')}
                  />
                  Negative perception (65%)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.competitive.badDebt}
                    onChange={() => toggleStat('competitive', 'badDebt')}
                  />
                  Bad debt (8%)
                </label>
              </div>
            </div>

            {/* Key Impact Summary */}
            <div className="stats-category">
              <h4>Key Impact Summary</h4>
              <div className="stats-checkboxes">
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.keyImpact.globalLosses}
                    onChange={() => toggleStat('keyImpact', 'globalLosses')}
                  />
                  Global losses ($1.8T)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.keyImpact.cashReserves}
                    onChange={() => toggleStat('keyImpact', 'cashReserves')}
                  />
                  Cash reserves (70%)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.keyImpact.reactivePlanning}
                    onChange={() => toggleStat('keyImpact', 'reactivePlanning')}
                  />
                  Reactive planning (60%+)
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={visibleStats.keyImpact.foodWaste}
                    onChange={() => toggleStat('keyImpact', 'foodWaste')}
                  />
                  Food waste (31%)
                </label>
              </div>
            </div>
          </div>

          <div className="stats-control-actions">
            <button className="reset-stats-btn" onClick={resetAllStats}>
              Reset All
            </button>
            <button className="clear-storage-btn" onClick={clearStatsStorage}>
              Clear Storage
            </button>
          </div>
        </div>
      )}

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
