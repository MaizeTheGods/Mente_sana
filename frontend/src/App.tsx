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
import AdminPanel from './components/AdminPanel';
import SidebarLayout from './components/SidebarLayout';
import Loader from './components/Loader';
import styled, { createGlobalStyle } from 'styled-components';
import { Card, PageHeader, PageTitle, PageSubtitle } from './components/SharedStyles';
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
    font-family: 'Inter', sans-serif;
    background: #f0f2f5;
    color: #1e293b;
    line-height: 1.6;
  }

  button {
    font-family: inherit;
  }
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
        background: '#f0f2f5'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <Loader />
          <div style={{ color: '#64748b', fontSize: '16px', fontWeight: '500' }}>Cargando...</div>
        </div>
      </div>
    );
  }

  return user ? <SidebarLayout>{children}</SidebarLayout> : <Navigate to="/login" />;
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
        background: '#f0f2f5'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <Loader />
          <div style={{ color: '#64748b', fontSize: '16px', fontWeight: '500' }}>Cargando...</div>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
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

        <Route path="/admin" element={
          user ? <AdminPanel /> : <Navigate to="/login" />
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GlobalStyle />
      <AppRoutes />
    </AuthProvider>
  );
};

const FeatureCard = styled(Card)`
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  border: 1px solid #e2e8f0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: #2e7d32;
  }
`;

// Professional Dashboard component
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const hasCompletedQuestionnaire = user?.questionnaireCompleted === true;

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

  const progressChartData = React.useMemo(() => {
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

    return {
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
  }, [results]);

  const progressChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { usePointStyle: true, padding: 20 }
      },
      title: { display: false },
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
        ticks: { stepSize: 5 },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  const features = [
    {
      id: 'questionnaire',
      title: 'Realizar Cuestionario',
      description: 'Evalúa tu estado de salud mental con el DASS-21',
      icon: '📝',
      bg: '#e8f5e9',
      color: '#2e7d32',
      action: () => navigate('/questionnaire')
    },
    {
      id: 'exercises',
      title: 'Ejercicios y Consejos',
      description: 'Accede a técnicas de relajación y consejos prácticos',
      icon: '🧘',
      bg: '#e0f2fe',
      color: '#0284c7',
      action: () => navigate('/exercises')
    },
    {
      id: 'tips',
      title: 'Consejos Prácticos',
      description: 'Descubre consejos diarios para mejorar tu bienestar mental',
      icon: '💡',
      bg: '#fef3c7',
      color: '#d97706',
      action: () => navigate('/tips')
    },
    {
      id: 'chat',
      title: 'Grupos de Apoyo',
      description: 'Conecta con personas que comparten experiencias similares',
      icon: '👥',
      bg: '#f3e8ff',
      color: '#9333ea',
      action: () => navigate('/chat')
    },
    {
      id: 'maps',
      title: 'Ayuda Profesional',
      description: 'Encuentra especialistas y centros de salud mental cercanos',
      icon: '🗺️',
      bg: '#fee2e2',
      color: '#dc2626',
      action: () => navigate('/maps')
    }
  ];

  return (
    <div>
      <PageHeader>
        <div>
          <PageTitle>¡Hola, {user?.firstName}!</PageTitle>
          <PageSubtitle>Bienvenido a tu espacio de bienestar</PageSubtitle>
        </div>
      </PageHeader>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {features.map((feature) => (
          <FeatureCard key={feature.id} onClick={feature.action}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: feature.bg,
              color: feature.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '16px'
            }}>
              {feature.icon}
            </div>
            <h3 style={{
              color: '#1e293b',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              {feature.title}
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: '0'
            }}>
              {feature.description}
            </p>
          </FeatureCard>
        ))}
      </div>

      {hasCompletedQuestionnaire && results.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          <Card>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
              Últimos Resultados
            </h3>
            <div style={{ height: '300px' }}>
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
                    backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6'],
                    borderRadius: 6,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, max: 30, grid: { color: '#f1f5f9' } },
                    x: { grid: { display: false } }
                  }
                }}
              />
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
              Tu Progreso
            </h3>
            <div style={{ height: '300px' }}>
              {progressChartData && <Line data={progressChartData} options={progressChartOptions} />}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default App;
