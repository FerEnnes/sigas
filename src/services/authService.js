import axios from 'axios';

const API_URL = 'http://localhost:8000/api/login/';

export const login = async (credentials) => {
  const response = await axios.post(API_URL, credentials);
  const data = response.data;

  console.log('Resposta da API de login:', data); // <- Adicione isso

  localStorage.setItem('userId', data.id);
  localStorage.setItem('username', data.username);
  localStorage.setItem('tipoUsuario', data.tipousuario);

  return data;
};
