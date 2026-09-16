/**
 * Centralized API Configuration for YUWA Field App
 * Configured to easily switch from local mock service to Member 3's backend REST APIs.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Member 3 - Backend API endpoints
  SCHOOLS: `${API_BASE_URL}/schools`,
  SCHOOL_BY_ID: (id) => `${API_BASE_URL}/schools/${id}`,
  PROGRAMS: `${API_BASE_URL}/programs`,
  PARTICIPANTS: `${API_BASE_URL}/participants`,
  ACTIVITIES: `${API_BASE_URL}/activities`,
  PHOTOS_UPLOAD: `${API_BASE_URL}/photos/upload`,
  
  // Member 4 - Offline & Sync endpoints
  SYNC_STATUS: `${API_BASE_URL}/sync/status`,
  SYNC_TRIGGER: `${API_BASE_URL}/sync/trigger`,
  SYNC_RETRY: `${API_BASE_URL}/sync/retry`
};
