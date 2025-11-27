import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import HealthServicesMap from './components/HealthServicesMap';
import Exercises from './components/Exercises';
import Tips from './components/Tips';
import Chat from './components/Chat';
import ChatRoom from './components/ChatRoom';
import ExerciseDetail from './components/ExerciseDetail';
import TipDetail from './components/TipDetail';
import styled, { createGlobalStyle } from 'styled-components';
import { GlassCard, CubeLoader, CubeSquare, LoadingText } from './components/SharedStyles';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { questionnaireAPI } from './services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  padding: 0;
`;

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <CubeLoader>
            <CubeSquare delay={0} />
            <CubeSquare delay={1} />
            <CubeSquare delay={2} />
            <CubeSquare delay={3} />
            <CubeSquare delay={4} />
            <CubeSquare delay={5} />
            <CubeSquare delay={6} />
            <CubeSquare delay={7} />
          </CubeLoader>
          <LoadingText>Cargando...</LoadingText>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route component (redirects to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <CubeLoader>
            <CubeSquare delay={0} />
            <CubeSquare delay={1} />
            <CubeSquare delay={2} />
            <CubeSquare delay={3} />
            <CubeSquare delay={4} />
            <CubeSquare delay={5} />
            <CubeSquare delay={6} />
            <CubeSquare delay={7} />
          </CubeLoader>
          <LoadingText>Cargando...</LoadingText>
        </div>
      </div>
    );
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
              <Route path="/exercises" element={
                <ProtectedRoute>
                  <Exercises />
                </ProtectedRoute>
              } />
              <Route path="/tips" element={
                <ProtectedRoute>
                  <Tips />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/chat/:id" element={
                <ProtectedRoute>
                  <ChatRoom />
                </ProtectedRoute>
              } />
              <Route path="/exercise/:id" element={
                <ProtectedRoute>
                  <ExerciseDetail />
                </ProtectedRoute>
              } />
              <Route path="/tip/:id" element={
                <ProtectedRoute>
                  <TipDetail />
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

const DashboardHeader = styled(GlassCard)`
  margin-bottom: 32px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  max-width: 100%;
`;

const FeatureCard = styled(GlassCard)`
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

