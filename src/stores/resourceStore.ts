import { create } from 'zustand';
import { userApi } from '../services/api';
import type { FreeResource, GenericList } from '../types';

interface ResourceState {
  resources: FreeResource[];
  selectedResource: FreeResource | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
  
  // Actions
  fetchResources: (params?: {
    search?: string;
    type?: string;
    page?: number;
    pageSize?: number;
  }) => Promise<void>;
  fetchResourceDetail: (id: string) => Promise<void>;
  clearSelectedResource: () => void;
  clearError: () => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
  resources: [],
  selectedResource: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
  },

  fetchResources: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response: GenericList<FreeResource> = await userApi.getResources(params);
      set({
        resources: response.items,
        pagination: {
          total: response.total,
          page: response.page,
          pageSize: response.pageSize,
        },
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch resources';
      set({ error: message, isLoading: false });
    }
  },

  fetchResourceDetail: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const resource = await userApi.getResourceDetail(id);
      set({ selectedResource: resource, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch resource details';
      set({ error: message, isLoading: false });
    }
  },

  clearSelectedResource: () => {
    set({ selectedResource: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));


