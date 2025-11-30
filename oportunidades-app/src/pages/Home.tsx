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
  const [carregando, setCarregando] = useState(true);
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());

  useEffect(() => {
    carregarOportunidades();
    if (usuario?.role === 'student') {
      carregarFavoritos();
    }
  }, [usuario]);

  const carregarOportunidades = async () => {
    try {
      const data = await oportunidadeService.getOportunidades();
      setOportunidades(data);
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

  if (!usuario) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-info">
              <h1>🎯 Plataforma de Oportunidades</h1>
              <p>Bem-vindo, {usuario.nome}!</p>
              <p className="capitalize">Tipo: {usuario.role === 'student' ? 'Aluno' : 'Organização'}</p>
            </div>
            
            <div className="user-info">
              <Link to="/perfil" className="btn" style={{background: '#059669'}}>
                Meu Perfil
              </Link>
              <span className="user-email">{usuario.email}</span>
              <button onClick={handleLogout} className="btn btn-danger">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div className="dashboard">
          <div className="dashboard-card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
              <h2>🎯 Oportunidades Recentes</h2>
              <div style={{fontSize: '14px', color: '#6b7280'}}>
                {oportunidades.length} oportunidades disponíveis
              </div>
            </div>
            
            {carregando ? (
              <div className="loading">Carregando oportunidades...</div>
            ) : oportunidades.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>
                <h3>Nenhuma oportunidade disponível no momento</h3>
                <p>Volte mais tarde para conferir novas oportunidades!</p>
              </div>
            ) : (
              <div className="oportunidades-grid">
                {oportunidades.map((oportunidade) => (
                  <div key={oportunidade.id} className="oportunidade-card">
                    <div className="oportunidade-imagem">
                      <img 
                        src={oportunidade.imagem} 
                        alt={oportunidade.titulo}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400';
                        }}
                      />
                    </div>
                    <div className="oportunidade-content">
                      <h3 className="oportunidade-titulo">{oportunidade.titulo}</h3>
                      <p className="oportunidade-descricao">
                        {oportunidade.descricao.substring(0, 100)}...
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
                          <span>📅 {formatarData(oportunidade.prazo_inscricao)}</span>
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
                            {favoritos.has(oportunidade.id) ? '❤️' : '♡'}
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