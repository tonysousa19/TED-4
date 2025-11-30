import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import type { Oportunidade } from '../types';
import { oportunidadeService } from '../services/oportunidadeService';
import { favoritoService } from '../services/favoritoService';

const Home: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [oportunidadesFiltradas, setOportunidadesFiltradas] = useState<Oportunidade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());

  const [termoBusca, setTermoBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('todas');

  const categorias = [
    { id: 'todas', nome: 'Todas as Categorias', icone: '🌐' },
    { id: 'tecnologia', nome: 'Tecnologia', icone: '💻' },
    { id: 'saude', nome: 'Saúde', icone: '🏥' },
    { id: 'educacao', nome: 'Educação', icone: '📚' },
    { id: 'negocios', nome: 'Negócios', icone: '💼' },
    { id: 'artes', nome: 'Artes', icone: '🎨' },
    { id: 'esportes', nome: 'Esportes', icone: '⚽' }
  ];

  useEffect(() => {
    carregarOportunidades();
    if (usuario?.role === 'student') {
      carregarFavoritos();
    }
  }, [usuario]);

  useEffect(() => {
    filtrarOportunidades();
  }, [termoBusca, categoriaSelecionada, oportunidades]);

  const carregarOportunidades = async () => {
    try {
      const data = await oportunidadeService.getOportunidades();
      setOportunidades(data);
      setOportunidadesFiltradas(data);
    } catch (error) {
      console.error('Erro ao carregar oportunidades:', error);
    } finally {
      setCarregando(false);
    }
  };

  const carregarFavoritos = async () => {
    try {
      const favoritosData = await favoritoService.getFavoritos();
      const favoritosIds = new Set(favoritosData.map(f => f.id));
      setFavoritos(favoritosIds);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const filtrarOportunidades = () => {
    let resultados = oportunidades;

    if (termoBusca) {
      resultados = resultados.filter(oportunidade =>
        oportunidade.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        oportunidade.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
        oportunidade.Organizacao?.nome.toLowerCase().includes(termoBusca.toLowerCase())
      );
    }

    if (categoriaSelecionada !== 'todas') {
      resultados = resultados.filter(oportunidade =>
        oportunidade.area.toLowerCase().includes(categoriaSelecionada.toLowerCase())
      );
    }

    setOportunidadesFiltradas(resultados);
  };

  const toggleFavorito = async (oportunidadeId: number) => {
    if (usuario?.role !== 'student') return;

    try {
      const isCurrentlyFavorito = favoritos.has(oportunidadeId);

      if (isCurrentlyFavorito) {
        await favoritoService.removerFavorito(oportunidadeId);
        setFavoritos(prev => {
          const newFavoritos = new Set(prev);
          newFavoritos.delete(oportunidadeId);
          return newFavoritos;
        });
      } else {
        await favoritoService.adicionarFavorito(oportunidadeId);
        setFavoritos(prev => new Set(prev).add(oportunidadeId));
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      alert('Erro ao atualizar favorito. Tente novamente.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const limparFiltros = () => {
    setTermoBusca('');
    setCategoriaSelecionada('todas');
  };

  if (!usuario) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div>
      {}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-info">
              <h1>🎯 Plataforma de Oportunidades</h1>
              <p>Bem-vindo, {usuario.nome}!</p>
              <p className="capitalize">Tipo: {usuario.role === 'student' ? 'Aluno' : 'Organização'}</p>
            </div>

            <div className="user-info">
              {usuario.role === 'organization' && (
                <Link to="/nova-oportunidade" className="btn" style={{background: '#059669'}}>
                  ➕ Nova Oportunidade
                </Link>
              )}
              <Link to="/perfil" className="btn" style={{background: '#3b82f6'}}>
                👤 Meu Perfil
              </Link>
              <span className="user-email">{usuario.email}</span>
              <button onClick={handleLogout} className="btn btn-danger">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="container">
        <div className="dashboard">

          {}
          <div className="filtros-section" style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '30px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#374151' }}>🔍 Buscar Oportunidades</h3>

            {}
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Buscar por título, descrição ou organização..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Categoria:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {categorias.map((categoria) => (
                  <button
                    key={categoria.id}
                    onClick={() => setCategoriaSelecionada(categoria.id)}
                    style={{
                      padding: '10px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      background: categoriaSelecionada === categoria.id ? '#3b82f6' : 'white',
                      color: categoriaSelecionada === categoria.id ? 'white' : '#374151',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (categoriaSelecionada !== categoria.id) {
                        e.currentTarget.style.background = '#f3f4f6';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (categoriaSelecionada !== categoria.id) {
                        e.currentTarget.style.background = 'white';
                      }
                    }}
                  >
                    <span>{categoria.icone}</span>
                    <span>{categoria.nome}</span>
                  </button>
                ))}
              </div>
            </div>

            {}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: '15px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                {oportunidadesFiltradas.length} de {oportunidades.length} oportunidades
                {(termoBusca || categoriaSelecionada !== 'todas') && ' encontradas'}
              </div>

              {(termoBusca || categoriaSelecionada !== 'todas') && (
                <button
                  onClick={limparFiltros}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    background: 'white',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🗑️ Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {}
          <div className="dashboard-card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
              <h2>🎯 Oportunidades {categoriaSelecionada !== 'todas' ? `de ${categorias.find(c => c.id === categoriaSelecionada)?.nome}` : 'Recentes'}</h2>
              <div style={{fontSize: '14px', color: '#6b7280'}}>
                {oportunidadesFiltradas.length} oportunidades disponíveis
              </div>
            </div>

            {carregando ? (
              <div className="loading">Carregando oportunidades...</div>
            ) : oportunidadesFiltradas.length === 0 ? (
              <div style={{
                textAlign: 'center', 
                padding: '60px 40px', 
                color: '#6b7280',
                background: '#f9fafb',
                borderRadius: '10px',
                border: '2px dashed #e5e7eb'
              }}>
                <h3 style={{ marginBottom: '10px', color: '#4b5563' }}>
                  {oportunidades.length === 0 ? '📭 Nenhuma oportunidade disponível' : '🔍 Nenhuma oportunidade encontrada'}
                </h3>
                <p style={{ marginBottom: '20px' }}>
                  {oportunidades.length === 0 
                    ? 'Volte mais tarde para conferir novas oportunidades!' 
                    : 'Tente ajustar os termos da busca ou selecione outra categoria.'
                  }
                </p>
                {(termoBusca || categoriaSelecionada !== 'todas') && (
                  <button
                    onClick={limparFiltros}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #3b82f6',
                      borderRadius: '6px',
                      background: '#3b82f6',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Ver Todas as Oportunidades
                  </button>
                )}
              </div>
            ) : (
              <div className="oportunidades-grid">
                {oportunidadesFiltradas.map((oportunidade) => (
                  <div key={oportunidade.id} className="oportunidade-card">
                    <div className="oportunidade-imagem">
                      <img 
                        src={oportunidade.imagem} 
                        alt={oportunidade.titulo}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400';
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(255,255,255,0.9)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {oportunidade.area}
                      </div>
                    </div>
                    <div className="oportunidade-content">
                      <h3 className="oportunidade-titulo">{oportunidade.titulo}</h3>
                      <p className="oportunidade-descricao">
                        {oportunidade.descricao.substring(0, 120)}...
                      </p>

                      <div className="oportunidade-info">
                        <div className="info-item">
                          <span>🏢 {oportunidade.Organizacao?.nome}</span>
                        </div>
                        <div className="info-item">
                          <span>📍 {oportunidade.localizacao}</span>
                        </div>
                        <div className="info-item">
                          <span>👥 {oportunidade.vagas} vagas</span>
                        </div>
                        <div className="info-item">
                          <span>📅 Inscrições até: {formatarData(oportunidade.prazo_inscricao)}</span>
                        </div>
                      </div>

                      <div className="oportunidade-actions">
                        <button className="btn-inscrever">
                          Ver Detalhes
                        </button>
                        {usuario.role === 'student' && (
                          <button 
                            className={`btn-favorito ${favoritos.has(oportunidade.id) ? 'favoritado' : ''}`}
                            onClick={() => toggleFavorito(oportunidade.id)}
                            style={{
                              background: favoritos.has(oportunidade.id) ? '#dc2626' : '#f3f4f6',
                              color: favoritos.has(oportunidade.id) ? 'white' : '#6b7280'
                            }}
                          >
                            {favoritos.has(oportunidade.id) ? '❤️ Remover' : '♡ Favoritar'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
