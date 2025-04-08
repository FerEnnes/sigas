import React from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import ClienteForm from '../components/ClienteForm';

function ClienteFormPage() {
  const search = window.location.search;
  const isEdit = search.includes('edit=true');

  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <Helmet>
        <title>{isEdit ? 'Editar Cliente' : 'Cadastrar Cliente'} | SaaS Agro</title>
        <meta name="description" content="Adicione ou edite informações de clientes." />
      </Helmet>

      <Sidebar />
      <ClienteForm />
    </div>
  );
}

export default ClienteFormPage;


