import api from './api';

export const getClients = () => api.get('clientes/');
export const getClient = (id) => api.get(`clientes/${id}/`);
export const createClient = (data) => api.post('clientes/', data);
export const updateClient = (id, data) => api.put(`clientes/${id}/`, data);
export const deleteClient = (id) => api.delete(`clientes/${id}/`);
