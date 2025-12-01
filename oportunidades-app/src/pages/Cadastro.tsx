import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import type { RegisterData } from '../types';

const Cadastro: React.FC = () => {
  const [dados, setDados] = useState<RegisterData>({
    nome: '',
    email: '',
    senha: '',
    role: 'student',
    organizacao: {
      nome: '',
      descricao: '',
      website: '',
      telefone: '',
      endereco: '',
    },
  });

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const dadosEnvio = dados.role === 'organization' 
        ? { ...dados, organizacao: undefined } 
        : dados;

      await register(dadosEnvio);

      if (dados.role === 'organization' && dados.organizacao) {
        console.log('Organização será criada automaticamente');
      }

      navigate('/');
    } catch (error: any) {
      setErro(error.message || 'Erro ao criar conta');
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('organizacao.')) {
      const field = name.split('.')[1];
      setDados(prev => ({
        ...prev,
        organizacao: {
          ...prev.organizacao!,
          [field]: value
        }
      }));
    } else {
      setDados(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="d-inline-block bg-primary rounded-circle p-3 mb-3">
                    <i className="bi bi-person-plus-fill text-white fs-1"></i>
                  </div>
                  <h1 className="h3 fw-bold text-dark">Crie sua conta</h1>
                  <p className="text-muted mb-0">
                    Junte-se à nossa plataforma de oportunidades educacionais
                  </p>
                </div>

                {erro && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {erro}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setErro('')}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Informações Pessoais */}
                    <div className="col-12">
                      <h5 className="border-bottom pb-2 mb-3">
                        <i className="bi bi-person-badge me-2"></i>
                        Informações Pessoais
                      </h5>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          id="nome"
                          name="nome"
                          type="text"
                          required
                          value={dados.nome}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Nome completo"
                        />
                        <label htmlFor="nome">
                          <i className="bi bi-person me-2"></i>
                          Nome completo
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={dados.email}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Email"
                        />
                        <label htmlFor="email">
                          <i className="bi bi-envelope me-2"></i>
                          Email
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          id="senha"
                          name="senha"
                          type="password"
                          required
                          value={dados.senha}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Senha"
                        />
                        <label htmlFor="senha">
                          <i className="bi bi-lock me-2"></i>
                          Senha
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <select
                          id="role"
                          name="role"
                          value={dados.role}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="student">
                            <i className="bi bi-mortarboard"></i> Aluno
                          </option>
                          <option value="organization">
                            <i className="bi bi-building"></i> Organização
                          </option>
                        </select>
                        <label htmlFor="role">
                          <i className="bi bi-person-workspace me-2"></i>
                          Tipo de conta
                        </label>
                      </div>
                    </div>

                    {/* Seção de Organização */}
                    {dados.role === 'organization' && (
                      <>
                        <div className="col-12 mt-4">
                          <div className="card border-primary">
                            <div className="card-header bg-primary text-white">
                              <h5 className="mb-0">
                                <i className="bi bi-building me-2"></i>
                                Dados da Organização
                              </h5>
                            </div>
                            <div className="card-body">
                              <div className="row g-3">
                                <div className="col-12">
                                  <div className="form-floating mb-3">
                                    <input
                                      id="organizacao.nome"
                                      name="organizacao.nome"
                                      type="text"
                                      required
                                      value={dados.organizacao?.nome}
                                      onChange={handleChange}
                                      className="form-control"
                                      placeholder="Nome da organização"
                                    />
                                    <label htmlFor="organizacao.nome">
                                      <i className="bi bi-building me-2"></i>
                                      Nome da Organização
                                    </label>
                                  </div>
                                </div>

                                <div className="col-12">
                                  <div className="form-floating mb-3">
                                    <textarea
                                      id="organizacao.descricao"
                                      name="organizacao.descricao"
                                      value={dados.organizacao?.descricao}
                                      onChange={handleChange}
                                      rows={3}
                                      className="form-control"
                                      placeholder="Descrição da organização"
                                      style={{ height: '100px' }}
                                    />
                                    <label htmlFor="organizacao.descricao">
                                      <i className="bi bi-text-paragraph me-2"></i>
                                      Descrição
                                    </label>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-floating mb-3">
                                    <input
                                      id="organizacao.website"
                                      name="organizacao.website"
                                      type="url"
                                      value={dados.organizacao?.website}
                                      onChange={handleChange}
                                      className="form-control"
                                      placeholder="Website"
                                    />
                                    <label htmlFor="organizacao.website">
                                      <i className="bi bi-globe me-2"></i>
                                      Website
                                    </label>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-floating mb-3">
                                    <input
                                      id="organizacao.telefone"
                                      name="organizacao.telefone"
                                      type="tel"
                                      value={dados.organizacao?.telefone}
                                      onChange={handleChange}
                                      className="form-control"
                                      placeholder="Telefone"
                                    />
                                    <label htmlFor="organizacao.telefone">
                                      <i className="bi bi-telephone me-2"></i>
                                      Telefone
                                    </label>
                                  </div>
                                </div>

                                <div className="col-12">
                                  <div className="form-floating mb-3">
                                    <input
                                      id="organizacao.endereco"
                                      name="organizacao.endereco"
                                      type="text"
                                      value={dados.organizacao?.endereco}
                                      onChange={handleChange}
                                      className="form-control"
                                      placeholder="Endereço"
                                    />
                                    <label htmlFor="organizacao.endereco">
                                      <i className="bi bi-geo-alt me-2"></i>
                                      Endereço
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Botão de Submit */}
                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        disabled={carregando}
                        className="btn btn-primary btn-lg w-100 py-3"
                      >
                        {carregando ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Criando conta...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-plus me-2"></i>
                            Criar conta
                          </>
                        )}
                      </button>
                    </div>

                    {/* Link para Login */}
                    <div className="col-12 text-center mt-4">
                      <p className="text-muted mb-0">
                        Já tem uma conta?
                        <Link to="/login" className="text-primary fw-bold ms-2 text-decoration-none">
                          <i className="bi bi-box-arrow-in-right me-1"></i>
                          Entre aqui
                        </Link>
                      </p>
                    </div>
                  </div>
                </form>

                {/* Termos e Condições */}
                <div className="text-center mt-4 pt-3 border-top">
                  <small className="text-muted">
                    Ao criar uma conta, você concorda com nossos{' '}
                    <a href="#" className="text-decoration-none">Termos de Serviço</a> e{' '}
                    <a href="#" className="text-decoration-none">Política de Privacidade</a>
                  </small>
                </div>
              </div>
            </div>

            {/* Cards de Benefícios */}
            <div className="row mt-4">
              <div className="col-md-4 mb-3">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body text-center">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                      <i className="bi bi-search text-primary fs-4"></i>
                    </div>
                    <h6 className="fw-bold">Encontre Oportunidades</h6>
                    <p className="text-muted small mb-0">
                      Acesse cursos, estágios e eventos na sua área
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body text-center">
                    <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                      <i className="bi bi-bullseye text-success fs-4"></i>
                    </div>
                    <h6 className="fw-bold">Conecte-se</h6>
                    <p className="text-muted small mb-0">
                      Faça networking com organizações e outros estudantes
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body text-center">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                      <i className="bi bi-graph-up text-warning fs-4"></i>
                    </div>
                    <h6 className="fw-bold">Cresça</h6>
                    <p className="text-muted small mb-0">
                      Desenvolva suas habilidades e construa seu futuro
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;