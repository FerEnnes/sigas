import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, getUser, inactivateUser, activateUser } from '../services/usuarioService';
import UsuarioDetails from './UsuarioDetails';
import './SupplierList.css';
import UsuarioForm from './UsuarioForm';
import { toast } from 'react-toastify';

function UsuarioList() {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
     fetchUsuarios();
   }, []);
 
  const fetchUsuarios = async () => {
    try {
      const res = await getUsers();
      setUsuarios(res.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };
  
  const handleViewUser = async (id) => {
    try {
      const res = await getUser(id);
      setSelectedUser(res.data);
    } catch (err) {
      console.error('Erro ao buscar usuário completo:', err);
    }
  };
  
  const handleInativar = async (id) => {
    try {
      await inactivateUser(id);
      toast.success('Usuário inativado com sucesso');
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao inativar usuário', error);
      if (error.response) {
        console.error('🛑 Erro do backend:', error.response.data);
        toast.error('Erro ao inativar usuário');
      }
    }
  };

  const handleAtivar = async (id) => {
    try {
      await activateUser(id);
      toast.success('Usuário ativado com sucesso');
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao ativar usuário', error);
      if (error.response) {
        console.error('🛑 Erro do backend:', error.response.data);
        toast.error('Erro ao ativar usuário');
      }
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div className="supplier-list">
        <div className="list-header">
          <h3>Usuários</h3>
          <button className="add-button" onClick={() => setShowForm(true)}>
            + Cadastrar usuário
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Sobrenome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id}>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.telefone}</td>
                <td>{parseInt(user.tipousuario) === 1 ? 'Admin' : 'Comum'}</td>
                <td style={{ color: user.is_active ? 'green' : 'gray' }}>
                  {user.is_active ? 'Ativo' : 'Inativo'}
                </td>
                <td>
                  <button onClick={() => handleViewUser(user.id)}>Ver</button>
                  {user.is_active ? (
                    <button onClick={() => handleInativar(user.id)}>Inativar</button>
                  ) : (
                    <button onClick={() => handleAtivar(user.id)}>Ativar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UsuarioDetails
          usuario={selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={(user) => {
            const query = new URLSearchParams({ ...user, edit: 'true' }).toString();
            window.location.href = `/usuarios/cadastrar?${query}`;
          }}
        />
      )}

      {showForm && (
        <div className="form-sidebar">
          <button className="close-button" onClick={() => setShowForm(false)}>×</button>
          <h3>Cadastrar usuário</h3>
          <UsuarioForm
            onSaveSuccess={() => {
              setShowForm(false);
              fetchUsuarios();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default UsuarioList;
