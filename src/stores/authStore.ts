import { create, StateCreator } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, TOKEN_KEY } from '../services/api';
import type { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  preSignupToken: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserProfile: (updates: Partial<AuthUser>) => void;
  setPreSignupToken: (token: string | null) => void;
  clearError: () => void;
}

const createAuthState: StateCreator<AuthState> = (set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  preSignupToken: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authApi.signin(email, password);
      
      if (response.token) {
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
      }
      
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signup: async (email: string, password: string, phone: string) => {
    try {
      set({ isLoading: true, error: null });
      const token = get().preSignupToken;
      
      if (!token) {
        throw new Error('Please verify your email first');
      }
      
      await authApi.signup(email, password, phone, token);
      
      // Auto login after signup
      await get().login(email, password);
      
      set({ preSignupToken: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authApi.signout();
      await AsyncStorage.removeItem(TOKEN_KEY);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      
      const response = await authApi.getProfile();
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateUserProfile: (updates: Partial<AuthUser>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...updates } });
    }
  },

  setPreSignupToken: (token: string | null) => {
    set({ preSignupToken: token });
  },

  clearError: () => {
    set({ error: null });
  },
});

export const useAuthStore = create<AuthState>(createAuthState);


