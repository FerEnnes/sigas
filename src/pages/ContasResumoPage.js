// src/pages/ContasResumoPage.js
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import GraficoPedidosPeriodo from '../components/GraficoPedidosPeriodo';
import GraficoAnaliseResumo from '../components/GraficoAnaliseResumo';
import './ContasResumoPage.css';
import { listContas } from '../services/contasServiceMock';

// ---- helper de moeda (garante "R$" sempre) -------------------------------
const fmtBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(Number(v || 0));

function ContasResumoPage() {
  const [abaAtiva, setAbaAtiva] = useState('pagar'); // 'pagar' | 'receber'
  const [items, setItems] = useState([]);

  // total vendido apenas para vitrine
  const totalVendido = 500008.74;

  // memoiza a função para não quebrar a regra de deps do useEffect
  const carregar = useCallback(() => {
    const data = listContas(abaAtiva);
    setItems(data);
  }, [abaAtiva]);

  useEffect(() => {
    carregar();
    window.addEventListener('storage', carregar);
    return () => window.removeEventListener('storage', carregar);
  }, [carregar]);

  const totalAba = useMemo(
    () => (items || []).reduce((acc, it) => acc + Number(it.total || 0), 0),
    [items]
  );

  return (
    <div className="app">
      <Sidebar />
      <div className="contas-resumo-container">
        <div className="header-resumo">
          <h2>Contas</h2>
          <div className="aba-toggle">
            <button
              className={abaAtiva === 'pagar' ? 'ativo' : ''}
              onClick={() => setAbaAtiva('pagar')}
            >
              A pagar
            </button>
            <button
              className={abaAtiva === 'receber' ? 'ativo' : ''}
              onClick={() => setAbaAtiva('receber')}
            >
              A receber
            </button>
          </div>
        </div>

        <div className="cards-resumo">
          <div className="card">
            <p>Total vendido</p>
            <h3>{fmtBRL(totalVendido)}</h3>
          </div>
          <div className="card">
            <p>Total {abaAtiva === 'pagar' ? 'a pagar' : 'a receber'}</p>
            <h3>{fmtBRL(totalAba)}</h3>
          </div>
        </div>

        <div className="graficos-resumo">
          <div className="grafico-card">
            <h3>Pedidos do período</h3>
            <GraficoPedidosPeriodo />
          </div>

          <div className="grafico-card">
            <h3>Análise</h3>
            <GraficoAnaliseResumo />
          </div>
        </div>

        <div className="listagem-resumo">
          <h3>Lista de {abaAtiva === 'pagar' ? 'pedidos' : 'vendas'}</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Descrição</th>
                <th>Valor parcela</th>
                <th>Parcelas</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(items || []).map((row, idx) => (
                <tr key={row.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{row.descricao}</td>
                  <td>{fmtBRL(row.valorParcela)}</td>
                  <td>{row.parcelas}</td>
                  <td style={{ color: 'green' }}>{fmtBRL(row.total)}</td>
                </tr>
              ))}
              {(!items || items.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ color: '#6b7280' }}>Nenhum registro.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default ContasResumoPage;
