import api from './api';

export const getUsers = () => api.get('usuarios/');
export const getUser = (id) => api.get(`usuarios/${id}/`);
export const createUser = (data) => api.post('usuarios/', data);
export const updateUser = (id, data) => api.put(`usuarios/${id}/`, data);
export const deleteUser = (id) => api.delete(`usuarios/${id}/`);

export const inactivateUser = (id) => api.put(`usuarios/${id}/inativar/`);
export const activateUser = (id) => api.put(`usuarios/${id}/ativar/`);
