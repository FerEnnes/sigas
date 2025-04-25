// src/pages/ContasResumoPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function ContasResumoPage() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <Sidebar />
      <div style={{ padding: 30 }}>
        <h2>Resumo de Contas</h2>

        <p style={{ marginTop: 20, marginBottom: 10 }}>Escolha uma visualização:</p>

        <div style={{ display: 'flex', gap: 16 }}>
          <button
            onClick={() => navigate('/contas/pagar')}
            style={{ padding: '10px 20px', backgroundColor: '#e76f51', color: '#fff', border: 'none', borderRadius: 4 }}
          >
            Contas a Pagar
          </button>

          <button
            onClick={() => navigate('/contas/receber')}
            style={{ padding: '10px 20px', backgroundColor: '#2a9d8f', color: '#fff', border: 'none', borderRadius: 4 }}
          >
            Contas a Receber
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContasResumoPage;
