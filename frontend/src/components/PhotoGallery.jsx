import React, { useState } from 'react';
import { X, Calendar, MapPin, ZoomIn } from 'lucide-react';

export default function PhotoGallery({ photos = [], title = 'Photos & Evidence Gallery' }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const photoList = Array.isArray(photos) ? photos : [];

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          {photoList.length} Verified Evidence Records
        </span>
      </div>

      <div className="card-body">
        <div className="photo-gallery-grid">
          {photoList.map((photo) => {
            const rawUrl = typeof photo === 'string' ? photo : (photo.url || photo.preview || photo.fileUrl || '');
            const imgUrl = rawUrl.startsWith('/uploads')
              ? (window.location.port === '5173' ? rawUrl : `http://localhost:5000${rawUrl}`)
              : (rawUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80');

            const caption = photo.caption || photo.title || 'Field Evidence Photo';
            const date = photo.date || 'Verified';
            const school = photo.school || '';

            return (
              <div 
                key={photo.id || imgUrl} 
                className="photo-card"
                onClick={() => setSelectedPhoto({ ...photo, url: imgUrl, caption, date, school })}
                title="Click to expand"
              >
                <img 
                  src={imgUrl} 
                  alt={caption} 
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="photo-card-overlay">
                  <div style={{ fontWeight: 600 }}>{caption}</div>
                  <div style={{ opacity: 0.85, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} />
                    <span>{date}</span>
                  </div>
                </div>
              </div>
            );
          })}
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
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80';
              }}
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
