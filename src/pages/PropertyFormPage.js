import React from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import PropertyForm from '../components/PropertyForm';

// [BACKEND] Página de formulário de propriedade para criação ou edição via query param
function PropertyFormPage() {
  const search = window.location.search;
  const isEdit = search.includes('edit=true');

  if (!isEdit) return null;

  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <Helmet>
        <title>Editar Propriedade | SaaS Agro</title>
        <meta name="description" content="Atualize os dados da propriedade cadastrada no sistema SaaS Agro." />
      </Helmet>

      <Sidebar />
      <PropertyForm />
    </div>
  );
}

export default PropertyFormPage;


