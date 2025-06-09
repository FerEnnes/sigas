import React from 'react';
import './SupplierDetails.css';

function UsuarioDetails({ usuario, onClose }) {

    console.log('Usuário recebido:', usuario);

  if (!usuario) return null;

  const handleEdit = () => {
    const query = new URLSearchParams({
      id: usuario.id,
      edit: 'true',
    }).toString();
    window.location.href = `/usuarios/cadastrar?${query}`;
  };

  return (
    <div className="details-panel">
      <div className="details-header">
        <h2>{usuario.first_name}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <hr />
      <h4>Dados do usuário</h4>

      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Telefone:</strong> {usuario.telefone}</p>
      <p><strong>CPF:</strong> {usuario.cpf}</p>

      <p><strong>Endereço:</strong></p>
      <p>
        Rua {usuario.rua || usuario.logradouro}, {usuario.numero} - {usuario.bairro}<br />
        {usuario.cidade} - {usuario.estado}<br />
        {usuario.cep}
      </p>

      <button className="edit-button" onClick={handleEdit}>
        ✏️ Editar
      </button>
    </div>
  );
}

export default UsuarioDetails;
