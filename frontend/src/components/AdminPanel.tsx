import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { tipsAPI, exercisesAPI, uploadsAPI, Tip, Category } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement
);

// --- Styled Components ---

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Inter', sans-serif;
`;

const Sidebar = styled.div`
  width: 260px;
  background: #ffffff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: fixed;
  height: 100vh;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #2e7d32;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const NavItem = styled.div<{ active: boolean }>`
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.active ? '#2e7d32' : '#64748b'};
  background: ${props => props.active ? '#e8f5e9' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '500'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#e8f5e9' : '#f8fafc'};
    color: #2e7d32;
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 260px;
  padding: 30px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2e7d32;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  color: #1e293b;
  font-size: 32px;
  font-weight: 700;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const ChartHeader = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
`;

// --- Users Table Styles ---
const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1.5fr;
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #64748b;
  font-size: 14px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1.5fr;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Badge = styled.span<{ color: string; bg: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.bg};
  color: ${props => props.color};
`;

const ActionButton = styled.button<{ variant?: 'danger' | 'success' | 'primary' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return 'background: #fee2e2; color: #dc2626; &:hover { background: #fecaca; }';
      case 'success':
        return 'background: #dcfce7; color: #16a34a; &:hover { background: #bbf7d0; }';
      default:
        return 'background: #e0f2fe; color: #0284c7; &:hover { background: #bae6fd; }';
    }
  }}
`;

// --- Tips Styles ---
const TipsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const AddButton = styled.button`
  background: #2e7d32;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover {
    background: #1b5e20;
  }
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const TipCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
`;

const TipTitle = styled.h4`
  font-size: 18px;
  color: #1e293b;
  margin-bottom: 8px;
`;

const TipContent = styled.p`
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TipFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
`;

// --- Modal Styles ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #334155;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  background: white;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
`;


