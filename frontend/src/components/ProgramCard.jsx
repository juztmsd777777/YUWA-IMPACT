import React from 'react';
import { ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProgramCard({ program }) {
  const isGreenGurukul = program.id === 'green-gurukul';

  return (
    <div className={`program-card ${isGreenGurukul ? 'green-gurukul' : ''}`}>
      <div>
        <div className="program-card-header">
          <div>
            <span className="program-badge">
              <CheckCircle2 size={12} />
              {program.badge}
            </span>
            <h3 className="program-title">{program.title}</h3>
          </div>
          <Award size={24} color={isGreenGurukul ? '#2e7d32' : '#0f4632'} />
        </div>

        <p className="program-desc">{program.description}</p>

        <div className="program-metrics-row">
          <div className="program-metric-item">
            <span className="program-metric-label">Schools</span>
            <span className="program-metric-val">{program.schoolsReached}</span>
          </div>
          <div className="program-metric-item">
            <span className="program-metric-label">Students</span>
            <span className="program-metric-val">{program.studentsReached}</span>
          </div>
          <div className="program-metric-item">
            <span className="program-metric-label">Avg Score</span>
            <span className="program-metric-val">{program.avgScore}</span>
          </div>
        </div>
      </div>

      <Link to="/dashboard/evaluation" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
        <span>View Evaluation</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

