import { create, StateCreator } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, TOKEN_KEY } from '../services/api';
import { useJobStore } from './jobStore';
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
      console.log('AuthStore: Starting login process');
      set({ isLoading: true, error: null });

      // 1) Sign in and persist token
      const response = await authApi.signin(email, password);
      console.log('AuthStore: Login API response:', response);

      if (response.token) {
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
        console.log('AuthStore: Token stored successfully');
      }

      // 2) Fetch fresh profile before marking authenticated so the
      //    home screen has data and the login button keeps showing loader
      let resolvedUser = response.user as AuthUser | null;
      try {
        const profile = await authApi.getProfile();
        if (profile?.user) {
          resolvedUser = profile.user as AuthUser;
        }
      } catch (profileError) {
        console.log('AuthStore: Failed to prefetch profile, using login payload user if available.', profileError);
      }

      // 3) Prefetch initial jobs for dashboard to avoid skeleton after login
      try {
        const fetchJobs = useJobStore.getState().fetchJobs;
        await fetchJobs({ page: 1, pageSize: 5 });
      } catch (prefetchError) {
        console.log('AuthStore: Prefetch jobs failed, continuing.', prefetchError);
      }

      set({
        user: resolvedUser ?? null,
        isAuthenticated: true,
        isLoading: false,
      });
      console.log('AuthStore: Login successful, user authenticated (profile prefetched)');
    } catch (error) {
      console.log('AuthStore: Login error:', error);
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signup: async (email: string, password: string, phone: string) => {
    try {
      console.log('AuthStore: Starting signup process for:', email);
      set({ isLoading: true, error: null });
      const token = get().preSignupToken;

      if (!token) {
        throw new Error('Please verify your email first');
      }

      console.log('AuthStore: Calling signup API with token');
      await authApi.signup(email, password, phone, token);

      console.log('AuthStore: Signup successful, auto-logging in');
      // Auto login after signup
      await get().login(email, password);

      set({ preSignupToken: null });
      console.log('AuthStore: Signup process completed successfully');
    } catch (error) {
      console.log('AuthStore: Signup error:', error);
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
    } catch {
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
