import React from 'react';
import './SupplierDetails.css';

function SupplierDetails({ supplier, onClose, onEdit }) {
  return (
    <div className="details-panel">
      <div className="details-header">
        <h2>{supplier.name}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <hr />
      <h4>Dados do fornecedor</h4>

      <p><strong>Email:</strong> {supplier.email}</p>
      <p><strong>Telefone:</strong> {supplier.telefone}</p>
      <p><strong>CPF/CNPJ:</strong> {supplier.cpf}</p>

      <p><strong>Endereço:</strong></p>
      <p>
        Rua {supplier.rua}, {supplier.numero} - {supplier.bairro}<br />
        {supplier.cidade} - {supplier.estado}<br />
        {supplier.cep}
      </p>

      <button className="edit-button" onClick={() => onEdit(supplier)}>
        ✏️ Editar
      </button>
    </div>
  );
}

export default SupplierDetails;
