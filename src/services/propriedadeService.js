import api from './api';

export const getProperties = () => api.get('propriedades/');
export const getProperty = (id) => api.get(`propriedades/${id}/`);
export const createProperty = (data) => api.post('propriedades/', data);
export const updateProperty = (id, data) => api.put(`propriedades/${id}/`, data);
export const deleteProperty = (id) => api.delete(`propriedades/${id}/`);
