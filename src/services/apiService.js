// src/services/apiService.js
import axios from 'axios';


export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  
  headers: {
    'Content-Type': 'application/json'
  }
});
//auth
export const postTenant = (dados) => publicApi.post('/tenant', dados) //revisado
export const existTenantBySlug = (slug) => publicApi.get(`/tenant/slug/${slug}`) //revisado
export const confirmarEmail = (dados) => publicApi.post(`/auth/confirmaremail`, dados) //revisado
export const existUserByEmail = (email) => publicApi.get(`auth/${email}`) //revisado
export const fazerLogin = (dados) => api.post('/auth/login', dados) //manter assim por enquanto. está dando conflito com o nome de uma variável interna do component de realizar login

//public
export const getHorariosAgendamentos = (tenantId) => publicApi.get(`agendamento/${tenantId}`)
export const criarAgendamento = (dados) => publicApi.post('/agendamento', dados)
export const getTenantPublic = (slug) => publicApi.get(`/tenant/${slug}`)

//private
export const arquivarProcedimento = (id) => api.patch(`/procedimento/${id}`)
export const excluirProcedimento = (id) => api.delete(`/procedimento/${id}`)
export const criarProcedimentos = (procedimentos) => api.post('/procedimento', procedimentos)
export const criarTenant = (tenant) => api.post('/tenant', tenant)
export const getTenant = () => api.get('/tenant')
export const checkLogin = () => api.get('/auth/check')
export const logout = () => api.post('/auth/logout');


export const uploadImagemTenant = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/image/tenant", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default api;
