import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  X,
  AlertCircle,
  ChevronRight,
  Trash2,
  Eye,
  Sparkles
} from 'lucide-react';
import { useFieldApp } from '../../context/FieldAppContext';
import { photoService } from '../../services/photoService';
import '../../styles/Photos.css';

export const PhotoEvidence = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { isOnline, photos, addPhotos, removePhoto, saveOfflinePhotos, selectedSchool, selectedProgram } = useFieldApp();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFiles(e.target.files);
    }
  };

  const processSelectedFiles = (files) => {
    setErrorMessage('');
    const validFiles = [];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Format validation
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrorMessage(`File "${file.name}" is not supported. Please upload JPG, PNG, or WEBP.`);
        continue;
      }

      // Size validation
      if (file.size > maxSizeBytes) {
        setErrorMessage(`File "${file.name}" exceeds 5MB size limit.`);
        continue;
      }

      validFiles.push({
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file)
      });
    }

    if (validFiles.length > 0) {
      addPhotos(validFiles);
    }
  };

  const handleUploadSubmit = async () => {
    if (photos.length === 0) {
      setErrorMessage('Please select or capture at least one photo.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(30);

    setTimeout(async () => {
      try {
        if (isOnline) {
          await photoService.uploadPhotos(photos, 'current-activity');
        } else {
          saveOfflinePhotos(photos);
        }
      } catch (err) {
        saveOfflinePhotos(photos);
      } finally {
        setUploadProgress(100);
        setIsUploading(false);
        setUploadSuccess(true);
      }
    }, 600);
  };

  return (
    <div className="photos-page-container">
      {/* 1. Header Section */}
      <div className="photos-header-section">
        <div className="photos-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-back-nav"
              onClick={() => navigate('/activities')}
              title="Return to Activity Details"
            >
              ← Back to Activity
            </button>
          </div>
          <h1 className="photos-heading" style={{ marginTop: '8px' }}>Upload Photos / Evidence</h1>
          <p className="photos-subheading">
            Add high-resolution field photos for climate activity verification
          </p>
        </div>

        <button
          type="button"
          className="proceed-step-btn"
          onClick={() => navigate('/offline')}
          title="Continue to Offline Data Queue"
        >
          <span>Next: Offline Queue</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 2. Main Upload Card */}
      <div className="upload-card-wrapper">
        {/* Success Alert */}
        {uploadSuccess && (
          <div className="participant-success-banner">
            <div className="participant-success-text">
              <CheckCircle2 size={18} />
              <span>
                {isOnline
                  ? `Successfully uploaded ${photos.length} activity evidence photos to server.`
                  : `Successfully stored ${photos.length} photos in local queue. Ready to sync when online.`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setUploadSuccess(false)}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="participant-success-banner" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#DC2626' }}>
            <div className="participant-success-text">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Drag & Drop Zone */}
        <div
          className={`photo-dropzone ${isDragOver ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="file-input-hidden"
            onChange={handleFileInputChange}
          />
          <div className="dropzone-icon-box">
            <Camera size={32} />
          </div>
          <div className="dropzone-main-text">
            Drag & drop photos here
          </div>
          <div className="dropzone-sub-text">
            or click to browse from device / take photo
          </div>
          <div className="dropzone-format-info">
            Supported formats: JPG, PNG, WEBP (Max 5MB each)
          </div>
        </div>

        {/* Upload Progress Bar (shown when uploading) */}
        {isUploading && (
          <div className="upload-progress-container">
            <div className="upload-progress-header">
              <span>Compressing & Uploading Evidence Photos...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Staged Photo Previews */}
        <div className="preview-section-header">
          <h2 className="preview-title">Uploaded Photos</h2>
          <span className="preview-count-chip">
            {photos.length} photos staged
          </span>
        </div>

        <div className="photos-preview-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-thumbnail-card">
              <div className="photo-image-wrapper">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="photo-img"
                  loading="lazy"
                />
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(photo.id);
                  }}
                  title="Remove this photo"
                  aria-label={`Remove photo ${photo.name}`}
                >
                  <X size={15} />
                </button>
              </div>

              <div className="photo-card-footer">
                <span className="photo-file-name" title={photo.name}>
                  {photo.name}
                </span>
                <span className="photo-size-badge">
                  {photo.size || '320 KB'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions Bar */}
        <div className="upload-actions-bar">
          <div className="photos-selected-count">
            Total: <strong>{photos.length} photos selected</strong>
          </div>

          <div className="actions-btn-group">
            <button
              type="button"
              className="btn-clear"
              onClick={() => {
                photos.forEach((p) => removePhoto(p.id));
              }}
              disabled={photos.length === 0}
            >
              Clear All
            </button>

            <button
              type="button"
              className="btn-upload-submit"
              onClick={handleUploadSubmit}
              disabled={photos.length === 0 || isUploading}
            >
              <UploadCloud size={18} />
              <span>{isUploading ? 'Uploading...' : 'Upload Photos'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEvidence;
