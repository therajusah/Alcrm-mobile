// Type definitions

export interface AuthUser {
  id: string;
  email: string;
  role: string;
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
}

export interface AuthResponse {
  user: AuthUser;
  token?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
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
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: 'FULL-TIME' | 'PART-TIME' | 'CONTRACT' | 'INTERNSHIP';
  status: 'OPEN' | 'CLOSED' | 'ARCHIVED';
  salary: string;
  postedDate: string;
  company_id?: string;
  company_name?: string;
  applicationStatus?: ApplicationStatus;
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

export interface Application {
  application_id: string;
  job_id: string;
  status: string;
  application_date: string;
  cover_letter?: string;
  resume_url_at_application?: string;
  job_title?: string;
  job_location?: string;
  job_salary?: string;
}

export interface FreeResource {
  resource_id: string;
  title: string;
  description: string | null;
  resource_type: string | null;
  created_at: string;
  resource_url?: string | null;
  resource_link?: string | null;
}

export interface CareerMentor {
  mentor_id: string;
  user_id: string;
  domain: string;
  experience_years: number;
  bio: string;
  created_at?: string;
  user?: {
    first_name?: string;
    last_name?: string;
    photo_url?: string | null;
  };
}

export interface MentorshipSession {
  session_id: string;
  mentor_id: string;
  user_id: string;
  session_type: string;
  status: string;
  scheduled_at: string;
  created_at: string;
  completed_at?: string | null;
  session_duration_minutes?: number | null;
  session_rating?: number | null;
  session_feedback?: string | null;
  notes?: string | null;
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

