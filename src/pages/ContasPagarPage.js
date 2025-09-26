// src/pages/ContasPagarPage.js
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ContaForm from '../components/ContaForm';
import { toast } from 'react-toastify';
import './ContasPage.css';
import {
  FORNECEDORES,
  PROPRIEDADES,
  PLANOS_OPCOES_DETALHADO, // pode usar o detalhado (opções completas)
} from '../services/catalogMock';

const KEY = 'contas_pagar_v1';

const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const save = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));
const nextId = (arr) => {
  const nums = arr.map((x) => Number(x.id)).filter(Number.isFinite);
  return String(nums.length ? Math.max(...nums) + 1 : 1);
};
const ordenar = (arr) =>
  [...arr].sort((a, b) => {
    const av = a.vencimento || '';
    const bv = b.vencimento || '';
    if (av === bv) return (a.descricao || '').localeCompare(b.descricao || '');
    return av.localeCompare(bv);
  });

function ContasPagarPage() {
  const [contas, setContas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);

  const carregar = () => setContas(ordenar(load()));
  useEffect(() => { carregar(); }, []);

  const handleSalvarConta = (nova) => {
    const data = load();
    const item = {
      ...nova,
      id: nova.id || nextId(data),
      parcelas: Number(nova.parcelas || 1),
      valorParcela: Number(nova.valorParcela || 0),
      juros: Number(nova.juros || 0),
      desconto: Number(nova.desconto || 0),
      total: Number(nova.total || 0),
      status: nova.status || 'Ativa',
      tipo: 'pagar',
    };
    const idx = data.findIndex((c) => String(c.id) === String(item.id));
    if (idx >= 0) data[idx] = item; else data.push(item);
    save(data);
    setContas(ordenar(data));
    toast.success(nova.id ? 'Conta atualizada!' : 'Conta criada!');
  };

  const handleInativar = (id) => {
    const data = load().map((c) =>
      String(c.id) === String(id) ? { ...c, status: 'Inativa' } : c
    );
    save(data);
    setContas(ordenar(data));
    toast.success('Conta inativada!');
  };

  const fmt = (n) => `R$ ${Number(n || 0).toFixed(2)}`;

  return (
    <div className="app">
      <Sidebar />
      <div className="supplier-list">
        <div className="list-header">
          <h3>Lista de contas a pagar</h3>
          <button
            className="add-button"
            onClick={() => { setContaSelecionada(null); setMostrarForm(true); }}
          >
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
            {contas.length === 0 ? (
              <tr><td colSpan={8} style={{ color: '#6b7280' }}>Nenhuma conta cadastrada.</td></tr>
            ) : (
              contas.map((conta) => (
                <tr key={conta.id}>
                  <td>{conta.descricao}</td>
                  <td>{fmt(conta.valorParcela)}</td>
                  <td>{conta.parcelas}</td>
                  <td>{fmt(conta.total)}</td>
                  <td>{conta.vencimento || '-'}</td>
                  <td>{conta.quitacao || '-'}</td>
                  <td style={{ color: conta.status === 'Inativa' ? '#999' : '#111' }}>{conta.status}</td>
                  <td>
                    <button
                      className="acao"
                      onClick={() => { setContaSelecionada(conta); setMostrarForm(true); }}
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
              ))
            )}
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
            fornecedores={FORNECEDORES}
            propriedades={PROPRIEDADES}
            planos={PLANOS_OPCOES_DETALHADO}
            onSave={(nova) => { handleSalvarConta(nova); setMostrarForm(false); }}
          />
        </div>
      )}
    </div>
  );
}

export default ContasPagarPage;





/*import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ContaForm from '../components/ContaForm';
import { toast } from 'react-toastify';
import './ContasPage.css';

function ContasPagarPage() {
  const [contas, setContas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);

  // Carrega contas do backend
  useEffect(() => {
    fetch('/api/contas-pagar/')
      .then(res => res.json())
      .then(data => setContas(data))
      .catch(() => toast.error('Erro ao carregar contas'));
  }, []);

  const handleSalvarConta = (nova) => {
    const metodo = nova.id ? 'PUT' : 'POST';
    const url = nova.id ? `/api/contas-pagar/${nova.id}/` : '/api/contas-pagar/';

    fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nova),
    })
      .then(res => res.json())
      .then(data => {
        if (nova.id) {
          setContas(contas.map(c => (c.id === data.id ? data : c)));
          toast.success('Conta atualizada!');
        } else {
          setContas([...contas, data]);
          toast.success('Conta criada!');
        }
      })
      .catch(() => toast.error('Erro ao salvar conta'));
  };

  const handleInativar = (id) => {
    setContas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Inativa' } : c))
    );

    fetch(`/api/contas-pagar/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Inativa' }),
    });
    
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
                <td>R$ {conta.valor_parcela?.toFixed(2)}</td>
                <td>{conta.parcelas}</td>
                <td>R$ {conta.total?.toFixed(2)}</td>
                <td>{conta.vencimento}</td>
                <td>{conta.quitacao || '-'}</td>
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
*/