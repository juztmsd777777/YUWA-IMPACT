import { API_ENDPOINTS } from './apiConfig';
import { initialSyncLogs } from '../data/mockData';

export const syncService = {
  /**
   * Fetch current sync status, records counts, and recent sync activity
   * Integration point for Member 4 (Offline & Sync backend service)
   */
  async getSyncStatus() {
    return {
      progressPercent: 68,
      totalRecords: 24,
      syncedRecords: 18,
      pendingRecords: 3,
      failedRecords: 1,
      lastSynced: '14 Sep 2025, 06:12 PM',
      logs: initialSyncLogs
    };
  },

  /**
   * Trigger synchronization
   */
  async triggerSync() {
    console.info('[syncService] Triggering manual synchronization...');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          message: 'Sync completed for all pending records',
          syncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }, 1000);
    });
  },

  /**
   * Retry failed records
   */
  async retryFailed() {
    console.info('[syncService] Retrying failed sync records...');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          retriedCount: 1,
          message: 'Failed records re-processed successfully'
        });
      }, 800);
    });
  }
};
