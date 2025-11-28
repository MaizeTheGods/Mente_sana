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
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { tipsAPI, exercisesAPI, uploadsAPI, Tip, Category } from '../services/api';
import { Card } from './SharedStyles';
import api from '../services/api';

// Avatar Categories API functions
const avatarCategoriesAPI = {
  getCategories: async (): Promise<{ categories: any[] }> => {
    const response = await api.get('/avatar-categories');
    return response.data;
  },

  createCategory: async (categoryData: any): Promise<{ message: string; category: any }> => {
    const response = await api.post('/avatar-categories', categoryData);
    return response.data;
  },

  updateCategory: async (id: string, categoryData: any): Promise<{ message: string; category: any }> => {
    const response = await api.put(`/avatar-categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/avatar-categories/${id}`);
    return response.data;
  }
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  Filler
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tips' | 'exercises' | 'avatars' | 'categories'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [avatars, setAvatars] = useState<Record<string, any[]>>({});
  const [avatarCategories, setAvatarCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

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
    if (activeTab === 'categories' && (user?.role === 'admin' || user?.role === 'owner')) {
      loadCategories();
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
      setAvatars(response.avatarsByCategory);
    } catch (error) {
      console.error('Error loading avatars:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await avatarCategoriesAPI.getCategories();
      setAvatarCategories(response.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
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

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const files = formData.getAll('avatar') as File[];

    if (!files || files.length === 0) {
      alert('Por favor selecciona al menos un archivo');
      return;
    }

    // Validate file types and sizes
    const invalidFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      return !isValidType || !isValidSize;
    });

    if (invalidFiles.length > 0) {
      alert('Algunos archivos no son válidos. Solo se permiten imágenes de hasta 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      let successCount = 0;
      let errorCount = 0;

      // Upload files one by one to show progress
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          await uploadsAPI.uploadAvatar(file, selectedCategory);
          successCount++;
          setUploadProgress({ current: i + 1, total: files.length });
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          errorCount++;
          setUploadProgress({ current: i + 1, total: files.length });
        }
      }

      // Reload avatars after all uploads
      loadAvatars();

      if (errorCount === 0) {
        alert(`${successCount} avatar(es) subido(s) exitosamente`);
      } else {
        alert(`${successCount} avatar(es) subido(s) exitosamente, ${errorCount} error(es)`);
      }

      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Error uploading avatars:', error);
      alert('Error al subir los avatares');
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const handleDeleteAvatar = async (avatarId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este avatar?')) return;

    try {
      await uploadsAPI.deleteAvatar(avatarId);
      loadAvatars();
      alert('Avatar eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting avatar:', error);
      alert('Error al eliminar el avatar');
    }
  };

  const handleSaveCategory = async (categoryData: any) => {
    try {
      if (editingCategory) {
        await avatarCategoriesAPI.updateCategory(editingCategory._id, categoryData);
        alert('Categoría actualizada exitosamente');
      } else {
        await avatarCategoriesAPI.createCategory(categoryData);
        alert('Categoría creada exitosamente');
      }
      loadCategories();
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar la categoría');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres desactivar esta categoría? Los avatares existentes permanecerán.')) return;

    try {
      await avatarCategoriesAPI.deleteCategory(categoryId);
      loadCategories();
      alert('Categoría desactivada exitosamente');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al desactivar la categoría');
    }
  };

  const handleRestoreCategory = async (categoryId: string) => {
    try {
      await avatarCategoriesAPI.updateCategory(categoryId, { isActive: true });
      loadCategories();
      alert('Categoría activada exitosamente');
    } catch (error) {
      console.error('Error restoring category:', error);
      alert('Error al activar la categoría');
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
        <NavItem active={activeTab === 'categories'} onClick={() => setActiveTab('categories')}>
          📂 Categorías
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
            {activeTab === 'categories' && 'Gestión de Categorías'}
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
              <AddButton onClick={() => setIsUploadModalOpen(true)}>
                + Subir Avatares
              </AddButton>
            </TipsHeader>

            {avatars && Object.entries(avatars).map(([category, categoryAvatars]) => (
              <div key={category} style={{ marginBottom: '40px' }}>
                <h3 style={{
                  color: '#1e293b',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  textTransform: 'capitalize'
                }}>
                  {category === 'default' ? 'Predeterminado' : category}
                </h3>

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  paddingBottom: '10px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 transparent'
                }}>
                  {(categoryAvatars as any[]).map((avatar: any) => (
                    <div key={avatar._id} style={{
                      flex: '0 0 auto',
                      width: '120px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid #2e7d32',
                        margin: '0 auto 12px',
                        background: avatar._id === 'default' ? 'linear-gradient(135deg, #2e7d32, #4caf50)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {avatar._id === 'default' ? (
                          <span style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>?</span>
                        ) : (
                          <img
                            src={avatar.url}
                            alt={`Avatar ${avatar.filename}`}
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
                        )}
                        {avatar._id !== 'default' && (
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
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                        {avatar._id === 'default' ? 'Predeterminado' : avatar.filename}
                      </div>
                      {avatar._id !== 'default' && (
                        <ActionButton
                          variant="danger"
                          style={{ fontSize: '10px', padding: '4px 8px' }}
                          onClick={() => handleDeleteAvatar(avatar._id)}
                        >
                          Eliminar
                        </ActionButton>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {isUploadModalOpen && (
              <ModalOverlay onClick={() => setIsUploadModalOpen(false)}>
                <ModalContent onClick={e => e.stopPropagation()}>
                  <h2 style={{ marginBottom: 20, color: '#1e293b' }}>
                    Subir Nuevos Avatares
                  </h2>

                  <form onSubmit={handleFileUpload}>
                    <FormGroup>
                      <Label>Categoría</Label>
                      <Select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        disabled={isUploading}
                      >
                        {avatarCategories.map(category => (
                          <option key={category.name} value={category.name}>
                            {category.icon} {category.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>Seleccionar Imágenes (máximo 5MB por imagen)</Label>
                      <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        multiple
                        required
                        disabled={isUploading}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: isUploading ? '#f8fafc' : 'white'
                        }}
                      />
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        Puedes seleccionar múltiples imágenes a la vez
                      </div>
                    </FormGroup>

                    {isUploading && (
                      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <div style={{ color: '#2e7d32', fontWeight: '600', marginBottom: '8px' }}>
                          Subiendo {uploadProgress.current} de {uploadProgress.total} imagen(es)...
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          background: '#e2e8f0',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                            height: '100%',
                            background: '#2e7d32',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    )}

                    <ModalActions>
                      <ActionButton
                        type="button"
                        variant="danger"
                        onClick={() => setIsUploadModalOpen(false)}
                        disabled={isUploading}
                      >
                        Cancelar
                      </ActionButton>
                      <ActionButton
                        type="submit"
                        variant="success"
                        disabled={isUploading}
                      >
                        {isUploading ? 'Subiendo...' : 'Subir Avatar(es)'}
                      </ActionButton>
                    </ModalActions>
                  </form>
                </ModalContent>
              </ModalOverlay>
            )}
          </>
        )}

        {activeTab === 'categories' && (
          <>
            <TipsHeader>
              <div style={{ color: '#64748b' }}>Gestiona todas las categorías de avatares (activas e inactivas)</div>
              <AddButton onClick={() => {
                setEditingCategory(null);
                setIsCategoryModalOpen(true);
              }}>
                + Nueva Categoría
              </AddButton>
            </TipsHeader>

            <div style={{ display: 'grid', gap: '16px' }}>
              {avatarCategories.map((category: any) => (
                <Card key={category._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: category.isActive ? 1 : 0.6,
                  background: category.isActive ? 'white' : '#f8fafc'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: category.color || '#2e7d32',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      opacity: category.isActive ? 1 : 0.5
                    }}>
                      {category.icon || '📁'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '18px' }}>
                          {category.label}
                        </h3>
                        {!category.isActive && (
                          <Badge bg="#fee2e2" color="#dc2626" style={{ fontSize: '10px' }}>
                            Inactiva
                          </Badge>
                        )}
                      </div>
                      <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>
                        {category.description || 'Sin descripción'}
                      </p>
                      <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>
                        Nombre: {category.name}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <ActionButton
                      onClick={() => {
                        setEditingCategory(category);
                        setIsCategoryModalOpen(true);
                      }}
                    >
                      Editar
                    </ActionButton>
                    {category.isActive ? (
                      <ActionButton
                        variant="danger"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        Desactivar
                      </ActionButton>
                    ) : (
                      <ActionButton
                        variant="success"
                        onClick={() => handleRestoreCategory(category._id)}
                      >
                        Activar
                      </ActionButton>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {isCategoryModalOpen && (
              <ModalOverlay onClick={() => setIsCategoryModalOpen(false)}>
                <ModalContent onClick={e => e.stopPropagation()}>
                  <h2 style={{ marginBottom: 20, color: '#1e293b' }}>
                    {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h2>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const categoryData = {
                      name: formData.get('name'),
                      label: formData.get('label'),
                      description: formData.get('description'),
                      icon: formData.get('icon'),
                      color: formData.get('color')
                    };
                    handleSaveCategory(categoryData);
                  }}>
                    <FormGroup>
                      <Label>Nombre (identificador único)</Label>
                      <Input
                        name="name"
                        required
                        defaultValue={editingCategory?.name || ''}
                        placeholder="ej: profesional"
                        disabled={!!editingCategory} // No permitir cambiar el nombre si ya existe
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Etiqueta (nombre visible)</Label>
                      <Input
                        name="label"
                        required
                        defaultValue={editingCategory?.label || ''}
                        placeholder="ej: Profesional"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Descripción</Label>
                      <TextArea
                        name="description"
                        defaultValue={editingCategory?.description || ''}
                        placeholder="Describe la categoría..."
                        rows={3}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Ícono (emoji)</Label>
                      <Input
                        name="icon"
                        defaultValue={editingCategory?.icon || '📁'}
                        placeholder="ej: 💼"
                        maxLength={2}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Color</Label>
                      <Input
                        name="color"
                        type="color"
                        defaultValue={editingCategory?.color || '#2e7d32'}
                      />
                    </FormGroup>

                    <ModalActions>
                      <ActionButton type="button" variant="danger" onClick={() => setIsCategoryModalOpen(false)}>
                        Cancelar
                      </ActionButton>
                      <ActionButton type="submit" variant="success">
                        {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                      </ActionButton>
                    </ModalActions>
                  </form>
                </ModalContent>
              </ModalOverlay>
            )}
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