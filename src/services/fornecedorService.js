// src/services/fornecedorService.js
import { IS_DEMO } from './demoFlags';
// import api from './api'; // use quando IS_DEMO=false

const STORAGE_KEY = 'demo_suppliers';

const DEFAULT_SUPPLIERS = [
  {
    id: 1,
    nome_completo: 'AgroMix Insumos',
    cpf_cnpj: '11.111.111/0001-11',
    email: 'contato@agromix.dev',
    telefone: '(47) 97777-1001',
    cep: '88330-001',
    logradouro: 'Av. das Indústrias',
    numero: '120',
    complemento: 'Sala 301',
    bairro: 'Centro',
    cidade: 'Balneário Camboriú',
    estado: 'SC',
  },
  {
    id: 2,
    nome_completo: 'Cooperativa Campo Forte',
    cpf_cnpj: '22.222.222/0001-22',
    email: 'vendas@campoforte.dev',
    telefone: '(47) 97777-1002',
    cep: '89010-020',
    logradouro: 'Rua XV de Novembro',
    numero: '1500',
    complemento: '',
    bairro: 'Centro',
    cidade: 'Blumenau',
    estado: 'SC',
  },
  {
    id: 3,
    nome_completo: 'Sementes do Sul',
    cpf_cnpj: '33.333.333/0001-33',
    email: 'comercial@sementesdosul.dev',
    telefone: '(51) 97777-1003',
    cep: '90010-030',
    logradouro: 'Av. Ipiranga',
    numero: '200',
    complemento: 'Depósito A',
    bairro: 'Partenon',
    cidade: 'Porto Alegre',
    estado: 'RS',
  },
  {
    id: 4,
    nome_completo: 'Fertilizantes Brasil',
    cpf_cnpj: '44.444.444/0001-44',
    email: 'suporte@fertbrasil.dev',
    telefone: '(11) 97777-1004',
    cep: '01000-000',
    logradouro: 'Av. Paulista',
    numero: '2200',
    complemento: 'Conj. 121',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
  },
  {
    id: 5,
    nome_completo: 'IrrigaTec Solutions',
    cpf_cnpj: '55.555.555/0001-55',
    email: 'contato@irrigatec.dev',
    telefone: '(31) 97777-1005',
    cep: '30110-012',
    logradouro: 'Rua da Bahia',
    numero: '500',
    complemento: '',
    bairro: 'Funcionários',
    cidade: 'Belo Horizonte',
    estado: 'MG',
  },
];

const delay = (ms = 80) => new Promise(r => setTimeout(r, ms));
const asAxios = (data) => Promise.resolve({ data });

const normalize = (f) => ({
  ...f,
  nome: f.nome ?? f.nome_completo ?? f.razao_social ?? '',
  endereco: [
    f.logradouro, f.numero, f.complemento ? `(${f.complemento})` : '',
    '—', f.bairro, f.cidade, f.estado, f.cep
  ].filter(Boolean).join(' ')
});

function read() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SUPPLIERS));
    return DEFAULT_SUPPLIERS.map(normalize);
  }
  try { return JSON.parse(raw).map(normalize); } catch { return DEFAULT_SUPPLIERS.map(normalize); }
}
function write(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list.map(normalize);
}
function nextId(list) {
  return list.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;
}

// GET /fornecedores/
export const getSuppliers = () => {
  if (!IS_DEMO) {
    // return api.get('fornecedores/');
    throw new Error('Configure sua API aqui quando IS_DEMO=false');
  }
  return delay().then(() => asAxios(read()));
};

// GET /fornecedores/:id
export const getSupplier = (id) => {
  if (!IS_DEMO) {
    // return api.get(`fornecedores/${id}/`);
    throw new Error('Configure sua API aqui quando IS_DEMO=false');
  }
  const s = read().find(x => String(x.id) === String(id)) || null;
  return delay().then(() => asAxios(s));
};

// POST /fornecedores/
export const createSupplier = (data) => {
  if (!IS_DEMO) {
    // return api.post('fornecedores/', data);
    throw new Error('Configure sua API aqui quando IS_DEMO=false');
  }
  const list = read();
  const id = nextId(list);
  const novo = normalize({
    id,
    nome_completo: data.nome_completo ?? data.nome ?? '',
    cpf_cnpj: data.cpf_cnpj ?? data.cpf ?? data.cnpj ?? '',
    email: data.email ?? '',
    telefone: data.telefone ?? '',
    cep: data.cep ?? '',
    logradouro: data.logradouro ?? data.rua ?? '',
    numero: String(data.numero ?? ''),
    complemento: data.complemento ?? '',
    bairro: data.bairro ?? '',
    cidade: data.cidade ?? '',
    estado: data.estado ?? '',
  });
  write([novo, ...list]);
  return delay().then(() => asAxios(novo));
};

// PUT /fornecedores/:id
export const updateSupplier = (id, data) => {
  if (!IS_DEMO) {
    // return api.put(`fornecedores/${id}/`, data);
    throw new Error('Configure sua API aqui quando IS_DEMO=false');
  }
  const list = read();
  const idx = list.findIndex(x => String(x.id) === String(id));
  if (idx === -1) return delay().then(() => asAxios(null));
  const prev = list[idx];
  const updated = normalize({
    ...prev,
    nome_completo: data.nome_completo ?? data.nome ?? prev.nome_completo ?? prev.nome,
    cpf_cnpj: data.cpf_cnpj ?? data.cpf ?? data.cnpj ?? prev.cpf_cnpj,
    email: data.email ?? prev.email,
    telefone: data.telefone ?? prev.telefone,
    cep: data.cep ?? prev.cep,
    logradouro: data.logradouro ?? data.rua ?? prev.logradouro,
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

// DELETE /fornecedores/:id
export const deleteSupplier = (id) => {
  if (!IS_DEMO) {
    // return api.delete(`fornecedores/${id}/`);
    throw new Error('Configure sua API aqui quando IS_DEMO=false');
  }
  const list = read().filter(x => String(x.id) !== String(id));
  write(list);
  return delay().then(() => asAxios({ ok: true }));
};

/*import api from './api';

export const getSuppliers = () => api.get('fornecedores/');
export const getSupplier = (id) => api.get(`fornecedores/${id}/`);
export const createSupplier = (data) => api.post('fornecedores/', data);
export const updateSupplier = (id, data) => api.put(`fornecedores/${id}/`, data);
export const deleteSupplier = (id) => api.delete(`fornecedores/${id}/`);
*/

