import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar } from 'lucide-react';

export default function ActivityTable({ activities, showSchoolColumn = true, title = 'Recent Activities' }) {
  return (
    <div className="table-container">
      <div className="table-header-bar">
        <h3 className="table-header-title">{title}</h3>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing {activities.length} entries
        </span>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Program</th>
              <th>Activity</th>
              {showSchoolColumn && <th>School</th>}
              <th>Participants</th>
              <th>Avg Score</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act) => {
              const isEcolympics = act.program === 'Ecolympics';
              return (
                <tr key={act.id}>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} color="var(--text-muted)" />
                      <span>{act.date}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${isEcolympics ? 'badge-ecolympics' : 'badge-greengurukul'}`}>
                      {act.program}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    <Link 
                      to={`/activities/${act.id}`}
                      style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-green)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    >
                      {act.activity}
                    </Link>
                  </td>
                  {showSchoolColumn && (
                    <td>
                      <Link 
                        to={`/schools/${act.schoolId || 'sunrise-high-school'}`}
                        style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-green)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      >
                        {act.school}
                      </Link>
                    </td>
                  )}
                  <td>
                    <span style={{ fontWeight: 600 }}>{act.participants}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>students</span>
                  </td>
                  <td>
                    <span className="badge badge-score">{act.avgScore}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/activities/${act.id}`} className="btn btn-outline btn-sm">
                      <span>View</span>
                      <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

