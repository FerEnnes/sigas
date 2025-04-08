import React from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';

function PlanoContasPage() {
  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <Helmet>
        <title>Plano de Contas | SaaS Agro</title>
        <meta
          name="description"
          content="Visualize ou cadastre categorias do plano de contas da sua operação agrícola."
        />
      </Helmet>

      <Sidebar />

      <div style={{ flex: 1, padding: '30px' }}>
        <h2 style={{ marginBottom: '16px' }}>Plano de Contas</h2>

        {/* 🔗 Backend: aqui será listado o plano de contas */}
        <p style={{ fontSize: '15px', color: '#555' }}>
          Em breve você poderá criar, editar e organizar suas categorias financeiras.
        </p>
      </div>
    </div>
  );
}

export default PlanoContasPage;
