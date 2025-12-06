import React from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import UsuarioForm from '../components/UsuarioForm';

function UsuarioFormPage() {
  const search = window.location.search;
  const isEdit = search.includes('edit=true');

  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <Helmet>
        <title>{isEdit ? 'Editar Usuário' : 'Cadastrar Usuário'} | SaaS Agro</title>
        <meta
          name="description"
          content="Gerencie usuários do sistema SaaS Agro: adicione ou edite dados de acesso e perfil."
        />
      </Helmet>

      <Sidebar />

      <UsuarioForm />
    </div>
  );
}

export default UsuarioFormPage;

