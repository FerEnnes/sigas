import api from './api';

// Lista todas as propriedades: GET /propriedades/
export async function getProperties() {
  const response = await api.get('propriedades/');
  return response.data;
}

// Detalhe de uma propriedade: GET /propriedades/:id
export async function getProperty(id) {
  const response = await api.get(`propriedades/${id}/`);
  return response.data;
}

// Cria propriedade: POST /propriedades/
export async function createProperty(data) {
  const response = await api.post('propriedades/', data);
  return response.data;
}

// Atualiza propriedade: PUT /propriedades/:id
export async function updateProperty(id, data) {
  const response = await api.put(`propriedades/${id}/`, data);
  return response.data;
}

// Deleta propriedade: DELETE /propriedades/:id
export async function deleteProperty(id) {
  const response = await api.delete(`propriedades/${id}/`);
  return response.data;
}
