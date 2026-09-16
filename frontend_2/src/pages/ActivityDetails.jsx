import React from 'react';
import { Link } from 'react-router-dom';
import PhotoGallery from '../components/PhotoGallery';
import { ACTIVITY_DETAILS_DATA } from '../data/mockData';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Award, 
  Tag, 
  FileText,
  CheckCircle2
} from 'lucide-react';

export default function ActivityDetails() {
  const activity = ACTIVITY_DETAILS_DATA;

  return (
    <div className="main-content">
      {/* Back Link */}
      <Link to="/admin/dashboard" className="back-link-btn">
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      {/* Page Heading */}
      <div className="page-top-bar" style={{ marginBottom: '18px' }}>
        <div className="page-title-group">
          <h2>Activity Details</h2>
          <p>Detailed performance and evidence report for field execution</p>
        </div>
        <div className="page-top-actions">
          <span className="badge badge-ecolympics" style={{ fontSize: '13px', padding: '6px 14px' }}>
            <CheckCircle2 size={14} />
            Verified Activity
          </span>
        </div>
      </div>

      {/* Large Banner & Attributes Card */}
      <div className="activity-banner-card">
        {/* Large Activity Hero Image */}
        <img 
          src={activity.bannerImage} 
          alt={activity.activityType} 
          className="activity-hero-image"
        />

        {/* Info Grid */}
        <div className="activity-info-grid">
          <div className="activity-info-item">
            <span className="activity-info-label">Program</span>
            <span className="activity-info-value" style={{ color: 'var(--primary-green)' }}>
              {activity.program}
            </span>
          </div>

          <div className="activity-info-item">
            <span className="activity-info-label">School</span>
            <Link 
              to={`/schools/${activity.schoolId}`}
              className="activity-info-value"
              style={{ color: 'var(--text-primary)', textDecoration: 'none', borderBottom: '1px dotted var(--primary-green)' }}
            >
              {activity.school}
            </Link>
          </div>

          <div className="activity-info-item">
            <span className="activity-info-label">Date</span>
            <div className="activity-info-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color="var(--primary-green)" />
              <span>{activity.date}</span>
            </div>
          </div>

          <div className="activity-info-item">
            <span className="activity-info-label">Activity Type</span>
            <div className="activity-info-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={16} color="var(--primary-green)" />
              <span>{activity.activityType}</span>
            </div>
          </div>

          <div className="activity-info-item">
            <span className="activity-info-label">Participants</span>
            <div className="activity-info-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} color="var(--primary-green)" />
              <span>{activity.participants} Students</span>
            </div>
          </div>

          <div className="activity-info-item">
            <span className="activity-info-label">Average Score</span>
            <div className="activity-info-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="var(--primary-green)" />
              <span className="badge badge-score" style={{ fontSize: '15px' }}>{activity.avgScore}</span>
            </div>
          </div>
        </div>

        {/* Notes & Description Box */}
        <div className="activity-notes-box">
          <div className="activity-notes-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={16} color="var(--primary-green)" />
            <span>Notes & Field Observations</span>
          </div>
          <p className="activity-notes-text">
            {activity.notes}
          </p>
        </div>
      </div>

      {/* Multi-Image Photo Gallery */}
      <PhotoGallery 
        photos={activity.photos} 
        title="Activity Photo Gallery & Field Evidence" 
      />
    </div>
  );
}
