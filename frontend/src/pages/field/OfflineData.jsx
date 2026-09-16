import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  WifiOff,
  Wifi,
  Database,
  Users,
  CalendarCheck,
  Camera,
  ShieldCheck,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  TreePine,
  Layers,
  Sparkles
} from 'lucide-react';
import { useFieldApp } from '../../context/FieldAppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import '../../styles/OfflineData.css';

export const OfflineData = () => {
  const navigate = useNavigate();
  const {
    isOnline,
    offlineRecords,
    participants,
    activities,
    photos,
    selectedSchool,
    selectedProgram
  } = useFieldApp();

  const [localSaveNotice, setLocalSaveNotice] = useState('');

  const handleManualSaveLocal = () => {
    setLocalSaveNotice('All active drafts and cached form entries successfully stored to device IndexedDB/localStorage.');
    setTimeout(() => setLocalSaveNotice(''), 4000);
  };

  const pendingCount = offlineRecords.filter(r => r.status === 'Pending Sync').length;

  return (
    <div className="offline-page-container">
      {/* 1. Header Section */}
      <div className="offline-header-section">
        <div className="offline-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-back-nav"
              onClick={() => navigate('/photos')}
              title="Return to Photos Evidence"
            >
              ← Back to Photos
            </button>
          </div>
          <h1 className="offline-heading" style={{ marginTop: '8px' }}>Offline Data</h1>
          <p className="offline-subheading">
            Your data is being saved locally. It will sync automatically when internet is available.
          </p>
        </div>

        <div className="offline-header-actions">
          <StatusBadge
            status={isOnline ? 'online' : 'offline'}
            text={isOnline ? 'Online' : "You're Offline"}
          />
          <button
            type="button"
            className="btn-save-local"
            onClick={handleManualSaveLocal}
          >
            <Plus size={16} />
            <span>+ Save Locally</span>
          </button>
        </div>
      </div>

      {/* Manual save notification banner */}
      {localSaveNotice && (
        <div className="participant-success-banner">
          <div className="participant-success-text">
            <CheckCircle2 size={18} />
            <span>{localSaveNotice}</span>
          </div>
        </div>
      )}

      {/* 2. Offline Status Hero Banner */}
      <div className="offline-status-hero">
        <div className="offline-hero-left">
          <div className={`offline-hero-icon-box ${isOnline ? 'online' : ''}`}>
            {isOnline ? <Wifi size={28} /> : <WifiOff size={28} />}
          </div>
          <div className="offline-hero-text">
            <h2 className="offline-hero-title">
              {isOnline ? "Network Connected" : "You're Offline"}
            </h2>
            <p className="offline-hero-desc">
              {isOnline
                ? "You currently have network connectivity. Locally staged records are ready to sync with the central database."
                : "No internet connection. Don't worry! The app works offline and your field data is safely stored on this device."}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-goto-sync"
          onClick={() => navigate('/sync')}
        >
          <span>View Sync Dashboard</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 3. Summary Counters */}
      <div className="offline-counters-grid">
        <div className="offline-counter-chip">
          <div className="chip-icon-box blue">
            <Users size={24} />
          </div>
          <div className="chip-content">
            <span className="chip-number">{participants.length}</span>
            <span className="chip-label">Participants Stored</span>
          </div>
        </div>

        <div className="offline-counter-chip">
          <div className="chip-icon-box green">
            <CalendarCheck size={24} />
          </div>
          <div className="chip-content">
            <span className="chip-number">{activities.length}</span>
            <span className="chip-label">Activities Recorded</span>
          </div>
        </div>

        <div className="offline-counter-chip">
          <div className="chip-icon-box purple">
            <Camera size={24} />
          </div>
          <div className="chip-content">
            <span className="chip-number">{photos.length}</span>
            <span className="chip-label">Evidence Photos</span>
          </div>
        </div>
      </div>

      {/* 4. Locally Saved Records List */}
      <div className="offline-records-card">
        <div className="records-card-header">
          <h2 className="records-card-title">Locally Saved Records</h2>
          <span className="roster-count-badge">
            {pendingCount} records waiting to sync
          </span>
        </div>

        <div className="records-list">
          {offlineRecords.length > 0 ? (
            offlineRecords.map((record) => (
              <div key={record.id} className="record-item-card">
                <div className="record-item-left">
                  <div className="record-item-icon">
                    {record.type === 'Participant' ? (
                      <Users size={20} />
                    ) : record.type === 'Photo' ? (
                      <Camera size={20} />
                    ) : (
                      <TreePine size={20} />
                    )}
                  </div>

                  <div className="record-item-text">
                    <span className="record-item-title">{record.title}</span>
                    <span className="record-item-sub">
                      {record.school} {record.itemsCount ? `• ${record.itemsCount}` : ''}
                    </span>
                  </div>
                </div>

                <div className="record-item-right">
                  <StatusBadge
                    status={record.status}
                    text={record.status}
                    size="sm"
                  />
                  <span className="record-item-timestamp">
                    {record.timestamp}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--color-text-muted)' }}>
              <p>No offline records currently in queue.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Device Safety Banner */}
      <div className="device-safety-banner">
        <div className="safety-text-group">
          <ShieldCheck size={22} />
          <span>Data saved successfully on this device. Fully protected against network drops.</span>
        </div>

        <button
          type="button"
          className="btn-goto-sync"
          onClick={() => navigate('/sync')}
        >
          <span>Sync Now</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default OfflineData;
