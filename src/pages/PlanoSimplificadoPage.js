import React from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';

function PlanoSimplificadoPage() {
  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <Helmet>
        <title>Plano de Contas Simplificado | SaaS Agro</title>
        <meta
          name="description"
          content="Visualize e gerencie seu plano de contas simplificado para controle agrícola."
        />
      </Helmet>

      <Sidebar />
      <div style={{ flex: 1, padding: '24px' }}>
        <h2>Plano de Contas Simplificado</h2>
        <p>Esta página está em construção.</p>
      </div>
    </div>
  );
}

export default PlanoSimplificadoPage;

