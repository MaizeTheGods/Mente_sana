import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import HealthServicesMap from './components/HealthServicesMap';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #ffffff;
    color: #2e7d32;
    line-height: 1.6;
  }

  button {
    font-family: inherit;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  input, select, textarea {
    font-family: inherit;
    border: 1px solid #c8e6c9;
    border-radius: 4px;
    padding: 8px;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
`;

const MainContent = styled.div`
  min-height: calc(100vh - 80px);
  padding: 20px;
`;

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route component (redirects to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GlobalStyle />
      <AppContainer>
        <Router>
          <MainContent>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />

              {/* Protected routes */}
              <Route path="/questionnaire" element={
                <ProtectedRoute>
                  <Questionnaire />
                </ProtectedRoute>
              } />
              <Route path="/results" element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              } />
              <Route path="/maps" element={
                <ProtectedRoute>
                  <HealthServicesMap />
                </ProtectedRoute>
              } />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </MainContent>
        </Router>
      </AppContainer>
    </AuthProvider>
  );
};

// Simple Dashboard component (placeholder)
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <h1 style={{ color: '#2e7d32', marginBottom: '10px' }}>¡Bienvenido a Mente Sana, {user?.firstName}!</h1>
      <p style={{ color: '#4caf50', fontSize: '18px' }}>Tu plataforma de apoyo para la salud mental - Desarrollada con ❤️ para ayudar a las personas.</p>

      <div style={{ marginTop: '30px' }}>
        <h2>¿Qué te gustaría hacer hoy?</h2>
        <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          <button
            onClick={() => window.location.href = '/questionnaire'}
            style={{
              padding: '15px',
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(76, 175, 80, 0.2)'
            }}
          >
            📝 Realizar Evaluación de Salud Mental
          </button>

          <button
            style={{
              padding: '15px',
              background: 'linear-gradient(135deg, #81c784 0%, #a5d6a7 100%)',
              color: '#2e7d32',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(129, 199, 132, 0.2)'
            }}
          >
            🧘 Ver Ejercicios y Consejos
          </button>

          <button
            style={{
              padding: '15px',
              background: 'linear-gradient(135deg, #a5d6a7 0%, #c8e6c9 100%)',
              color: '#2e7d32',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(165, 214, 167, 0.2)'
            }}
          >
            💬 Unirse a Grupos de Apoyo
          </button>

          <button
            onClick={() => navigate('/maps')}
            style={{
              padding: '15px',
              background: 'linear-gradient(135deg, #c8e6c9 0%, #e8f5e8 100%)',
              color: '#2e7d32',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(200, 230, 201, 0.2)'
            }}
          >
            🗺️ Encontrar Ayuda Profesional
          </button>
        </div>
      </div>

      <button
        onClick={logout}
        style={{
          marginTop: '40px',
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(76, 175, 80, 0.2)'
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default App;
