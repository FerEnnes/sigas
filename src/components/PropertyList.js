import React, { useState } from 'react';
import './PropertyList.css';
import PropertyDetails from './PropertyDetails';
import PropertyForm from './PropertyForm';

function PropertyList() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // [BACKEND] GET: Esta lista virá do backend via Django futuramente
  const properties = [
    {
      name: 'Fazenda Boa Vista',
      email: 'fazenda@example.com',
      cpf: '123.456.789-00',
      telefone: '(49) 99999-0000',
      rua: 'Estrada Rural',
      numero: '100',
      bairro: 'Zona Sul',
      cidade: 'Chapecó',
      estado: 'SC',
      cep: '89800-000',
      complemento: 'Sítio próximo ao rio'
    },
    {
      name: 'Sítio Alegria',
      email: 'fazenda@example.com',
      cpf: '123.456.789-00',
      telefone: '(49) 99999-0000',
      rua: 'Linha São João',
      numero: '75',
      bairro: 'Interior',
      cidade: 'Concórdia',
      estado: 'SC',
      cep: '89700-000',
      complemento: ''
    }
  ];

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div className="property-list">
        <div className="list-header">
          <h3>Lista de propriedades</h3>
          <button className="add-button" onClick={() => setShowForm(true)}>
            + Adicionar
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nome (descrição)</th>
              <th>Cidade</th>
              <th>Endereço</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p, index) => (
              <tr key={index}>
                <td>{p.name}</td>
                <td>{p.cidade}</td>
                <td>
                  <button onClick={() => setSelectedProperty(p)}>Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onEdit={(p) => {
            const query = new URLSearchParams({ ...p, edit: 'true' }).toString();
            window.location.href = `/propriedades/cadastrar?${query}`;
          }}
        />
      )}

      {showForm && (
        <div className="form-sidebar">
          <button className="close-button" onClick={() => setShowForm(false)}>×</button>
          <h3>Cadastrar propriedade</h3>
          <PropertyForm />
        </div>
      )}
    </div>
  );
}

export default PropertyList;
