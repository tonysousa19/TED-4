import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import NovaOportunidade from './pages/NovaOportunidade';

// Componente para redirecionar usuários logados
const RedirectIfAuthenticated: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (usuario) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};



const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route 
            path="/login" 
            element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} 
          />
          <Route 
            path="/cadastro" 
            element={<RedirectIfAuthenticated><Cadastro /></RedirectIfAuthenticated>} 
          />

          {/* Rota de logout */}
          <Route path="/logout" element={<Logout />} />

          {/* Rotas protegidas */}
          <Route 
            path="/" 
            element={<ProtectedRoute><Home /></ProtectedRoute>} 
          />
          <Route 
            path="/perfil" 
            element={<ProtectedRoute><Perfil /></ProtectedRoute>} 
          />
          <Route 
            path="/nova-oportunidade" 
            element={<ProtectedRoute><NovaOportunidade /></ProtectedRoute>} 
          />

          {/* Rota padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Componente para logout
const Logout: React.FC = () => {
  const { logout } = useAuth();

  React.useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/login" replace />;
};

export default App;