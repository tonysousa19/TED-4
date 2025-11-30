import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import type { RegisterData } from '../types';
import "../index.css"

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
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crie sua conta</h2>
        <form onSubmit={handleSubmit}>
          {erro && (
            <div className="alert alert-error">
              {erro}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              value={dados.nome}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={dados.email}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              required
              value={dados.senha}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Tipo de conta</label>
            <select
              id="role"
              name="role"
              value={dados.role}
              onChange={handleChange}
              className="form-control"
            >
              <option value="student">Aluno</option>
              <option value="organization">Organização</option>
            </select>
          </div>

          {dados.role === 'organization' && (
            <div className="org-section">
              <h3>Dados da Organização</h3>

              <div className="form-group">
                <label htmlFor="organizacao.nome">Nome da Organização</label>
                <input
                  id="organizacao.nome"
                  name="organizacao.nome"
                  type="text"
                  required
                  value={dados.organizacao?.nome}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="organizacao.descricao">Descrição</label>
                <textarea
                  id="organizacao.descricao"
                  name="organizacao.descricao"
                  value={dados.organizacao?.descricao}
                  onChange={handleChange}
                  rows={3}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="organizacao.website">Website</label>
                <input
                  id="organizacao.website"
                  name="organizacao.website"
                  type="url"
                  value={dados.organizacao?.website}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="organizacao.telefone">Telefone</label>
                <input
                  id="organizacao.telefone"
                  name="organizacao.telefone"
                  type="tel"
                  value={dados.organizacao?.telefone}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="organizacao.endereco">Endereço</label>
                <input
                  id="organizacao.endereco"
                  name="organizacao.endereco"
                  type="text"
                  value={dados.organizacao?.endereco}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="btn btn-primary"
          >
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>

          <div className="auth-link">
            <Link to="/login">Já tem uma conta? Entre aqui</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
