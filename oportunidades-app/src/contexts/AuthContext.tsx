import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextType, Usuario, RegisterData } from '../types';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se usuário está logado ao carregar a aplicação
  useEffect(() => {
    const tokenStorage = localStorage.getItem('token');
    const usuarioStorage = localStorage.getItem('usuario');

    if (tokenStorage && usuarioStorage) {
      setToken(tokenStorage);
      setUsuario(JSON.parse(usuarioStorage));
      
      // Validar token com backend
      authService.getPerfil()
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const data = await authService.login(email, senha);
      
      setUsuario(data.usuario);
      setToken(data.token);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
    } catch (error) {
      throw error;
    }
  };

  const register = async (dados: RegisterData) => {
    try {
      const data = await authService.register(dados);
      
      setUsuario(data.usuario);
      setToken(data.token);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  const value: AuthContextType = {
    usuario,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};