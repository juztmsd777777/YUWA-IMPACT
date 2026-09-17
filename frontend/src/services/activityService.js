import { API_ENDPOINTS } from './apiConfig';

export const activityService = {
  /**
   * Fetch activities from the database
   */
  async getActivities() {
    try {
      const res = await fetch(API_ENDPOINTS.ACTIVITIES);
      if (res.ok) {
        const result = await res.json();
        return result.data || result || [];
      }
      return [];
    } catch (err) {
      console.error('[activityService] Error fetching activities from database:', err.message);
      return [];
    }
  },

  /**
   * Record a new field activity in the database
   */
  async createActivity(activityData) {
    try {
      const res = await fetch(API_ENDPOINTS.ACTIVITIES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData)
      });
      if (res.ok) {
        const result = await res.json();
        return result.data || result;
      }
      throw new Error(`Failed to create activity: ${res.status}`);
    } catch (err) {
      console.error('[activityService] Error recording activity:', err.message);
      throw err;
    }
  }
};
