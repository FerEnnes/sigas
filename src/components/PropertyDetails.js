import React from 'react';
import './SupplierDetails.css'; 

function PropertyDetails({ property, onClose }) {
  const handleEdit = () => {
    const query = new URLSearchParams({
      idpropriedade: property.idpropriedade,
      edit: 'true',
    }).toString();
    window.location.href = `/propriedades/cadastrar?${query}`;
  };

  return (
    <div className="details-panel">
      <div className="details-header">
        <h2>{property.descricao}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <hr />
      <h4>Dados da propriedade</h4>

      <p><strong>Telefone:</strong> {property.telefone}</p>

      <p><strong>Endereço:</strong></p>
      <p>
        Rua {property.rua ||property.logradouro}, {property.numero}
        {property.complemento && ` - ${property.complemento}`}<br />
        {property.bairro && `${property.bairro} - `}
        {property.cidade} - {property.estado}<br />
        {property.cep}
      </p>

      <button className="edit-button" onClick={handleEdit}>
        ✏️ Editar
      </button>
    </div>
  );
}

export default PropertyDetails;