import React from 'react';
import './SupplierDetails.css'; 

function PropertyDetails({ property, onClose, onEdit }) {
  return (
    <div className="details-panel">
      <div className="details-header">
        <h2>{property.name}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <hr />
      <h4>Dados da propriedade</h4>

      <p><strong>Email:</strong> {property.email}</p>
      <p><strong>CPF/CNPJ:</strong> {property.cpf}</p>
      <p><strong>Telefone:</strong> {property.telefone}</p>

      <p><strong>Endereço:</strong></p>
      <p>
        Rua {property.rua}, {property.numero}
        {property.complemento && ` - ${property.complemento}`}<br />
        {property.bairro && `${property.bairro} - `}
        {property.cidade} - {property.estado}<br />
        {property.cep}
      </p>

      <button className="edit-button" onClick={() => onEdit(property)}>✏️ Editar</button>
    </div>
  );
}

export default PropertyDetails;



