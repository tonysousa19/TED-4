import api from './api';
import type { Oportunidade } from '../types';

export const favoritoService = {
  // Listar favoritos do usuário
  async getFavoritos(): Promise<Oportunidade[]> {
    try {
      const response = await api.get('/favoritos');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar favoritos:', error);
      if (error.response?.status === 404) {
        console.log('Endpoint de favoritos não encontrado - talvez não esteja implementado');
        return [];
      }
      throw new Error('Erro ao carregar favoritos');
    }
  },

  // Adicionar oportunidade aos favoritos
  async adicionarFavorito(oportunidadeId: number): Promise<void> {
    try {
      const response = await api.post('/favoritos', { oportunidade_id: oportunidadeId });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao adicionar favorito:', error);
      if (error.response?.status === 404) {
        throw new Error('Funcionalidade de favoritos não disponível no momento');
      }
      throw new Error('Erro ao favoritar oportunidade');
    }
  },

  // Remover oportunidade dos favoritos
  async removerFavorito(oportunidadeId: number): Promise<void> {
    try {
      const response = await api.delete(`/favoritos/${oportunidadeId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao remover favorito:', error);
      if (error.response?.status === 404) {
        throw new Error('Funcionalidade de favoritos não disponível no momento');
      }
      throw new Error('Erro ao remover favorito');
    }
  },

  // Verificar se uma oportunidade está favoritada
  async verificarFavorito(oportunidadeId: number): Promise<boolean> {
    try {
      const response = await api.get(`/favoritos/verificar/${oportunidadeId}`);
      return response.data.isFavorito;
    } catch (error: any) {
      console.error('Erro ao verificar favorito:', error);
      return false;
    }
  }
};