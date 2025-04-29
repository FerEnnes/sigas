🌿 SAAS Agro Light - Sistema de Gestão Agropecuária

Este projeto é um sistema web completo voltado para gestão de propriedades agropecuárias. Desenvolvido com foco em modularidade, escalabilidade e responsividade, o sistema oferece ferramentas para cadastro de entidades, controle financeiro, exibição de dashboards analíticos e integração com APIs externas (clima e autenticação).

<img width="2047" alt="Captura de Tela 2025-04-04 às 15 03 57" src="https://github.com/user-attachments/assets/c0fc65ab-0e60-4090-a0f5-64805283e09e" />

## Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Integração com OpenWeather API](#integração-com-openweather-api)
- [Autenticação e Rotas Protegidas](#autenticação-e-rotas-protegidas)
- [Estilização e Responsividade](#estilização-e-responsividade)
- [Licença](#licença)

---

## Tecnologias Utilizadas

- **React 19**
- **React Router DOM**
- **React Toastify**
- **Axios**
- **Material UI (MUI)**
- **Chart.js + react-chartjs-2**
- **OpenWeatherMap API**
- **HTML5, CSS3, Flexbox**
- **Context API para autenticação**
- **Estrutura modular de componentes e páginas**

---

## Instalação
1. Clone o repositório:  
  ```bash
  git clone https://github.com/seu-usuario/saas-agro-light.git
  cd saas-agro-light

2. Instale as dependências:

  npm install --legacy-peer-deps

3. Configure a chave da API de clima no arquivo src/services/weatherService.js:

  const API_KEY = 'SUA_CHAVE_OPENWEATHERMAP';

4. Inicie o servidor de desenvolvimento:
  npm start
