import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ContaForm from '../components/ContaForm';
import { toast } from 'react-toastify';
import './ContasPage.css';

function ContasReceberPage() {
  const [contas, setContas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);

  // Carrega contas do backend
  useEffect(() => {
    fetch('/api/contas-receber/')
      .then(res => res.json())
      .then(data => setContas(data))
      .catch(err => {
        console.error('Erro ao carregar contas:', err);
        toast.error('Erro ao carregar contas');
      });
  }, []);

  const handleSalvarConta = (nova) => {
    if (nova.id) {
      // Atualiza no backend
      fetch(`/api/contas-receber/${nova.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nova),
      })
        .then(res => res.json())
        .then(data => {
          setContas((prev) => prev.map((c) => (c.id === data.id ? data : c)));
          toast.success('Conta atualizada!');
        })
        .catch(() => toast.error('Erro ao atualizar conta'));
    } else {
      // Cria nova no backend
      fetch('/api/contas-receber/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nova, status: 'Ativa' }),
      })
        .then(res => res.json())
        .then(data => {
          setContas(prev => [...prev, data]);
          toast.success('Conta criada!');
        })
        .catch(() => toast.error('Erro ao criar conta'));
    }
  };

  const handleInativar = (id) => {
    fetch(`/api/contas-receber/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Inativa' }),
    })
      .then(res => res.json())
      .then(data => {
        setContas((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: 'Inativa' } : c))
        );
        toast.success('Conta inativada!');
      })
      .catch(() => toast.error('Erro ao inativar conta'));
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="supplier-list">
        <div className="list-header">
          <h3>Lista de contas a receber</h3>
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
                <td>R$ {parseFloat(conta.valor_parcela)?.toFixed(2)}</td>
                <td>{conta.parcelas}</td>
                <td>R$ {parseFloat(conta.total)?.toFixed(2)}</td>
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
            tipoConta="receber"
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

export default ContasReceberPage;
