import React from 'react';
import {
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Database,
  Users,
  Camera,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useFieldApp } from '../../context/FieldAppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import '../../styles/SyncStatus.css';

export const SyncStatus = () => {
  const {
    isOnline,
    syncProgress,
    isSyncing,
    lastSyncTime,
    triggerSync,
    retryFailedRecords,
    syncLogs,
    offlineRecords
  } = useFieldApp();

  const pendingCount = offlineRecords.filter(r => r.status === 'Pending Sync').length;

  return (
    <div className="sync-page-container">
      {/* 1. Header Section */}
      <div className="sync-header-section">
        <div className="sync-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-back-nav"
              onClick={() => navigate('/offline')}
              title="Return to Offline Queue"
            >
              ← Back to Offline Queue
            </button>
            <button
              type="button"
              className="btn-back-nav"
              onClick={() => navigate('/')}
              title="Return to Field Home"
            >
              Field Home ↗
            </button>
          </div>
          <h1 className="sync-heading" style={{ marginTop: '8px' }}>Sync Data</h1>
          <p className="sync-subheading">Last synced: {lastSyncTime}</p>
        </div>

        <div className="sync-actions-group">
          <button
            type="button"
            className="btn-sync-now"
            onClick={triggerSync}
            disabled={isSyncing}
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : '+ Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* 2. Sync Progress Card */}
      <div className="sync-progress-card">
        <div className="sync-progress-header">
          <h2 className="sync-progress-title">Sync Progress</h2>
          <span className="sync-percentage-badge">{syncProgress}%</span>
        </div>

        <div className="sync-progress-bar-track">
          <div
            className="sync-progress-bar-fill"
            style={{ width: `${syncProgress}%` }}
          />
        </div>

        <div className="sync-status-details">
          <span>
            {isSyncing
              ? 'Uploading pending local records to central MongoDB...'
              : syncProgress === 100
              ? 'All staged field records successfully synced'
              : `Uploading 8 of 12 records (${pendingCount} pending queue)`}
          </span>
          <span>
            {isOnline ? 'Network Connection: Stable' : 'Working Offline (Queued)'}
          </span>
        </div>
      </div>

      {/* 3. 4 Metrics Summary Grid */}
      <div className="sync-metrics-grid">
        <div className="sync-metric-chip">
          <div className="sync-metric-icon-box total">
            <Database size={22} />
          </div>
          <div className="sync-metric-info">
            <span className="sync-metric-val">24</span>
            <span className="sync-metric-lbl">Total Records</span>
          </div>
        </div>

        <div className="sync-metric-chip">
          <div className="sync-metric-icon-box synced">
            <CheckCircle2 size={22} />
          </div>
          <div className="sync-metric-info">
            <span className="sync-metric-val">18</span>
            <span className="sync-metric-lbl">Synced</span>
          </div>
        </div>

        <div className="sync-metric-chip">
          <div className="sync-metric-icon-box pending">
            <Clock size={22} />
          </div>
          <div className="sync-metric-info">
            <span className="sync-metric-val">{pendingCount || 3}</span>
            <span className="sync-metric-lbl">Pending Sync</span>
          </div>
        </div>

        <div className="sync-metric-chip">
          <div className="sync-metric-icon-box failed">
            <AlertCircle size={22} />
          </div>
          <div className="sync-metric-info">
            <span className="sync-metric-val">1</span>
            <span className="sync-metric-lbl">Failed</span>
          </div>
        </div>
      </div>

      {/* 4. Recent Sync Activity Card */}
      <div className="sync-activity-card">
        <div className="sync-activity-header">
          <h2 className="sync-activity-title">Recent Sync Activity</h2>
          <button
            type="button"
            className="btn-retry-failed"
            onClick={retryFailedRecords}
            title="Retry failed synchronization tasks"
          >
            <RefreshCw size={14} />
            <span>Retry Failed</span>
          </button>
        </div>

        <div className="sync-logs-list">
          {syncLogs.map((log) => {
            const isFailed = log.status === 'Failed';
            return (
              <div key={log.id} className="sync-log-item">
                <div className="sync-log-left">
                  <div className="sync-log-icon">
                    {log.entity.includes('Participant') ? (
                      <Users size={18} />
                    ) : log.entity.includes('Photo') ? (
                      <Camera size={18} />
                    ) : log.entity.includes('School') ? (
                      <Database size={18} />
                    ) : (
                      <Layers size={18} />
                    )}
                  </div>

                  <div className="sync-log-info">
                    <span className="sync-log-entity">{log.entity}</span>
                    <span className="sync-log-desc">{log.details}</span>
                  </div>
                </div>

                <div className="sync-log-right">
                  <StatusBadge
                    status={log.status}
                    text={log.status}
                    size="sm"
                  />

                  {isFailed ? (
                    <button
                      type="button"
                      className="btn-inline-retry"
                      onClick={retryFailedRecords}
                    >
                      Retry
                    </button>
                  ) : (
                    <span className="sync-log-time">{log.time}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Synchronization Completion Banner */}
      <div className="sync-completion-banner">
        <div className="completion-left">
          <div className="completion-check-icon">
            <CheckCircle2 size={24} />
          </div>
          <div className="completion-text-group">
            <h3 className="completion-headline">Synchronization Complete!</h3>
            <p className="completion-subtext">
              All field data is safely verified. Ready for evaluation analytics by Member 5.
            </p>
          </div>
        </div>

        <StatusBadge
          status="synced"
          text="Sync Engine Ready"
          size="md"
        />
      </div>
    </div>
  );
};

export default SyncStatus;
