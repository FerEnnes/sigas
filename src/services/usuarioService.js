/*import api from './api';

export const getUsers = () => api.get('usuarios/');
export const getUser = (id) => api.get(`usuarios/${id}/`);
export const createUser = (data) => api.post('usuarios/', data);
export const updateUser = (id, data) => api.put(`usuarios/${id}/`, data);
export const deleteUser = (id) => api.delete(`usuarios/${id}/`);

export const inactivateUser = (id) => api.put(`usuarios/${id}/inativar/`);
export const activateUser = (id) => api.put(`usuarios/${id}/ativar/`);
*/
// src/services/usuarioService.js
import api from './api';
import { IS_DEMO } from './demoFlags';

// ====== MOCK (localStorage) ======
const STORAGE_KEY = 'demo_users';

const DEFAULT_USERS = [
  {
    id: 1,
    username: 'ana',
    first_name: 'Ana',
    last_name: 'Silva',
    email: 'ana.silva@sigas.dev',
    telefone: '(47) 98888-0001',
    tipousuario: '1', // 1 = admin
    status: 'ativo',
  },
  {
    id: 2,
    username: 'joao',
    first_name: 'João',
    last_name: 'Santos',
    email: 'joao.santos@sigas.dev',
    telefone: '(47) 98888-0002',
    tipousuario: '0',
    status: 'ativo',
  },
  {
    id: 3,
    username: 'maria',
    first_name: 'Maria',
    last_name: 'Oliveira',
    email: 'maria.oliveira@sigas.dev',
    telefone: '(47) 98888-0003',
    tipousuario: '0',
    status: 'inativo',
  },
];

const delay = (ms = 80) => new Promise(r => setTimeout(r, ms));
const asAxios = (data) => Promise.resolve({ data });

function read() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try { return JSON.parse(raw); } catch { return DEFAULT_USERS; }
}
function write(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}
function nextId(list) {
  const max = list.reduce((m, u) => Math.max(m, Number(u.id) || 0), 0);
  return max + 1;
}
// =================================

// GET /usuarios/
export const getUsers = () => {
  if (!IS_DEMO) return api.get('usuarios/');
  const list = read();
  return delay().then(() => asAxios(list));
};

// GET /usuarios/:id
export const getUser = (id) => {
  if (!IS_DEMO) return api.get(`usuarios/${id}/`);
  const user = read().find(u => String(u.id) === String(id)) || null;
  return delay().then(() => asAxios(user));
};

// POST /usuarios/
export const createUser = (data) => {
  if (!IS_DEMO) return api.post('usuarios/', data);

  const list = read();
  const id = nextId(list);
  const novo = {
    id,
    username: data.username || (data.email ? data.email.split('@')[0] : `user_${id}`),
    first_name: data.first_name || data.nome || '',
    last_name: data.last_name || data.sobrenome || '',
    email: data.email || '',
    telefone: data.telefone || '',
    tipousuario: String(data.tipousuario ?? '0'),
    status: data.status || 'ativo',
  };
  write([novo, ...list]);
  return delay().then(() => asAxios(novo));
};

// PUT /usuarios/:id
export const updateUser = (id, data) => {
  if (!IS_DEMO) return api.put(`usuarios/${id}/`, data);

  const list = read();
  const idx = list.findIndex(u => String(u.id) === String(id));
  if (idx === -1) return delay().then(() => asAxios(null));

  list[idx] = {
    ...list[idx],
    ...data,
    tipousuario: data.tipousuario !== undefined ? String(data.tipousuario) : list[idx].tipousuario,
  };
  write(list);
  return delay().then(() => asAxios(list[idx]));
};

// DELETE /usuarios/:id
export const deleteUser = (id) => {
  if (!IS_DEMO) return api.delete(`usuarios/${id}/`);

  const list = read().filter(u => String(u.id) !== String(id));
  write(list);
  return delay().then(() => asAxios({ ok: true }));
};

// PUT /usuarios/:id/inativar/
export const inactivateUser = (id) => {
  if (!IS_DEMO) return api.put(`usuarios/${id}/inativar/`);

  const list = read();
  const idx = list.findIndex(u => String(u.id) === String(id));
  if (idx === -1) return delay().then(() => asAxios(null));
  list[idx].status = 'inativo';
  write(list);
  return delay().then(() => asAxios(list[idx]));
};

// PUT /usuarios/:id/ativar/
export const activateUser = (id) => {
  if (!IS_DEMO) return api.put(`usuarios/${id}/ativar/`);

  const list = read();
  const idx = list.findIndex(u => String(u.id) === String(id));
  if (idx === -1) return delay().then(() => asAxios(null));
  list[idx].status = 'ativo';
  write(list);
  return delay().then(() => asAxios(list[idx]));
};
