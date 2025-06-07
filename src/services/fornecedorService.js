import api from './api';

export const getSuppliers = () => api.get('fornecedores/');
export const getSupplier = (id) => api.get(`fornecedores/${id}/`);
export const createSupplier = (data) => api.post('fornecedores/', data);
export const updateSupplier = (id, data) => api.put(`fornecedores/${id}/`, data);
export const deleteSupplier = (id) => api.delete(`fornecedores/${id}/`);
