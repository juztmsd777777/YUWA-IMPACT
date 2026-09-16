import { API_ENDPOINTS } from './apiConfig';
import { initialActivities } from '../data/mockData';

export const activityService = {
  /**
   * Fetch recent activities
   */
  async getActivities() {
    try {
      // Future integration point for Member 3:
      // const res = await fetch(API_ENDPOINTS.ACTIVITIES);
      // if (res.ok) return await res.json();
      return initialActivities;
    } catch (err) {
      console.warn('[activityService] Error fetching activities:', err.message);
      return initialActivities;
    }
  },

  /**
   * Record a new field activity
   */
  async createActivity(activityData) {
    console.info('[activityService] Recording activity:', activityData);
    const newActivity = {
      id: `act-${Date.now()}`,
      ...activityData,
      timeAgo: 'Just now',
      status: 'Pending Sync'
    };
    return newActivity;
  }
};
