import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SupplierList.css';
import SupplierDetails from './SupplierDetails';
import SupplierForm from './SupplierForm';

function SupplierList() {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const suppliers = [
    {
      name: 'John Deo',
      email: 'johndoe2211@gmail.com',
      telefone: '(49) 99999-0000',
      cpf: '111.111.111-11',
      rua: 'João Nestor',
      numero: '42',
      bairro: 'Lídia',
      cidade: 'Camboriú',
      estado: 'SC',
      cep: '883330-333',
    },
    {
      name: 'Shelby Goode',
      email: 'shelbygoode41@gmail.com',
      telefone: '(49) 99999-0000',
      cpf: '111.111.111-11',
      rua: 'Rua X',
      numero: '123',
      bairro: 'Centro',
      cidade: 'Florianópolis',
      estado: 'SC',
      cep: '88000-000',
    }
  ];

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div className="supplier-list">
        <div className="list-header">
          <h3>Lista de fornecedores</h3>
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
            {suppliers.map((s, index) => (
              <tr key={index}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.cpf}</td>
                <td>
                  <button onClick={() => setSelectedSupplier(s)}>Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSupplier && (
        <SupplierDetails
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
          onEdit={(s) => {
            const query = new URLSearchParams({ ...s, edit: 'true' }).toString();
            navigate(`/fornecedores/cadastrar?${query}`);
          }}
        />
      )}

      {showForm && (
        <div className="form-sidebar">
          <button className="close-button" onClick={() => setShowForm(false)}>×</button>
          <h3>Cadastrar fornecedores</h3>
          <SupplierForm />
        </div>
      )}
    </div>
  );
}

export default SupplierList;




