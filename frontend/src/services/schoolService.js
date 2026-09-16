import { API_ENDPOINTS } from './apiConfig';
import { initialSchools } from '../data/mockData';

export const schoolService = {
  /**
   * Fetch list of schools
   * Fallback to mock data if backend API is not yet available
   */
  async getSchools(query = {}) {
    try {
      // Future integration point for Member 3:
      // const response = await fetch(API_ENDPOINTS.SCHOOLS);
      // if (response.ok) return await response.json();
      return initialSchools;
    } catch (err) {
      console.warn('[schoolService] Backend not reachable, using local mock data:', err.message);
      return initialSchools;
    }
  },

  /**
   * Fetch single school by ID
   */
  async getSchoolById(schoolId) {
    try {
      // Future integration point for Member 3:
      // const response = await fetch(API_ENDPOINTS.SCHOOL_BY_ID(schoolId));
      // if (response.ok) return await response.json();
      const school = initialSchools.find(s => s.id === schoolId);
      return school || null;
    } catch (err) {
      console.warn('[schoolService] Error fetching school:', err.message);
      return initialSchools.find(s => s.id === schoolId) || null;
    }
  },

  /**
   * Placeholder for school creation (owned by Member 3)
   */
  async createSchool(schoolData) {
    console.info('[schoolService] createSchool called with:', schoolData);
    return {
      id: `sch-${Date.now()}`,
      ...schoolData,
      participantsCount: 0,
      totalActivities: 0
    };
  }
};
