import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ContaForm from '../components/ContaForm';
import { toast } from 'react-toastify';
import './ContasPage.css';

function ContasPagarPage() {
  const [contas, setContas] = useState([
    {
      id: 1,
      descricao: 'Compra de sementes',
      valorParcela: 2000,
      parcelas: 1,
      total: 2000,
      vencimento: '2025-04-30',
      quitacao: '2025-04-30',
      status: 'Ativa',
      juros: 0,
      desconto: 0,
      fornecedor: 'Agropecuária do Sul',
      propriedade: 'Fazenda Verde',
      planoContas: 'Insumos'
    }
  ]);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);

  //  Criação ou edição local da conta
  const handleSalvarConta = (nova) => {
    if (nova.id) {
      setContas((prev) =>
        prev.map((c) => (c.id === nova.id ? nova : c))
      );
      toast.success('Conta atualizada!');
    } else {
      const novoId = Math.max(...contas.map(c => c.id)) + 1;
      setContas([...contas, { ...nova, id: novoId, status: 'Ativa' }]);
      toast.success('Conta criada!');
    }

    // BACKEND: POST /api/contas/pagar (nova)
    // BACKEND: PUT /api/contas/pagar/:id (editar)
  };

  // Simula inativação da conta
  const handleInativar = (id) => {
    setContas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Inativa' } : c))
    );

    //  BACKEND: PUT /api/contas/pagar/:id/inativar
    toast.success('Conta inativada!');
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="supplier-list">
        <div className="list-header">
          <h3>Lista de contas a pagar</h3>
          <button className="add-button" onClick={() => {
            setContaSelecionada(null);
            setMostrarForm(true);
          }}>
            + Nova conta
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor da parcela</th>
              <th>Nº de parcelas</th>
              <th>Total</th>
              <th>Data venc.</th>
              <th>Data quitação</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contas.map((conta) => (
              <tr key={conta.id}>
                <td>{conta.descricao}</td>
                <td>R$ {conta.valorParcela?.toFixed(2)}</td>
                <td>{conta.parcelas}</td>
                <td>R$ {conta.total?.toFixed(2)}</td>
                <td>{conta.vencimento}</td>
                <td>{conta.quitacao}</td>
                <td style={{ color: conta.status === 'Inativa' ? '#999' : '#333' }}>
                  {conta.status}
                </td>
                <td>
                  <button
                    className="acao"
                    onClick={() => {
                      setContaSelecionada(conta);
                      setMostrarForm(true);
                    }}
                    disabled={conta.status === 'Inativa'}
                  >
                    Editar
                  </button>
                  <button
                    className="acao danger"
                    onClick={() => handleInativar(conta.id)}
                    disabled={conta.status === 'Inativa'}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarForm && (
        <div className="form-sidebar">
          <div className="form-header">
            <h3>{contaSelecionada ? 'Editar conta' : 'Nova conta'}</h3>
            <button className="fechar" onClick={() => setMostrarForm(false)}>×</button>
          </div>
          <ContaForm
            conta={contaSelecionada}
            tipoConta="pagar"
            onSave={(nova) => {
              handleSalvarConta(nova);
              setMostrarForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ContasPagarPage;
