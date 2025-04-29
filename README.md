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
````
---

Scripts Disponíveis

 npm start – Inicia o servidor em modo de desenvolvimento

  npm run build – Gera os arquivos otimizados para produção

  npm test – Executa testes automatizados

  npm run lint – Análise estática do código (se configurado)

--- 

Estrutura de Pastas

├── public/
│   └── index.html
├── src/
│   ├── assets/           # Logos e imagens
│   ├── components/       # Componentes reutilizáveis
│   ├── pages/            # Páginas completas do sistema
│   ├── services/         # Integrações com APIs externas
│   ├── styles/           # Estilos globais e modularizados
│   ├── App.js            # Componente principal
│   ├── index.js          # Entrada da aplicação

---

Funcionalidades Principais

  - Login e recuperação de senha

  - Cadastro e edição de:

      Usuários (com controle de permissão por tipo)

      Clientes

      Fornecedores

      Propriedades

  - Plano de Contas hierárquico

  - Gerenciamento de contas:

      A pagar

      A receber

  - Dashboard com:

  - Resumo financeiro

  - Previsão do tempo

  - Filtros de período (em desenvolvimento)

  - Calendário de eventos

 -  Notificações (mock)

 -  Responsividade total e compatibilidade com dispositivos móveis

---

Integração com OpenWeather API
  A previsão do tempo é obtida automaticamente via geolocalização ou por busca manual.

    // Exemplo - services/weatherService.js
    export const getWeatherByCity = async (cidade) => {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&lang=pt_br&appid=${API_KEY}`);
    };

---
Autenticação e Rotas Protegidas
  A autenticação é baseada em token e é gerenciada por meio de AuthContext.js. As rotas protegidas utilizam o componente PrivateRoute.

    <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

---

Estilização e Responsividade

  Layout construído com Flexbox e media queries

  Botões, cards, modais e tabelas estilizados com consistência

  Paleta suave e tipografia adequada ao contexto rural

  Suporte total a telas menores (mobile-first)

---
Licença
  Distribuído sob a licença MIT. Consulte package-lock.json para detalhes sobre as dependências utilizadas.
