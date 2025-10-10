import { create } from 'zustand';
import { userApi } from '../services/api';
import type { Application, GenericList } from '../types';

interface ApplicationState {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
  
  // Actions
  fetchApplications: (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }) => Promise<void>;
  clearError: () => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
  },

  fetchApplications: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response: GenericList<Application> = await userApi.getApplications(params);
      set({
        applications: response.items,
        pagination: {
          total: response.total,
          page: response.page,
          pageSize: response.pageSize,
        },
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch applications';
      set({ error: message, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

