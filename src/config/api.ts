// API Configuration
// Update this to match your backend URL
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:4000/api'  // For development
  : 'https://alcrm-backend.vercel.app/api/';  // For production

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    SIGNOUT: '/auth/signout',
    PROFILE: '/auth/profile',
    VALIDATE_TOKEN: '/auth/validate-token',
    PASSWORD_RESET_REQUEST: '/auth/password/otp/request',
    PASSWORD_RESET_VERIFY: '/auth/password/otp/verify',
    PASSWORD_RESET: '/auth/password/reset',
    OTP_REQUEST: '/auth/otp/request',
    OTP_VERIFY: '/auth/otp/verify',
  },
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    JOBS: '/user/jobs',
    JOB_DETAIL: (id: string) => `/user/jobs/${id}`,
    APPLY_JOB: (id: string) => `/user/jobs/${id}/apply`,
    APPLICATIONS: '/user/applications',
    RESOURCES: '/user/resources',
    RESOURCE_DETAIL: (id: string) => `/user/resources/${id}`,
    MENTORS: '/user/mentors',
    MENTOR_DETAIL: (id: string) => `/user/mentors/${id}`,
    BOOK_SESSION: '/user/mentorship-sessions',
    MY_SESSIONS: '/user/mentorship-sessions',
    RATE_SESSION: (id: string) => `/user/mentorship-sessions/${id}/rate`,
    CANCEL_SESSION: (id: string) => `/user/mentorship-sessions/${id}/cancel`,
    UPLOAD_RESUME: '/user/uploads/resume',
    DELETE_RESUME: '/user/uploads/resume',
    UPLOAD_PHOTO: '/user/uploads/photo',
    DELETE_PHOTO: '/user/uploads/photo',
  },
};

