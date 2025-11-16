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
import ExerciseDetail from './components/ExerciseDetail';
import TipDetail from './components/TipDetail';
import styled, { createGlobalStyle } from 'styled-components';
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

  // Don't auto-redirect to questionnaire - users can access it from dashboard

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
    <div className="container" style={{
      minHeight: '100vh',
      padding: window.innerWidth <= 768 ? '10px' : '20px'
    }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: window.innerWidth <= 768 ? '12px' : '16px',
        padding: window.innerWidth <= 768 ? '16px' : '24px',
        marginBottom: window.innerWidth <= 768 ? '24px' : '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: window.innerWidth <= 768 ? '12px' : '16px'
        }}>
          <div>
            <h1 style={{
              color: '#2e7d32',
              margin: '0 0 8px 0',
              fontSize: window.innerWidth <= 768 ? '2rem' : '2.5rem',
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
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: window.innerWidth <= 768 ? '100%' : '1200px',
        margin: '0 auto',
        padding: window.innerWidth <= 768 ? '0 10px' : '0'
      }}>
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
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: window.innerWidth <= 768 ? '12px' : '16px',
            padding: window.innerWidth <= 768 ? '20px' : '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: window.innerWidth <= 768 ? '32px' : '48px'
          }}>
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
          </div>
        )}

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: window.innerWidth <= 768 ? '16px' : '24px',
          marginBottom: window.innerWidth <= 768 ? '32px' : '48px'
        }}>
          {features.map((feature, index) => (
            <div
              key={feature.id}
              onClick={feature.action}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: window.innerWidth <= 768 ? '12px' : '16px',
                padding: window.innerWidth <= 768 ? '24px' : '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
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
            </div>
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
      </main>

      </div>

      <style>
        {`
          /* Adapted background for site theme */

          .container {
            position: absolute;
            background-image: radial-gradient(
              circle at 50% 50%,
              #0000 0,
              #0000 3px,
              rgba(129, 199, 132, 0.1) 3px
            );
            background-size: 20px 20px;
            width: 100%;
            height: 100%;
          }

          @keyframes thingy {
            0% {
              filter: var(--f) hue-rotate(0deg);
            }
            to {
              filter: var(--f) hue-rotate(1turn);
            }
          }

          .container::before {
            content: "";
            position: absolute;
            inset: -4em;
            z-index: -1;
            --f: blur(3em) brightness(1.2);
            animation:
              blobs-1e28bd3d 200s linear infinite,
              thingy 10s linear infinite;
            background-color: transparent;
            background-image: radial-gradient(
                ellipse 60px 45px at 50% 50%,
                rgba(76, 175, 80, 0.3) 0%,
                transparent 100%
              ),
              radial-gradient(ellipse 70px 55px at 50% 50%, rgba(76, 175, 80, 0.3) 0%, transparent 100%),
              radial-gradient(ellipse 75px 90px at 50% 50%, rgba(76, 175, 80, 0.3) 0%, transparent 100%),
              radial-gradient(ellipse 68px 85px at 50% 50%, rgba(76, 175, 80, 0.3) 0%, transparent 100%),
              radial-gradient(ellipse 70px 70px at 50% 50%, rgba(76, 175, 80, 0.3) 0%, transparent 100%),
              radial-gradient(ellipse 60px 46px at 50% 50%, rgba(76, 175, 80, 0.3) 0%, transparent 100%),
              radial-gradient(ellipse 85px 52px at 50% 50%, rgba(76, 175, 80, 0.3) 0%, transparent 100%),
              radial-gradient(ellipse 83px 87px at 50% 50%, rgba(76, 175, 80, 0.3) 0%, transparent 100%);
            background-size:
              800px 640px,
              1400px 510px,
              980px 1300px,
              770px 970px,
              1020px 610px,
              1300px 380px,
              1140px 930px,
              350px 1090px;
          }

          @keyframes blobs-1e28bd3d {
            0% {
              background-position:
                271px 478px,
                62px 291px,
                67px 861px,
                553px 413px,
                36px 392px,
                1077px 226px,
                400px 799px,
                7px 264px;
            }

            to {
              background-position:
                -14975px -2978px,
                31112px 11187px,
                -20081px 8981px,
                11609px -3952px,
                -12760px 12492px,
                -9354px 2946px,
                9553px 21574px,
                946px 9057px;
            }
          }


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
