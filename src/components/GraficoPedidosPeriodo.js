import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

// Configura Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function GraficoPedidosPeriodo() {
  // eslint-disable-next-line no-unused-vars
  const [dados, setDados] = useState([
    { mes: 'Janeiro', pedidos: 10 },
    { mes: 'Fevereiro', pedidos: 15 },
    { mes: 'Março', pedidos: 8 },
    { mes: 'Abril', pedidos: 12 },
  ]);

  //  BACKEND depois:
  /*
  useEffect(() => {
    async function fetchPedidosPeriodo() {
      try {
        const res = await fetch('/api/contas/pedidos-periodo'); // Ajuste conforme sua API
        const json = await res.json();
        setDados(json);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    }

    fetchPedidosPeriodo();
  }, []);
  */

  const chartData = {
    labels: dados.map(item => item.mes),
    datasets: [
      {
        label: 'Pedidos',
        data: dados.map(item => item.pedidos),
        fill: false,
        borderColor: '#2a9d8f',
        tension: 0.4,
        pointBackgroundColor: '#2a9d8f',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={{ marginBottom: 10 }}>Pedidos por período</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default GraficoPedidosPeriodo;
