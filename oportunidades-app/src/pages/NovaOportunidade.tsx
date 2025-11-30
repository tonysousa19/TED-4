import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import type { NovaOportunidade } from '../types';
import { oportunidadeService } from '../services/oportunidadeService';

const NovaOportunidade: React.FC = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  
  const [dados, setDados] = useState<NovaOportunidade>({
    titulo: '',
    descricao: '',
    localizacao: '',
    area: '',
    vagas: 1,
    data_inicio: '',
    data_fim: '',
    prazo_inscricao: '',
    max_participantes: 50,
    requires_approval: false,
    link: '',
    imagem: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400',
    categoria_id: undefined
  });

  // Verificar se é organização
  if (usuario?.role !== 'organization') {
    return (
      <div style={{padding: '40px', textAlign: 'center'}}>
        <h2>Acesso Restrito</h2>
        <p>Somente organizações podem criar oportunidades.</p>
        <Link to="/" className="btn">Voltar à Home</Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setDados(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setDados(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setDados(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      console.log('Enviando dados para criar oportunidade:', dados);
      await oportunidadeService.criarOportunidade(dados);
      navigate('/perfil');
    } catch (error: any) {
      console.error('Erro ao criar oportunidade:', error);
      setErro(error.message || 'Erro ao criar oportunidade');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-info">
              <h1>➕ Nova Oportunidade</h1>
              <p>Crie uma nova oportunidade para atrair participantes</p>
            </div>
            
            <div className="user-info">
              <Link to="/perfil" className="btn" style={{background: '#6b7280'}}>
                Voltar ao Perfil
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="dashboard">
          <div className="dashboard-card">
            <form onSubmit={handleSubmit} style={{maxWidth: '600px', margin: '0 auto'}}>
              {erro && (
                <div className="alert alert-error">
                  <strong>Erro:</strong> {erro}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="titulo">Título da Oportunidade *</label>
                <input
                  id="titulo"
                  name="titulo"
                  type="text"
                  required
                  value={dados.titulo}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: Workshop de Programação Web"
                />
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição *</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  required
                  value={dados.descricao}
                  onChange={handleChange}
                  className="form-control"
                  rows={4}
                  placeholder="Descreva detalhadamente a oportunidade..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="localizacao">Localização *</label>
                <input
                  id="localizacao"
                  name="localizacao"
                  type="text"
                  required
                  value={dados.localizacao}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: Online, São Paulo-SP, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="area">Área de Atuação *</label>
                <input
                  id="area"
                  name="area"
                  type="text"
                  required
                  value={dados.area}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: Tecnologia, Marketing, Design..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="vagas">Número de Vagas *</label>
                <input
                  id="vagas"
                  name="vagas"
                  type="number"
                  required
                  min="1"
                  value={dados.vagas}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="max_participantes">Máximo de Participantes</label>
                <input
                  id="max_participantes"
                  name="max_participantes"
                  type="number"
                  min="1"
                  value={dados.max_participantes}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="prazo_inscricao">Prazo de Inscrição *</label>
                <input
                  id="prazo_inscricao"
                  name="prazo_inscricao"
                  type="date"
                  required
                  value={dados.prazo_inscricao}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="data_inicio">Data de Início</label>
                <input
                  id="data_inicio"
                  name="data_inicio"
                  type="date"
                  value={dados.data_inicio}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="data_fim">Data de Término</label>
                <input
                  id="data_fim"
                  name="data_fim"
                  type="date"
                  value={dados.data_fim}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoria_id">Categoria (Opcional)</label>
                <select
                  id="categoria_id"
                  name="categoria_id"
                  value={dados.categoria_id || ''}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="1">Tecnologia</option>
                  <option value="2">Marketing</option>
                  <option value="3">Design</option>
                  <option value="4">Educação</option>
                  <option value="5">Saúde</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="link">Link para Inscrição (Opcional)</label>
                <input
                  id="link"
                  name="link"
                  type="url"
                  value={dados.link}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="imagem">URL da Imagem (Opcional)</label>
                <input
                  id="imagem"
                  name="imagem"
                  type="url"
                  value={dados.imagem}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                <small style={{color: '#6b7280', fontSize: '12px'}}>
                  Dica: Use imagens do Unsplash como 
                  https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400
                </small>
              </div>

              <div className="form-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <input
                    name="requires_approval"
                    type="checkbox"
                    checked={dados.requires_approval}
                    onChange={handleChange}
                  />
                  Requer aprovação manual das inscrições
                </label>
                <small style={{color: '#6b7280', fontSize: '12px'}}>
                  Se marcado, você precisará aprovar manualmente cada inscrição
                </small>
              </div>

              <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                <button
                  type="submit"
                  disabled={carregando}
                  className="btn btn-primary"
                  style={{flex: 1}}
                >
                  {carregando ? 'Criando...' : 'Criar Oportunidade'}
                </button>
                
                <Link 
                  to="/perfil" 
                  className="btn" 
                  style={{background: '#6b7280'}}
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NovaOportunidade;