import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: false,
});

// Helperzinho para tratar erro de forma amigável
export function parseApiError(err) {
  if (err.response) {
    const msg =
      typeof err.response.data === 'string'
        ? err.response.data
        : JSON.stringify(err.response.data);
    return `HTTP ${err.response.status} – ${msg}`;
  }
  if (err.request) return 'Sem resposta do servidor (verifique se o backend está rodando).';
  return err.message || 'Erro desconhecido';
}

export default api;

