import { create } from 'zustand';
import { userApi } from '../services/api';
import type { Job, GenericList } from '../types';

interface JobState {
  jobs: Job[];
  selectedJob: Job | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
  
  // Actions
  fetchJobs: (params?: {
    search?: string;
    status?: string;
    type?: string;
    page?: number;
    pageSize?: number;
  }) => Promise<void>;
  fetchJobDetail: (id: string) => Promise<void>;
  applyForJob: (id: string, coverLetter?: string) => Promise<void>;
  clearSelectedJob: () => void;
  clearError: () => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  selectedJob: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
  },

  fetchJobs: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response: GenericList<Job> = await userApi.getJobs(params);
      set({
        jobs: response.items,
        pagination: {
          total: response.total,
          page: response.page,
          pageSize: response.pageSize,
        },
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch jobs';
      set({ error: message, isLoading: false });
    }
  },

  fetchJobDetail: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const job = await userApi.getJobDetail(id);
      set({ selectedJob: job, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch job details';
      set({ error: message, isLoading: false });
    }
  },

  applyForJob: async (id: string, coverLetter?: string) => {
    try {
      set({ isLoading: true, error: null });
      await userApi.applyJob(id, { cover_letter: coverLetter });
      
      // Refresh job detail to get updated application status
      await get().fetchJobDetail(id);
      
      set({ isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to apply for job';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearSelectedJob: () => {
    set({ selectedJob: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

