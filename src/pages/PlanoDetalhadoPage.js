import React from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';

function PlanoDetalhadoPage() {
  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <Helmet>
        <title>Plano de Contas Detalhado | SaaS Agro</title>
        <meta
          name="description"
          content="Visualize e organize seu plano de contas detalhado com categorias e subcategorias agrícolas."
        />
      </Helmet>

      <Sidebar />
      <div style={{ flex: 1, padding: '24px' }}>
        <h2>Plano de Contas Detalhado</h2>
        <p>Esta página está em construção.</p>
      </div>
    </div>
  );
}

export default PlanoDetalhadoPage;

