import { API_ENDPOINTS } from './apiConfig';

export const photoService = {
  /**
   * Upload photos for activity evidence to backend storage & MongoDB
   */
  async uploadPhotos(photos, activityId = null) {
    if (!photos || photos.length === 0) {
      return { success: true, count: 0, photos: [] };
    }

    try {
      // Check if photos contain actual File objects for FormData
      const formData = new FormData();
      let hasFiles = false;
      const base64List = [];

      for (const p of photos) {
        if (p.file instanceof File || p.file instanceof Blob) {
          formData.append('photos', p.file, p.name || 'evidence.jpg');
          hasFiles = true;
        } else if (p instanceof File || p instanceof Blob) {
          formData.append('photos', p, p.name || 'evidence.jpg');
          hasFiles = true;
        } else if (typeof p.url === 'string' && p.url.startsWith('data:image/')) {
          base64List.push(p.url);
        } else if (typeof p === 'string' && p.startsWith('data:image/')) {
          base64List.push(p);
        } else {
          base64List.push(typeof p === 'string' ? p : (p.url || p.preview || ''));
        }
      }

      let res;
      if (hasFiles) {
        res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
      } else {
        res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photos: base64List })
        });
      }

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          count: data.count || photos.length,
          url: data.url,
          photos: data.photos || data.uploaded || [],
          uploadedAt: new Date().toISOString(),
          status: 'Synced to Database'
        };
      } else {
        console.warn('[photoService] Server returned non-200 upload status:', res.status);
      }
    } catch (err) {
      console.warn('[photoService] Network error during upload (saved locally):', err.message);
    }

    // Fallback for offline / network issues: safely return local objects
    return {
      success: true,
      count: photos.length,
      photos: photos.map((p, idx) => ({
        url: typeof p === 'string' ? p : (p.url || p.preview || ''),
        filename: p.name || `photo_${idx + 1}.jpg`,
        status: 'Stored Locally'
      })),
      uploadedAt: new Date().toISOString(),
      status: 'Stored Locally'
    };
  }
};
