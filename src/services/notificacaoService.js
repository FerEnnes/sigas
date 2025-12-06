import api from './api';

export const getNotificacoes = () => {
  return api.get('/notificacoes/');
};