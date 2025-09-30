import React from 'react';
import { ArrowLeft, Brain } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-text">
            <h1>Singh Union Enterprises</h1>
            <p>AI-Powered Supply Chain Management Dashboard</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => window.open('predictive_supply_chain.html', '_blank')}
            >
              <Brain size={16} />
              How It Works
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => window.open('grocery_supply_chain_dashboard.html', '_blank')}
            >
              <ArrowLeft size={16} />
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

