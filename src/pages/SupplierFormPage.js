import React from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import SupplierForm from '../components/SupplierForm';

function SupplierFormPage() {
  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <Helmet>
        <title>Editar ou Cadastrar Fornecedor | SaaS Agro</title>
        <meta
          name="description"
          content="Adicione ou edite informações dos fornecedores da sua plataforma agrícola."
        />
      </Helmet>

      <Sidebar />
      <SupplierForm />
    </div>
  );
}

export default SupplierFormPage;







