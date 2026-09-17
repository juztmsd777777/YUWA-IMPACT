import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Building2,
  CheckCircle2,
  Plus,
  UserPlus,
  Camera,
  Database,
  Calendar,
  MapPin,
  ChevronRight,
  Wifi,
  WifiOff,
  Sprout,
  TreePine,
  Sparkles
} from 'lucide-react';
import { useFieldApp } from '../../context/FieldAppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import '../../styles/Home.css';

export const FieldHome = () => {
  const navigate = useNavigate();
  const { isOnline, fieldWorker, schools, activities, offlineRecords } = useFieldApp();

  // Current formatted date/time
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const pendingRecordsCount = offlineRecords.filter(r => r.status === 'Pending Sync').length;

  return (
    <div className="home-container">
      {/* 1. Welcome Section */}
      <section className="home-welcome-header">
        <div className="welcome-title-group">
          <h1 className="welcome-heading">Good Morning, {fieldWorker.name.split(' ')[0]}!</h1>
          <p className="welcome-subheading">Let's create a cleaner and greener tomorrow.</p>
        </div>

        <div className="welcome-meta-group">
          <div className="meta-chip">
            <MapPin size={14} className="meta-chip-icon" />
            <span>{fieldWorker.role} • {fieldWorker.location}</span>
          </div>

          <div className="meta-chip">
            <Calendar size={14} className="meta-chip-icon" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </section>

      {/* 2. Metric Summary Cards */}
      <section className="home-metrics-grid">
        <div className="metric-summary-card">
          <div className="metric-icon-box amber">
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Pending sync</span>
            <div className="metric-value-row">
              <span className="metric-value">{pendingRecordsCount}</span>
              <span className="metric-tag">records</span>
            </div>
          </div>
        </div>

        <div className="metric-summary-card">
          <div className="metric-icon-box green">
            <Building2 size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Schools registered</span>
            <div className="metric-value-row">
              <span className="metric-value">{schools.length}</span>
              <span className="metric-tag">schools</span>
            </div>
          </div>
        </div>

        <div className="metric-summary-card">
          <div className="metric-icon-box emerald">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Activities recorded</span>
            <div className="metric-value-row">
              <span className="metric-value">{activities.length}</span>
              <span className="metric-tag">done</span>
            </div>
          </div>
        </div>
      </section>


      {/* 3. Quick Actions */}
      <section className="quick-actions-section">
        <div className="section-label">Quick Actions</div>
        <div className="quick-actions-grid">
          <div
            className="action-card primary-action"
            onClick={() => navigate('/programs')}
            title="Start new activity workflow"
          >
            <div className="action-icon-circle">
              <Plus size={22} strokeWidth={2.5} />
            </div>
            <div className="action-text-group">
              <span className="action-text-title">+ Add Activity</span>
              <span className="action-text-sub">Choose program & school</span>
            </div>
          </div>

          <div
            className="action-card"
            onClick={() => navigate('/participants')}
            title="Register student or view participants"
          >
            <div className="action-icon-circle">
              <UserPlus size={20} />
            </div>
            <div className="action-text-group">
              <span className="action-text-title">Add Participant</span>
              <span className="action-text-sub">Student roster</span>
            </div>
          </div>

          <div
            className="action-card"
            onClick={() => navigate('/photos')}
            title="Upload photo evidence for activities"
          >
            <div className="action-icon-circle">
              <Camera size={20} />
            </div>
            <div className="action-text-group">
              <span className="action-text-title">Upload Photos</span>
              <span className="action-text-sub">Field evidence</span>
            </div>
          </div>

          <div
            className="action-card"
            onClick={() => navigate('/offline')}
            title="Inspect locally stored offline records"
          >
            <div className="action-icon-circle">
              <Database size={20} />
            </div>
            <div className="action-text-group">
              <span className="action-text-title">View Offline Data</span>
              <span className="action-text-sub">{pendingRecordsCount} pending sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Split: Recent Activities & Status Column */}
      <div className="home-bottom-grid">
        {/* Left: Recent Activities */}
        <section className="recent-activities-card">
          <div className="card-header-row">
            <h2 className="card-title">Recent Activities</h2>
            <Link to="/activities" className="card-link">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="recent-activities-list">
            {activities.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No activities recorded yet. Tap "+ Add Activity" above to record one!
              </div>
            ) : (
              activities.slice(0, 4).map((act) => {
                const actName = act.activityName || act.name || act.title || 'Field Activity';
                const schName = act.schoolName || (typeof act.schoolId === 'object' ? (act.schoolId?.schoolName || act.schoolId?.name) : '') || 'Partner School';
                const actKey = act._id || act.id || Math.random();
                const actDate = act.date ? new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently';

                return (
                  <div key={actKey} className="recent-activity-item">
                    <div className="activity-item-left">
                      <div className="activity-item-icon">
                        <TreePine size={20} />
                      </div>
                      <div className="activity-item-text">
                        <span className="activity-item-name">{actName}</span>
                        <span className="activity-item-school">{schName}</span>
                      </div>
                    </div>

                    <div className="activity-item-right">
                      <StatusBadge
                        status="verified"
                        text="Recorded"
                        size="sm"
                      />
                      <span className="activity-item-time">{actDate}</span>
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </section>

        {/* Right: Online/Offline Status & Organization Motto */}
        <div className="side-status-column">
          <div className="status-summary-box">
            <div className={`status-pulse-circle ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? <Wifi size={28} /> : <WifiOff size={28} />}
            </div>
            <h3 className="status-box-title">
              {isOnline ? "You're Online" : "You're Offline"}
            </h3>
            <p className="status-box-desc">
              {isOnline
                ? "Data will sync automatically with central servers."
                : "All records are safely stored on this device."}
            </p>
            <Link to="/sync">
              <StatusBadge
                status={isOnline ? 'online' : 'offline'}
                text={isOnline ? 'Connected' : 'Offline Queue Active'}
              />
            </Link>
          </div>

          <div className="quote-motivation-box">
            <Sprout size={80} className="quote-decor-icon" />
            <div className="quote-headline">"Cleaner Communities, Brighter Futures"</div>
            <div className="quote-subtext">Waste Warriors Society • Youth Impact</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldHome;
