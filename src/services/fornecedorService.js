import api from './api';

export const getSuppliers = () => {
  return api.get('fornecedores/');
};

export const getSupplier = (id) => {
  return api.get(`fornecedores/${id}/`);
};

export const createSupplier = (data) => {
  return api.post('fornecedores/', data);
};

export const updateSupplier = (id, data) => {
  return api.put(`fornecedores/${id}/`, data);
};

export const deleteSupplier = (id) => {
  return api.delete(`fornecedores/${id}/`);
};

export default {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
