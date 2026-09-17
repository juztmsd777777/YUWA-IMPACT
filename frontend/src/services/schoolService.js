import { API_ENDPOINTS } from './apiConfig';

export const schoolService = {
  /**
   * Fetch list of schools from the MongoDB database
   */
  async getSchools(query = {}) {
    try {
      const url = new URL(API_ENDPOINTS.SCHOOLS);
      Object.entries(query).forEach(([k, v]) => {
        if (v) url.searchParams.append(k, v);
      });
      const response = await fetch(url.toString());
      if (response.ok) {
        const result = await response.json();
        return result.data || result || [];
      }
      return [];
    } catch (err) {
      console.error('[schoolService] Error fetching schools from database:', err.message);
      return [];
    }
  },

  /**
   * Fetch single school by ID from the MongoDB database
   */
  async getSchoolById(schoolId) {
    try {
      const response = await fetch(API_ENDPOINTS.SCHOOL_BY_ID(schoolId));
      if (response.ok) {
        const result = await response.json();
        return result.data || result;
      }
      return null;
    } catch (err) {
      console.error('[schoolService] Error fetching school from database:', err.message);
      return null;
    }
  },

  /**
   * Create school in the MongoDB database
   */
  async createSchool(schoolData) {
    try {
      const response = await fetch(API_ENDPOINTS.SCHOOLS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schoolData)
      });
      if (response.ok) {
        const result = await response.json();
        return result.data || result;
      }
      throw new Error(`Failed to create school: ${response.status}`);
    } catch (err) {
      console.error('[schoolService] Error creating school:', err.message);
      throw err;
    }
  }
};
