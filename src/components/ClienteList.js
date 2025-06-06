import React, { useState, useEffect } from 'react';
import { getClients, getClient } from '../services/clienteService';
import ClienteDetails from './ClienteDetails';
import ClienteForm from './ClienteForm';
import './SupplierList.css';

function ClienteList() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await getClients();
      setClients(res.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleViewClient = async (idcliente) => {
  try {
    const res = await getClient(idcliente);
    setSelectedClient(res.data);
  } catch (err) {
    console.error('Erro ao buscar cliente completo:', err);
  }
};

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div className="supplier-list">
        <div className="list-header">
          <h3>Lista de clientes</h3>
          <button className="add-button" onClick={() => setShowForm(true)}>
            + Adicionar
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF / CNPJ</th>
              <th>Endereço</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c, index) => (
              <tr key={c.idcliente || index}>
                <td>{c.nome}</td>
                <td>{c.email}</td>
                <td>{c.cpf_cnpj}</td>
                <td>
                  <button onClick={() => handleViewClient(c.idcliente)}>Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClient && (
        <ClienteDetails
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onEdit={(c) => {
            const query = new URLSearchParams({ ...c, edit: 'true' }).toString();
            window.location.href = `/clientes/cadastrar?${query}`;
          }}
        />
      )}

      {showForm && (
        <div className="form-sidebar">
          <button className="close-button" onClick={() => setShowForm(false)}>×</button>
          <h3>Cadastrar cliente</h3>
          <ClienteForm
            onSaveSuccess={() => {
              setShowForm(false);
              fetchClientes();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ClienteList;
