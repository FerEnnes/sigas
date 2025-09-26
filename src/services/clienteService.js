// src/services/clienteService.js
import api from './api';
import { IS_DEMO } from './demoFlags';

const STORAGE_KEY = 'demo_clients';

const DEFAULT_CLIENTS = [
  {
    id: 1,
    nome_completo: 'Carlos Pereira',
    cpf_cnpj: '123.456.789-00',
    telefone: '(47) 98888-0101',
    email: 'carlos.pereira@sigas.dev',
    cep: '88330-001',
    rua: 'Rua das Palmeiras',
    numero: '120',
    complemento: 'Casa',
    bairro: 'Centro',
    cidade: 'Balneário Camboriú',
    estado: 'SC',
  },
  {
    id: 2,
    nome_completo: 'Empresa Verde LTDA',
    cpf_cnpj: '12.345.678/0001-90',
    telefone: '(47) 98888-0102',
    email: 'contato@empresaverde.dev',
    cep: '89010-020',
    rua: 'Av. Brasil',
    numero: '3500',
    complemento: 'Sala 802',
    bairro: 'Pioneiros',
    cidade: 'Itajaí',
    estado: 'SC',
  },
  {
    id: 3,
    nome_completo: 'Mariana Souza',
    cpf_cnpj: '987.654.321-00',
    telefone: '(47) 98888-0103',
    email: 'mariana.souza@sigas.dev',
    cep: '89200-050',
    rua: 'Rua das Araucárias',
    numero: '45',
    complemento: '',
    bairro: 'Victor Konder',
    cidade: 'Blumenau',
    estado: 'SC',
  },
];

const delay = (ms = 60) => new Promise(r => setTimeout(r, ms));
const asAxios = (data) => Promise.resolve({ data });

const normalize = (c) => {
  const nome = c.nome ?? c.nome_completo ?? c.nomeCompleto ?? '';
  const enderecoStr = [
    c.rua ?? c.logradouro,
    c.numero,
    c.complemento ? `(${c.complemento})` : '',
    '—',
    c.bairro,
    c.cidade,
    c.estado,
    c.cep,
  ].filter(Boolean).join(' ');
  return {
    ...c,
    nome,                 // <- garante compatibilidade com a UI
    endereco: enderecoStr, // <- string pronta pra “Ver”
    address: {             // <- objeto completo, útil no modal
      cep: c.cep, rua: c.rua ?? c.logradouro, numero: c.numero,
      complemento: c.complemento, bairro: c.bairro, cidade: c.cidade, estado: c.estado
    }
  };
};

function read() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CLIENTS));
    return DEFAULT_CLIENTS.map(normalize);
  }
  try { return JSON.parse(raw).map(normalize); } catch { return DEFAULT_CLIENTS.map(normalize); }
}
function write(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list.map(normalize);
}
function nextId(list) {
  const max = list.reduce((m, c) => Math.max(m, Number(c.id) || 0), 0);
  return max + 1;
}

// GET /clientes/
export const getClients = () => {
  if (!IS_DEMO) return api.get('clientes/');
  return delay().then(() => asAxios(read()));
};

// GET /clientes/:id
export const getClient = (id) => {
  if (!IS_DEMO) return api.get(`clientes/${id}/`);
  const c = read().find(x => String(x.id) === String(id)) || null;
  return delay().then(() => asAxios(c));
};

// POST /clientes/
export const createClient = (data) => {
  if (!IS_DEMO) return api.post('clientes/', data);
  const list = read();
  const id = nextId(list);
  const novo = normalize({
    id,
    nome_completo: data.nome_completo ?? data.nome ?? data.nomeCompleto ?? '',
    cpf_cnpj: data.cpf_cnpj ?? data.cpf ?? data.cnpj ?? data.cpfCnpj ?? '',
    telefone: data.telefone ?? '',
    email: data.email ?? '',
    cep: data.cep ?? '',
    rua: data.rua ?? data.logradouro ?? '',
    numero: String(data.numero ?? ''),
    complemento: data.complemento ?? '',
    bairro: data.bairro ?? '',
    cidade: data.cidade ?? '',
    estado: data.estado ?? '',
  });
  write([novo, ...list]);
  return delay().then(() => asAxios(novo));
};

// PUT /clientes/:id
export const updateClient = (id, data) => {
  if (!IS_DEMO) return api.put(`clientes/${id}/`, data);
  const list = read();
  const idx = list.findIndex(x => String(x.id) === String(id));
  if (idx === -1) return delay().then(() => asAxios(null));
  const prev = list[idx];
  const updated = normalize({
    ...prev,
    nome_completo: data.nome_completo ?? data.nome ?? data.nomeCompleto ?? prev.nome_completo ?? prev.nome,
    cpf_cnpj: data.cpf_cnpj ?? data.cpf ?? data.cnpj ?? data.cpfCnpj ?? prev.cpf_cnpj,
    telefone: data.telefone ?? prev.telefone,
    email: data.email ?? prev.email,
    cep: data.cep ?? prev.cep,
    rua: data.rua ?? data.logradouro ?? prev.rua,
    numero: data.numero !== undefined ? String(data.numero) : prev.numero,
    complemento: data.complemento ?? prev.complemento,
    bairro: data.bairro ?? prev.bairro,
    cidade: data.cidade ?? prev.cidade,
    estado: data.estado ?? prev.estado,
  });
  list[idx] = updated;
  write(list);
  return delay().then(() => asAxios(updated));
};

// DELETE /clientes/:id
export const deleteClient = (id) => {
  if (!IS_DEMO) return api.delete(`clientes/${id}/`);
  const list = read().filter(x => String(x.id) !== String(id));
  write(list);
  return delay().then(() => asAxios({ ok: true }));
};




/*import api from './api';

export const getClients = () => api.get('clientes/');
export const getClient = (id) => api.get(`clientes/${id}/`);
export const createClient = (data) => api.post('clientes/', data);
export const updateClient = (id, data) => api.put(`clientes/${id}/`, data);
export const deleteClient = (id) => api.delete(`clientes/${id}/`);
*/
