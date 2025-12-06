import axios from 'axios';
import { IS_DEMO } from './demoFlags';

const BASE_URL   = 'http://127.0.0.1:8000';
const LOGIN_PATH = '/api/login/';

function persistUserAllKeys({ id, username, nome, tipoUsuario, token, email }) {
  localStorage.setItem('token', token || '');
  localStorage.setItem('userId', String(id ?? ''));
  localStorage.setItem('username', String(username ?? ''));
  localStorage.setItem('nome', String(nome ?? username ?? 'Usuário'));

  localStorage.setItem('tipoUsuario', String(tipoUsuario ?? '0'));
  localStorage.setItem('tipousuario', String(tipoUsuario ?? '0'));

  const roles = String(tipoUsuario) === '1' ? ['admin'] : ['user'];
  const userObj = { id, username, nome, tipoUsuario, roles, email };
  localStorage.setItem('roles', JSON.stringify(roles));
  localStorage.setItem('user', JSON.stringify(userObj));
}

export const login = async (credentials) => {
  if (IS_DEMO) {
  }

  const url = `${BASE_URL}${LOGIN_PATH}`;
  const { data } = await axios.post(url, credentials);

  const token = data.token || data.access || data.access_token || data.jwt || '';
  const user  = data.user || data;

  const id       = user.id ?? data.id ?? null;
  const username = user.username ?? data.username ?? credentials.username;

  const nome =
    data.nome ||
    user.nome ||
    [user.first_name, user.last_name].filter(Boolean).join(' ') ||
    username;

  const rawTipo =
    data.tipoUsuario ??
    data.tipousuario ??
    user.tipoUsuario ??
    user.tipousuario ??
    '2'; // default comum

  const tipoStr = String(rawTipo).toLowerCase();
  const tipoUsuario =
    tipoStr === '1' || tipoStr === 'admin'
      ? '1' // admin
      : '2'; // comum

  persistUserAllKeys({
    id,
    username,
    nome,
    tipoUsuario,
    token,
    email: user.email || data.email || credentials.email,
  });

  return data;
};
