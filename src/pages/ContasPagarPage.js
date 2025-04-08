import React from 'react';
import Sidebar from '../components/Sidebar';

function ContasPagarPage() {
  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ padding: '24px' }}>
        <h2>Contas a Pagar</h2>
        <p>Lista de contas a pagar aqui...</p>
      </div>
    </div>
  );
}

export default ContasPagarPage;
