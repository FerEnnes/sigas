import axios from 'axios';

export function setupDemoMocks() {
  // silencia erros de rede e retorna listas vazias
  axios.interceptors.response.use(
    (resp) => resp,
    () => Promise.resolve({ data: [] })
  );

  // mock de fetch
  const origFetch = window.fetch?.bind(window);
  window.fetch = async (...args) => {
    try { return await origFetch(...args); }
    catch { return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } }); }
  };

  // mock de WebSocket
  const NoopWS = class {
    constructor() { setTimeout(() => this.onopen && this.onopen(), 0); }
    send() {}
    close() { this.onclose && this.onclose(); }
    addEventListener() {}
    removeEventListener() {}
  };
  if (window.WebSocket) window.WebSocket = NoopWS;

  console.info('[DEMO] mocks de API/WS ativos.');
}
