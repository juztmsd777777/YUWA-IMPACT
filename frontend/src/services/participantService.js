import { API_ENDPOINTS } from './apiConfig';

export const participantService = {
  /**
   * Fetch participants from the database, optionally filtered by schoolId
   */
  async getParticipants(schoolId = null) {
    try {
      const url = schoolId ? `${API_ENDPOINTS.PARTICIPANTS}?schoolId=${schoolId}` : API_ENDPOINTS.PARTICIPANTS;
      const res = await fetch(url);
      if (res.ok) {
        const result = await res.json();
        return result.data || result || [];
      }
      return [];
    } catch (err) {
      console.error('[participantService] Error fetching participants from database:', err.message);
      return [];
    }
  },

  /**
   * Register a new participant in the database
   */
  async createParticipant(participantData) {
    try {
      const res = await fetch(API_ENDPOINTS.PARTICIPANTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participantData)
      });
      if (res.ok) {
        const result = await res.json();
        return result.data || result;
      }
      throw new Error(`Failed to create participant: ${res.status}`);
    } catch (err) {
      console.error('[participantService] Error creating participant:', err.message);
      throw err;
    }
  }
};
