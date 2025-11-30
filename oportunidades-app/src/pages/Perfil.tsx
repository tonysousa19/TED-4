import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import type { Oportunidade } from '../types';
import { oportunidadeService } from '../services/oportunidadeService';
import { favoritoService } from '../services/favoritoService';

const Perfil: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [minhasOportunidades, setMinhasOportunidades] = useState<Oportunidade[]>([]);
  const [favoritos, setFavoritos] = useState<Oportunidade[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(false);

  useEffect(() => {
    if (usuario?.role === 'organization') {
      carregarMinhasOportunidades();
    } else if (usuario?.role === 'student') {
      carregarFavoritos();
    }
  }, [usuario]);

  const carregarMinhasOportunidades = async () => {
    setCarregando(true);
    try {
      const data = await oportunidadeService.getMinhasOportunidades();
      setMinhasOportunidades(data);
    } catch (error) {
      console.error('Erro ao carregar oportunidades:', error);
    } finally {
      setCarregando(false);
    }
  };

  const carregarFavoritos = async () => {
    setCarregandoFavoritos(true);
    try {
      const data = await favoritoService.getFavoritos();
      setFavoritos(data);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setCarregandoFavoritos(false);
    }
  };

  const removerFavorito = async (oportunidadeId: number) => {
    try {
      await favoritoService.removerFavorito(oportunidadeId);
      setFavoritos(prev => prev.filter(op => op.id !== oportunidadeId));
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      alert('Erro ao remover favorito. Tente novamente.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 🔽 FUNÇÃO formatarData ADICIONADA
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // 🔽 VALIDAÇÃO DE USUÁRIO NULL
  if (!usuario) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-info">
              <h1>👤 Meu Perfil</h1>
              <p>Gerencie suas informações e oportunidades</p>
            </div>
            
            <div className="user-info">
              <Link to="/" className="btn" style={{background: '#4f46e5'}}>
                Voltar à Home
              </Link>
              <button onClick={handleLogout} className="btn btn-danger">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="dashboard">
          {/* Informações do usuário */}
          <div className="dashboard-card" style={{marginBottom: '30px'}}>
            <h2>Informações Pessoais</h2>
            <div className="perfil-info">
              <div className="info-item">
                <strong>Nome:</strong> {usuario.nome}
              </div>
              <div className="info-item">
                <strong>Email:</strong> {usuario.email}
              </div>
              <div className="info-item">
                <strong>Tipo de conta:</strong> 
                <span className="capitalize"> {usuario.role === 'student' ? 'Aluno' : 'Organização'}</span>
              </div>
            </div>
          </div>

          {/* Conteúdo específico por tipo de usuário */}
          {usuario.role === 'student' && (
            <div className="dashboard-card">
              <h2>⭐ Oportunidades Favoritadas</h2>
              
              {carregandoFavoritos ? (
                <div className="loading">Carregando favoritos...</div>
              ) : favoritos.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>
                  <h3>Nenhuma oportunidade favoritada</h3>
                  <p>Explore as oportunidades e adicione às favoritas para vê-las aqui!</p>
                  <Link to="/" className="btn" style={{marginTop: '20px'}}>
                    Explorar Oportunidades
                  </Link>
                </div>
              ) : (
                <div className="oportunidades-grid">
                  {favoritos.map((oportunidade) => (
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
                          <button 
                            className="btn-favorito favoritado"
                            onClick={() => removerFavorito(oportunidade.id)}
                            style={{background: '#dc2626', color: 'white'}}
                          >
                            ❤️ Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {usuario.role === 'organization' && (
            <div className="dashboard-card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                <h2>📊 Minhas Oportunidades</h2>
                <Link to="/nova-oportunidade" className="btn" style={{background: '#059669'}}>
                  + Nova Oportunidade
                </Link>
              </div>

              {carregando ? (
                <div className="loading">Carregando suas oportunidades...</div>
              ) : minhasOportunidades.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>
                  <h3>Nenhuma oportunidade cadastrada</h3>
                  <p>Crie sua primeira oportunidade para atrair participantes!</p>
                  <Link to="/nova-oportunidade" className="btn" style={{marginTop: '20px', background: '#059669'}}>
                    Criar Primeira Oportunidade
                  </Link>
                </div>
              ) : (
                <div className="oportunidades-grid">
                  {minhasOportunidades.map((oportunidade) => (
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
                            <span>📍 {oportunidade.localizacao}</span>
                          </div>
                          <div className="info-item">
                            <span>👥 {oportunidade.vagas} vagas</span>
                          </div>
                          <div className="info-item">
                            <span>📅 {formatarData(oportunidade.prazo_inscricao)}</span>
                          </div>
                          <div className="info-item">
                            <span style={{
                              color: oportunidade.is_active ? '#059669' : '#dc2626',
                              fontWeight: 'bold'
                            }}>
                              {oportunidade.is_active ? '🟢 Ativa' : '🔴 Inativa'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="oportunidade-actions">
                          <button className="btn-inscrever">
                            Editar
                          </button>
                          <button className="btn-favorito" style={{background: '#dc2626'}}>
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Perfil;