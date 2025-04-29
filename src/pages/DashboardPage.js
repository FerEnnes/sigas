import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getWeatherByCity, getWeatherByCoords } from '../services/weatherService';
import './DashboardPage.css';

function DashboardPage() {
  const [weather, setWeather] = useState(null);
  const [cidade, setCidade] = useState('');
  const [inputCidade, setInputCidade] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const data = await getWeatherByCoords(position.coords.latitude, position.coords.longitude);
          setWeather(data);
          setCidade(data.name);
        } catch (error) {
          console.error('Erro ao obter localização automática:', error);
        }
      }, (error) => {
        console.error('Erro ao obter geolocalização:', error);
      });
    }
  }, []);

  const handleBuscarCidade = async () => {
    if (!inputCidade) return;
    try {
      const data = await getWeatherByCity(inputCidade);
      setWeather(data);
      setCidade(data.name);
      setInputCidade('');
    } catch (error) {
      alert('Cidade não encontrada.');
      console.error(error);
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <main className="dashboard-container">
        <div className="header-dashboard">
          <h2>Dashboard</h2>

          <div className="weather-search">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar cidade..."
                value={inputCidade}
                onChange={(e) => setInputCidade(e.target.value)}
              />
              <button onClick={handleBuscarCidade}>Buscar</button>
            </div>

            {weather && (
              <div className="weather-box">
                <h4>{cidade}</h4>
                <div className="weather-info">
                  <div>
                    <p><strong>Temp:</strong> {weather.main.temp}°C</p>
                    <p><strong>Clima:</strong> {weather.weather[0].description}</p>
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt="Ícone do clima"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="cards-grid">
          <div className="card">
            <p>Contas a receber</p>
            <h3>178k</h3>
          </div>
          <div className="card">
            <p>Contas a pagar</p>
            <h3>20k</h3>
          </div>
          <div className="card">
            <p>Total recebido</p>
            <h3>190k</h3>
          </div>
          <div className="card">
            <p>Total pago</p>
            <h3>12k</h3>
          </div>
        </div>

      </main>
    </div>
  );
}

export default DashboardPage;
