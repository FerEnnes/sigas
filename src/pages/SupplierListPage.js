import React from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import SupplierList from '../components/SupplierList';

function SupplierListPage() {
  return (
    <div className="app">
      <Helmet>
        <title>Fornecedores | SIGAS</title>
        <meta name="description" content="Visualize, adicione e gerencie a lista de fornecedores cadastrados no sistema." />
      </Helmet>

      <Sidebar />
      <div className="main-content">
        <SupplierList />
      </div>
    </div>
  );
}

export default SupplierListPage;