const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tips' | 'exercises' | 'avatars'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [avatars, setAvatars] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [editingExercise, setEditingExercise] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    videoUrl: ''
  });
  const [exerciseFormData, setExerciseFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: 5,
    instructions: '',
    videoUrl: ''
  });

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'owner') {
      loadData();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (activeTab === 'avatars' && (user?.role === 'admin' || user?.role === 'owner')) {
      loadAvatars();
    }
  }, [activeTab, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const backendUrl = 'https://mente-sana-backend.onrender.com';

      if (activeTab === 'dashboard') {
        const statsRes = await fetch(`${backendUrl}/api/admin/stats`, { headers });
        const statsData = await statsRes.json();
        setStats(statsData);
      } else if (activeTab === 'users') {
        const usersRes = await fetch(`${backendUrl}/api/admin/users`, { headers });
        const usersData = await usersRes.json();
        setUsers(usersData.users);
      } else if (activeTab === 'tips') {
        const [tipsRes, catsRes] = await Promise.all([
          tipsAPI.getTips(),
          tipsAPI.getCategories()
        ]);
        setTips(tipsRes.tips);
        setCategories(catsRes.categories);
      } else if (activeTab === 'exercises') {
        const [exercisesRes, catsRes] = await Promise.all([
          exercisesAPI.getExercises(),
          exercisesAPI.getCategories()
        ]);
        setExercises(exercisesRes.exercises);
        setCategories(catsRes.categories);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvatars = async () => {
    try {
      const response = await uploadsAPI.getAvatars();
      setAvatars(response.avatars.map(avatar => avatar.url));
    } catch (error) {
      console.error('Error loading avatars:', error);
    }
  };

  // --- User Actions ---
  const handleUserAction = async (userId: string, action: 'toggleStatus' | 'delete' | 'changeRole', value?: any) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    const backendUrl = 'https://mente-sana-backend.onrender.com';

    try {
      if (action === 'toggleStatus') {
        await fetch(`${backendUrl}/api/admin/users/${userId}/status`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ isActive: value })
        });
      } else if (action === 'delete') {
        if (!window.confirm('¿Estás seguro?')) return;
        await fetch(`${backendUrl}/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers
        });
      } else if (action === 'changeRole') {
        await fetch(`${backendUrl}/api/admin/users/${userId}/role`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ role: value })
        });
      }
      loadData();
    } catch (error) {
      console.error('Action failed:', error);
      alert('Error al realizar la acción');
    }
  };

  // --- Tip Actions ---
  const handleOpenModal = (tip?: Tip) => {
    if (tip) {
      setEditingTip(tip);
      setFormData({
        title: tip.title,
        content: tip.content || '',
        category: tip.category,
        videoUrl: tip.media?.videoUrl || ''
      });
    } else {
      setEditingTip(null);
      setFormData({ title: '', content: '', category: categories[0]?.id || 'general', videoUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveTip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tipData = {
        ...formData,
        media: formData.videoUrl ? { videoUrl: formData.videoUrl } : undefined
      };

      if (editingTip) {
        await tipsAPI.updateTip(editingTip._id, tipData);
      } else {
        await tipsAPI.createTip(tipData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving tip:', error);
      alert('Error al guardar el consejo');
    }
  };

  const handleDeleteTip = async (id: string) => {
    if (!window.confirm('¿Eliminar consejo?')) return;
    try {
      await tipsAPI.deleteTip(id);
      loadData();
    } catch (error) {
      console.error('Error deleting tip:', error);
    }
  };

  // --- Exercise Actions ---
  const handleOpenExerciseModal = (exercise?: any) => {
    if (exercise) {
      setEditingExercise(exercise);
      setExerciseFormData({
        title: exercise.title,
        description: exercise.description,
        category: exercise.category,
        duration: exercise.duration,
        instructions: exercise.instructions?.map((i: any) => i.text).join('\n\n') || '',
        videoUrl: exercise.media?.videoUrl || ''
      });
    } else {
      setEditingExercise(null);
      setExerciseFormData({
        title: '',
        description: '',
        category: categories[0]?.id || 'breathing',
        duration: 5,
        instructions: '',
        videoUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const exerciseData = {
        ...exerciseFormData,
        instructions: exerciseFormData.instructions.split('\n\n').map((text, index) => ({
          step: index + 1,
          text: text.trim()
        })),
        media: exerciseFormData.videoUrl ? { videoUrl: exerciseFormData.videoUrl } : undefined
      };

      if (editingExercise) {
        await exercisesAPI.updateExercise(editingExercise._id, exerciseData);
      } else {
        await exercisesAPI.createExercise(exerciseData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Error al guardar el ejercicio');
    }
  };

  const handleDeleteExercise = async (id: string) => {
    if (!window.confirm('¿Eliminar ejercicio?')) return;
    try {
      await exercisesAPI.deleteExercise(id);
      loadData();
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadsAPI.uploadAvatar(file);
      // Reload avatars after upload
      loadAvatars();
      alert('Avatar subido exitosamente');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error al subir el avatar');
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Acceso Denegado</div>;
  }

  // Chart Data Preparation
  const userGrowthData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], // Mock data for now, ideally calculate from users creation date
    datasets: [
      {
        label: 'Nuevos Usuarios',
        data: [12, 19, 3, 5, 2, 3], // Mock data
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const userRolesData = {
    labels: ['Usuarios', 'Admins', 'Owners'],
    datasets: [
      {
        data: [
          stats?.stats?.totalUsers || 0,
          stats?.stats?.adminUsers || 0,
          1 // Owner (approx)
        ],
        backgroundColor: ['#4caf50', '#2196f3', '#ffc107'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Layout>
      <Sidebar>
        <Logo onClick={() => navigate('/dashboard')}>
          🌿 Mente Sana
        </Logo>
        <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
          📊 Dashboard
        </NavItem>
        <NavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          👥 Usuarios
        </NavItem>
        <NavItem active={activeTab === 'tips'} onClick={() => setActiveTab('tips')}>
          💡 Consejos
        </NavItem>
        <NavItem active={activeTab === 'exercises'} onClick={() => setActiveTab('exercises')}>
          🧘 Ejercicios
        </NavItem>
        <NavItem active={activeTab === 'avatars'} onClick={() => setActiveTab('avatars')}>
          👤 Avatares
        </NavItem>

        <div style={{ marginTop: 'auto' }}>
          <NavItem active={false} onClick={() => navigate('/dashboard')}>
            ⬅️ Volver a la App
          </NavItem>
        </div>
      </Sidebar>

      <MainContent>
        <Header>
          <PageTitle>
            {activeTab === 'dashboard' && 'Panel de Control'}
            {activeTab === 'users' && 'Gestión de Usuarios'}
            {activeTab === 'tips' && 'Biblioteca de Consejos'}
            {activeTab === 'exercises' && 'Biblioteca de Ejercicios'}
            {activeTab === 'avatars' && 'Gestión de Avatares'}
          </PageTitle>
          <UserProfile>
            <span>{user.firstName} {user.lastName}</span>
            <Avatar>{user.firstName[0]}</Avatar>
          </UserProfile>
        </Header>

        {activeTab === 'dashboard' && stats && (
          <>
            <StatsGrid>
              <StatCard>
                <StatLabel>Total Usuarios</StatLabel>
                <StatValue>{stats.stats.totalUsers}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Usuarios Activos</StatLabel>
                <StatValue>{stats.stats.activeUsers}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Consejos Publicados</StatLabel>
                <StatValue>{stats.stats.totalTips}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Ejercicios</StatLabel>
                <StatValue>{stats.stats.totalExercises}</StatValue>
              </StatCard>
            </StatsGrid>

            <ChartsContainer>
              <ChartCard>
                <ChartHeader>Crecimiento de Usuarios</ChartHeader>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Line data={userGrowthData} options={{ maintainAspectRatio: false, responsive: true }} />
                </div>
              </ChartCard>
              <ChartCard>
                <ChartHeader>Distribución</ChartHeader>
                <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <Doughnut data={userRolesData} options={{ maintainAspectRatio: false, responsive: true }} />
                </div>
              </ChartCard>
            </ChartsContainer>
          </>
        )}

        {activeTab === 'users' && (
          <TableContainer>
            <TableHeader>
              <div>Usuario</div>
              <div>Email</div>
              <div>Rol</div>
              <div>Estado</div>
              <div>Acciones</div>
            </TableHeader>
            {users.map(u => (
              <TableRow key={u._id}>
                <div style={{ fontWeight: 500 }}>{u.firstName} {u.lastName}</div>
                <div style={{ color: '#64748b' }}>{u.email}</div>
                <div>
                  <select
                    value={u.role}
                    onChange={(e) => handleUserAction(u._id, 'changeRole', e.target.value)}
                    disabled={u.role === 'owner'}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <Badge
                    bg={u.isActive ? '#dcfce7' : '#fee2e2'}
                    color={u.isActive ? '#16a34a' : '#dc2626'}
                  >
                    {u.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div>
                  <ActionButton
                    variant={u.isActive ? 'danger' : 'success'}
                    onClick={() => handleUserAction(u._id, 'toggleStatus', !u.isActive)}
                    disabled={u.role === 'owner'}
                  >
                    {u.isActive ? 'Desactivar' : 'Activar'}
                  </ActionButton>
                  {u.role !== 'owner' && (
                    <ActionButton variant="danger" onClick={() => handleUserAction(u._id, 'delete')}>
                      Eliminar
                    </ActionButton>
                  )}
                </div>
              </TableRow>
            ))}
          </TableContainer>
        )}

        {activeTab === 'tips' && (
          <>
            <TipsHeader>
              <div style={{ color: '#64748b' }}>Gestiona el contenido de bienestar</div>
              <AddButton onClick={() => handleOpenModal()}>
                + Nuevo Consejo
              </AddButton>
            </TipsHeader>
            <TipsGrid>
              {tips.map(tip => (
                <TipCard key={tip._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Badge bg="#e0f2fe" color="#0284c7">{tip.category}</Badge>
                    {tip.media?.videoUrl && <span>🎥</span>}
                  </div>
                  <TipTitle>{tip.title}</TipTitle>
                  <TipContent>{tip.content}</TipContent>
                  <TipFooter>
                    <ActionButton onClick={() => handleOpenModal(tip)}>Editar</ActionButton>
                    <ActionButton variant="danger" onClick={() => handleDeleteTip(tip._id)}>Eliminar</ActionButton>
                  </TipFooter>
                </TipCard>
              ))}
            </TipsGrid>
          </>
        )}

        {activeTab === 'exercises' && (
          <>
            <TipsHeader>
              <div style={{ color: '#64748b' }}>Gestiona los ejercicios de meditación y relajación</div>
              <AddButton onClick={() => handleOpenExerciseModal()}>
                + Nuevo Ejercicio
              </AddButton>
            </TipsHeader>
            <TipsGrid>
              {exercises.map(exercise => (
                <TipCard key={exercise._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Badge bg="#e0f2fe" color="#0284c7">{exercise.category}</Badge>
                    {exercise.media?.videoUrl && <span>🎥</span>}
                  </div>
                  <TipTitle>{exercise.title}</TipTitle>
                  <TipContent>{exercise.description}</TipContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>Duración: {exercise.duration} min</span>
                  </div>
                  <TipFooter>
                    <ActionButton onClick={() => handleOpenExerciseModal(exercise)}>Editar</ActionButton>
                    <ActionButton variant="danger" onClick={() => handleDeleteExercise(exercise._id)}>Eliminar</ActionButton>
                  </TipFooter>
                </TipCard>
              ))}
            </TipsGrid>
          </>
        )}

        {activeTab === 'avatars' && (
          <>
            <TipsHeader>
              <div style={{ color: '#64748b' }}>Gestiona las imágenes de perfil disponibles para los usuarios</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="avatar-upload"
                />
                <AddButton onClick={() => document.getElementById('avatar-upload')?.click()}>
                  + Subir Avatar
                </AddButton>
              </div>
            </TipsHeader>
            <TipsGrid>
              <TipCard>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #2e7d32',
                    background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'bold'
                  }}>
                    ?
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                      Avatar Predeterminado
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <ActionButton variant="primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                        Usado por defecto
                      </ActionButton>
                    </div>
                  </div>
                </div>
              </TipCard>
              {avatars.map((avatarUrl, index) => (
                <TipCard key={avatarUrl}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '3px solid #2e7d32'
                    }}>
                      <img
                        src={avatarUrl}
                        alt={`Avatar ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = target.nextElementSibling as HTMLElement;
                          if (placeholder) {
                            placeholder.style.display = 'flex';
                          }
                        }}
                      />
                      <div style={{
                        display: 'none',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: 'bold'
                      }}>
                        ?
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                        Avatar {index + 1}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <ActionButton variant="primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                          Editar
                        </ActionButton>
                        <ActionButton variant="danger" style={{ fontSize: '12px', padding: '6px 12px' }}>
                          Eliminar
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                </TipCard>
              ))}
            </TipsGrid>
          </>
        )}

      </MainContent>
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 20, color: '#1e293b' }}>
              {editingTip ? 'Editar Consejo' : editingExercise ? 'Editar Ejercicio' : activeTab === 'tips' ? 'Nuevo Consejo' : 'Nuevo Ejercicio'}
            </h2>
            {activeTab === 'tips' ? (
              <form onSubmit={handleSaveTip}>
                <FormGroup>
                  <Label>Título</Label>
                  <Input
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Categoría</Label>
                  <Select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Contenido</Label>
                  <TextArea
                    required
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Video URL (YouTube ID)</Label>
                  <Input
                    placeholder="Ej: dQw4w9WgXcQ"
                    value={formData.videoUrl}
                    onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  />
                </FormGroup>
                <ModalActions>
                  <ActionButton type="button" variant="danger" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </ActionButton>
                  <ActionButton type="submit" variant="success">
                    Guardar
                  </ActionButton>
                </ModalActions>
              </form>
            ) : (
              <form onSubmit={handleSaveExercise}>
                <FormGroup>
                  <Label>Título</Label>
                  <Input
                    required
                    value={exerciseFormData.title}
                    onChange={e => setExerciseFormData({ ...exerciseFormData, title: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Categoría</Label>
                  <Select
                    value={exerciseFormData.category}
                    onChange={e => setExerciseFormData({ ...exerciseFormData, category: e.target.value })}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Descripción</Label>
                  <TextArea
                    required
                    value={exerciseFormData.description}
                    onChange={e => setExerciseFormData({ ...exerciseFormData, description: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Duración (minutos)</Label>
                  <Input
                    type="number"
                    required
                    min="1"
                    value={exerciseFormData.duration}
                    onChange={e => setExerciseFormData({ ...exerciseFormData, duration: parseInt(e.target.value) })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Instrucciones (una por línea)</Label>
                  <TextArea
                    required
                    placeholder="Paso 1: Siéntate cómodamente&#10;&#10;Paso 2: Respira profundamente"
                    value={exerciseFormData.instructions}
                    onChange={e => setExerciseFormData({ ...exerciseFormData, instructions: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Video URL (YouTube ID)</Label>
                  <Input
                    placeholder="Ej: dQw4w9WgXcQ"
                    value={exerciseFormData.videoUrl}
                    onChange={e => setExerciseFormData({ ...exerciseFormData, videoUrl: e.target.value })}
                  />
                </FormGroup>
                <ModalActions>
                  <ActionButton type="button" variant="danger" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </ActionButton>
                  <ActionButton type="submit" variant="success">
                    Guardar
                  </ActionButton>
                </ModalActions>
              </form>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

export default AdminPanel;