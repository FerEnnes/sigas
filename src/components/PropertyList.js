import React, { useState, useEffect } from 'react';
import './PropertyList.css';
import PropertyDetails from './PropertyDetails';
import PropertyForm from './PropertyForm';
import { getProperties, getProperty } from '../services/propriedadeService';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await getProperties();
      setProperties(res.data);
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
    }
  };

  const handleViewProperty = async (idpropriedade) => {
  try {
    const res = await getProperty(idpropriedade);
    setSelectedProperty(res.data);
  } catch (err) {
    console.error('Erro ao buscar propriedade completa:', err);
  }
};

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
                <td>{p.descricao}</td>
                <td>{p.cidade}</td>
                <td>
                  <button onClick={() => handleViewProperty(p.idpropriedade)}>Ver</button>
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
          <PropertyForm
            onSaveSuccess={() => {
              setShowForm(false);
              fetchProperties();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default PropertyList;
