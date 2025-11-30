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
import { tipsAPI, exercisesAPI, uploadsAPI, songsAPI, reelsAPI, Tip, Category, Song, Reel } from '../services/api';
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

const Sidebar = styled.div<{ isOpen: boolean }>`
  width: 260px;
  background: #ffffff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: fixed;
  height: 100vh;
  z-index: 100;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  display: none;
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 90;
  }
`;

const MobileHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    background: white;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 80;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #1e293b;
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
  padding-top: 100px;
  overflow-y: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 20px;
    padding-top: 140px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  position: fixed;
  top: 0;
  right: 0;
  left: 260px;
  background: white;
  padding: 20px 30px;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  @media (max-width: 768px) {
    left: 0;
    top: 60px;
    padding: 15px 20px;
  }
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tips' | 'exercises' | 'avatars' | 'categories' | 'songs' | 'reels'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatars, setAvatars] = useState<Record<string, any[]>>({});
  const [avatarCategories, setAvatarCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<Reel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [songFormData, setSongFormData] = useState({
    files: [] as File[],
    titles: [] as string[]
  });

  const [reelFormData, setReelFormData] = useState({
    title: '',
    description: '',
    videoUrl: ''
  });

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
      loadCategories(); // Necesario para el dropdown de categorías en subida
    }
    if (activeTab === 'categories' && (user?.role === 'admin' || user?.role === 'owner')) {
      loadCategories();
    }
  }, [activeTab, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token} ` };
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
      } else if (activeTab === 'songs') {
        const songsRes = await songsAPI.getSongs();
        setSongs(songsRes.songs);
      } else if (activeTab === 'reels') {
        const reelsRes = await reelsAPI.getReels({ limit: 100 });
        setReels(reelsRes.reels);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvatars = async () => {
    try {
      console.log('🔍 Cargando avatares desde API...');
      const response = await uploadsAPI.getAvatars();
      console.log('📦 Respuesta de avatares:', response);
      console.log('📂 Avatares por categoría:', response.avatarsByCategory);

      // Log detallado de cada categoría
      Object.entries(response.avatarsByCategory || {}).forEach(([category, avatars]) => {
        console.log(`  📁 ${category}: ${Array.isArray(avatars) ? avatars.length : 'N/A'} avatares`);
        if (Array.isArray(avatars) && avatars.length > 0) {
          avatars.forEach((avatar: any, index: number) => {
            console.log(`    ${index + 1}. ${avatar.filename} (ID: ${avatar._id}, URL: ${avatar.url?.substring(0, 50)}...)`);
          });
        }
      });

      setAvatars(response.avatarsByCategory);
      console.log('✅ Avatares cargados y estado actualizado');
    } catch (error) {
      console.error('❌ Error cargando avatares:', error);
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
      'Authorization': `Bearer ${token} `,
      'Content-Type': 'application/json'
    };
    const backendUrl = 'https://mente-sana-backend.onrender.com';

    try {
      if (action === 'toggleStatus') {
        await fetch(`${backendUrl} /api/admin / users / ${userId}/status`, {
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
      // Validar datos antes de enviar
      if (!formData.title.trim()) {
        alert('El título es obligatorio');
        return;
      }
      if (!formData.content.trim()) {
        alert('El contenido es obligatorio');
        return;
      }
      if (!formData.category) {
        alert('La categoría es obligatoria');
        return;
      }

      // Procesar URL de YouTube si es necesario
      let processedVideoUrl = formData.videoUrl;
      if (formData.videoUrl && (formData.videoUrl.includes('youtube.com/watch?v=') || formData.videoUrl.includes('youtu.be/'))) {
        try {
          const url = new URL(formData.videoUrl.includes('youtu.be/') ? formData.videoUrl.replace('youtu.be/', 'youtube.com/watch?v=') : formData.videoUrl);
          processedVideoUrl = url.searchParams.get('v') || formData.videoUrl.split('/').pop() || formData.videoUrl;
        } catch (error) {
          console.warn('Error procesando URL de YouTube, usando valor original:', error);
        }
      }

      const tipData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        media: processedVideoUrl ? { videoUrl: processedVideoUrl } : undefined
      };

      console.log('📤 Enviando datos del consejo:', JSON.stringify(tipData, null, 2));

      if (editingTip) {
        await tipsAPI.updateTip(editingTip._id, tipData);
      } else {
        await tipsAPI.createTip(tipData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      console.error('Error saving tip:', error);
      if (error.response?.status === 400) {
        alert(`Error de validación: ${error.response.data.error || 'Datos inválidos'}`);
      } else {
        alert('Error al guardar el consejo');
      }
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
      // Validar datos antes de enviar
      if (!exerciseFormData.title.trim()) {
        alert('El título es obligatorio');
        return;
      }
      if (!exerciseFormData.description.trim()) {
        alert('La descripción es obligatoria');
        return;
      }
      if (!exerciseFormData.category) {
        alert('La categoría es obligatoria');
        return;
      }
      if (!exerciseFormData.duration || isNaN(exerciseFormData.duration) || exerciseFormData.duration < 1 || exerciseFormData.duration > 120) {
        alert('La duración debe ser un número entre 1 y 120 minutos');
        return;
      }
      if (!exerciseFormData.instructions.trim()) {
        alert('Las instrucciones son obligatorias');
        return;
      }

      // Procesar instrucciones - dividir por líneas y filtrar líneas vacías
      const instructionsArray = exerciseFormData.instructions
        .split('\n')
        .map(text => text.trim())
        .filter(text => text.length > 0)
        .map((text, index) => ({
          step: index + 1,
          text: text
        }));

      if (instructionsArray.length === 0) {
        alert('Debe proporcionar al menos una instrucción');
        return;
      }

      const exerciseData = {
        title: exerciseFormData.title.trim(),
        description: exerciseFormData.description.trim(),
        category: exerciseFormData.category,
        duration: Number(exerciseFormData.duration),
        instructions: instructionsArray,
        difficulty: 'beginner', // Valor por defecto
        targetDisorders: [], // Array vacío por defecto
        media: exerciseFormData.videoUrl ? { videoUrl: exerciseFormData.videoUrl } : undefined
      };

      console.log('📤 Enviando datos del ejercicio:', JSON.stringify(exerciseData, null, 2));

      if (editingExercise) {
        await exercisesAPI.updateExercise(editingExercise._id, exerciseData);
      } else {
        await exercisesAPI.createExercise(exerciseData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      console.error('Error saving exercise:', error);
      if (error.response?.status === 400) {
        alert(`Error de validación: ${error.response.data.error || 'Datos inválidos'}`);
      } else {
        alert('Error al guardar el ejercicio');
      }
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

    console.log('🚀 Iniciando subida de avatares');
    console.log('📁 Archivos seleccionados:', files.length);
    files.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB, ${file.type})`);
    });

    if (!files || files.length === 0) {
      console.log('❌ No hay archivos seleccionados');
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
      console.log('❌ Archivos inválidos encontrados:', invalidFiles.map(f => f.name));
      alert('Algunos archivos no son válidos. Solo se permiten imágenes de hasta 5MB.');
      return;
    }

    // Get the selected category from the form
    const categoryFromForm = formData.get('category') as string;
    const categoryToUse = categoryFromForm || selectedCategory;

    console.log('📂 Categoría seleccionada:', categoryToUse);
    console.log('📂 Categoría desde form:', categoryFromForm);
    console.log('📂 Categoría desde estado:', selectedCategory);
    console.log('📂 Categorías disponibles:', avatarCategories.map(c => `${c.name} (${c.isActive ? 'activa' : 'inactiva'})`));

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      let successCount = 0;
      let errorCount = 0;
      const uploadedAvatars: any[] = [];

      console.log('⏳ Iniciando subida individual de archivos...');

      // Upload files one by one to show progress
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📤 Subiendo archivo ${i + 1}/${files.length}: ${file.name}`);

        try {
          const result = await uploadsAPI.uploadAvatar(file, categoryToUse);
          console.log(`✅ Archivo ${file.name} subido exitosamente:`, result);

          if (result && result.avatar) {
            uploadedAvatars.push(result.avatar);
          }

          successCount++;
          setUploadProgress({ current: i + 1, total: files.length });
        } catch (error) {
          console.error(`❌ Error subiendo ${file.name}:`, error);
          errorCount++;
          setUploadProgress({ current: i + 1, total: files.length });
        }
      }

      console.log('🔄 Recargando lista de avatares...');
      await loadAvatars();

      console.log('📊 Resumen de subida:');
      console.log(`  ✅ Exitosos: ${successCount}`);
      console.log(`  ❌ Errores: ${errorCount}`);
      console.log(`  📂 Categoría: ${categoryToUse}`);
      console.log('  📸 Avatares subidos:', uploadedAvatars);

      if (errorCount === 0) {
        console.log('🎉 Subida completada exitosamente');
        alert(`${successCount} avatar(es) subido(s) exitosamente a la categoría "${categoryToUse}"`);
      } else {
        console.log('⚠️ Subida completada con algunos errores');
        alert(`${successCount} avatar(es) subido(s) exitosamente, ${errorCount} error(es) en la categoría "${categoryToUse}"`);
      }

      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('💥 Error general en subida:', error);
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

  const handleSongUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (songFormData.files.length === 0) {
      alert('Selecciona al menos un archivo');
      return;
    }

    try {
      const result = await songsAPI.uploadSongs(songFormData.files, songFormData.titles);
      setIsSongModalOpen(false);
      setSongFormData({ files: [], titles: [] });
      loadData();

      const successCount = result.songs?.length || 0;
      const errorCount = result.errors?.length || 0;

      if (errorCount === 0) {
        alert(`${successCount} canción(es) subida(s) exitosamente`);
      } else {
        alert(`${successCount} canción(es) subida(s) exitosamente, ${errorCount} error(es)`);
      }
    } catch (error) {
      console.error('Error uploading songs:', error);
      alert('Error al subir las canciones');
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!window.confirm('¿Eliminar canción?')) return;
    try {
      await songsAPI.deleteSong(songId);
      loadData();
      alert('Canción eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('Error al eliminar la canción');
    }
  };

  // --- Reel Actions ---
  const handleOpenReelModal = (reel?: Reel) => {
    if (reel) {
      setEditingReel(reel);
      setReelFormData({
        title: reel.title,
        description: reel.description,
        videoUrl: reel.videoUrl
      });
    } else {
      setEditingReel(null);
      setReelFormData({
        title: '',
        description: '',
        videoUrl: ''
      });
    }
    setIsReelModalOpen(true);
  };

  const handleSaveReel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!reelFormData.title.trim()) {
        alert('El título es obligatorio');
        return;
      }
      if (!reelFormData.description.trim()) {
        alert('La descripción es obligatoria');
        return;
      }
      if (!reelFormData.videoUrl.trim()) {
        alert('La URL del video es obligatoria');
        return;
      }

      if (editingReel) {
        await reelsAPI.updateReel(editingReel._id, reelFormData);
      } else {
        await reelsAPI.createReel(reelFormData);
      }
      setIsReelModalOpen(false);
      loadData();
    } catch (error: any) {
      console.error('Error saving reel:', error);
      if (error.response?.status === 400) {
        alert(`Error de validación: ${error.response.data.error || 'Datos inválidos'}`);
      } else {
        alert('Error al guardar el reel');
      }
    }
  };

  const handleDeleteReel = async (reelId: string) => {
    if (!window.confirm('¿Eliminar reel?')) return;
    try {
      await reelsAPI.deleteReel(reelId);
      loadData();
      alert('Reel eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting reel:', error);
      alert('Error al eliminar el reel');
    }
  };

  // Chart Data Preparation - Must be called before any conditional returns
  const userGrowthData = React.useMemo(() => {
    if (!stats?.userGrowth) {
      return {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
          label: 'Nuevos Usuarios',
          data: [0, 0, 0, 0, 0, 0],
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          tension: 0.4,
          fill: true,
        }],
      };
    }

    return {
      labels: stats.userGrowth.map((item: { month: string; count: number }) => item.month),
      datasets: [
        {
          label: 'Nuevos Usuarios',
          data: stats.userGrowth.map((item: { month: string; count: number }) => item.count),
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [stats?.userGrowth]);

  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Acceso Denegado</div>;
  }

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
      <MobileHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MenuButton onClick={() => setIsMobileMenuOpen(true)}>☰</MenuButton>
          <Logo style={{ marginBottom: 0, fontSize: '20px' }}>🌿 Agora</Logo>
        </div>

      </MobileHeader>

      <Overlay isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />

      <Sidebar isOpen={isMobileMenuOpen}>
        <Logo onClick={() => navigate('/dashboard')}>
          🌿 Agora
        </Logo>
        <NavItem active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}>
          📊 Dashboard
        </NavItem>
        <NavItem active={activeTab === 'users'} onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }}>
          👥 Usuarios
        </NavItem>
        <NavItem active={activeTab === 'tips'} onClick={() => { setActiveTab('tips'); setIsMobileMenuOpen(false); }}>
          💡 Consejos
        </NavItem>
        <NavItem active={activeTab === 'exercises'} onClick={() => { setActiveTab('exercises'); setIsMobileMenuOpen(false); }}>
          🧘 Ejercicios
        </NavItem>
        <NavItem active={activeTab === 'avatars'} onClick={() => { setActiveTab('avatars'); setIsMobileMenuOpen(false); }}>
          👤 Avatares
        </NavItem>
        <NavItem active={activeTab === 'categories'} onClick={() => { setActiveTab('categories'); setIsMobileMenuOpen(false); }}>
          📂 Categorías
        </NavItem>
        <NavItem active={activeTab === 'songs'} onClick={() => { setActiveTab('songs'); setIsMobileMenuOpen(false); }}>
          🎵 Música
        </NavItem>
        <NavItem active={activeTab === 'reels'} onClick={() => { setActiveTab('reels'); setIsMobileMenuOpen(false); }}>
          🎥 Reels
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
            {activeTab === 'songs' && 'Biblioteca de Música'}
            {activeTab === 'reels' && 'Biblioteca de Reels'}
          </PageTitle >
          <UserProfile>
            <span>{user.firstName} {user.lastName}</span>
            <Avatar>{user.firstName[0]}</Avatar>
          </UserProfile>
        </Header >

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

        {
          activeTab === 'users' && (
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
          )
        }

        {
          activeTab === 'tips' && (
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
          )
        }

        {
          activeTab === 'exercises' && (
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
          )
        }

        {
          activeTab === 'avatars' && (
            <>
              <TipsHeader>
                <div style={{ color: '#64748b' }}>Gestiona las imágenes de perfil disponibles para los usuarios</div>
                <AddButton onClick={() => {
                  loadCategories(); // Asegurar que las categorías estén cargadas
                  setIsUploadModalOpen(true);
                }}>
                  + Subir Avatares
                </AddButton>
              </TipsHeader>

              {(() => {
                console.log('🎨 Renderizando categorías de avatares');
                console.log('📂 Estado avatars:', avatars);
                console.log('📂 Estado avatarCategories:', avatarCategories);

                const activeCategories = avatarCategories.filter(category => category.isActive);
                console.log('✅ Categorías activas:', activeCategories.map(c => `${c.icon} ${c.label} (${c.name})`));

                return activeCategories
                  .sort((catA, catB) => {
                    // Ordenar por orden definido, luego alfabéticamente
                    if (catA.order !== undefined && catB.order !== undefined) {
                      return catA.order - catB.order;
                    }
                    if (catA.order !== undefined) return -1;
                    if (catB.order !== undefined) return 1;
                    return catA.name.localeCompare(catB.name);
                  })
                  .map((category) => {
                    const categoryAvatars = avatars?.[category.name] || [];
                    console.log(`🎭 Renderizando categoría: ${category.icon} ${category.label} (${category.name})`);
                    console.log(`  📸 Avatares en esta categoría: ${categoryAvatars.length}`);

                    return (
                      <div key={category.name} style={{ marginBottom: '40px' }}>
                        <h3 style={{
                          color: '#1e293b',
                          fontSize: '20px',
                          fontWeight: '600',
                          marginBottom: '20px',
                          textTransform: 'capitalize'
                        }}>
                          {category.icon} {category.label}
                        </h3>

                        {categoryAvatars.length > 0 ? (
                          <div style={{
                            display: 'flex',
                            gap: '16px',
                            overflowX: 'auto',
                            paddingBottom: '10px',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#cbd5e1 transparent'
                          }}>
                            {categoryAvatars.map((avatar: any) => (
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
                        ) : (
                          <div style={{
                            padding: '40px',
                            textAlign: 'center',
                            background: '#f8fafc',
                            borderRadius: '12px',
                            border: '2px dashed #cbd5e1'
                          }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>
                              {category.icon}
                            </div>
                            <p style={{ color: '#64748b', margin: '0' }}>
                              No hay avatares en esta categoría aún
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '8px 0 0 0' }}>
                              Sube algunos avatares para comenzar
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  });
              })()}

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
                          name="category"
                          value={selectedCategory || avatarCategories.filter(category => category.isActive)[0]?.name || ''}
                          onChange={e => setSelectedCategory(e.target.value)}
                          disabled={isUploading}
                        >
                          {avatarCategories.filter(category => category.isActive).map(category => (
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
          )
        }

        {
          activeTab === 'categories' && (
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
          )
        }

        {
          activeTab === 'songs' && (
            <>
              <TipsHeader>
                <div style={{ color: '#64748b' }}>Gestiona las canciones para la música de fondo</div>
                <AddButton onClick={() => setIsSongModalOpen(true)}>
                  + Subir Canción
                </AddButton>
              </TipsHeader>
              <TipsGrid>
                {songs.map(song => (
                  <TipCard key={song._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <Badge bg="#e0f2fe" color="#0284c7">#{song.order}</Badge>
                      <span>🎵</span>
                    </div>
                    <TipTitle>{song.title}</TipTitle>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>
                        {(song.fileSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                      {song.duration > 0 && (
                        <span style={{ color: '#64748b', fontSize: '14px' }}>
                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>
                    <TipFooter>
                      <ActionButton onClick={() => window.open(song.url, '_blank')}>
                        Reproducir
                      </ActionButton>
                      <ActionButton variant="danger" onClick={() => handleDeleteSong(song._id)}>
                        Eliminar
                      </ActionButton>
                    </TipFooter>
                  </TipCard>
                ))}
              </TipsGrid>
            </>
          )
        }

        {
          activeTab === 'reels' && (
            <>
              <TipsHeader>
                <div style={{ color: '#64748b' }}>Gestiona los reels para el contenido de video</div>
                <AddButton onClick={() => handleOpenReelModal()}>
                  + Nuevo Reel
                </AddButton>
              </TipsHeader>
              <TipsGrid>
                {reels.map(reel => (
                  <TipCard key={reel._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <Badge bg="#e0f2fe" color="#0284c7">Reel</Badge>
                      <span>🎥</span>
                    </div>
                    <TipTitle>{reel.title}</TipTitle>
                    <TipContent>{reel.description}</TipContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>
                        Por {reel.createdBy.firstName} {reel.createdBy.lastName}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>
                        {new Date(reel.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <TipFooter>
                      <ActionButton onClick={() => window.open(reel.videoUrl, '_blank')}>
                        Ver Video
                      </ActionButton>
                      <ActionButton onClick={() => handleOpenReelModal(reel)}>
                        Editar
                      </ActionButton>
                      <ActionButton variant="danger" onClick={() => handleDeleteReel(reel._id)}>
                        Eliminar
                      </ActionButton>
                    </TipFooter>
                  </TipCard>
                ))}
              </TipsGrid>
            </>
          )
        }

      </MainContent >
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
                    placeholder="Ej: Técnicas para reducir el estrés diario"
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
                  <Label>Contenido del Consejo</Label>
                  <TextArea
                    required
                    placeholder="Escribe aquí el contenido completo del consejo. Incluye toda la información necesaria para que sea útil y comprensible para los usuarios."
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                  />
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Proporciona información clara, práctica y útil. El contenido debe ser comprensible para todos los usuarios.
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label>Video URL (YouTube ID o URL completa)</Label>
                  <Input
                    placeholder="Ej: dQw4w9WgXcQ o https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    value={formData.videoUrl}
                    onChange={e => {
                      const value = e.target.value;
                      // Extraer ID del video si es una URL completa de YouTube
                      let videoId = value;
                      if (value.includes('youtube.com/watch?v=') || value.includes('youtu.be/')) {
                        try {
                          const url = new URL(value.includes('youtu.be/') ? value.replace('youtu.be/', 'youtube.com/watch?v=') : value);
                          videoId = url.searchParams.get('v') || value.split('/').pop() || value;
                        } catch (error) {
                          console.warn('Error procesando URL de YouTube, usando valor original:', error);
                        }
                      }
                      setFormData({ ...formData, videoUrl: videoId });
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Puedes pegar la URL completa de YouTube o solo el ID del video
                  </div>
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
                    max="120"
                    value={exerciseFormData.duration || ''}
                    onChange={e => {
                      const value = e.target.value;
                      const numValue = value === '' ? '' : parseInt(value);
                      if (numValue === '' || (!isNaN(numValue) && numValue >= 1 && numValue <= 120)) {
                        setExerciseFormData({ ...exerciseFormData, duration: numValue === '' ? 5 : numValue });
                      }
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Instrucciones (una por línea)</Label>
                  <TextArea
                    required
                    placeholder="Siéntate cómodamente en una silla con los pies apoyados en el suelo&#10;&#10;Cierra los ojos y respira profundamente por la nariz&#10;&#10;Exhala lentamente por la boca&#10;&#10;Repite este proceso durante 5 minutos"
                    value={exerciseFormData.instructions}
                    onChange={e => setExerciseFormData({ ...exerciseFormData, instructions: e.target.value })}
                  />
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Cada línea representa un paso del ejercicio. Las líneas vacías separan los pasos.
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label>Video URL (YouTube ID o URL completa)</Label>
                  <Input
                    placeholder="Ej: dQw4w9WgXcQ o https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    value={exerciseFormData.videoUrl}
                    onChange={e => {
                      const value = e.target.value;
                      // Extraer ID del video si es una URL completa de YouTube
                      let videoId = value;
                      if (value.includes('youtube.com/watch?v=') || value.includes('youtu.be/')) {
                        const url = new URL(value.includes('youtu.be/') ? value.replace('youtu.be/', 'youtube.com/watch?v=') : value);
                        videoId = url.searchParams.get('v') || value.split('/').pop() || value;
                      }
                      setExerciseFormData({ ...exerciseFormData, videoUrl: videoId });
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Puedes pegar la URL completa de YouTube o solo el ID del video
                  </div>
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

      {isSongModalOpen && (
        <ModalOverlay onClick={() => setIsSongModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 20, color: '#1e293b' }}>
              Subir Canciones
            </h2>

            <form onSubmit={handleSongUpload}>
              <FormGroup>
                <Label>Archivos de Audio (MP3/MP4)</Label>
                <input
                  type="file"
                  accept="audio/*,video/mp4"
                  multiple
                  required
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    setSongFormData({
                      ...songFormData,
                      files,
                      titles: files.map(file => file.name.replace(/\.[^/.]+$/, "")) // Default titles from filenames
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Selecciona múltiples archivos. Máximo 50MB por archivo. Formatos: MP3, MP4, WAV, etc.
                </div>
              </FormGroup>

              {songFormData.files.length > 0 && (
                <FormGroup>
                  <Label>Títulos (opcional - se usará el nombre del archivo si está vacío)</Label>
                  {songFormData.files.map((file, index) => (
                    <div key={index} style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                        {file.name}
                      </div>
                      <Input
                        placeholder={`Título para ${file.name.replace(/\.[^/.]+$/, "")}`}
                        value={songFormData.titles[index] || ''}
                        onChange={e => {
                          const newTitles = [...songFormData.titles];
                          newTitles[index] = e.target.value;
                          setSongFormData({ ...songFormData, titles: newTitles });
                        }}
                      />
                    </div>
                  ))}
                </FormGroup>
              )}

              <ModalActions>
                <ActionButton type="button" variant="danger" onClick={() => setIsSongModalOpen(false)}>
                  Cancelar
                </ActionButton>
                <ActionButton type="submit" variant="success">
                  Subir {songFormData.files.length} Canción(es)
                </ActionButton>
              </ModalActions>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {isReelModalOpen && (
        <ModalOverlay onClick={() => setIsReelModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 20, color: '#1e293b' }}>
              {editingReel ? 'Editar Reel' : 'Nuevo Reel'}
            </h2>

            <form onSubmit={handleSaveReel}>
              <FormGroup>
                <Label>Título</Label>
                <Input
                  required
                  placeholder="Título del reel"
                  value={reelFormData.title}
                  onChange={e => setReelFormData({ ...reelFormData, title: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>Descripción</Label>
                <TextArea
                  required
                  placeholder="Descripción del contenido del reel"
                  value={reelFormData.description}
                  onChange={e => setReelFormData({ ...reelFormData, description: e.target.value })}
                  rows={4}
                />
              </FormGroup>

              <FormGroup>
                <Label>URL del Video</Label>
                <Input
                  required
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={reelFormData.videoUrl}
                  onChange={e => setReelFormData({ ...reelFormData, videoUrl: e.target.value })}
                />
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  URL directa al archivo de video (MP4, WebM, etc.)
                </div>
              </FormGroup>

              <ModalActions>
                <ActionButton type="button" variant="danger" onClick={() => setIsReelModalOpen(false)}>
                  Cancelar
                </ActionButton>
                <ActionButton type="submit" variant="success">
                  {editingReel ? 'Actualizar' : 'Crear'} Reel
                </ActionButton>
              </ModalActions>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout >
  );
};

export default AdminPanel;