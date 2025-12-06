import api from './api';

// Normaliza o objeto vindo do backend para o formato que a UI usa hoje
const normalize = (c) => {
  const nome = c.nome ?? c.nome_completo ?? c.nomeCompleto ?? '';

  const enderecoStr = [
    c.rua ?? c.logradouro,
    c.numero,
    c.complemento ? `(${c.complemento})` : '',
    '—',
    c.bairro,
    c.cidade,
    c.estado,
    c.cep,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    ...c,
    nome,          // usado na tabela/lista
    endereco: enderecoStr,
    address: {     // usado no modal/detalhes
      cep: c.cep,
      rua: c.rua ?? c.logradouro,
      numero: c.numero,
      complemento: c.complemento,
      bairro: c.bairro,
      cidade: c.cidade,
      estado: c.estado,
    },
  };
};

// GET /clientes/
export const getClients = () => {
  return api.get('clientes/').then((res) => {
    const arr = Array.isArray(res.data) ? res.data : [];
    return { ...res, data: arr.map(normalize) };
  });
};

// GET /clientes/:id
export const getClient = (id) => {
  return api.get(`clientes/${id}/`).then((res) => {
    return { ...res, data: normalize(res.data) };
  });
};

// POST /clientes/
export const createClient = (data) => {
  return api.post('clientes/', data).then((res) => {
    return { ...res, data: normalize(res.data) };
  });
};

// PUT /clientes/:id
export const updateClient = (id, data) => {
  return api.put(`clientes/${id}/`, data).then((res) => {
    return { ...res, data: normalize(res.data) };
  });
};

// DELETE /clientes/:id
export const deleteClient = (id) => {
  return api.delete(`clientes/${id}/`);
};
