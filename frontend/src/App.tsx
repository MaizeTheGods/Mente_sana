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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="rain-container"></div>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              color: '#2e7d32',
              margin: '0 0 8px 0',
              fontSize: '2.5rem',
              fontWeight: '700',
              letterSpacing: '-0.025em'
            }}>
              ¡Bienvenido, {user?.firstName}!
            </h1>
            <p style={{
              color: '#4caf50',
              margin: '0',
              fontSize: '1.125rem',
              fontWeight: '400'
            }}>
              Tu plataforma de apoyo para la salud mental
            </p>
          </div>
          <button
            onClick={logout}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
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
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            color: '#2e7d32',
            fontSize: '1.875rem',
            fontWeight: '600',
            margin: '0 0 8px 0',
            textAlign: 'center'
          }}>
            ¿Qué te gustaría hacer hoy?
          </h2>
          <p style={{
            color: '#4caf50',
            fontSize: '1.125rem',
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
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '48px'
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
            <div style={{ height: '400px', position: 'relative' }}>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {features.map((feature, index) => (
            <div
              key={feature.id}
              onClick={feature.action}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
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
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: feature.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '20px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                color: '#2e7d32',
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: '0 0 12px 0'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: '#4caf50',
                fontSize: '1rem',
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

          .rain-container {
            position: absolute;
            inset: 0;
            pointer-events: none;
          }

          .rain-container::before {
            content: "";
            position: absolute;
            inset: -145%;
            rotate: -45deg;
            background: transparent;
            background-image: radial-gradient(4px 100px at 0px 235px, #0f0, #0000),
              radial-gradient(4px 100px at 300px 235px, #0f0, #0000),
              radial-gradient(1.5px 1.5px at 150px 117.5px, #0f0 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 252px, #0f0, #0000),
              radial-gradient(4px 100px at 300px 252px, #0f0, #0000),
              radial-gradient(1.5px 1.5px at 150px 126px, #0f0 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 150px, #0f0, #0000),
              radial-gradient(4px 100px at 300px 150px, #0f0, #0000),
              radial-gradient(1.5px 1.5px at 150px 75px, #0f0 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 253px, #0f0, #0000),
              radial-gradient(4px 100px at 300px 253px, #0f0, #0000),
              radial-gradient(1.5px 1.5px at 150px 126.5px, #0f0 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 204px, #0f0, #0000),
              radial-gradient(4px 100px at 300px 204px, #0f0, #0000),
              radial-gradient(1.5px 1.5px at 150px 102px, #0f0 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 134px, #0f0, #0000),
              radial-gradient(4px 100px at 300px 134px, #0f0, #0000),
              radial-gradient(1.5px 1.5px at 150px 67px, #0f0 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 179px, #0f0, #0000),
              radial-gradient(4px 100px at 300px 179px, #0f0, #0000),
              radial-gradient(1.5px 1.5px at 150px 89.5px, #0f0 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 299px, #0f0, #0000),
              radial-gradient(4px 100px at 300px 299px, #0f0, #0000),
              radial-gradient(1.5px 1.5px at 150px 149.5px, #0f0 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 215px, #0f0, #0000),
              radial-gradient(4px 100px at 300px 215px, #0f0, #0000),
              radial-gradient(1.5px 1.5px at 150px 107.5px, #0f0 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 281px, #0f0, #0000),
              radial-gradient(4px 100px at 300px 281px, #0f0, #0000),
              radial-gradient(1.5px 1.5px at 150px 140.5px, #0f0 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 158px, #0f0, #0000),
              radial-gradient(4px 100px at 300px 158px, #0f0, #0000),
              radial-gradient(1.5px 1.5px at 150px 79px, #0f0 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 210px, #0f0, #0000),
              radial-gradient(4px 100px at 300px 210px, #0f0, #0000),
              radial-gradient(1.5px 1.5px at 150px 105px, #0f0 100%, #0000 150%);
            background-size:
              300px 235px,
              300px 235px,
              300px 235px,
              300px 252px,
              300px 252px,
              300px 252px,
              300px 150px,
              300px 150px,
              300px 150px,
              300px 253px,
              300px 253px,
              300px 253px,
              300px 204px,
              300px 204px,
              300px 204px,
              300px 134px,
              300px 134px,
              300px 134px,
              300px 179px,
              300px 179px,
              300px 179px,
              300px 299px,
              300px 299px,
              300px 299px,
              300px 215px,
              300px 215px,
              300px 215px,
              300px 281px,
              300px 281px,
              300px 281px,
              300px 158px,
              300px 158px,
              300px 158px,
              300px 210px,
              300px 210px,
              300px 210px;
            animation: hi 150s linear infinite;
          }

          @keyframes hi {
            0% {
              background-position:
                0px 220px,
                3px 220px,
                151.5px 337.5px,
                25px 24px,
                28px 24px,
                176.5px 150px,
                50px 16px,
                53px 16px,
                201.5px 91px,
                75px 224px,
                78px 224px,
                226.5px 350.5px,
                100px 19px,
                103px 19px,
                251.5px 121px,
                125px 120px,
                128px 120px,
                276.5px 187px,
                150px 31px,
                153px 31px,
                301.5px 120.5px,
                175px 235px,
                178px 235px,
                326.5px 384.5px,
                200px 121px,
                203px 121px,
                351.5px 228.5px,
                225px 224px,
                228px 224px,
                376.5px 364.5px,
                250px 26px,
                253px 26px,
                401.5px 105px,
                275px 75px,
                278px 75px,
                426.5px 180px;
            }
            to {
              background-position:
                0px 6800px,
                3px 6800px,
                151.5px 6917.5px,
                25px 13632px,
                28px 13632px,
                176.5px 13758px,
                50px 5416px,
                53px 5416px,
                201.5px 5491px,
                75px 17175px,
                78px 17175px,
                226.5px 17301.5px,
                100px 5119px,
                103px 5119px,
                251.5px 5221px,
                125px 8428px,
                128px 8428px,
                276.5px 8495px,
                150px 9876px,
                153px 9876px,
                301.5px 9965.5px,
                175px 13391px,
                178px 13391px,
                326.5px 13540.5px,
                200px 14741px,
                203px 14741px,
                351.5px 14848.5px,
                225px 18770px,
                228px 18770px,
                376.5px 18910.5px,
                250px 5082px,
                253px 5082px,
                401.5px 5161px,
                275px 6375px,
                278px 6375px,
                426.5px 6480px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default App;
