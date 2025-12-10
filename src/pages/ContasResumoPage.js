import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import Sidebar from '../components/Sidebar';
import api, { parseApiError } from '../services/api';
import './ContasResumoPage.css';

const fmtBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(v || 0),
  );

function mapApiContaToResumoRow(apiRow, tipo) {
  const valorParcela = Number(apiRow.valorparcela ?? 0);
  const juros = Number(apiRow.valorjuros ?? 0);
  const desconto = Number(apiRow.valordesconto ?? 0);
  const parcelas = Number(apiRow.numeroparcela ?? 1);

  const total = (valorParcela + juros - desconto) * parcelas;

  const vencimento =
    apiRow.datavencimento || apiRow.data_vencimento || apiRow.dataVencimento;
  const quitacao =
    apiRow.dataquitacao || apiRow.data_quitacao || apiRow.dataQuitacao;

  return {
    id: tipo === 'pagar' ? apiRow.idcontapagar : apiRow.idconta,
    descricao: apiRow.descricao,
    valorParcela,
    parcelas,
    total,
    vencimento,
    quitacao,
    tipo,
  };
}

const STATUS_LABEL = {
  aberta: 'Em aberto',
  atrasada: 'Atrasada',
  paga: 'Paga',
};

const STATUS_COLORS = {
  aberta: '#f59e0b',
  atrasada: '#dc2626',
  paga: '#16a34a',
};

function classificarStatus(row) {
  const hoje = new Date();
  const venc = row.vencimento ? new Date(row.vencimento) : null;
  const quit = row.quitacao ? new Date(row.quitacao) : null;

  if (quit) return 'paga';
  if (venc && venc < hoje) return 'atrasada';
  return 'aberta';
}

function ContasResumoPage() {
  const [abaAtiva, setAbaAtiva] = useState('pagar');
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const endpoint = abaAtiva === 'pagar' ? 'contas-pagar/' : 'contas-receber/';
        const res = await api.get(endpoint);
        const raw = Array.isArray(res.data) ? res.data : [];
        const mapped = raw.map((row) => mapApiContaToResumoRow(row, abaAtiva));
        setItems(mapped);
      } catch (err) {
        const msg = parseApiError ? parseApiError(err) : 'Erro ao carregar contas';
        toast.error(msg);
      }
    }

    carregar();
  }, [abaAtiva]);

  const totalGeral = useMemo(
    () => (items || []).reduce((acc, it) => acc + Number(it.total || 0), 0),
    [items],
  );

  const totalEmAberto = useMemo(
    () =>
      (items || []).reduce((acc, it) => {
        const status = classificarStatus(it);
        if (status === 'paga') return acc;
        return acc + Number(it.total || 0);
      }, 0),
    [items],
  );

  const dadosFluxoMes = useMemo(() => {
    const agora = new Date();
    const inicioPeriodo = new Date(agora);
    inicioPeriodo.setMonth(inicioPeriodo.getMonth() - 5);
    inicioPeriodo.setDate(1);

    const mapa = new Map();

    (items || []).forEach((row) => {
      if (!row.vencimento) return;
      const d = new Date(row.vencimento);
      if (Number.isNaN(d.getTime()) || d < inicioPeriodo || d > agora) return;

      const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        '0',
      )}`;
      const rotulo = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(
        d.getFullYear(),
      ).slice(-2)}`;

      const atual = mapa.get(chave) || { mes: rotulo, total: 0 };
      atual.total += Number(row.total || 0);
      mapa.set(chave, atual);
    });

    const ordenado = Array.from(mapa.keys())
      .sort()
      .map((k) => mapa.get(k));

    return ordenado;
  }, [items]);

  const dadosStatus = useMemo(() => {
    const soma = { aberta: 0, atrasada: 0, paga: 0 };

    (items || []).forEach((row) => {
      const status = classificarStatus(row);
      soma[status] += Number(row.total || 0);
    });

    return Object.entries(soma)
      .filter(([, valor]) => valor > 0)
      .map(([status, valor]) => ({
        name: STATUS_LABEL[status],
        status,
        value: valor,
      }));
  }, [items]);

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
              type="button"
            >
              A pagar
            </button>
            <button
              className={abaAtiva === 'receber' ? 'ativo' : ''}
              onClick={() => setAbaAtiva('receber')}
              type="button"
            >
              A receber
            </button>
          </div>
        </div>

        <div className="cards-resumo">
          <div className="card">
            <p>
              {abaAtiva === 'pagar'
                ? 'Total de contas a pagar (abertas e pagas)'
                : 'Total de contas a receber (abertas e pagas)'}
            </p>
            <h3>{fmtBRL(totalGeral)}</h3>
          </div>
          <div className="card">
            <p>
              {abaAtiva === 'pagar'
                ? 'Total em aberto a pagar'
                : 'Total em aberto a receber'}
            </p>
            <h3>{fmtBRL(totalEmAberto)}</h3>
          </div>
        </div>

        <div className="graficos-resumo">
          <div className="grafico-card">
            <h3>Fluxo de contas (últimos 6 meses)</h3>
            {dadosFluxoMes.length === 0 ? (
              <p className="grafico-vazio">Sem dados suficientes para o período.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dadosFluxoMes}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={fmtBRL} />
                  <Tooltip formatter={(v) => fmtBRL(v)} />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="#1d4ed8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grafico-card">
            <h3>Status das contas</h3>
            {dadosStatus.length === 0 ? (
              <p className="grafico-vazio">Sem contas cadastradas.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={dadosStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {dadosStatus.map((entry, index) => {
                      const color =
                        STATUS_COLORS[entry.status] ||
                        ['#60a5fa', '#f97316', '#22c55e'][index % 3];
                      return <Cell key={entry.status} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(v) => fmtBRL(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="listagem-resumo">
          <h3>
            Lista de contas {abaAtiva === 'pagar' ? 'a pagar' : 'a receber'}
          </h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Descrição</th>
                  <th>Vencimento</th>
                  <th>Valor parcela</th>
                  <th>Parcelas</th>
                  <th>Total (calculado)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(items || []).map((row, idx) => {
                  const status = classificarStatus(row);
                  return (
                    <tr key={row.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{row.descricao}</td>
                      <td>
                        {row.vencimento
                          ? new Date(row.vencimento).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td>{fmtBRL(row.valorParcela)}</td>
                      <td>{row.parcelas}</td>
                      <td style={{ fontWeight: 600 }}>
                        {fmtBRL(row.total)}
                      </td>
                      <td className={`status-pill status-${status}`}>
                        {STATUS_LABEL[status]}
                      </td>
                    </tr>
                  );
                })}
                {(!items || items.length === 0) && (
                  <tr>
                    <td colSpan={7} style={{ color: '#6b7280' }}>
                      Nenhum registro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContasResumoPage;
