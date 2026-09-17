import { API_ENDPOINTS } from './apiConfig';

export const syncService = {
  /**
   * Fetch current sync status, records counts, and recent sync activity directly from database
   */
  async getSyncStatus() {
    try {
      const res = await fetch(API_ENDPOINTS.SYNC_STATUS);
      if (res.ok) {
        return await res.json();
      }
      return {
        progressPercent: 100,
        totalRecords: 0,
        syncedRecords: 0,
        pendingRecords: 0,
        failedRecords: 0,
        lastSynced: new Date().toISOString(),
        logs: []
      };
    } catch (err) {
      console.error('[syncService] Error fetching sync status:', err.message);
      return {
        progressPercent: 100,
        totalRecords: 0,
        syncedRecords: 0,
        pendingRecords: 0,
        failedRecords: 0,
        lastSynced: new Date().toISOString(),
        logs: []
      };
    }
  },

  /**
   * Trigger batch synchronization with backend
   */
  async triggerSync(payload = {}) {
    try {
      const res = await fetch(API_ENDPOINTS.SYNC_TRIGGER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
      throw new Error(`Sync trigger failed: ${res.status}`);
    } catch (err) {
      console.error('[syncService] Error triggering sync:', err.message);
      throw err;
    }
  },

  /**
   * Retry failed records in the database
   */
  async retryFailed() {
    try {
      const res = await fetch(API_ENDPOINTS.SYNC_RETRY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        return await res.json();
      }
      throw new Error(`Sync retry failed: ${res.status}`);
    } catch (err) {
      console.error('[syncService] Error retrying failed records:', err.message);
      throw err;
    }
  }
};
