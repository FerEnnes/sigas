// src/pages/ContasResumoPage.js
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import GraficoPedidosPeriodo from '../components/GraficoPedidosPeriodo';
import GraficoAnaliseResumo from '../components/GraficoAnaliseResumo';
import './ContasResumoPage.css';
import { listContas } from '../services/contasServiceMock';

function ContasResumoPage() {
  const [abaAtiva, setAbaAtiva] = useState('pagar'); // 'pagar' | 'receber'
  const [items, setItems] = useState([]);

  // total vendido é estático só pra vitrine (pode trocar por alguma conta real depois)
  const totalVendido = 500008.74;

  // deixa a função estável e só dependente de abaAtiva
  const carregar = useCallback(() => {
    const data = listContas(abaAtiva); // lê do localStorage
    setItems(data);
  }, [abaAtiva]);

  useEffect(() => {
    carregar();

    // atualiza se algo do localStorage mudar (ex.: cadastrou novo item)
    const handler = () => carregar();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
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
            <h3>R$ {totalVendido.toLocaleString('pt-BR')}</h3>
          </div>
          <div className="card">
            <p>Total {abaAtiva === 'pagar' ? 'a pagar' : 'a receber'}</p>
            <h3>R$ {totalAba.toLocaleString('pt-BR')}</h3>
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
                  <td>
                    R{' '}
                    {Number(row.valorParcela || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                  </td>
                  <td>{row.parcelas}</td>
                  <td style={{ color: 'green' }}>
                    R{' '}
                    {Number(row.total || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                  </td>
                </tr>
              ))}
              {(!items || items.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ color: '#6b7280' }}>
                    Nenhum registro.
                  </td>
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
