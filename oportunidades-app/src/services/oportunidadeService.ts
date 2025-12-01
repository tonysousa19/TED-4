import api from './api';
import type { Oportunidade, NovaOportunidade } from '../types';

export const oportunidadeService = {
  async getOportunidades(): Promise<Oportunidade[]> {
    try {
      const response = await api.get('/oportunidades');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar oportunidades:', error);
      return [];
    }
  },

  async getOportunidadePorId(id: number): Promise<Oportunidade> {
    try {
      const response = await api.get(`/oportunidades/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar oportunidade ${id}:`, error);
      throw new Error(`Oportunidade não encontrada: ${error.message}`);
    }
  },

  async getMinhasOportunidades(): Promise<Oportunidade[]> {
    try {
      const response = await api.get('/minhas-oportunidades');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar minhas oportunidades:', error);
      return [];
    }
  },

  async criarOportunidade(dados: NovaOportunidade): Promise<Oportunidade> {
    try {
      console.log('Enviando dados para criar oportunidade:', dados);
      const response = await api.post('/oportunidades', dados);
      return response.data;
    } catch (error: any) {
      console.error('Erro detalhado ao criar oportunidade:', error);

      if (error.response?.data?.erro?.includes('Organização não encontrada')) {
        throw new Error('Organização não encontrada. Verifique se você está cadastrado como organização.');
      }

      if (error.response?.data?.erro) {
        throw new Error(error.response.data.erro);
      }

      throw new Error('Erro ao criar oportunidade. Verifique sua conexão e tente novamente.');
    }
  },

  async atualizarOportunidade(id: number, dados: Partial<Oportunidade>): Promise<Oportunidade> {
    try {
      const response = await api.put(`/oportunidades/${id}`, dados);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao atualizar oportunidade ${id}:`, error);
      throw new Error('Erro ao atualizar oportunidade. Tente novamente.');
    }
  },

  async deletarOportunidade(id: number): Promise<void> {
    try {
      console.log(`🔴 Excluindo oportunidade ${id} do banco de dados...`);

      await api.delete(`/oportunidades/${id}`);

      console.log(`✅ Oportunidade ${id} excluída com sucesso do banco de dados`);

    } catch (error: any) {
      console.error(`❌ Erro ao excluir oportunidade ${id}:`, error);

      console.log('📋 Detalhes do erro:');
      console.log('- URL:', error.config?.url);
      console.log('- Status:', error.response?.status);
      console.log('- Mensagem:', error.response?.data?.erro || error.message);
      console.log('- Dados:', error.response?.data);

      if (error.response?.status === 403) {
        throw new Error('Você não tem permissão para excluir esta oportunidade.');
      }

      if (error.response?.status === 404) {
        throw new Error('Oportunidade não encontrada ou já foi excluída.');
      }

      if (error.response?.data?.erro) {
        throw new Error(error.response.data.erro);
      }

      throw new Error(`Falha ao excluir oportunidade: ${error.message}`);
    }
  },

  async inscreverOportunidade(oportunidadeId: number): Promise<void> {
    try {
      await api.post(`/oportunidades/${oportunidadeId}/inscrever`);
    } catch (error: any) {
      console.error(`Erro ao inscrever na oportunidade ${oportunidadeId}:`, error);
      throw new Error('Erro ao realizar inscrição. Tente novamente.');
    }
  },

  async getMinhasInscricoes(): Promise<any[]> {
    try {
      const response = await api.get('/minhas-inscricoes');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar minhas inscrições:', error);
      return [];
    }
  },

  async buscarOportunidades(filtros: Partial<FiltrosBusca>): Promise<Oportunidade[]> {
    try {
      const params = new URLSearchParams();

      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== null && value !== '' && value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/oportunidades/busca?${params.toString()}`);
      return response.data;

    } catch (error: any) {
      console.error('Erro ao buscar oportunidades com filtros:', error);
      return [];
    }
  },

  async getAreas(): Promise<string[]> {
    try {
      const response = await api.get('/oportunidades/areas');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar áreas:', error);
      return ['Tecnologia', 'Saúde', 'Educação', 'Negócios', 'Artes', 'Esportes'];
    }
  },

  async getLocalizacoes(): Promise<string[]> {
    try {
      const response = await api.get('/oportunidades/localizacoes');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar localizações:', error);
      return ['Online', 'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador'];
    }
  },

  async desativarOportunidade(id: number): Promise<Oportunidade> {
    try {
      console.log(`🟡 Desativando oportunidade ${id}...`);

      const response = await api.put(`/oportunidades/${id}`, { 
        is_active: false,
        updatedAt: new Date().toISOString()
      });

      console.log(`✅ Oportunidade ${id} desativada com sucesso`);
      return response.data;

    } catch (error: any) {
      console.error(`❌ Erro ao desativar oportunidade ${id}:`, error);
      throw new Error('Não foi possível desativar a oportunidade. Tente excluir diretamente.');
    }
  },

  async verificarPermissao(oportunidadeId: number): Promise<boolean> {
    try {

      const minhasOportunidades = await this.getMinhasOportunidades();
      return minhasOportunidades.some(op => op.id === oportunidadeId);
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      return false;
    }
  },

  async excluirForcadamente(id: number): Promise<void> {
    try {
      console.log(`⚠️ Tentando exclusão forçada da oportunidade ${id}...`);

      try {

        await this.deletarOportunidade(id);
      } catch (error1) {
        console.log('Primeira tentativa falhou, tentando desativar...');

        try {

          await this.desativarOportunidade(id);
        } catch (error2) {
          console.log('Desativação também falhou...');
          throw new Error('Não foi possível remover a oportunidade de nenhuma forma.');
        }
      }

    } catch (error) {
      console.error(`❌ Falha na exclusão forçada:`, error);
      throw error;
    }
  }
};