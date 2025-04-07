import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import UsuarioList from '../components/UsuarioList';
import UsuarioForm from '../components/UsuarioForm';
import './UsuarioPage.css'; // Reutiliza estilo do SupplierForm

function UsuarioListPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (user) => {
    setSelectedUser(user);       
    setShowForm(true);          
  };

  const handleAdd = () => {
    setSelectedUser(null);    
    setShowForm(true);
  };

  return (
    <div className="app">
      <Helmet>
        <title>Usuários | SaaS Agro</title>
        <meta
          name="description"
          content="Gerencie os usuários da plataforma SaaS Agro: cadastre, edite ou visualize informações."
        />
      </Helmet>

      {/* Sidebar lateral padrão */}
      <Sidebar />

      {/* Lista de usuários */}
      <div className="main-content">
        <UsuarioList onEdit={handleEdit} onAdd={handleAdd} />
      </div>

      {/* Sidebar lateral de formulário */}
      {showForm && (
        <div className="form-sidebar">
          <button className="close-button" onClick={() => setShowForm(false)}>×</button>
          <h3>{selectedUser ? 'Editar usuário' : 'Cadastrar usuário'}</h3>
          <UsuarioForm user={selectedUser} />
        </div>
      )}
    </div>
  );
}

export default UsuarioListPage;
