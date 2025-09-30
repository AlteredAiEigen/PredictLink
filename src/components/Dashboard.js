import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Header from './Header';
import StatsCards from './StatsCards';
import ClientChart from './ClientChart';
import ClientList from './ClientList';
import ProductPredictions from './ProductPredictions';
import Alerts from './Alerts';
import ClientModal from './ClientModal';
import ProductsModal from './ProductsModal';
import './Dashboard.css';

const Dashboard = () => {
  const { data } = useData();
  const [selectedClient, setSelectedClient] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);

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

  return (
    <div className="dashboard">
      <Header />
      
      <div className="container">
        <StatsCards 
          data={data.company} 
          onProductsClick={handleProductsClick}
        />
        
        <div className="dashboard-grid">
          <div className="dashboard-section">
            <ClientChart data={data.chartData} />
          </div>
          
          <div className="dashboard-section">
            <ClientList 
              clients={data.clients} 
              onClientClick={handleClientClick}
            />
          </div>
        </div>
        
        <ProductPredictions products={data.products} />
        
        <Alerts alerts={data.alerts} />
      </div>

      {selectedClient && (
        <ClientModal
          clientName={selectedClient}
          clientData={data.clients[selectedClient]}
          onClose={handleCloseClientModal}
        />
      )}

      {showProductsModal && (
        <ProductsModal
          products={data.products}
          onClose={handleCloseProductsModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
