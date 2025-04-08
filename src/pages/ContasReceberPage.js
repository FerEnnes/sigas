import React from 'react';
import Sidebar from '../components/Sidebar';

function ContasReceberPage() {
  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ padding: '24px' }}>
        <h2>Contas a Receber</h2>
        <p>Lista de contas a receber aqui...</p>
      </div>
    </div>
  );
}

export default ContasReceberPage;
