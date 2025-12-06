import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import UsuarioList from '../components/UsuarioList';
import UsuarioForm from '../components/UsuarioForm';
import './UsuarioPage.css';

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
        <title>Usuários | SIGAS</title>
        <meta
          name="description"
          content="Gerencie os usuários da plataforma SIGAS: cadastre, edite ou visualize informações."
        />
      </Helmet>

      <Sidebar />

      <div className="main-content">
        <UsuarioList onEdit={handleEdit} onAdd={handleAdd} />
      </div>

      {showForm && (
        <div className="form-sidebar">
          <button
            className="close-button"
            onClick={() => setShowForm(false)}
            type="button"
          >
            ×
          </button>
          <h3>{selectedUser ? 'Editar usuário' : 'Cadastrar usuário'}</h3>
          <UsuarioForm
            user={selectedUser}
            onSaveSuccess={() => {
              setShowForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default UsuarioListPage;
