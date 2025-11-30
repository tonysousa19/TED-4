import api from './api';
import type { Oportunidade, NovaOportunidade } from '../types';

export const oportunidadeService = {
  async getOportunidades(): Promise<Oportunidade[]> {
    const response = await api.get('/oportunidades');
    return response.data;
  },

  async getMinhasOportunidades(): Promise<Oportunidade[]> {
    try {
      const response = await api.get('/minhas-oportunidades');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar minhas oportunidades:', error);
      // Se não encontrar organização, retornar array vazio
      if (error.response?.status === 404 || error.response?.data?.erro?.includes('Organização não encontrada')) {
        return [];
      }
      throw error;
    }
  },

  async criarOportunidade(dados: NovaOportunidade): Promise<Oportunidade> {
    try {
      const response = await api.post('/oportunidades', dados);
      return response.data;
    } catch (error: any) {
      console.error('Erro detalhado no serviço:', error);
      
      // Se o backend retornar erro de organização não encontrada
      if (error.response?.data?.erro?.includes('Organização não encontrada')) {
        throw new Error('Organização não encontrada. O sistema tentará criar uma automaticamente.');
      }
      
      if (error.response?.data?.erro) {
        throw new Error(error.response.data.erro);
      }
      throw new Error('Erro ao criar oportunidade. Tente novamente.');
    }
  }
};