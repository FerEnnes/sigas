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
      // aceita axios (res.data) e retorno direto (res)
      const list = Array.isArray(res?.data) ? res.data : res;
      setProperties(list || []);
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
    }
  };

  // aceita id OU o objeto completo
  const handleViewProperty = async (idOrObj) => {
    try {
      if (typeof idOrObj === 'object' && idOrObj !== null) {
        setSelectedProperty(idOrObj);
        return;
      }
      const id = idOrObj;
      if (!id) return;

      const res = await getProperty(id);
      const prop = res?.data ?? res;
      setSelectedProperty(prop);
    } catch (err) {
      console.error('Erro ao buscar propriedade completa:', err);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div className="property-list">
        <div className="list-header">
          <h3>Lista de propriedades</h3>
          <button className="add-button" onClick={() => setShowForm(true)} type="button">
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
            {properties.map((p, index) => {
              // 🔽 fallbacks para conviver com mock e backend
              const id = p.id ?? p.idpropriedade ?? index;
              const nome = p.nome ?? p.descricao ?? '';
              const cidade = p.cidade ?? '';

              return (
                <tr key={id}>
                  <td>{nome}</td>
                  <td>{cidade}</td>
                  <td>
                    <button
                      type="button"
                      className="chip"
                      onClick={() => handleViewProperty(p.id ?? p.idpropriedade ?? p)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}          // tem .nome, .cidade, .endereco, etc.
          onClose={() => setSelectedProperty(null)}
          onEdit={(prop) => {
            const query = new URLSearchParams({ ...prop, edit: 'true' }).toString();
            window.location.href = `/propriedades/cadastrar?${query}`;
          }}
        />
      )}

      {showForm && (
        <div className="form-sidebar">
          <button className="close-button" onClick={() => setShowForm(false)} type="button">×</button>
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

