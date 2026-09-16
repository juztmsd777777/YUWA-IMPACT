import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, GraduationCap, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { useFieldApp } from '../../context/FieldAppContext';
import { initialPrograms } from '../../data/mockData';
import '../../styles/Programs.css';

export const ProgramSelect = () => {
  const navigate = useNavigate();
  const { selectedProgram, setSelectedProgram } = useFieldApp();

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    // Proceed to Step 3: School Selection in the field worker flow
    navigate('/schools');
  };

  return (
    <div className="programs-page-container">
      {/* Header */}
      <div className="programs-header-section">
        <div className="programs-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-back-nav"
              onClick={() => navigate('/')}
              title="Return to Field Home"
            >
              ← Back to Home
            </button>
          </div>
          <h1 className="programs-heading" style={{ marginTop: '8px' }}>Our Programs</h1>
          <p className="programs-subheading">Choose a youth climate program to record field activities</p>
        </div>

        {selectedProgram && (
          <div className="current-selection-badge">
            <span>Active: <strong>{selectedProgram.name}</strong></span>
          </div>
        )}
      </div>

      {/* Program Cards Grid */}
      <div className="programs-cards-grid">
        {initialPrograms.map((program) => {
          const isSelected = selectedProgram?.id === program.id;
          const isEcolympics = program.id === 'prog-ecolympics';

          return (
            <div
              key={program.id}
              className={`program-card ${isSelected ? 'is-selected' : ''}`}
            >
              {isSelected && (
                <div className="selected-ribbon">
                  <Check size={14} />
                  <span>Active Selection</span>
                </div>
              )}

              <div className="program-card-top">
                <div className={`program-icon-box ${isEcolympics ? 'ecolympics' : 'green-gurukul'}`}>
                  {isEcolympics ? (
                    <Trophy size={28} />
                  ) : (
                    <GraduationCap size={28} />
                  )}
                </div>

                <div className="program-meta">
                  <span className="program-category">{program.category}</span>
                  <h2 className="program-name">{program.name}</h2>
                  <p className="program-tagline">{program.tagline}</p>
                  <p className="program-desc">{program.description}</p>
                </div>

                {/* Program Stats Strip */}
                <div className="program-stats-row">
                  <div className="stat-item">
                    <span className="stat-num">{program.stats.schools}</span>
                    <span className="stat-label">Schools</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-num">{program.stats.students}</span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-num">{program.stats.activities}</span>
                    <span className="stat-label">Activities</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="program-features-list">
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <CheckCircle2 size={16} className="feature-icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className={`select-program-btn ${isSelected ? 'active-selected' : 'primary'}`}
                onClick={() => handleSelectProgram(program)}
              >
                <span>{isSelected ? 'Selected (Continue to Schools)' : 'Select Program'}</span>
                <ChevronRight size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgramSelect;
