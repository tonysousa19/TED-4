import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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

const testarConexao = async () => {
  try {
    console.log('Testando conexão com a API...');
    
    // Teste 1: Rota raiz da API
    const response1 = await fetch('http://localhost:4000/api');
    console.log('Status da rota /api:', response1.status);
    
    if (response1.ok) {
      const data = await response1.json();
      console.log('Resposta da API:', data);
    }

    // Teste 2: Rota de saúde
    const response2 = await fetch('http://localhost:4000/health');
    console.log('Status da rota /health:', response2.status);

    // Teste 3: Verificar se a rota auth existe
    const response3 = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    console.log('Status da rota POST /api/auth/login:', response3.status);

  } catch (error) {
    console.error('Erro no teste de conexão:', error);
    setErro('Não foi possível conectar com o servidor.');
  }
};

  // Chama o teste quando o componente carrega
  React.useEffect(() => {
    testarConexao();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Entre na sua conta</h2>
        
        {/* Botão de teste */}
        <button 
          type="button" 
          onClick={testarConexao}
          style={{
            background: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          Testar Conexão com API
        </button>

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