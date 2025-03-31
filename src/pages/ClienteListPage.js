import React from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import ClienteList from '../components/ClienteList';

function ClienteListPage() {
  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <Helmet>
        <title>Clientes | SaaS Agro</title>
        <meta name="description" content="Gerencie seus clientes no SaaS Agro Light." />
      </Helmet>

      <Sidebar />
      <ClienteList />
    </div>
  );
}

export default ClienteListPage;