// Professional Dashboard component
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = React.useState<any[]>([]);
  const [selectedDisorder, setSelectedDisorder] = React.useState<'depression' | 'anxiety' | 'stress'>('depression');
  const [isLoading, setIsLoading] = React.useState(true);

  // Check if user has completed questionnaire (questionnaireCompleted is true)
  const hasCompletedQuestionnaire = user?.questionnaireCompleted === true;

  // Load historical results
  React.useEffect(() => {
    const loadResults = async () => {
      if (user && hasCompletedQuestionnaire) {
        try {
          const response = await questionnaireAPI.getResults();
          setResults(response.results);
        } catch (error) {
          console.error('Failed to load results:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [user, hasCompletedQuestionnaire]);

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!results.length) return null;

    const sortedResults = results.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const labels = sortedResults.map(result =>
      new Date(result.createdAt).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric'
      })
    );

    const data = sortedResults.map(result => result.scores[selectedDisorder]);

    return {
      labels,
      datasets: [{
        label: selectedDisorder === 'depression' ? 'Depresión' :
          selectedDisorder === 'anxiety' ? 'Ansiedad' : 'Estrés',
        data,
        borderColor: selectedDisorder === 'depression' ? '#dc3545' :
          selectedDisorder === 'anxiety' ? '#ffc107' : '#6f42c1',
        backgroundColor: selectedDisorder === 'depression' ? 'rgba(220, 53, 69, 0.1)' :
          selectedDisorder === 'anxiety' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(111, 66, 193, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }, [results, selectedDisorder]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Progreso en ${selectedDisorder === 'depression' ? 'Depresión' :
          selectedDisorder === 'anxiety' ? 'Ansiedad' : 'Estrés'}`,
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 21,
        ticks: {
          stepSize: 3
        }
      }
    }
  };

  const features = [
    {
      id: 'questionnaire',
      title: 'Realizar Cuestionario',
      description: 'Evalúa tu estado de salud mental con el DASS-21',
      icon: '📝',
      gradient: 'linear-gradient(135deg, #81c784 0%, #a5d6a7 100%)',
      action: () => navigate('/questionnaire')
    },
    {
      id: 'exercises',
      title: 'Ejercicios y Consejos',
      description: 'Accede a técnicas de relajación y consejos prácticos',
      icon: '🧘',
      gradient: 'linear-gradient(135deg, #a5d6a7 0%, #c8e6c9 100%)',
      action: () => navigate('/exercises')
    },
    {
      id: 'tips',
      title: 'Consejos Prácticos',
      description: 'Descubre consejos diarios para mejorar tu bienestar mental',
      icon: '💡',
      gradient: 'linear-gradient(135deg, #c8e6c9 0%, #e8f5e8 100%)',
      action: () => navigate('/tips')
    },
    {
      id: 'chat',
      title: 'Grupos de Apoyo',
      description: 'Conecta con personas que comparten experiencias similares',
      icon: '👥',
      gradient: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
      action: () => navigate('/chat')
    },
    {
      id: 'maps',
      title: 'Ayuda Profesional',
      description: 'Encuentra especialistas y centros de salud mental cercanos',
      icon: '🗺️',
      gradient: 'linear-gradient(135deg, #66bb6a 0%, #81c784 100%)',
      action: () => navigate('/maps')
    }
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto',
      padding: window.innerWidth <= 768 ? '0' : '0'
    }}>
      {/* Header */}
      <DashboardHeader>
        <div>
          <h1 style={{
            color: '#2e7d32',
            margin: '0 0 8px 0',
            fontSize: window.innerWidth <= 768 ? '1.8rem' : '2.5rem',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}>
            ¡Bienvenido, {user?.firstName}!
          </h1>
          <p style={{
            color: '#4caf50',
            margin: '0',
            fontSize: window.innerWidth <= 768 ? '1rem' : '1.125rem',
            fontWeight: '400'
          }}>
            Tu plataforma de apoyo para la salud mental
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: window.innerWidth <= 768 ? '10px 20px' : '12px 24px',
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: window.innerWidth <= 768 ? '13px' : '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(76, 175, 80, 0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(76, 175, 80, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(76, 175, 80, 0.2)';
          }}
        >
          Cerrar Sesión
        </button>
      </DashboardHeader>

      <div style={{ marginBottom: window.innerWidth <= 768 ? '24px' : '32px' }}>
        <h2 style={{
          color: '#2e7d32',
          fontSize: window.innerWidth <= 768 ? '1.5rem' : '1.875rem',
          fontWeight: '600',
          margin: '0 0 8px 0',
          textAlign: 'center'
        }}>
          ¿Qué te gustaría hacer hoy?
        </h2>
        <p style={{
          color: '#4caf50',
          fontSize: window.innerWidth <= 768 ? '1rem' : '1.125rem',
          textAlign: 'center',
          margin: '0'
        }}>
          Explora las herramientas disponibles para cuidar tu bienestar emocional
        </p>
      </div>

      {/* Progress Chart Section */}
      {results.length > 1 && (
        <GlassCard style={{ marginBottom: window.innerWidth <= 768 ? '32px' : '48px', width: '100%', maxWidth: '100%' }}>
          <h2 style={{
            color: '#2e7d32',
            fontSize: '1.875rem',
            fontWeight: '600',
            margin: '0 0 24px 0',
            textAlign: 'center'
          }}>
            📈 Mi Progreso en Salud Mental
          </h2>

          {/* Disorder Selector */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            {[
              { key: 'depression', label: 'Depresión', color: '#dc3545' },
              { key: 'anxiety', label: 'Ansiedad', color: '#ffc107' },
              { key: 'stress', label: 'Estrés', color: '#6f42c1' }
            ].map((disorder) => (
              <button
                key={disorder.key}
                onClick={() => setSelectedDisorder(disorder.key as any)}
                style={{
                  padding: '12px 24px',
                  border: `2px solid ${selectedDisorder === disorder.key ? disorder.color : '#e9ecef'}`,
                  borderRadius: '25px',
                  background: selectedDisorder === disorder.key ? disorder.color : 'white',
                  color: selectedDisorder === disorder.key ? 'white' : '#666',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedDisorder === disorder.key ? `0 4px 12px ${disorder.color}40` : 'none'
                }}
              >
                {disorder.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div style={{
            height: window.innerWidth <= 768 ? '300px' : '400px',
            position: 'relative'
          }}>
            {chartData && <Line data={chartData} options={chartOptions} />}
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            <strong>💡 Tip:</strong> Realiza el cuestionario periódicamente para ver tu progreso.
            Una disminución en las puntuaciones indica mejora en tu bienestar mental.
          </div>
        </GlassCard>
      )}

      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: window.innerWidth <= 768 ? '16px' : '24px',
        marginBottom: window.innerWidth <= 768 ? '32px' : '48px'
      }}>
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            onClick={feature.action}
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <div style={{
              width: window.innerWidth <= 768 ? '56px' : '64px',
              height: window.innerWidth <= 768 ? '56px' : '64px',
              borderRadius: window.innerWidth <= 768 ? '14px' : '16px',
              background: feature.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: window.innerWidth <= 768 ? '1.75rem' : '2rem',
              marginBottom: window.innerWidth <= 768 ? '16px' : '20px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
            }}>
              {feature.icon}
            </div>
            <h3 style={{
              color: '#2e7d32',
              fontSize: window.innerWidth <= 768 ? '1.125rem' : '1.25rem',
              fontWeight: '600',
              margin: '0 0 12px 0'
            }}>
              {feature.title}
            </h3>
            <p style={{
              color: '#4caf50',
              fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem',
              lineHeight: '1.5',
              margin: '0'
            }}>
              {feature.description}
            </p>
          </FeatureCard>
        ))}
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '32px 0',
        color: '#4caf50',
        fontSize: '0.875rem'
      }}>
        <p style={{ margin: '0' }}>
          Desarrollado con ❤️ para ayudar a las personas en su camino hacia el bienestar mental
        </p>
      </footer>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default App;
