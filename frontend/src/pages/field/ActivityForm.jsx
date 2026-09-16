import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  AlertCircle,
  Sprout,
  Camera,
  X
} from 'lucide-react';
import { useFieldApp } from '../../context/FieldAppContext';
import { initialPrograms } from '../../data/mockData';
import { activityService } from '../../services/activityService';
import '../../styles/Activities.css';

export const ActivityForm = () => {
  const navigate = useNavigate();
  const {
    schools,
    selectedSchool,
    setSelectedSchool,
    selectedProgram,
    setSelectedProgram,
    addActivity,
    photos
  } = useFieldApp();

  // Form state prefilled from workflow context
  const [programId, setProgramId] = useState(
    selectedProgram?.id || initialPrograms[0].id
  );
  const [schoolId, setSchoolId] = useState(
    selectedSchool?.id || schools[0]?.id || ''
  );
  const [activityType, setActivityType] = useState('Tree Plantation');
  const [activityName, setActivityName] = useState('Tree Plantation Drive');
  const [date, setDate] = useState('2025-09-16');
  const [participantsCount, setParticipantsCount] = useState('25');
  const [averageScore, setAverageScore] = useState('82');
  const [description, setDescription] = useState(
    'Students participated enthusiastically in native tree planting and composting setup on school grounds.'
  );

  // UI state
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleClear = () => {
    setActivityName('');
    setParticipantsCount('');
    setAverageScore('');
    setDescription('');
    setFormError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activityName.trim()) {
      setFormError('Activity Name is required.');
      return;
    }

    const matchedSchool = schools.find((s) => s.id === schoolId) || selectedSchool;
    const matchedProgram = initialPrograms.find((p) => p.id === programId) || selectedProgram;

    const activityData = {
      programId,
      programName: matchedProgram?.name || 'Climate Program',
      schoolId,
      schoolName: matchedSchool ? `${matchedSchool.name}, ${matchedSchool.location}` : 'Local School',
      activityType,
      activityName: activityName.trim(),
      date,
      participantsCount: parseInt(participantsCount, 10) || 0,
      averageScore: parseInt(averageScore, 10) || 0,
      description: description.trim()
    };

    // Call service abstraction and update context state
    await activityService.createActivity(activityData);
    const added = addActivity(activityData);

    setSuccessMessage(`Activity "${added.activityName}" saved successfully!`);
    setFormError('');
  };

  return (
    <div className="activities-page-container">
      {/* 1. Header Section */}
      <div className="activities-header-section">
        <div className="activities-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-back-nav"
              onClick={() => navigate('/participants')}
              title="Return to Participant Entry"
            >
              ← Back to Participants
            </button>
          </div>
          <h1 className="activities-heading" style={{ marginTop: '8px' }}>Record Activity</h1>
          <p className="activities-subheading">
            Enter field activity details, school, and participant metrics
          </p>
        </div>

        <button
          type="button"
          className="proceed-step-btn"
          onClick={() => navigate('/photos')}
          title="Continue to Photo Upload"
        >
          <span>Next: Add Photos</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 2. Two-Column Desktop Grid */}
      <div className="activities-grid-layout">
        {/* Left: Activity Creation Form */}
        <div className="activity-form-card">
          <div className="form-card-header">
            <h2 className="form-title">Activity Details</h2>
            {photos.length > 0 && (
              <span className="current-selection-badge" style={{ fontSize: '0.75rem' }}>
                <Camera size={14} />
                <span>{photos.length} photos staged</span>
              </span>
            )}
          </div>

          {successMessage && (
            <div className="participant-success-banner">
              <div className="participant-success-text">
                <CheckCircle2 size={18} />
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage('')}
                aria-label="Dismiss message"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {formError && (
            <div className="participant-success-banner" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#DC2626' }}>
              <div className="participant-success-text">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="entry-form">
            {/* Program Selection */}
            <div className="field-group">
              <label className="field-label">
                Program <span className="required-star">*</span>
              </label>
              <div className="program-radio-toggle-group">
                {initialPrograms.map((prog) => {
                  const isActive = programId === prog.id;
                  return (
                    <label
                      key={prog.id}
                      className={`program-radio-card ${isActive ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="activityProgram"
                        value={prog.id}
                        checked={isActive}
                        onChange={() => {
                          setProgramId(prog.id);
                          setSelectedProgram(prog);
                        }}
                      />
                      <span className="program-card-text">{prog.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* School Dropdown */}
            <div className="field-group">
              <label className="field-label">
                School <span className="required-star">*</span>
              </label>
              <select
                className="field-select"
                value={schoolId}
                onChange={(e) => {
                  setSchoolId(e.target.value);
                  const found = schools.find((s) => s.id === e.target.value);
                  if (found) setSelectedSchool(found);
                }}
              >
                {schools.map((sch) => (
                  <option key={sch.id} value={sch.id}>
                    {sch.name} — {sch.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Activity Type & Name */}
            <div className="form-field-row">
              <div className="field-group">
                <label className="field-label">
                  Activity Type <span className="required-star">*</span>
                </label>
                <select
                  className="field-select"
                  value={activityType}
                  onChange={(e) => {
                    setActivityType(e.target.value);
                    if (!activityName || activityName.includes('Drive') || activityName.includes('Session') || activityName.includes('Quiz')) {
                      setActivityName(`${e.target.value} Drive`);
                    }
                  }}
                >
                  <option value="Tree Plantation">Tree Plantation</option>
                  <option value="Green Quiz">Green Quiz</option>
                  <option value="Clean Campus Drive">Clean Campus Drive</option>
                  <option value="Awareness Session">Awareness Session</option>
                  <option value="Poster Making">Poster Making</option>
                  <option value="Nature Walk">Nature Walk</option>
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">
                  Activity Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="e.g. Tree Plantation Drive"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Date & Participants Count */}
            <div className="form-field-row">
              <div className="field-group">
                <label className="field-label">
                  Date <span className="required-star">*</span>
                </label>
                <input
                  type="date"
                  className="field-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">
                  Number of Participants <span className="required-star">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  className="field-input"
                  placeholder="e.g. 25"
                  value={participantsCount}
                  onChange={(e) => setParticipantsCount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Average Score */}
            <div className="field-group">
              <label className="field-label">Average Score / Quiz Result (Optional)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="field-input"
                placeholder="e.g. 82"
                value={averageScore}
                onChange={(e) => setAverageScore(e.target.value)}
              />
            </div>

            {/* Description / Notes */}
            <div className="field-group">
              <label className="field-label">Description / Field Notes</label>
              <textarea
                className="field-textarea"
                placeholder="Students were very enthusiastic and participated actively..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-buttons-row">
              <button
                type="button"
                className="btn-clear"
                onClick={handleClear}
              >
                Clear
              </button>
              <button type="submit" className="btn-save-participant">
                <CalendarCheck size={18} />
                <span>Save Activity</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Activity Guidelines & Quote Column */}
        <div className="guidelines-side-column">
          <div className="guidelines-card">
            <h3 className="guidelines-title">
              <ClipboardList size={18} color="var(--color-primary)" />
              <span>Activity Guidelines</span>
            </h3>

            <div className="guidelines-list">
              <div className="guideline-item">
                <CheckCircle2 size={16} className="guideline-icon" />
                <div className="guideline-text">
                  <span className="guideline-item-title">Fill all mandatory fields</span>
                  <span className="guideline-item-desc">Program, School, Activity Type, Date and Participant count.</span>
                </div>
              </div>

              <div className="guideline-item">
                <CheckCircle2 size={16} className="guideline-icon" />
                <div className="guideline-text">
                  <span className="guideline-item-title">Add photos as evidence</span>
                  <span className="guideline-item-desc">Capture minimum 2 clear field photos on the next step.</span>
                </div>
              </div>

              <div className="guideline-item">
                <CheckCircle2 size={16} className="guideline-icon" />
                <div className="guideline-text">
                  <span className="guideline-item-title">Ensure correct participant count</span>
                  <span className="guideline-item-desc">Match the number of students who signed the field attendance.</span>
                </div>
              </div>

              <div className="guideline-item">
                <CheckCircle2 size={16} className="guideline-icon" />
                <div className="guideline-text">
                  <span className="guideline-item-title">Save and sync when online</span>
                  <span className="guideline-item-desc">Data saves automatically to device if connection is lost.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="activity-quote-card">
            <Sprout size={76} className="activity-quote-decor" />
            <div className="activity-quote-text">
              "Every activity creates a cleaner, brighter tomorrow."
            </div>
            <div className="activity-quote-author">
              YUWA Impact Portal • Waste Warriors Society
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityForm;
