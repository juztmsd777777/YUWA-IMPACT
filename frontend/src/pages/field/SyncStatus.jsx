import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Database,
  Users,
  Camera,
  Layers
} from 'lucide-react';
import { useFieldApp } from '../../context/FieldAppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import '../../styles/SyncStatus.css';

export const SyncStatus = () => {
  const navigate = useNavigate();
  const {
    isOnline,
    syncProgress,
    isSyncing,
    lastSyncTime,
    triggerSync,
    retryFailedRecords,
    syncLogs,
    offlineRecords,
    syncSummary,
    refreshData
  } = useFieldApp();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const pendingCount = (offlineRecords && offlineRecords.length > 0)
    ? offlineRecords.filter(r => r.status === 'Pending Sync' || r.status === 'pending').length
    : (syncSummary?.pendingRecords || 0);

  const totalCount = (syncSummary?.totalRecords || 0) + (offlineRecords ? offlineRecords.length : 0);
  const syncedCount = syncSummary?.syncedRecords || (totalCount - pendingCount - (syncSummary?.failedRecords || 0));
  const failedCount = syncSummary?.failedRecords || 0;

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
              ? 'All staged field records successfully synced with central database'
              : `Uploading records (${pendingCount} pending queue)`}
          </span>
          <span>
            {isOnline ? 'Network Connection: Stable' : 'Working Offline (Queued)'}
          </span>
        </div>
      </div>

      {/* 3. 4 Metrics Summary Grid (Live Database Counts) */}
      <div className="sync-metrics-grid">
        <div className="sync-metric-chip">
          <div className="sync-metric-icon-box total">
            <Database size={22} />
          </div>
          <div className="sync-metric-info">
            <span className="sync-metric-val">{totalCount}</span>
            <span className="sync-metric-lbl">Total Records</span>
          </div>
        </div>

        <div className="sync-metric-chip">
          <div className="sync-metric-icon-box synced">
            <CheckCircle2 size={22} />
          </div>
          <div className="sync-metric-info">
            <span className="sync-metric-val">{syncedCount}</span>
            <span className="sync-metric-lbl">Synced</span>
          </div>
        </div>

        <div className="sync-metric-chip">
          <div className="sync-metric-icon-box pending">
            <Clock size={22} />
          </div>
          <div className="sync-metric-info">
            <span className="sync-metric-val">{pendingCount}</span>
            <span className="sync-metric-lbl">Pending Sync</span>
          </div>
        </div>

        <div className="sync-metric-chip">
          <div className="sync-metric-icon-box failed">
            <AlertCircle size={22} />
          </div>
          <div className="sync-metric-info">
            <span className="sync-metric-val">{failedCount}</span>
            <span className="sync-metric-lbl">Failed</span>
          </div>
        </div>
      </div>

      {/* 4. Recent Sync Activity Card */}
      <div className="sync-activity-card">
        <div className="sync-activity-header">
          <h2 className="sync-activity-title">Recent Sync Activity</h2>
          {failedCount > 0 && (
            <button
              type="button"
              className="btn-retry-failed"
              onClick={retryFailedRecords}
              title="Retry failed synchronization tasks"
            >
              <RefreshCw size={14} />
              <span>Retry Failed</span>
            </button>
          )}
        </div>

        <div className="sync-logs-list">
          {syncLogs && syncLogs.length > 0 ? (
            syncLogs.map((log, idx) => {
              const entityName = log.entity || log.programName || 'Activity Report';
              const logDesc = log.description || log.details || (log.studentCount ? `Synced ${log.studentCount} students` : 'Record verified');
              const isFailed = log.status === 'Failed' || log.status === 'flagged';
              const timeDisplay = log.time || (log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Verified');

              return (
                <div key={log.id || log.clientGeneratedId || idx} className="sync-log-item">
                  <div className="sync-log-left">
                    <div className="sync-log-icon">
                      {entityName.includes('Participant') ? (
                        <Users size={18} />
                      ) : entityName.includes('Photo') ? (
                        <Camera size={18} />
                      ) : entityName.includes('School') ? (
                        <Database size={18} />
                      ) : (
                        <Layers size={18} />
                      )}
                    </div>

                    <div className="sync-log-info">
                      <span className="sync-log-entity">{entityName}</span>
                      <span className="sync-log-desc">{logDesc}</span>
                    </div>
                  </div>

                  <div className="sync-log-right">
                    <StatusBadge
                      status={log.status === 'flagged' ? 'failed' : (log.status || 'synced')}
                      text={log.status || 'synced'}
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
                      <span className="sync-log-time">{timeDisplay}</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No sync logs to display. All records are currently synchronized.
            </div>
          )}
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
              All field data is safely verified and synced directly with MongoDB Atlas.
            </p>
          </div>
        </div>

        <StatusBadge
          status="synced"
          text="Sync Engine Live"
          size="md"
        />
      </div>
    </div>
  );
};

export default SyncStatus;
