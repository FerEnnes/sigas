import React from 'react';
import Sidebar from '../components/Sidebar';

function NotFoundPage() {
  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px'
      }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>🚫 Página não encontrada</h1>
        <p style={{ fontSize: 16, color: '#666', marginBottom: 24 }}>
          O caminho que você acessou não existe ou foi movido.
        </p>
        <a href="/fornecedores" style={{
          backgroundColor: '#6da972',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Voltar para Início
        </a>
      </div>
    </div>
  );
}

export default NotFoundPage;
