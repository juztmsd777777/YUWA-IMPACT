import React, { useState } from 'react';
import { X, Calendar, MapPin, ZoomIn } from 'lucide-react';

export default function PhotoGallery({ photos, title = 'Photos & Evidence Gallery' }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          {photos.length} Verified Evidence Records
        </span>
      </div>

      <div className="card-body">
        <div className="photo-gallery-grid">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="photo-card"
              onClick={() => setSelectedPhoto(photo)}
              title="Click to expand"
            >
              <img src={photo.url} alt={photo.caption} loading="lazy" />
              <div className="photo-card-overlay">
                <div style={{ fontWeight: 600 }}>{photo.caption}</div>
                <div style={{ opacity: 0.85, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={11} />
                  <span>{photo.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedPhoto(null)}>
              <X size={18} />
            </button>
            <img 
              src={selectedPhoto.url} 
              alt={selectedPhoto.caption} 
              style={{ width: '100%', maxHeight: '480px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedPhoto.caption}
              </h4>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} color="var(--primary-green)" />
                  {selectedPhoto.date}
                </span>
                {selectedPhoto.school && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} color="var(--primary-green)" />
                    {selectedPhoto.school}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

