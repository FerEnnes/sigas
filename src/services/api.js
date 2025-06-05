// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', 
  withCredentials: false, // se estiver usando autenticação baseada em cookies
});

export default api;
