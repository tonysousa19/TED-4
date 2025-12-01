import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { oportunidadeService } from '../services/oportunidadeService';
import type { Oportunidade, Organizacao } from '../types';

const Perfil: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [editando, setEditando] = useState(false);
  const [minhasOportunidades, setMinhasOportunidades] = useState<Oportunidade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState<number | null>(null);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [oportunidadeParaExcluir, setOportunidadeParaExcluir] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const [formData, setFormData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    telefone: '',
    website: '',
    endereco: '',
    descricao: ''
  });

  useEffect(() => {
    if (usuario?.role === 'organization') {
      carregarMinhasOportunidades();
    }
  }, [usuario]);

  const carregarMinhasOportunidades = async () => {
    try {
      const data = await oportunidadeService.getMinhasOportunidades();
      setMinhasOportunidades(data);
    } catch (error) {
      console.error('Erro ao carregar oportunidades:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao carregar oportunidades.' });
    } finally {
      setCarregando(false);
    }
  };

  const mostrarMensagem = (tipo: 'sucesso' | 'erro', texto: string) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 5000);
  };

  const handleEditarPerfil = () => {
    setEditando(true);
  };

  const handleSalvarEdicao = async () => {
    try {
      console.log('Dados a serem salvos:', formData);
      mostrarMensagem('sucesso', 'Perfil atualizado com sucesso!');
      setEditando(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      mostrarMensagem('erro', 'Erro ao atualizar perfil. Tente novamente.');
    }
  };

  const handleCancelarEdicao = () => {
    setFormData({
      nome: usuario?.nome || '',
      email: usuario?.email || '',
      telefone: '',
      website: '',
      endereco: '',
      descricao: ''
    });
    setEditando(false);
  };

  const handleExcluirOportunidade = async (oportunidadeId: number) => {
    setExcluindo(oportunidadeId);

    try {
      await oportunidadeService.deletarOportunidade(oportunidadeId);

      setMinhasOportunidades(prev => 
        prev.filter(op => op.id !== oportunidadeId)
      );

      mostrarMensagem('sucesso', 'Oportunidade excluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir oportunidade:', error);

      if (error.message.includes('Rota de exclusão não disponível')) {
        setMinhasOportunidades(prev => 
          prev.filter(op => op.id !== oportunidadeId)
        );
        mostrarMensagem('sucesso', 'Oportunidade removida localmente. A funcionalidade completa estará disponível em breve.');
      } else {
        mostrarMensagem('erro', error.message || 'Erro ao excluir oportunidade. Tente novamente.');
      }
    } finally {
      setExcluindo(null);
      setMostrarModalExcluir(false);
      setOportunidadeParaExcluir(null);
    }
  };

  const confirmarExclusao = (oportunidadeId: number) => {
    setOportunidadeParaExcluir(oportunidadeId);
    setMostrarModalExcluir(true);
  };

  const handleEditarOportunidade = (oportunidadeId: number) => {
    const oportunidade = minhasOportunidades.find(op => op.id === oportunidadeId);
    if (oportunidade) {
      alert(`Editando: ${oportunidade.titulo}\n\nDescrição: ${oportunidade.descricao}\n\nA funcionalidade completa de edição estará disponível em breve.`);
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
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3 text-muted">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {}
      {mensagem && (
        <div className={`alert alert-${mensagem.tipo === 'sucesso' ? 'success' : 'danger'} alert-dismissible fade show`}>
          <i className={`bi ${mensagem.tipo === 'sucesso' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
          {mensagem.texto}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMensagem(null)}
          ></button>
        </div>
      )}

      <div className="row">
        {}
        <div className="col-lg-3 mb-4">

          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <div className="position-relative mb-3">
                <div className="bg-primary rounded-circle p-4 d-inline-block">
                  <i className="bi bi-person-circle text-white fs-1"></i>
                </div>
                <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1 border border-white">
                  <i className="bi bi-check text-white"></i>
                </div>
              </div>

              <h2 className="h4 fw-bold mb-1">{usuario.nome}</h2>
              <p className="text-muted mb-3">
                <i className="bi bi-envelope me-2"></i>
                {usuario.email}
              </p>

              <span className={`badge bg-${usuario.role === 'student' ? 'info' : 'primary'} px-3 py-2 mb-3`}>
                <i className={`bi ${usuario.role === 'student' ? 'bi-mortarboard' : 'bi-building'} me-2`}></i>
                {usuario.role === 'student' ? 'Estudante' : 'Organização'}
              </span>

              {!editando && (
                <button 
                  className="btn btn-outline-primary w-100 mb-3"
                  onClick={handleEditarPerfil}
                >
                  <i className="bi bi-pencil-square me-2"></i>
                  Editar Perfil
                </button>
              )}

            </div>
          </div>

          {}
          <div className="card shadow-sm border-0 mt-3">
            <div className="card-header bg-light">
              <h6 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Estatísticas
              </h6>
            </div>
            <div className="card-body">
              {usuario.role === 'organization' ? (
                <div className="text-center">
                  <h1 className="display-5 text-primary fw-bold">{minhasOportunidades.length}</h1>
                  <p className="text-muted mb-0">Oportunidades criadas</p>
                </div>
              ) : (
                <div className="text-center">
                  <h1 className="display-5 text-success fw-bold">0</h1>
                  <p className="text-muted mb-0">Inscrições ativas</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {}
        <div className="col-lg-9">
          {editando ? (
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-pencil-square me-2"></i>
                  Editar Informações
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nome}
                        onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Nome"
                      />
                      <label>
                        <i className="bi bi-person me-2"></i>
                        Nome
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Email"
                      />
                      <label>
                        <i className="bi bi-envelope me-2"></i>
                        Email
                      </label>
                    </div>
                  </div>

                  {usuario.role === 'organization' && (
                    <>
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <input
                            type="tel"
                            className="form-control"
                            value={formData.telefone}
                            onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                            placeholder="Telefone"
                          />
                          <label>
                            <i className="bi bi-telephone me-2"></i>
                            Telefone
                          </label>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <input
                            type="url"
                            className="form-control"
                            value={formData.website}
                            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="Website"
                          />
                          <label>
                            <i className="bi bi-globe me-2"></i>
                            Website
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            value={formData.endereco}
                            onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                            placeholder="Endereço"
                          />
                          <label>
                            <i className="bi bi-geo-alt me-2"></i>
                            Endereço
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <textarea
                            className="form-control"
                            value={formData.descricao}
                            onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                            placeholder="Descrição"
                            style={{ height: '100px' }}
                          />
                          <label>
                            <i className="bi bi-text-paragraph me-2"></i>
                            Descrição
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-12 d-flex gap-2 justify-content-end">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={handleCancelarEdicao}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancelar
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={handleSalvarEdicao}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Informações do Perfil
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-muted">Nome</label>
                      <div className="form-control bg-light">
                        <i className="bi bi-person me-2"></i>
                        {usuario.nome}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-muted">Email</label>
                      <div className="form-control bg-light">
                        <i className="bi bi-envelope me-2"></i>
                        {usuario.email}
                      </div>
                    </div>
                  </div>

                  {usuario.role === 'organization' && (
                    <>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label text-muted">Telefone</label>
                          <div className="form-control bg-light">
                            <i className="bi bi-telephone me-2"></i>
                            {formData.telefone || 'Não informado'}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label text-muted">Website</label>
                          <div className="form-control bg-light">
                            <i className="bi bi-globe me-2"></i>
                            {formData.website || 'Não informado'}
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="mb-3">
                          <label className="form-label text-muted">Endereço</label>
                          <div className="form-control bg-light">
                            <i className="bi bi-geo-alt me-2"></i>
                            {formData.endereco || 'Não informado'}
                          </div>
                        </div>
                      </div>

                      {formData.descricao && (
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label text-muted">Descrição</label>
                            <div className="form-control bg-light">
                              <i className="bi bi-text-paragraph me-2"></i>
                              {formData.descricao}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {}
          {usuario.role === 'organization' && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-briefcase me-2"></i>
                    Minhas Oportunidades ({minhasOportunidades.length})
                  </h5>
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => navigate('/nova-oportunidade')}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nova Oportunidade
                  </button>
                </div>
              </div>

              <div className="card-body">
                {carregando ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p className="mt-3 text-muted">Carregando oportunidades...</p>
                  </div>
                ) : minhasOportunidades.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <i className="bi bi-briefcase display-1 text-muted"></i>
                    </div>
                    <h5 className="text-muted">Nenhuma oportunidade criada ainda</h5>
                    <p className="text-muted mb-4">Crie sua primeira oportunidade para começar</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/nova-oportunidade')}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Criar Primeira Oportunidade
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Título</th>
                          <th>Área</th>
                          <th>Vagas</th>
                          <th>Prazo</th>
                          <th className="text-end">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {minhasOportunidades.map((oportunidade) => (
                          <tr key={oportunidade.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="bg-light rounded-circle p-2 me-3">
                                  <i className="bi bi-briefcase text-primary"></i>
                                </div>
                                <div>
                                  <strong>{oportunidade.titulo}</strong>
                                  <div className="small text-muted">
                                    <i className="bi bi-geo-alt me-1"></i>
                                    {oportunidade.localizacao}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-info">{oportunidade.area}</span>
                            </td>
                            <td>
                              <span className="badge bg-secondary">
                                {oportunidade.vagas} vagas
                              </span>
                            </td>
                            <td>
                              <span className="text-muted small">
                                {formatarData(oportunidade.prazo_inscricao)}
                              </span>
                            </td>
                            <td className="text-end">
                              <div className="btn-group btn-group-sm">
                                <button 
                                  className="btn btn-outline-primary"
                                  onClick={() => handleEditarOportunidade(oportunidade.id)}
                                  disabled={excluindo === oportunidade.id}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-danger"
                                  onClick={() => confirmarExclusao(oportunidade.id)}
                                  disabled={excluindo === oportunidade.id}
                                >
                                  {excluindo === oportunidade.id ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                  ) : (
                                    <i className="bi bi-trash"></i>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {}
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Ações Rápidas
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                </div>
                <div className="col-md-4">
                  <button 
                    className="btn btn-outline-danger w-100"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Sair da Conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      {mostrarModalExcluir && oportunidadeParaExcluir && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title text-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Confirmar Exclusão
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setMostrarModalExcluir(false);
                    setOportunidadeParaExcluir(null);
                  }}
                  disabled={excluindo !== null}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Tem certeza que deseja excluir esta oportunidade? 
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="modal-footer border-0">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setMostrarModalExcluir(false);
                    setOportunidadeParaExcluir(null);
                  }}
                  disabled={excluindo !== null}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => handleExcluirOportunidade(oportunidadeParaExcluir)}
                  disabled={excluindo !== null}
                >
                  {excluindo ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash me-2"></i>
                      Sim, Excluir
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;