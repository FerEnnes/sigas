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
      // aceita axios (res.data) e retorno direto (res)
      const list = Array.isArray(res?.data) ? res.data : res;
      setClients(list || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleViewClient = async (idOrClient) => {
    try {
      // aceita id OU o objeto inteiro
      if (typeof idOrClient === 'object' && idOrClient !== null) {
        setSelectedClient(idOrClient);
        return;
      }
      const id = idOrClient;
      if (!id) return;

      const res = await getClient(id);
      const client = res?.data ?? res;
      setSelectedClient(client);
    } catch (err) {
      console.error('Erro ao buscar cliente completo:', err);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div className="supplier-list">
        <div className="list-header">
          <h3>Lista de clientes</h3>
          <button className="add-button" onClick={() => setShowForm(true)} type="button">
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
            {clients.map((c, index) => {
              // 🔽 fallbacks para conviver com mock e backend
              const id = c.id ?? c.idcliente ?? index;
              const nome = c.nome ?? c.nome_completo ?? '';
              const cpfCnpj = c.cpf_cnpj ?? c.cpf ?? c.cnpj ?? '';

              return (
                <tr key={id}>
                  <td>{nome}</td>
                  <td>{c.email}</td>
                  <td>{cpfCnpj}</td>
                  <td>
                    <button
                      type="button"               // evita submit de forms
                      onClick={() => handleViewClient(c.id ?? c.idcliente ?? c)}
                      className="chip"
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
          <button className="close-button" onClick={() => setShowForm(false)} type="button">×</button>
          <h3>Cadastrar cliente</h3>
          <ClienteForm
            onSaveSuccess={() => {
              setShowForm(false);
              fetchClientes(); // recarrega a lista após salvar
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ClienteList;
