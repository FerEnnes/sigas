import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import PlanoContasTree from '../components/PlanoContasTree';
import PlanoContasModal from '../components/PlanoContasModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PlanoContasPage.css';

function PlanoContasPage() {
  const [modelo, setModelo] = useState(1); // 1 = Simplificado, 2 = Detalhado
  const [contas, setContas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [userTipo] = useState(1); // 1 = Admin, 2 = Colaborador

  //  MOCK DE PLANO SIMPLIFICADO
  const fakeSimplificado = useCallback(() => [
    {
      id: 1,
      descricao: '1. Ativos',
      subcontas: [
        { id: 11, descricao: 'A. Caixa', subcontas: [] },
        { id: 12, descricao: 'B. Investimentos', subcontas: [] },
        { id: 13, descricao: 'C. Produtos para revenda', subcontas: [] }
      ]
    },
    {
      id: 2,
      descricao: '2. Passivo',
      subcontas: [
        { id: 21, descricao: 'A. Impostos', subcontas: [] },
        { id: 22, descricao: 'B. Empréstimos', subcontas: [] },
        { id: 23, descricao: 'C. Salários', subcontas: [] }
      ]
    }
  ], []);

  //  MOCK DE PLANO DETALHADO
  const fakeDetalhado = useCallback(() => [
    {
      id: 100,
      descricao: '1. Ativo',
      subcontas: [
        {
          id: 101,
          descricao: '1.1 Ativo Circulante',
          subcontas: [
            {
              id: 1011,
              descricao: '1.1.1 Disponível',
              subcontas: [
                { id: 10111, descricao: '1.1.1.1 Caixa', subcontas: [] },
                { id: 10112, descricao: '1.1.1.2 Conta bancária', subcontas: [] }
              ]
            }
          ]
        }
      ]
    }
  ], []);

  //  Carregar plano de contas com base no modelo selecionado
  useEffect(() => {
    // FUTURO BACKEND:
    // fetch(`/api/plano-contas?modelo=${modelo}`)
    //   .then(res => res.json())
    //   .then(data => setContas(data))

    setContas(modelo === 1 ? fakeSimplificado() : fakeDetalhado());
  }, [modelo, fakeSimplificado, fakeDetalhado]);

  const handleModeloChange = (novoModelo) => {
    setModelo(novoModelo);
    toast.info(`Visualizando: ${novoModelo === 1 ? 'Simplificado' : 'Detalhado'}`);
  };

  const atualizarLista = (novaConta) => {
    const novoId = Math.max(...flattenIds(contas)) + 1;

    if (novaConta.id) {
      setContas(updateConta(contas, novaConta));
      toast.success('Conta atualizada!');
    } else {
      const novaComId = { ...novaConta, id: novoId, subcontas: [] };
      setContas([...contas, novaComId]);
      toast.success('Conta criada!');
    }
  };

  const flattenIds = (items) => {
    let ids = [];
    for (const item of items) {
      ids.push(item.id);
      if (Array.isArray(item.subcontas)) {
        ids = [...ids, ...flattenIds(item.subcontas)];
      }
    }
    return ids;
  };

  const updateConta = (lista, nova) =>
    lista.map(item => {
      if (item.id === nova.id) return nova;
      if (item.subcontas) {
        return { ...item, subcontas: updateConta(item.subcontas, nova) };
      }
      return item;
    });

  return (
    <div className="app">
      <Sidebar />
      <div className="plano-container">
        <h2>Plano de Contas ({modelo === 1 ? 'Simplificado' : 'Detalhado'})</h2>

        {userTipo === 1 && (
          <div className="modelo-toggle">
            <button className={modelo === 1 ? 'active' : ''} onClick={() => handleModeloChange(1)}>
              Simplificado
            </button>
            <button className={modelo === 2 ? 'active' : ''} onClick={() => handleModeloChange(2)}>
              Detalhado
            </button>
          </div>
        )}

        <PlanoContasTree
          contas={contas}
          onEdit={(data) => {
            setEditData(data);
            setOpenModal(true);
          }}
        />

        {userTipo === 1 && (
          <button className="add-button" onClick={() => {
            setEditData(null);
            setOpenModal(true);
          }}>
            + Nova conta
          </button>
        )}

        {openModal && (
          <PlanoContasModal
            modelo={modelo}
            data={editData}
            onClose={() => setOpenModal(false)}
            onSave={(nova) => {
              atualizarLista(nova);
              setOpenModal(false);
            }}
          />
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default PlanoContasPage;
