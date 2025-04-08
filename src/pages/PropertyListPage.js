import React from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import PropertyList from '../components/PropertyList';

// [BACKEND] Página de listagem de propriedades — integrará com API Django
function PropertyListPage() {
  return (
    <div className="app">
      <Helmet>
        <title>Propriedades | SaaS Agro</title>
        <meta name="description" content="Gerencie todas as propriedades cadastradas no sistema SaaS Agro." />
      </Helmet>

      <Sidebar />
      <div className="main-content">
        <PropertyList />
      </div>
    </div>
  );
}

export default PropertyListPage;

