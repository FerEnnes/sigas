import React from 'react';
import './SupplierDetails.css';

function ClienteDetails({ client, onClose }) {
  const handleEdit = () => {
    const query = new URLSearchParams({
      idcliente: client.idcliente,
      edit: 'true',
    }).toString();
    window.location.href = `/clientes/cadastrar?${query}`;
  };

  return (
    <div className="details-panel">
      <div className="details-header">
        <h2>{client.nome}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <hr />
      <h4>Dados do cliente</h4>

      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Telefone:</strong> {client.telefone}</p>
      <p><strong>CPF/CNPJ:</strong> {client.cpf_cnpj}</p>

      <p><strong>Endereço:</strong></p>
      <p>
        Rua {client.rua || client.logradouro}, {client.numero} - {client.bairro}<br />
        {client.cidade} - {client.estado}<br />
        {client.cep}
      </p>

      <button className="edit-button" onClick={handleEdit}>
        ✏️ Editar
      </button>
    </div>
  );
}

export default ClienteDetails;
