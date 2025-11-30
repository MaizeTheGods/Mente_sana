import axios from 'axios';
import io, { Socket } from 'socket.io-client';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'owner';
  questionnaireResults?: string[];
  questionnaireCount?: number;
  questionnaireCompleted?: boolean;
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
    profileImage: string;
  };
  progressTracking: {
    streakDays: number;
    lastActivity: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface QuestionnaireQuestion {
  questionnaireType: string;
  questions: string[];
  instructions: string;
  scale: { [key: number]: string };
}

export interface QuestionnaireSubmission {
  responses: { [key: string]: number };
}

export interface QuestionnaireResult {
  _id: string;
  scores: {
    depression: number;
    anxiety: number;
    stress: number;
    total: number;
  };
  severityLevels: {
    depression: string;
    anxiety: string;
    stress: string;
  };
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    resourceId: string;
    priority: string;
  }>;
  createdAt: string;
}

export interface Exercise {
  _id: string;
  title: string;
  description: string;
  category: string;
  targetDisorders: string[];
  difficulty: string;
  duration: number;
  instructions: Array<{
    step: number;
    text: string;
    duration?: number;
    audioUrl?: string;
  }>;
  benefits: string[];
  prerequisites: string[];
  tags: string[];
  media: {
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tip {
  _id: string;
  title: string;
  content?: string;
  description?: string;
  category: string;
  targetDisorders?: string[];
  priority?: string;
  frequency?: string;
  why?: string;
  tags?: string[];
  media?: {
    imageUrl?: string;
    videoUrl?: string;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface Song {
  _id: string;
  title: string;
  url: string;
  order: number;
  duration: number;
  fileSize: number;
  filename: string;
  uploadedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export interface Reel {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  publicId: string;
  filename: string;
  fileSize: number;
  duration: number;
  isActive: boolean;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: any[];
}

// Auth API
export const authAPI = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
  }): Promise<AuthResponse> => {
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Making register request to:', `${API_BASE_URL}/auth/register`);
    console.log('With data:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('Register response:', response);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (updates: Partial<User>): Promise<{ user: User }> => {
    const response = await api.put('/auth/profile', updates);
    return response.data;
  },
};

// Questionnaire API
export const questionnaireAPI = {
  getQuestions: async (): Promise<QuestionnaireQuestion> => {
    const response = await api.get('/questionnaire/questions');
    return response.data;
  },

  submitQuestionnaire: async (data: QuestionnaireSubmission): Promise<{
    resultId: string;
    scores: QuestionnaireResult['scores'];
    severityLevels: QuestionnaireResult['severityLevels'];
    recommendations: QuestionnaireResult['recommendations'];
    createdAt: string;
  }> => {
    console.log('Submitting questionnaire with data:', JSON.stringify(data, null, 2));
    const response = await api.post('/questionnaire/submit', data);
    console.log('Questionnaire submission response:', response);
    return response.data;
  },

  getResults: async (): Promise<{ results: QuestionnaireResult[]; count: number }> => {
    const response = await api.get('/questionnaire/results');
    return response.data;
  },

  getResult: async (id: string): Promise<{ result: QuestionnaireResult }> => {
    const response = await api.get(`/questionnaire/results/${id}`);
    return response.data;
  },
};

// Exercises API
export const exercisesAPI = {
 getExercises: async (params?: {
   category?: string;
   difficulty?: string;
   limit?: number;
   page?: number;
 }): Promise<{ exercises: Exercise[]; pagination: any }> => {
   const response = await api.get('/exercises', { params });
   return response.data;
 },

 getExercise: async (id: string): Promise<{ exercise: Exercise }> => {
   const response = await api.get(`/exercises/${id}`);
   return response.data;
 },

 getCategories: async (): Promise<{ categories: Category[] }> => {
   const response = await api.get('/exercises/categories');
   return response.data;
 },

 createExercise: async (exerciseData: Partial<Exercise>): Promise<{ exercise: Exercise }> => {
   const response = await api.post('/exercises', exerciseData);
   return response.data;
 },

 updateExercise: async (id: string, exerciseData: Partial<Exercise>): Promise<{ exercise: Exercise }> => {
   const response = await api.put(`/exercises/${id}`, exerciseData);
   return response.data;
 },

 deleteExercise: async (id: string): Promise<void> => {
   await api.delete(`/exercises/${id}`);
 },
};

// Tips API
export const tipsAPI = {
 getTips: async (params?: {
   category?: string;
   priority?: string;
   limit?: number;
   page?: number;
 }): Promise<{ tips: Tip[]; pagination: any }> => {
   const response = await api.get('/tips', { params });
   return response.data;
 },

 getTip: async (id: string): Promise<{ tip: Tip }> => {
   const response = await api.get(`/tips/${id}`);
   return response.data;
 },

 getCategories: async (): Promise<{ categories: Category[] }> => {
   const response = await api.get('/tips/categories');
   return response.data;
 },

 createTip: async (tipData: Partial<Tip>): Promise<{ tip: Tip }> => {
   const response = await api.post('/tips', tipData);
   return response.data;
 },

 updateTip: async (id: string, tipData: Partial<Tip>): Promise<{ tip: Tip }> => {
   const response = await api.put(`/tips/${id}`, tipData);
   return response.data;
 },

 deleteTip: async (id: string): Promise<void> => {
   await api.delete(`/tips/${id}`);
 },
};

// Uploads API
export const uploadsAPI = {
  uploadAvatar: async (file: File, category: string): Promise<{ message: string; avatar: any }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('category', category);

    const response = await api.post('/uploads/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAvatar: async (publicId: string): Promise<void> => {
    await api.delete(`/uploads/avatar/${publicId}`);
  },

  getAvatars: async (): Promise<{ avatarsByCategory: Record<string, Array<{ _id: string; publicId: string; url: string; filename: string; category: string; uploadedBy?: any; createdAt: string }>> }> => {
    const response = await api.get('/uploads/avatars');
    return response.data;
  },
};

// Songs API
export const songsAPI = {
  uploadSongs: async (files: File[], titles?: string[]): Promise<{ message: string; songs: Song[]; errors?: any[] }> => {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append('songs', file);
    });

    if (titles && titles.length > 0) {
      titles.forEach(title => {
        formData.append('titles', title);
      });
    }

    const response = await api.post('/songs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getSongs: async (): Promise<{ songs: Song[] }> => {
    const response = await api.get('/songs');
    return response.data;
  },

  deleteSong: async (id: string): Promise<void> => {
    await api.delete(`/songs/${id}`);
  },

  reorderSongs: async (songOrders: Array<{ _id: string; order: number }>): Promise<{ message: string }> => {
    const response = await api.put('/songs/reorder', { songOrders });
    return response.data;
  },
};

// Reels API
export const reelsAPI = {
  uploadReel: async (file: File, title: string, description: string): Promise<{ message: string; reel: Reel }> => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);

    const response = await api.post('/reels', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getReels: async (params?: {
    limit?: number;
    page?: number;
  }): Promise<{ reels: Reel[]; pagination: any }> => {
    const response = await api.get('/reels', { params });
    return response.data;
  },

  getReel: async (id: string): Promise<{ reel: Reel }> => {
    const response = await api.get(`/reels/${id}`);
    return response.data;
  },

  updateReel: async (id: string, reelData: Partial<Reel>): Promise<{ reel: Reel }> => {
    const response = await api.put(`/reels/${id}`, reelData);
    return response.data;
  },

  deleteReel: async (id: string): Promise<void> => {
    await api.delete(`/reels/${id}`);
  },
};

// Chat API
export const chatAPI = {
 getGroups: async (): Promise<{ groups: ChatGroup[] }> => {
   const response = await api.get('/chat/groups');
   return response.data;
 },

 getGroup: async (id: string): Promise<{ group: ChatGroup }> => {
   const response = await api.get(`/chat/groups/${id}`);
   return response.data;
 },

 joinGroup: async (id: string): Promise<{ message: string }> => {
   const response = await api.post(`/chat/groups/${id}/join`);
   return response.data;
 },

 getMessages: async (groupId: string, params?: {
   limit?: number;
   page?: number;
 }): Promise<{ messages: ChatMessage[]; pagination: any }> => {
   const response = await api.get(`/chat/groups/${groupId}/messages`, { params });
   return response.data;
 },

 sendMessage: async (groupId: string, content: string): Promise<{ message: string; messageData: ChatMessage }> => {
   const response = await api.post(`/chat/groups/${groupId}/messages`, { content });
   return response.data;
 },

 deleteMessage: async (groupId: string, messageId: string): Promise<{ message: string }> => {
   const response = await api.delete(`/chat/groups/${groupId}/messages/${messageId}`);
   return response.data;
 },

 startTyping: async (groupId: string): Promise<{ message: string }> => {
   const response = await api.post(`/chat/groups/${groupId}/typing/start`);
   return response.data;
 },

 stopTyping: async (groupId: string): Promise<{ message: string }> => {
   const response = await api.post(`/chat/groups/${groupId}/typing/stop`);
   return response.data;
 },

 getTypingUsers: async (groupId: string): Promise<{ typingUsers: { firstName: string; lastName: string }[] }> => {
   const response = await api.get(`/chat/groups/${groupId}/typing`);
   return response.data;
 },
};

// Chat Types
export interface ChatGroup {
  _id: string;
  name: string;
  description: string;
  category: 'anxiety' | 'depression' | 'stress' | 'general' | 'recovery' | 'family';
  currentMembers: Array<{
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    role: string;
    joinedAt: string;
    isActive: boolean;
  }>;
  isMember?: boolean;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  groupId: string;
  senderId: {
    _id: string;
    firstName: string;
    lastName: string;
    preferences?: {
      profileImage: string;
    };
  };
  content: string;
  messageType: 'text' | 'image' | 'file';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Socket.io functionality
let socket: Socket | null = null;

export const initializeSocket = (token: string) => {
  if (socket) return socket;

  socket = io(API_BASE_URL.replace('/api', ''), {
    auth: { token }
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default api;