import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [lembrar, setLembrar] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await login(email, senha);
      navigate('/');
    } catch (error: any) {
      console.error('Erro completo no login:', error);
      setErro(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setCarregando(false);
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
                    <i className="bi bi-door-open-fill text-white fs-1"></i>
                  </div>
                  <h1 className="h3 fw-bold text-dark">Bem-vindo de volta!</h1>
                  <p className="text-muted mb-0">
                    Entre na sua conta para continuar
                  </p>
                </div>

                {erro && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Erro:</strong> {erro}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setErro('')}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <div className="form-floating mb-3">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="exemplo@email.com"
                        autoComplete="email"
                      />
                      <label htmlFor="email">
                        <i className="bi bi-envelope me-2"></i>
                        Email
                      </label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        id="senha"
                        name="senha"
                        type="password"
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="form-control"
                        placeholder="Sua senha"
                        autoComplete="current-password"
                      />
                      <label htmlFor="senha">
                        <i className="bi bi-lock me-2"></i>
                        Senha
                      </label>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="lembrar"
                          checked={lembrar}
                          onChange={(e) => setLembrar(e.target.checked)}
                        />
                        <label className="form-check-label text-muted" htmlFor="lembrar">
                          <small>Lembrar de mim</small>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={carregando}
                      className="btn btn-primary btn-lg w-100 py-3 mb-3"
                    >
                      {carregando ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Entrando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Entrar na conta
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center pt-4 border-top">
                  <p className="text-muted mb-0">
                    Não tem uma conta?
                    <Link to="/cadastro" className="text-primary fw-bold ms-2 text-decoration-none">
                      <i className="bi bi-person-plus me-1"></i>
                      Cadastre-se agora
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Cards de Informação */}
            <div className="row mt-4">
              <div className="col-md-4 mb-3">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body text-center py-3">
                    <div className="bg-info bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
                      <i className="bi bi-shield-check text-info"></i>
                    </div>
                    <h6 className="fw-bold mb-1">Seguro</h6>
                    <p className="text-muted small mb-0">
                      Suas informações estão protegidas
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body text-center py-3">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
                      <i className="bi bi-lightning-charge text-success"></i>
                    </div>
                    <h6 className="fw-bold mb-1">Rápido</h6>
                    <p className="text-muted small mb-0">
                      Acesso instantâneo às oportunidades
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body text-center py-3">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
                      <i className="bi bi-people text-warning"></i>
                    </div>
                    <h6 className="fw-bold mb-1">Comunidade</h6>
                    <p className="text-muted small mb-0">
                      Faça parte de uma rede de estudantes
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

export default Login;
