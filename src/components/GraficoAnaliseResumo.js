import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

//  Configura Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function GraficoAnaliseResumo() {
  // eslint-disable-next-line no-unused-vars
  const [dados, setDados] = useState([
    { mes: 'Janeiro', valor: 15000 },
    { mes: 'Fevereiro', valor: 18000 },
    { mes: 'Março', valor: 12000 },
    { mes: 'Abril', valor: 20000 },
  ]);

  //  BACKEND depois:
  /*
  useEffect(() => {
    async function fetchDadosResumo() {
      try {
        const res = await fetch('/api/contas/resumo'); // Ajuste a rota conforme seu backend
        const json = await res.json();
        setDados(json);
      } catch (error) {
        console.error('Erro ao carregar resumo:', error);
      }
    }

    fetchDadosResumo();
  }, []);
  */

  const chartData = {
    labels: dados.map(item => item.mes),
    datasets: [
      {
        label: 'Valor',
        data: dados.map(item => item.valor),
        backgroundColor: '#6ba877',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={{ marginBottom: 10 }}>Análise geral</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default GraficoAnaliseResumo;
