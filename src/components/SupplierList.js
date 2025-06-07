import React, { useState, useEffect } from 'react';
import { getSuppliers, getSupplier } from '../services/fornecedorService';
import './SupplierList.css';
import SupplierDetails from './SupplierDetails';
import SupplierForm from './SupplierForm';

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await getSuppliers();
      setSuppliers(res.data);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    }
  };

  const handleViewSupplier = async (idfornecedor) => {
  try {
    const res = await getSupplier(idfornecedor);
    setSelectedSupplier(res.data);
  } catch (err) {
    console.error('Erro ao buscar fornecedor completo:', err);
  }
};

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
                <td>{s.nome}</td>
                <td>{s.email}</td>
                <td>{s.cpf_cnpj}</td>
                <td>
                  <button onClick={() => handleViewSupplier(s.idfornecedor)}>Ver</button>
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
            window.location.href = `/fornecedores/cadastrar?${query}`;
          }}
        />
      )}

      {showForm && (
        <div className="form-sidebar">
          <button className="close-button" onClick={() => setShowForm(false)}>×</button>
          <h3>Cadastrar fornecedor</h3>
          <SupplierForm
            onSaveSuccess={() => {
              setShowForm(false);
              fetchSuppliers();
            }}
          />
        </div>
      )}
    </div>
  );
}


export default SupplierList;
