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
      // aceita axios (res.data) e retorno direto (res)
      const list = Array.isArray(res?.data) ? res.data : res;
      setSuppliers(list || []);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    }
  };

  // aceita id OU o objeto completo
  const handleViewSupplier = async (idOrObj) => {
    try {
      if (typeof idOrObj === 'object' && idOrObj !== null) {
        setSelectedSupplier(idOrObj);
        return;
      }
      const id = idOrObj;
      if (!id) return;

      const res = await getSupplier(id);
      const supplier = res?.data ?? res;
      setSelectedSupplier(supplier);
    } catch (err) {
      console.error('Erro ao buscar fornecedor completo:', err);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div className="supplier-list">
        <div className="list-header">
          <h3>Lista de fornecedores</h3>
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
            {suppliers.map((s, index) => {
              // fallbacks para conviver com mock e backend
              const id = s.id ?? s.idfornecedor ?? index;
              const nome = s.nome ?? s.nome_completo ?? s.razao_social ?? '';

              return (
                <tr key={id}>
                  <td>{nome}</td>
                  <td>{s.email}</td>
                  <td>{s.cpf_cnpj ?? s.cpf ?? s.cnpj ?? ''}</td>
                  <td>
                    <button
                      type="button"
                      className="chip"
                      onClick={() => handleViewSupplier(s.id ?? s.idfornecedor ?? s)}
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
          <button className="close-button" onClick={() => setShowForm(false)} type="button">×</button>
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
