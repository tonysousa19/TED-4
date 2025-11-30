import axios from 'axios';

// Mude para a porta correta (4000 conforme seu server.js)
const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;