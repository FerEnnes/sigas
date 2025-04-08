import React from 'react';
import './SupplierDetails.css'; 

// [BACKEND] GET: Os dados deste cliente deverão ser buscados via ID no Django futuramente
function ClienteDetails({ client, onClose, onEdit }) {
  return (
    <div className="details-panel">
      <div className="details-header">
        <h2>{client.name}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <hr />
      <h4>Dados do cliente</h4>

      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Telefone:</strong> {client.telefone}</p>
      <p><strong>CPF/CNPJ:</strong> {client.cpf}</p>

      <p><strong>Endereço:</strong></p>
      <p>
        Rua {client.rua}, {client.numero} - {client.bairro}<br />
        {client.cidade} - {client.estado}<br />
        {client.cep}
      </p>

      <button className="edit-button" onClick={() => onEdit(client)}>
        ✏️ Editar
      </button>
    </div>
  );
}

export default ClienteDetails;


