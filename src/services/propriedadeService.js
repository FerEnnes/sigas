import { IS_DEMO } from './demoFlags';
// Se já tiver um axios "api", descomente a linha abaixo e use nas rotas reais
// import api from './api';

// =================== MOCK (localStorage) ===================
const STORAGE_KEY = 'demo_properties';

const DEFAULT_PROPERTIES = [
  {
    id: 1,
    nome: 'Sítio Boa Esperança',
    area_ha: 12.5,
    cep: '88330-001',
    logradouro: 'Estrada Geral',
    numero: '1200',
    complemento: '',
    bairro: 'Interior',
    cidade: 'Balneário Camboriú',
    estado: 'SC',
    telefone: '(47) 98888-0201',
    email: 'contato@boaesperanca.dev',
  },
  {
    id: 2,
    nome: 'Fazenda Santa Luzia',
    area_ha: 250,
    cep: '89010-020',
    logradouro: 'BR-470',
    numero: 'S/N',
    complemento: 'Portão 2',
    bairro: 'Zona Rural',
    cidade: 'Blumenau',
    estado: 'SC',
    telefone: '(47) 98888-0202',
    email: 'fazenda@santaluzia.dev',
  },
  {
    id: 3,
    nome: 'Chácara Recanto Verde',
    area_ha: 6.2,
    cep: '89200-050',
    logradouro: 'Rua das Araucárias',
    numero: '45',
    complemento: '',
    bairro: 'Interior',
    cidade: 'Joinville',
    estado: 'SC',
    telefone: '(47) 98888-0203',
    email: 'recanto@verde.dev',
  },
  {
    id: 4,
    nome: 'Sítio Horizonte',
    area_ha: 18.9,
    cep: '88010-030',
    logradouro: 'Estrada Velha',
    numero: '300',
    complemento: 'Galpão B',
    bairro: 'Mato Alto',
    cidade: 'Florianópolis',
    estado: 'SC',
    telefone: '(48) 98888-0204',
    email: 'sitio@horizonte.dev',
  },
  {
    id: 5,
    nome: 'Fazenda Dois Rios',
    area_ha: 540,
    cep: '88700-040',
    logradouro: 'Rod. SC-108',
    numero: 'KM 12',
    complemento: '',
    bairro: 'Rural',
    cidade: 'Tubarão',
    estado: 'SC',
    telefone: '(48) 98888-0205',
    email: 'contato@doisrios.dev',
  },
];

const delay = (ms = 80) => new Promise(r => setTimeout(r, ms));
const asAxios = (data) => Promise.resolve({ data });

const normalize = (p) => ({
  ...p,
  endereco: [
    p.logradouro, p.numero, p.complemento ? `(${p.complemento})` : '',
    '—', p.bairro, p.cidade, p.estado, p.cep
  ].filter(Boolean).join(' '),
});

function read() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROPERTIES));
    return DEFAULT_PROPERTIES.map(normalize);
  }
  try { return JSON.parse(raw).map(normalize); } catch { return DEFAULT_PROPERTIES.map(normalize); }
}
function write(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list.map(normalize);
}
function nextId(list) {
  return list.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;
}
// ==========================================================

// GET /propriedades/
export const getProperties = () => {
  if (!IS_DEMO) {
    // return api.get('propriedades/');
    throw new Error('Configure sua API aqui quando IS_DEMO=false');
  }
  return delay().then(() => asAxios(read()));
};

// GET /propriedades/:id
export const getProperty = (id) => {
  if (!IS_DEMO) {
    // return api.get(`propriedades/${id}/`);
    throw new Error('Configure sua API aqui quando IS_DEMO=false');
  }
  const p = read().find(x => String(x.id) === String(id)) || null;
  return delay().then(() => asAxios(p));
};

// POST /propriedades/
export const createProperty = (data) => {
  if (!IS_DEMO) {
    // return api.post('propriedades/', data);
    throw new Error('Configure sua API aqui quando IS_DEMO=false');
  }
  const list = read();
  const id = nextId(list);
  const novo = normalize({
    id,
    nome: data.nome ?? data.nome_propriedade ?? '',
    area_ha: Number(data.area_ha ?? data.area ?? 0),
    cep: data.cep ?? '',
    logradouro: data.logradouro ?? data.rua ?? '',
    numero: String(data.numero ?? ''),
    complemento: data.complemento ?? '',
    bairro: data.bairro ?? '',
    cidade: data.cidade ?? '',
    estado: data.estado ?? '',
    telefone: data.telefone ?? '',
    email: data.email ?? '',
  });
  write([novo, ...list]);
  return delay().then(() => asAxios(novo));
};

// PUT /propriedades/:id
export const updateProperty = (id, data) => {
  if (!IS_DEMO) {
    // return api.put(`propriedades/${id}/`, data);
    throw new Error('Configure sua API aqui quando IS_DEMO=false');
  }
  const list = read();
  const idx = list.findIndex(x => String(x.id) === String(id));
  if (idx === -1) return delay().then(() => asAxios(null));
  const prev = list[idx];
  const updated = normalize({
    ...prev,
    nome: data.nome ?? data.nome_propriedade ?? prev.nome,
    area_ha: data.area_ha !== undefined ? Number(data.area_ha) : prev.area_ha,
    cep: data.cep ?? prev.cep,
    logradouro: data.logradouro ?? data.rua ?? prev.logradouro,
    numero: data.numero !== undefined ? String(data.numero) : prev.numero,
    complemento: data.complemento ?? prev.complemento,
    bairro: data.bairro ?? prev.bairro,
    cidade: data.cidade ?? prev.cidade,
    estado: data.estado ?? prev.estado,
    telefone: data.telefone ?? prev.telefone,
    email: data.email ?? prev.email,
  });
  list[idx] = updated;
  write(list);
  return delay().then(() => asAxios(updated));
};

// DELETE /propriedades/:id
export const deleteProperty = (id) => {
  if (!IS_DEMO) {
    // return api.delete(`propriedades/${id}/`);
    throw new Error('Configure sua API aqui quando IS_DEMO=false');
  }
  const list = read().filter(x => String(x.id) !== String(id));
  write(list);
  return delay().then(() => asAxios({ ok: true }));
};



/*import api from './api';

export const getProperties = () => api.get('propriedades/');
export const getProperty = (id) => api.get(`propriedades/${id}/`);
export const createProperty = (data) => api.post('propriedades/', data);
export const updateProperty = (id, data) => api.put(`propriedades/${id}/`, data);
export const deleteProperty = (id) => api.delete(`propriedades/${id}/`);
*/
