import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { DataProvider } from './context/DataContext';
import MainDashboard from './pages/MainDashboard';
import ClientDashboard from './pages/ClientDashboard';
import PredictivePage from './pages/PredictivePage';

// Component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/predictive" element={<PredictivePage />} />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
