import api from './api';
import type { Usuario, RegisterData } from '../types';

export const authService = {
  async login(email: string, senha: string) {
    try {
      const response = await api.post('/auth/login', { email, senha });
      return response.data;
    } catch (error: any) {
      console.error('Erro no serviço de login:', error);
      if (error.response) {

        throw new Error(error.response.data.erro || 'Erro ao fazer login');
      } else if (error.request) {

        throw new Error('Servidor não respondeu. Verifique se a API está rodando.');
      } else {

        throw new Error('Erro ao configurar a requisição');
      }
    }
  },

  async register(dados: RegisterData) {
    try {
      const response = await api.post('/auth/register', dados);
      return response.data;
    } catch (error: any) {
      console.error('Erro no serviço de registro:', error);
      if (error.response) {
        throw new Error(error.response.data.erro || 'Erro ao criar conta');
      } else if (error.request) {
        throw new Error('Servidor não respondeu. Verifique se a API está rodando.');
      } else {
        throw new Error('Erro ao configurar a requisição');
      }
    }
  },

  async getPerfil() {
    try {
      const response = await api.get('/auth/perfil');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  },
};