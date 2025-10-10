import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import type {
  AuthResponse,
  UserProfile,
  Job,
  Application,
  FreeResource,
  CareerMentor,
  MentorshipSession,
  GenericList,
} from '../types';

const TOKEN_KEY = 'auth_token';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log API configuration for debugging
console.log('API Configuration:', {
  baseURL: API_BASE_URL,
  platform: 'react-native',
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async config => {
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
    });

    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.log('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async (error: AxiosError) => {
    console.log('API Response Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      fullURL: error.config
        ? `${error.config.baseURL}${error.config.url}`
        : 'unknown',
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
    const message =
      (error.response?.data as { error?: string })?.error ||
      error.message ||
      'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth API
export const authApi = {
  requestOtp: async (email: string) => {
    console.log('API: Requesting OTP for email:', email);
    const response = await api.post('/auth/otp/request', { email });
    console.log('API: OTP request response:', response.data);
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    console.log('API: Verifying OTP for email:', email, 'OTP:', otp);
    const response = await api.post('/auth/otp/verify', { email, otp });
    console.log('API: OTP verification response:', response.data);
    return response.data;
  },

  signup: async (
    email: string,
    password: string,
    phone: string,
    preSignupToken: string
  ): Promise<AuthResponse> => {
    console.log('API: Making signup request for email:', email);
    const response = await api.post('/auth/signup', {
      email,
      password,
      phone,
      preSignupToken,
    });
    console.log('API: Signup response:', response.data);
    return response.data;
  },

  signin: async (email: string, password: string): Promise<AuthResponse> => {
    console.log(
      'API: Making signin request to:',
      `${API_BASE_URL}/auth/signin`
    );
    console.log('API: Request payload:', { email, password: '***' });
    const response = await api.post('/auth/signin', { email, password });
    console.log('API: Signin response:', response.data);
    if (response.data.token) {
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
    }
    return response.data;
  },

  signout: async () => {
    await api.post('/auth/signout');
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  getProfile: async (): Promise<AuthResponse> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  validateToken: async (token: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/validate-token', { token });
    if (response.data.token) {
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
    }
    return response.data;
  },

  requestPasswordReset: async (email: string) => {
    const response = await api.post('/auth/password/otp/request', { email });
    return response.data;
  },

  verifyPasswordResetOtp: async (email: string, otp: string) => {
    const response = await api.post('/auth/password/otp/verify', {
      email,
      otp,
    });
    return response.data;
  },

  resetPassword: async (
    email: string,
    newPassword: string,
    resetToken: string
  ) => {
    const response = await api.post('/auth/password/reset', {
      email,
      newPassword,
      resetToken,
    });
    return response.data;
  },
};

// User API
export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch('/user/profile', data);
    return response.data;
  },

  getJobs: async (params?: {
    search?: string;
    status?: string;
    type?: string;
    page?: number;
    pageSize?: number;
  }): Promise<GenericList<Job>> => {
    const response = await api.get('/user/jobs', { params });
    return response.data;
  },

  getJobDetail: async (id: string): Promise<Job> => {
    const response = await api.get(`/user/jobs/${id}`);
    return response.data;
  },

  applyJob: async (
    id: string,
    data: { cover_letter?: string; resume_url?: string }
  ) => {
    const response = await api.post(`/user/jobs/${id}/apply`, data);
    return response.data;
  },

  getApplications: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<GenericList<Application>> => {
    const response = await api.get('/user/applications', { params });
    return response.data;
  },

  getResources: async (params?: {
    search?: string;
    type?: string;
    page?: number;
    pageSize?: number;
  }): Promise<GenericList<FreeResource>> => {
    const response = await api.get('/user/resources', { params });
    return response.data;
  },

  getResourceDetail: async (id: string): Promise<FreeResource> => {
    const response = await api.get(`/user/resources/${id}`);
    return response.data;
  },

  getMentors: async (params?: {
    search?: string;
    domain?: string;
    page?: number;
    pageSize?: number;
  }): Promise<GenericList<CareerMentor>> => {
    const response = await api.get('/user/mentors', { params });
    return response.data;
  },

  getMentorDetail: async (id: string): Promise<CareerMentor> => {
    const response = await api.get(`/user/mentors/${id}`);
    return response.data;
  },

  bookSession: async (data: {
    mentor_id: string;
    user_id: string;
    session_type: string;
    scheduled_at: string;
    notes?: string;
  }): Promise<MentorshipSession> => {
    const response = await api.post('/user/mentorship-sessions', data);
    return response.data;
  },

  getMySessions: async (params?: {
    status?: string;
    page?: number;
    pageSize?: number;
    session_type?: string;
  }): Promise<GenericList<MentorshipSession>> => {
    const response = await api.get('/user/mentorship-sessions', { params });
    return response.data;
  },

  rateSession: async (
    id: string,
    rating: number,
    feedback?: string
  ): Promise<MentorshipSession> => {
    const response = await api.patch(`/user/mentorship-sessions/${id}/rate`, {
      rating,
      feedback,
    });
    return response.data;
  },

  cancelSession: async (id: string): Promise<MentorshipSession> => {
    const response = await api.patch(`/user/mentorship-sessions/${id}/cancel`);
    return response.data;
  },

  uploadResume: async (fileData: string, fileName: string) => {
    const response = await api.post('/user/uploads/resume', {
      fileData,
      fileName,
    });
    return response.data;
  },

  deleteResume: async () => {
    const response = await api.delete('/user/uploads/resume');
    return response.data;
  },

  uploadPhoto: async (fileData: string, fileName: string) => {
    const response = await api.post('/user/uploads/photo', {
      fileData,
      fileName,
    });
    return response.data;
  },

  deletePhoto: async () => {
    const response = await api.delete('/user/uploads/photo');
    return response.data;
  },

  // Onboarding management
  getOnboardingState: async () => {
    const response = await api.get('/user/onboarding/state');
    return response.data;
  },

  setOnboardingStep: async (step: number) => {
    const response = await api.post('/user/onboarding/step', { step });
    return response.data;
  },

  completeOnboarding: async () => {
    const response = await api.post('/user/onboarding/complete');
    return response.data;
  },

  // Mentorship session detail
  getSessionDetail: async (id: string) => {
    const response = await api.get(`/user/mentorship-sessions/${id}`);
    return response.data;
  },
};

export { api, TOKEN_KEY };
