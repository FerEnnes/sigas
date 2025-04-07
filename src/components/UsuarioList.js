import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SupplierList.css';
import UsuarioForm from './UsuarioForm';

function UsuarioList() {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      tipoUsuario: 1,
      telefone: '(11) 99999-0000',
      ativo: true,
      cpf: '123.456.789-00',
      rua: 'Rua das Flores',
      numero: '100',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000',
      complemento: ''
    },
    {
      id: 2,
      nome: 'João Souza',
      email: 'joao@email.com',
      tipoUsuario: 2,
      telefone: '(11) 91234-5678',
      ativo: false,
      cpf: '987.654.321-00',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      complemento: ''
    }
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleInativar = (id) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ativo: false } : u))
    );
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
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.telefone}</td>
                <td>{user.tipoUsuario === 1 ? 'Admin' : 'Comum'}</td>
                <td style={{ color: user.ativo ? 'green' : 'gray' }}>
                  {user.ativo ? 'Ativo' : 'Inativo'}
                </td>
                <td>
                  <button onClick={() => setSelectedUser(user)}>Ver</button>
                  <button
                    onClick={() => {
                      const query = new URLSearchParams({ ...user, edit: 'true' }).toString();
                      navigate(`/usuarios/cadastrar?${query}`);
                    }}
                  >
                    Editar
                  </button>
                  {user.ativo && (
                    <button onClick={() => handleInativar(user.id)}>
                      Inativar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sidebar de visualização com estilo refinado */}
      {selectedUser && (
        <div className="form-sidebar usuario-details">
          <button className="close-button" onClick={() => setSelectedUser(null)}>×</button>
          <h3>{selectedUser.nome}</h3>
          <hr />
          <h4>Detalhes do usuário</h4>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Telefone:</strong> {selectedUser.telefone}</p>
          <p><strong>Tipo:</strong> {selectedUser.tipoUsuario === 1 ? 'Administrador' : 'Comum'}</p>
          <p><strong>Status:</strong> {selectedUser.ativo ? 'Ativo' : 'Inativo'}</p>
          <p><strong>CPF:</strong> {selectedUser.cpf}</p>
          <p><strong>Endereço:</strong> {selectedUser.rua}, {selectedUser.numero} - {selectedUser.bairro}, {selectedUser.cidade} - {selectedUser.estado} - {selectedUser.cep}</p>
          <button
            onClick={() => {
              const query = new URLSearchParams({ ...selectedUser, edit: 'true' }).toString();
              navigate(`/usuarios/cadastrar?${query}`);
            }}
            className="add-button"
            style={{ marginTop: 10 }}
          >
            ✏️ Editar
          </button>
        </div>
      )}

      {/* Sidebar do formulário */}
      {showForm && (
        <div className="form-sidebar">
          <button className="close-button" onClick={() => setShowForm(false)}>×</button>
          <h3>Cadastrar usuário</h3>
          <UsuarioForm />
        </div>
      )}
    </div>
  );
}

export default UsuarioList;





