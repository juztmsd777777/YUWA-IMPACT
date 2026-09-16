import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import ActivityTable from '../components/ActivityTable';
import PhotoGallery from '../components/PhotoGallery';
import { SCHOOL_DETAILS_DATA } from '../data/mockData';
import { 
  MapPin, 
  Users, 
  Award, 
  ClipboardCheck, 
  ArrowLeft, 
  GraduationCap
} from 'lucide-react';

export default function SchoolDetails() {
  const [activeTab, setActiveTab] = useState('Overview');
  const school = SCHOOL_DETAILS_DATA;

  const tabs = ['Overview', 'Students', 'Activities', 'Photos', 'History'];

  return (
    <div className="main-content">
      {/* Back Navigation */}
      <Link to="/admin/dashboard" className="back-link-btn">
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      {/* School Header Banner */}
      <div className="school-header-banner">
        <img 
          src={school.image} 
          alt={school.name} 
          className="school-avatar-image"
        />
        <div className="school-header-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 className="school-header-name">{school.name}</h1>
            <span className="badge badge-ecolympics">Partner Institution</span>
          </div>

          <div className="school-meta-tags">
            <div className="school-meta-item">
              <MapPin size={14} color="var(--primary-green)" />
              <span>{school.location}</span>
            </div>
            <div className="school-meta-item">
              <Users size={14} color="var(--primary-green)" />
              <span>{school.studentsCount} Students Enrolled</span>
            </div>
            <div className="school-meta-item">
              <GraduationCap size={14} color="var(--primary-green)" />
              <span>{school.coordinator}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div>
          {/* 3 Summary Cards */}
          <div className="stat-grid-3">
            <StatCard
              label="Total Students"
              value={school.overview.totalStudents}
              trend="100% participation in Green Quiz"
              isPositive={true}
              icon={Users}
            />
            <StatCard
              label="Total Activities"
              value={school.overview.totalActivities}
              trend="Completed this academic year"
              isPositive={true}
              icon={ClipboardCheck}
            />
            <StatCard
              label="Average Score"
              value={school.overview.averageScore}
              trend="+16% baseline improvement"
              isPositive={true}
              icon={Award}
            />
          </div>

          {/* Recent Activities */}
          <ActivityTable 
            activities={school.recentActivities} 
            showSchoolColumn={false}
            title="School Recent Activities"
          />

          {/* Photos / Evidence Gallery */}
          <PhotoGallery 
            photos={school.photos} 
            title="School Evidence & Event Photos" 
          />
        </div>
      )}

      {activeTab === 'Students' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Enrolled Student Cohort ({school.studentsCount})</h3>
          </div>
          <div className="card-body">
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
              Students from Grade 6 through Grade 10 actively participating in YUWA waste audits and compost drives.
            </p>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Grade / Section</th>
                    <th>Eco-Club Role</th>
                    <th>Activities Attended</th>
                    <th>Latest Assessment</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Aarav Sharma', grade: 'Grade 8-A', role: 'Green Captain', count: 6, score: '88%' },
                    { name: 'Diya Nair', grade: 'Grade 9-B', role: 'Compost Lead', count: 5, score: '92%' },
                    { name: 'Kavya Patel', grade: 'Grade 7-C', role: 'Waste Auditor', count: 4, score: '84%' },
                    { name: 'Rohan Gupta', grade: 'Grade 8-B', role: 'Active Member', count: 5, score: '80%' },
                  ].map((stu, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{stu.name}</td>
                      <td>{stu.grade}</td>
                      <td><span className="badge badge-greengurukul">{stu.role}</span></td>
                      <td>{stu.count} activities</td>
                      <td><span className="badge badge-score">{stu.score}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Activities' && (
        <ActivityTable 
          activities={school.recentActivities} 
          showSchoolColumn={false}
          title="All School Activities"
        />
      )}

      {activeTab === 'Photos' && (
        <PhotoGallery 
          photos={school.photos} 
          title="Complete Photo Gallery" 
        />
      )}

      {activeTab === 'History' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Partnership Timeline & Milestones</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '12px 16px', background: '#f8faf8', borderRadius: '8px', borderLeft: '4px solid var(--primary-green)' }}>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>MOU Signed with Waste Warriors Society</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>15 January 2025 • Formal onboarding for Ecolympics & Green Gurukul</div>
            </div>
            <div style={{ padding: '12px 16px', background: '#f8faf8', borderRadius: '8px', borderLeft: '4px solid var(--primary-green)' }}>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Campus Waste Audit Baseline Established</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>02 February 2025 • 42 kg/day waste stream characterized (62% organic)</div>
            </div>
            <div style={{ padding: '12px 16px', background: '#f8faf8', borderRadius: '8px', borderLeft: '4px solid var(--primary-green)' }}>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Compost Pit Inauguration</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>28 March 2025 • Diverted 100% canteen organic scraps</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
