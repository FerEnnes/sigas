/*import axios from 'axios';

const API_URL = 'http://localhost:8000/api/login/';

export const login = async (credentials) => {
  const response = await axios.post(API_URL, credentials);
  const data = response.data;

  console.log('Resposta da API de login:', data); // <- Adicione isso

  localStorage.setItem('userId', data.id);
  localStorage.setItem('username', data.username);
  localStorage.setItem('tipoUsuario', data.tipousuario);

  return data;
};*/
import axios from 'axios';
import { IS_DEMO } from './demoFlags';

const BASE_URL  = 'http://127.0.0.1:8000';
const LOGIN_PATH = '/api/login/';

function persistUserAllKeys({ id, username, nome, tipoUsuario, token, email }) {
  // token e identidade
  localStorage.setItem('token', token || 'demo-admin-token');
  localStorage.setItem('userId', String(id ?? ''));
  localStorage.setItem('username', String(username ?? ''));
  localStorage.setItem('nome', String(nome ?? username ?? 'Usuario'));

  // >>> compatibilidade: salva com U maiúsculo e minúsculo
  localStorage.setItem('tipoUsuario', String(tipoUsuario ?? '0'));
  localStorage.setItem('tipousuario', String(tipoUsuario ?? '0'));

  // roles + objeto completo
  const roles = String(tipoUsuario) === '1' ? ['admin'] : ['user'];
  const userObj = { id, username, nome: nome ?? username, tipoUsuario, roles, email };
  localStorage.setItem('roles', JSON.stringify(roles));
  localStorage.setItem('user', JSON.stringify(userObj));
}

export const login = async (credentials) => {
  // ---- MODO DEMO: SEM BACKEND ----
  if (IS_DEMO) {
    const email = credentials?.email || credentials?.username || 'admin@email.com';
    persistUserAllKeys({
      id: 'demo-admin',
      username: 'admin_dev',
      nome: 'admin_dev',
      tipoUsuario: '1', 
      token: 'demo-admin-token',
      email,
    });
    return {
      id: 'demo-admin',
      username: 'admin_dev',
      nome: 'admin_dev',
      email,
      tipoUsuario: '1',
      token: 'demo-admin-token',
      demo: true,
    };
  }

  // ---- Modo normal (quando o backend estiver ligado) ----
  const url = `${BASE_URL}${LOGIN_PATH}`;
  const { data } = await axios.post(url, credentials);

  const token = data.token || data.access || data.access_token || data.jwt || 'dev-bypass-token';
  const id = data.id ?? data.userId ?? data.user?.id ?? data.user?.userId ?? null;
  const username = data.username ?? data.user?.username ?? data.email ?? credentials.email ?? 'usuario';
  const rawTipo = data.tipoUsuario ?? data.tipousuario ?? data.role ?? data.user?.tipoUsuario ?? data.user?.role ?? null;
  const tipoUsuario = (String(rawTipo).toLowerCase() === '1' || String(rawTipo).toLowerCase() === 'admin') ? '1' : '0';

  persistUserAllKeys({ id, username, nome: username, tipoUsuario, token, email: credentials.email || data.email });
  return data;
};


