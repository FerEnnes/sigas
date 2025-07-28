import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import GraficoPedidosPeriodo from '../components/GraficoPedidosPeriodo';
import GraficoAnaliseResumo from '../components/GraficoAnaliseResumo';
import { toast } from 'react-toastify';
import './ContasResumoPage.css';

function ContasResumoPage() {
  const [abaAtiva, setAbaAtiva] = useState('pagar');
  const [pedidos, setPedidos] = useState([]);
  const [total, setTotal] = useState(0);
  const totalVendido = 500008.74;

  useEffect(() => {
    const endpoint = abaAtiva === 'pagar' ? '/api/contas-pagar/' : '/api/contas-receber/';
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setPedidos(data);
        const soma = data.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);
        setTotal(soma);
      })
      .catch(() => toast.error('Erro ao carregar dados do resumo'));
  }, [abaAtiva]);

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
            <h3>R$ {total.toLocaleString('pt-BR')}</h3>
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
              {pedidos.map((pedido, index) => (
                <tr key={pedido.id || index}>
                  <td>{index + 1}</td>
                  <td>{pedido.descricao}</td>
                  <td>R$ {parseFloat(pedido.valor_parcela).toLocaleString('pt-BR')}</td>
                  <td>{pedido.parcelas}</td>
                  <td style={{ color: 'green' }}>
                    R$ {parseFloat(pedido.total).toLocaleString('pt-BR')}
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