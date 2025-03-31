import React, { useState } from 'react';
import ClienteDetails from './ClienteDetails';
import ClienteForm from './ClienteForm';
import './SupplierList.css'; // mantido para reutilizar o estilo da lista

function ClienteList() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const clients = [
    {
      name: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '(11) 99999-0000',
      cpf: '123.456.789-00',
      rua: 'Rua das Flores',
      numero: '100',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000'
    }
  ];

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
              <tr key={index}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.cpf}</td>
                <td>
                  <button onClick={() => setSelectedClient(c)}>Ver</button>
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
          <ClienteForm />
        </div>
      )}
    </div>
  );
}

export default ClienteList;

