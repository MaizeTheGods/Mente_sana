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
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
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
  const [isLoading, setIsLoading] = React.useState(true);

  // Check if user has completed questionnaire (questionnaireCompleted is true)
  const hasCompletedQuestionnaire = user?.questionnaireCompleted === true;

  // Load historical results
  React.useEffect(() => {
    const loadResults = async () => {
      console.log('Dashboard: Loading results...');
      console.log('Dashboard: user exists:', !!user);
      console.log('Dashboard: hasCompletedQuestionnaire:', hasCompletedQuestionnaire);
      console.log('Dashboard: user.questionnaireCompleted:', user?.questionnaireCompleted);

      if (user && hasCompletedQuestionnaire) {
        try {
          console.log('Dashboard: Calling questionnaireAPI.getResults()...');
          const response = await questionnaireAPI.getResults();
          console.log('Dashboard: API response:', response);
          console.log('Dashboard: Setting results:', response.results);
          setResults(response.results);
        } catch (error) {
          console.error('Failed to load results:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('Dashboard: Not loading results - conditions not met');
        setIsLoading(false);
      }
    };

    loadResults();
  }, [user, hasCompletedQuestionnaire]);

  // Prepare chart data for progress line chart
  const progressChartData = React.useMemo(() => {
    console.log('Dashboard: Preparing progress chart data...');
    console.log('Dashboard: results.length:', results.length);

    if (!results.length) {
      console.log('Dashboard: No results, returning null');
      return null;
    }

    const sortedResults = results.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    console.log('Dashboard: sortedResults:', sortedResults);

    const labels = sortedResults.map(result =>
      new Date(result.createdAt).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric'
      })
    );

    console.log('Dashboard: labels:', labels);

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Depresión',
          data: sortedResults.map(result => result.scores?.depression || 0),
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Ansiedad',
          data: sortedResults.map(result => result.scores?.anxiety || 0),
          borderColor: '#ffc107',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Estrés',
          data: sortedResults.map(result => result.scores?.stress || 0),
          borderColor: '#6f42c1',
          backgroundColor: 'rgba(111, 66, 193, 0.1)',
          tension: 0.4,
          fill: false
        }
      ]
    };

    console.log('Dashboard: progressChartData:', chartData);
    return chartData;
  }, [results]);

  const progressChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Progreso en Salud Mental',
        font: {
          size: 14,
          weight: 'bold' as const
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30,
        ticks: {
          stepSize: 5
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
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

      {/* Latest Results Charts */}
      {(() => {
        console.log('Dashboard: Checking charts condition...');
        console.log('Dashboard: hasCompletedQuestionnaire:', hasCompletedQuestionnaire);
        console.log('Dashboard: results.length:', results.length);
        console.log('Dashboard: results:', results);
        const shouldShow = hasCompletedQuestionnaire && results.length > 0;
        console.log('Dashboard: Should show charts:', shouldShow);
        return shouldShow;
      })() && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr',
          gap: window.innerWidth <= 768 ? '24px' : '32px',
          marginBottom: window.innerWidth <= 768 ? '32px' : '48px'
        }}>
          {/* Latest Results Column Chart */}
          <GlassCard style={{ width: '100%' }}>
            <h3 style={{
              color: '#2e7d32',
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: '0 0 24px 0',
              textAlign: 'center'
            }}>
              📊 Mis Últimos Resultados
            </h3>

            <div style={{
              height: window.innerWidth <= 768 ? '300px' : '350px',
              position: 'relative'
            }}>
              <Bar
                data={{
                  labels: ['Depresión', 'Ansiedad', 'Estrés'],
                  datasets: [{
                    label: 'Puntuación',
                    data: [
                      results[results.length - 1]?.scores?.depression || 0,
                      results[results.length - 1]?.scores?.anxiety || 0,
                      results[results.length - 1]?.scores?.stress || 0
                    ],
                    backgroundColor: [
                      'rgba(220, 53, 69, 0.8)',
                      'rgba(255, 193, 7, 0.8)',
                      'rgba(111, 66, 193, 0.8)'
                    ],
                    borderColor: [
                      '#dc3545',
                      '#ffc107',
                      '#6f42c1'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    title: {
                      display: true,
                      text: 'Último Cuestionario Completado',
                      font: {
                        size: 14,
                        weight: 'bold'
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: 'white',
                      bodyColor: 'white',
                      callbacks: {
                        label: function(context: any) {
                          return `Puntuación: ${context.parsed.y}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 30,
                      ticks: {
                        stepSize: 4,
                        callback: function(value) {
                          return value;
                        }
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  },
                  animation: {
                    duration: 1000,
                    easing: 'easeOutCubic' as const
                  }
                }}
              />
            </div>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '13px'
            }}>
              <strong>Última evaluación:</strong> {results[results.length - 1] ? new Date(results[results.length - 1].createdAt).toLocaleDateString('es-ES') : 'N/A'}
            </div>
          </GlassCard>

          {/* Progress Line Chart */}
          <GlassCard style={{ width: '100%' }}>
            <h3 style={{
              color: '#2e7d32',
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: '0 0 24px 0',
              textAlign: 'center'
            }}>
              📈 Mi Progreso en el Tiempo
            </h3>

            <div style={{
              height: window.innerWidth <= 768 ? '300px' : '350px',
              position: 'relative'
            }}>
              {progressChartData && <Line data={progressChartData} options={progressChartOptions} />}
            </div>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '13px'
            }}>
              <strong>💡 Tip:</strong> Una disminución en las puntuaciones indica mejora en tu bienestar mental.
            </div>
          </GlassCard>
        </div>
      )}

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
