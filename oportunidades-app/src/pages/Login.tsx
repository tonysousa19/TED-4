import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/LoginCadastro.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

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
      setErro(error.message || 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Entre na sua conta</h2>

        <form onSubmit={handleSubmit}>
          {erro && (
            <div className="alert alert-error">
              <strong>Erro:</strong> {erro}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="form-control"
              placeholder="Sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="btn btn-primary"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="auth-link">
            <Link to="/cadastro">Não tem uma conta? Cadastre-se</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

