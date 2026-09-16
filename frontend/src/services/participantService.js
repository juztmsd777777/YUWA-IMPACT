import { API_ENDPOINTS } from './apiConfig';
import { initialParticipants } from '../data/mockData';

export const participantService = {
  /**
   * Fetch participants, optionally filtered by schoolId
   */
  async getParticipants(schoolId = null) {
    try {
      // Future integration point for Member 3:
      // const url = schoolId ? `${API_ENDPOINTS.PARTICIPANTS}?schoolId=${schoolId}` : API_ENDPOINTS.PARTICIPANTS;
      // const res = await fetch(url);
      // if (res.ok) return await res.json();
      if (!schoolId) return initialParticipants;
      return initialParticipants.filter(p => p.schoolId === schoolId);
    } catch (err) {
      console.warn('[participantService] Error fetching participants:', err.message);
      return initialParticipants;
    }
  },

  /**
   * Register a new participant
   */
  async createParticipant(participantData) {
    console.info('[participantService] Creating participant:', participantData);
    const newParticipant = {
      id: `part-${Date.now()}`,
      ...participantData,
      status: 'Active',
      addedAt: new Date().toISOString().split('T')[0]
    };
    return newParticipant;
  }
};
