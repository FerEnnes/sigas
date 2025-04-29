import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import GraficoPedidosPeriodo from '../components/GraficoPedidosPeriodo';
import GraficoAnaliseResumo from '../components/GraficoAnaliseResumo';
import './ContasResumoPage.css';

function ContasResumoPage() {
  const [abaAtiva, setAbaAtiva] = useState('pagar');

  // BACKEND futuramente: buscar dados reais de vendas/contas
  const totalVendido = 500008.74;
  const totalAPagar = 20348.88;

  const pedidosMockados = [
    { sn: 1, descricao: 'Semente', valor: 1000, parcelas: 10, total: 10000 },
    { sn: 2, descricao: 'Adubo', valor: 1500, parcelas: 5, total: 7500 },
    { sn: 3, descricao: 'Fertilizante', valor: 1000, parcelas: 1, total: 1000 },
    { sn: 4, descricao: 'Diesel', valor: 1200, parcelas: 10, total: 12000 },
    { sn: 5, descricao: 'Arame', valor: 1200, parcelas: 2, total: 2400 },
  ];

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
            <h3>R$ {totalAPagar.toLocaleString('pt-BR')}</h3>
          </div>
        </div>

        <div className="graficos-resumo">
          <div className="grafico-pedidos">
            <h3>Pedidos do período</h3>
            <GraficoPedidosPeriodo />
          </div>

          <div className="grafico-analise">
            <h3>Análise</h3>
            <GraficoAnaliseResumo />
          </div>
        </div>

        <div className="listagem-resumo">
          <h3>Lista de {abaAtiva === 'pagar' ? 'pedidos' : 'vendas'}</h3>
          <table>
            <thead>
              <tr>
                <th>SN</th>
                <th>Descrição</th>
                <th>Valor parcela</th>
                <th>Parcelas</th>
                <th>{abaAtiva === 'pagar' ? 'Total pedido' : 'Total venda'}</th>
              </tr>
            </thead>
            <tbody>
              {pedidosMockados.map((pedido, index) => (
                <tr key={index}>
                  <td>{pedido.sn}</td>
                  <td>{pedido.descricao}</td>
                  <td>R$ {pedido.valor.toLocaleString('pt-BR')}</td>
                  <td>{pedido.parcelas}</td>
                  <td style={{ color: 'green' }}>
                    R$ {pedido.total.toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default ContasResumoPage;
