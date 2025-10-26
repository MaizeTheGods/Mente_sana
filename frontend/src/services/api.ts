import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
  questionnaireResults?: string[];
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
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
    const response = await api.post('/questionnaire/submit', data);
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

export default api;