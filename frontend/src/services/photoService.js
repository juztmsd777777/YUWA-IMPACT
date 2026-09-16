import { API_ENDPOINTS } from './apiConfig';

export const photoService = {
  /**
   * Upload photos for activity evidence
   * Integration point for Member 3 (Media storage) and Member 4 (Offline image queue)
   */
  async uploadPhotos(photos, activityId) {
    console.info('[photoService] Uploading photos for activity:', activityId, photos);
    
    // Simulate upload progress / API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          count: photos.length,
          uploadedAt: new Date().toISOString(),
          status: 'Stored Locally / Pending Sync'
        });
      }, 600);
    });
  }
};
