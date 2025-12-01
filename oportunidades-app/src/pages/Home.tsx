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

  const verDetalhes = (oportunidadeId: number) => {

    const oportunidade = oportunidades.find(op => op.id === oportunidadeId);
    if (oportunidade) {
      alert(`Detalhes da Oportunidade:\n\nTítulo: ${oportunidade.titulo}\nDescrição: ${oportunidade.descricao}\nOrganização: ${oportunidade.Organizacao?.nome}\nLocal: ${oportunidade.localizacao}\nVagas: ${oportunidade.vagas}\nInício: ${new Date(oportunidade.data_inicio).toLocaleDateString()}\nPrazo: ${new Date(oportunidade.prazo_inscricao).toLocaleDateString()}`);
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

  const limparFiltros = () => {
    setTermoBusca('');
    setCategoriaSelecionada('todas');
  };

  if (!usuario) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="container-fluid p-0">
      {}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <div className="navbar-brand d-flex align-items-center">
            <i className="bi bi-bullseye fs-3 me-2"></i>
            <div>
              <h1 className="h5 mb-0">Plataforma de Oportunidades</h1>
              <small className="text-light opacity-75">
                Bem-vindo, {usuario?.nome}!
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            {usuario?.role === 'organization' && (
              <Link 
                to="/nova-oportunidade" 
                className="btn btn-success btn-sm"
              >
                <i className="bi bi-plus-circle me-1"></i>
                Nova Oportunidade
              </Link>
            )}

            <Link 
              to="/perfil" 
              className="btn btn-outline-light btn-sm"
            >
              <i className="bi bi-person-circle me-1"></i>
              Perfil
            </Link>

            <button 
              onClick={handleLogout}
              className="btn btn-danger btn-sm"
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Sair
            </button>
          </div>
        </div>
      </nav>

      {}
      <main className="container py-4">
        {}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar oportunidades..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <select 
                  className="form-select"
                  value={categoriaSelecionada}
                  onChange={(e) => setCategoriaSelecionada(e.target.value)}
                >
                  <option value="todas">Todas as categorias</option>
                  <option value="tecnologia">Tecnologia</option>
                  <option value="saude">Saúde</option>
                  <option value="educacao">Educação</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {oportunidadesFiltradas.map((oportunidade) => (
            <div key={oportunidade.id} className="col">
              <div className="card h-100 shadow-sm hover-shadow">
                <div className="position-relative">
                  <img 
                    src={oportunidade.imagem} 
                    className="card-img-top"
                    alt={oportunidade.titulo}
                    style={{ height: '180px', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400';
                    }}
                  />
                  <span className="badge bg-primary position-absolute top-0 start-0 m-2">
                    {oportunidade.area}
                  </span>
                </div>

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{oportunidade.titulo}</h5>
                  <p className="card-text text-muted flex-grow-1">
                    {oportunidade.descricao.substring(0, 120)}...
                  </p>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-1">
                      <i className="bi bi-building text-secondary me-2"></i>
                      <small className="text-muted">{oportunidade.Organizacao?.nome}</small>
                    </div>
                    <div className="d-flex align-items-center mb-1">
                      <i className="bi bi-geo-alt text-secondary me-2"></i>
                      <small className="text-muted">{oportunidade.localizacao}</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-people text-secondary me-2"></i>
                      <small className="text-muted">{oportunidade.vagas} vagas</small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    {}

                    {usuario?.role === 'student' && (
                      <button 
                        className={`btn btn-sm ${favoritos.has(oportunidade.id) ? 'btn-danger' : 'btn-outline-secondary'}`}
                        onClick={() => toggleFavorito(oportunidade.id)}
                      >
                        <i className={`bi ${favoritos.has(oportunidade.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                      </button>
                    )}
                  </div>
                </div>

                <div className="card-footer bg-transparent">
                  <small className="text-muted">
                    <i className="bi bi-calendar-check me-1"></i>
                    Inscrições até: {formatarData(oportunidade.prazo_inscricao)}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;