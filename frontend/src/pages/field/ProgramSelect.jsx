import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, GraduationCap, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { useFieldApp } from '../../context/FieldAppContext';
import '../../styles/Programs.css';

export const ProgramSelect = () => {
  const navigate = useNavigate();
  const { programs, selectedProgram, setSelectedProgram } = useFieldApp();

  const displayPrograms = programs && programs.length > 0 ? programs : [
    {
      _id: 'eco-default',
      name: 'Ecolympics',
      description: 'Youth climate challenge & competitive environmental waste audit olympiad for secondary schools',
      category: 'Competition & Sports',
      tagline: 'Environmental competitions for schools'
    },
    {
      _id: 'gg-default',
      name: 'Green Gurukul',
      description: 'Year-round experiential climate curriculum, composting labs, and campus biodiversity stewardship',
      category: 'Experiential Curriculum',
      tagline: 'Year-round climate education & composting'
    }
  ];

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
          <p className="programs-subheading">Choose a youth climate program to record field activities (Live Database)</p>
        </div>

        {selectedProgram && (
          <div className="current-selection-badge">
            <span>Active: <strong>{selectedProgram.name}</strong></span>
          </div>
        )}
      </div>

      {/* Program Cards Grid */}
      <div className="programs-cards-grid">
        {displayPrograms.map((program, index) => {
          const progId = program._id || program.id || `prog-${index}`;
          const isSelected = (selectedProgram?._id && selectedProgram._id === progId) || selectedProgram?.name === program.name;
          const progName = program.name || 'YUWA Program';
          const isEcolympics = progName.toLowerCase().includes('ecolympics');

          const category = program.category || (isEcolympics ? 'Competition & Sports' : 'Experiential Curriculum');
          const tagline = program.tagline || (isEcolympics ? 'Environmental waste competitions for secondary schools' : 'Experiential climate curriculum & biodiversity labs');
          const description = program.description || (isEcolympics ? 'Youth climate challenge & competitive environmental waste audit olympiad' : 'Year-round experiential climate curriculum, composting labs, and campus stewardship');

          const statsSchools = program.stats?.schools ?? (isEcolympics ? '4' : '2');
          const statsStudents = program.stats?.students ?? (isEcolympics ? '420+' : '280+');
          const statsActivities = program.stats?.activities ?? (isEcolympics ? '18+' : '12+');

          const features = Array.isArray(program.features) && program.features.length > 0
            ? program.features
            : (isEcolympics
                ? ['Inter-school waste seg audits', 'Live student climate leaderboard', 'Plastic-free campus challenges']
                : ['Hands-on composting workshops', 'Eco-club leadership curriculum', 'Campus green audit & stewardship']);

          return (
            <div
              key={progId}
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
                  <span className="program-category">{category}</span>
                  <h2 className="program-name">{progName}</h2>
                  <p className="program-tagline">{tagline}</p>
                  <p className="program-desc">{description}</p>
                </div>

                {/* Program Stats Strip */}
                <div className="program-stats-row">
                  <div className="stat-item">
                    <span className="stat-num">{statsSchools}</span>
                    <span className="stat-label">Schools</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-num">{statsStudents}</span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-num">{statsActivities}</span>
                    <span className="stat-label">Activities</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="program-features-list">
                  {features.map((feature, idx) => (
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
