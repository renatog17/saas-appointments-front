// src/services/apiService.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const publicApi = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getTenantPublic = (slug) => publicApi.get(`/tenant/${slug}`);
export const criarAgendamento = (dados) => publicApi.post('/agendamento', dados);

export const getTenant = () => api.get('/tenant');



export const arquivarProcedimento = (id) => api.patch(`/procedimento/${id}`);
export const excluirProcedimento = (id) => api.delete(`/procedimento/${id}`);
export const criarProcedimentos = (procedimentos) => api.post('/procedimento', procedimentos);




export default api;
