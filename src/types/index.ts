// Type definitions
import {
  NavigationProp as RNavigationProp,
  RouteProp as RRouteProp,
} from '@react-navigation/native';

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Onboarding: undefined;
  Dashboard: undefined;
  Jobs: undefined;
  JobDetail: { jobId: string };
  Applications: undefined;
  Resources: undefined;
  CareerGuidance: undefined;
  CVReview: undefined;
  InterviewPrep: undefined;
  PersonalReferences: undefined;
  Mentorship: undefined;
  MentorDetail: { mentorId: string };
  MySessions: undefined;
  MentorshipSessionDetail: { sessionId: string };
  BookSession: {
    serviceType: string;
    serviceTitle: string;
    price: number;
    duration: number;
  };
  PDFViewer: {
    pdfUrl: string;
    title?: string;
  };
  BrowseMentors: undefined;
  Profile: undefined;
  Settings: undefined;
  ChangePassword: undefined;
};

export type NavigationProp = RNavigationProp<RootStackParamList>;
export type RouteProp<T extends keyof RootStackParamList> = RRouteProp<
  RootStackParamList,
  T
>;

// User roles - simplified for user-only app
export type UserRole = 'USER';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  phone?: string;
  photo_url?: string;
  bio?: string;
  base_location?: string;
  current_location?: string;
  qualification?: string;
  date_of_birth?: string;
  whatsapp_number?: string;
  resume_url?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  onboarding_step?: number;
  onboarding_completed_at?: string;
  google_id?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  base_location?: string;
  current_location?: string;
  qualification?: string;
  date_of_birth?: string;
  whatsapp_number?: string;
  resume_url?: string;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  onboarding_step?: number;
  onboarding_completed_at?: string;
  google_id?: string;
}

// Job types from database
export type JobType = 'FULL-TIME' | 'PART-TIME' | 'CONTRACT' | 'INTERNSHIP';
export type JobStatus = 'OPEN' | 'CLOSED' | 'ARCHIVED';

export interface Job {
  id: string; // Changed from job_id to id
  company_id?: string;
  title: string;
  description: string;
  type: JobType; // Changed from job_type to type
  location?: string;
  status: JobStatus;
  postedDate?: string; // Changed from created_at to postedDate
  updated_at?: string;
  salary?: string; // Changed from salary_range to salary
  // Additional fields for UI
  company_name?: string;
  applicationStatus?: ApplicationStatusInfo;
}

export type ApplicationStatus =
  | 'APPLIED'
  | 'SHARED_WITH_COMPANY'
  | 'SHORTLISTED'
  | 'REJECTED'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'SELECTED'
  | 'WITHDRAWN';

export interface ApplicationStatusInfo {
  hasApplied: boolean;
  status?: ApplicationStatus;
}

export interface Application {
  application_id: string;
  job_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  resume_url_at_application?: string;
  cover_letter?: string;
  application_date: string;
  created_at?: string;
  updated_at?: string;
  // Additional fields for UI
  job_title?: string;
  job_location?: string;
  job_salary?: string;
}

export interface FreeResource {
  resource_id: string;
  title: string;
  description?: string;
  resource_url?: string;
  resource_type: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  resource_link?: string;
}

export interface CareerMentor {
  mentor_id: string;
  user_id?: string;
  domain: string;
  experience_years?: number;
  bio?: string;
  created_at?: string;
  is_deleted?: boolean;
  rating?: number;
  total_sessions?: number;
  hourly_rate?: number;
  user?: {
    first_name?: string;
    last_name?: string;
    photo_url?: string;
  };
}

export interface MentorshipSession {
  session_id: string;
  mentor_id: string;
  user_id: string;
  session_type: string;
  status: string;
  scheduled_at?: string;
  completed_at?: string;
  notes?: string;
  created_at?: string;
  is_deleted?: boolean;
  session_duration_minutes?: number;
  session_rating?: number;
  session_feedback?: string;
  mentor_notes?: string;
  updated_at?: string;
}

// New interfaces based on database schema - user-focused only
export interface Company {
  company_id: string;
  name: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmailOTP {
  id: string;
  email: string;
  otp_hash: string;
  expires_at: string;
  consumed_at?: string;
  attempt_count: number;
  created_at: string;
  last_sent_at?: string;
  locked_until?: string;
}

export interface JobNotification {
  notification_id: string;
  job_id: string;
  user_id: string;
  is_read?: boolean;
  created_at?: string;
  is_deleted?: boolean;
}

export interface OnboardingState {
  current_step: number;
  completed_steps: number[];
  is_completed: boolean;
  completed_at?: string;
}

export interface OnboardingStepResponse {
  success: boolean;
  current_step: number;
  message?: string;
}

export interface GenericList<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  error: string;
  message?: string;
}
