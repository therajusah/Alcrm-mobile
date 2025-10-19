import { create } from 'zustand';
import { userApi } from '../services/api';
import type { CareerMentor, MentorshipSession, GenericList } from '../types';

interface MentorshipState {
  mentors: CareerMentor[];
  sessions: MentorshipSession[];
  selectedMentor: CareerMentor | null;
  selectedSession: MentorshipSession | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    mentors: {
      page: number;
      pageSize: number;
      total: number;
      hasMore: boolean;
    };
    sessions: {
      page: number;
      pageSize: number;
      total: number;
      hasMore: boolean;
    };
  };
}

interface MentorshipActions {
  fetchMentors: (params?: {
    search?: string;
    domain?: string;
    page?: number;
    pageSize?: number;
  }) => Promise<void>;
  fetchMentorDetail: (id: string) => Promise<void>;
  fetchSessions: (params?: {
    status?: string;
    page?: number;
    pageSize?: number;
    session_type?: string;
  }) => Promise<void>;
  bookSession: (data: {
    mentor_id: string;
    user_id: string;
    session_type: string;
    scheduled_at: string;
    notes?: string;
  }) => Promise<void>;
  rateSession: (id: string, rating: number, feedback?: string) => Promise<void>;
  cancelSession: (id: string) => Promise<void>;
  setSelectedMentor: (mentor: CareerMentor | null) => void;
  setSelectedSession: (session: MentorshipSession | null) => void;
  clearError: () => void;
}

type MentorshipStore = MentorshipState & MentorshipActions;

export const useMentorshipStore = create<MentorshipStore>((set, get) => ({
  // Initial state
  mentors: [],
  sessions: [],
  selectedMentor: null,
  selectedSession: null,
  isLoading: false,
  error: null,
  pagination: {
    mentors: {
      page: 1,
      pageSize: 20,
      total: 0,
      hasMore: false,
    },
    sessions: {
      page: 1,
      pageSize: 20,
      total: 0,
      hasMore: false,
    },
  },

  // Actions
  fetchMentors: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { page = 1, pageSize = 20, ...otherParams } = params;
      const response: GenericList<CareerMentor> = await userApi.getMentors({
        page,
        pageSize,
        ...otherParams,
      });

      const currentMentors = get().mentors;
      const newMentors =
        page === 1 ? response.items : [...currentMentors, ...response.items];

      set({
        mentors: newMentors,
        isLoading: false,
        pagination: {
          ...get().pagination,
          mentors: {
            page,
            pageSize,
            total: response.total,
            hasMore: response.items.length === pageSize,
          },
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch mentors';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchMentorDetail: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const mentor = await userApi.getMentorDetail(id);
      set({ selectedMentor: mentor, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch mentor details';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchSessions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { page = 1, pageSize = 20, ...otherParams } = params;
      const response: GenericList<MentorshipSession> =
        await userApi.getMySessions({
          page,
          pageSize,
          ...otherParams,
        });

      const currentSessions = get().sessions;
      const newSessions =
        page === 1 ? response.items : [...currentSessions, ...response.items];

      set({
        sessions: newSessions,
        isLoading: false,
        pagination: {
          ...get().pagination,
          sessions: {
            page,
            pageSize,
            total: response.total,
            hasMore: response.items.length === pageSize,
          },
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch sessions';
      set({ error: errorMessage, isLoading: false });
    }
  },

  bookSession: async data => {
    set({ isLoading: true, error: null });
    try {
      await userApi.bookSession(data);
      // Refresh sessions after booking
      await get().fetchSessions();
      set({ isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to book session';
      set({ error: errorMessage, isLoading: false });
    }
  },

  rateSession: async (id: string, rating: number, feedback?: string) => {
    set({ isLoading: true, error: null });
    try {
      await userApi.rateSession(id, rating, feedback);
      // Refresh sessions after rating
      await get().fetchSessions();
      set({ isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to rate session';
      set({ error: errorMessage, isLoading: false });
    }
  },

  cancelSession: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await userApi.cancelSession(id);
      // Refresh sessions after cancellation
      await get().fetchSessions();
      set({ isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to cancel session';
      set({ error: errorMessage, isLoading: false });
    }
  },

  setSelectedMentor: mentor => set({ selectedMentor: mentor }),
  setSelectedSession: session => set({ selectedSession: session }),
  clearError: () => set({ error: null }),
}));
