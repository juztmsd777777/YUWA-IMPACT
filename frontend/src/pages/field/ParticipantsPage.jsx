import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Users,
  Search,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  X
} from 'lucide-react';
import { useFieldApp } from '../../context/FieldAppContext';
import { participantService } from '../../services/participantService';
import '../../styles/Participants.css';

export const ParticipantsPage = () => {
  const navigate = useNavigate();
  const {
    schools,
    selectedSchool,
    setSelectedSchool,
    participants,
    addParticipant
  } = useFieldApp();

  // Form State
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('Class 8');
  const [age, setAge] = useState('14');
  const [gender, setGender] = useState('Male');
  const [schoolId, setSchoolId] = useState(selectedSchool?.id || schools[0]?.id || '');
  const [contact, setContact] = useState('');
  const [score, setScore] = useState('85');
  const [notes, setNotes] = useState('');

  // UI Feedback
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered Roster
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const query = searchTerm.toLowerCase();
      const pName = p.fullName || p.name || '';
      const pClass = p.className || p.gradeOrClass || '';
      const pSchool = p.schoolName || (typeof p.schoolId === 'object' ? (p.schoolId?.schoolName || p.schoolId?.name) : '') || '';
      return (
        pName.toLowerCase().includes(query) ||
        pClass.toLowerCase().includes(query) ||
        pSchool.toLowerCase().includes(query)
      );
    });
  }, [participants, searchTerm]);

  const handleClear = () => {
    setFullName('');
    setAge('14');
    setClassName('Class 8');
    setGender('Male');
    setContact('');
    setScore('80');
    setNotes('');
    setFormError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setFormError('Full Name is required.');
      return;
    }

    const currentSchool = schools.find(s => (s._id || s.id) === schoolId) || selectedSchool;

    const participantData = {
      fullName: fullName.trim(),
      name: fullName.trim(),
      className,
      gradeOrClass: className,
      age: parseInt(age, 10) || 14,
      gender,
      schoolId: currentSchool?._id || currentSchool?.id || schoolId,
      schoolName: currentSchool?.schoolName || currentSchool?.name || 'Selected School',
      contact: contact.trim(),
      score: parseInt(score, 10) || 0,
      notes: notes.trim()
    };

    // Call service abstraction and update context state
    const added = await addParticipant(participantData);

    setSuccessMessage(`Participant "${added?.fullName || fullName}" saved successfully to database!`);
    setFormError('');

    // Clear form name for fast subsequent entries
    setFullName('');
    setContact('');
    setNotes('');
  };


  return (
    <div className="participants-page-container">
      {/* 1. Header Section */}
      <div className="participants-header-section">
        <div className="participants-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-back-nav"
              onClick={() => navigate('/schools')}
              title="Return to School Selection"
            >
              ← Back to Schools
            </button>
          </div>
          <h1 className="participants-heading" style={{ marginTop: '8px' }}>Add Participant</h1>
          <p className="participants-subheading">
            Enter student details for youth climate activities & evaluation
          </p>
        </div>

        <button
          type="button"
          className="proceed-step-btn"
          onClick={() => navigate('/activities')}
          title="Continue to Activity Creation"
        >
          <span>Next: Record Activity</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 2. Two-Column Desktop Layout */}
      <div className="participants-grid-layout">
        {/* Left Column: Form Card */}
        <div className="participant-form-card">
          <h2 className="form-card-title">Student Registration Form</h2>

          {successMessage && (
            <div className="participant-success-banner">
              <div className="participant-success-text">
                <CheckCircle2 size={18} />
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage('')}
                aria-label="Dismiss success message"
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
            <div className="field-group">
              <label className="field-label">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                className="field-input"
                placeholder="Enter student full name (e.g. Rahul Sharma)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-field-row">
              <div className="field-group">
                <label className="field-label">
                  Class <span className="required-star">*</span>
                </label>
                <select
                  className="field-select"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                >
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Age</label>
                <input
                  type="number"
                  min="5"
                  max="22"
                  className="field-input"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Gender</label>
              <div className="gender-radio-group">
                <label className="gender-radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={gender === 'Male'}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <span>Male</span>
                </label>
                <label className="gender-radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={gender === 'Female'}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <span>Female</span>
                </label>
                <label className="gender-radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={gender === 'Other'}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <span>Other</span>
                </label>
              </div>
            </div>

            <div className="form-field-row">
              <div className="field-group">
                <label className="field-label">
                  School <span className="required-star">*</span>
                </label>
                <select
                  className="field-select"
                  value={schoolId}
                  onChange={(e) => {
                    setSchoolId(e.target.value);
                    const found = schools.find(s => s.id === e.target.value);
                    if (found) setSelectedSchool(found);
                  }}
                >
                  {schools.map((sch) => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name} ({sch.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Score (If known)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="field-input"
                  placeholder="e.g. 85"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Contact Number (Optional)</label>
              <input
                type="tel"
                className="field-input"
                placeholder="+91 (Parent/Guardian phone number)"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Additional Information (Optional)</label>
              <textarea
                className="field-textarea"
                placeholder="Club membership, Eco-captain role, special remarks..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
                <UserPlus size={18} />
                <span>Save Participant</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Participants Roster Card */}
        <div className="roster-card">
          <div className="roster-header-row">
            <h2 className="roster-title">Participants Roster</h2>
            <span className="roster-count-badge">
              {participants.length} registered
            </span>
          </div>

          <div className="roster-search-box">
            <Search size={16} className="roster-search-icon" />
            <input
              type="text"
              className="roster-search-input"
              placeholder="Search participant by name or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="roster-list">
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((p) => {
                const pName = p.fullName || p.name || 'Student';
                const pClass = p.className || p.gradeOrClass || 'Class 8';
                const pSchool = p.schoolName || (typeof p.schoolId === 'object' ? (p.schoolId?.schoolName || p.schoolId?.name) : '') || '';
                const pKey = p._id || p.id || Math.random();
                const initials = pName
                  .split(' ')
                  .map((n) => n[0])
                  .filter(Boolean)
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'ST';

                return (
                  <div key={pKey} className="roster-item">
                    <div className="roster-item-left">
                      <div className="roster-avatar">{initials}</div>
                      <div className="roster-info">
                        <span className="roster-name">{pName}</span>
                        <span className="roster-meta">
                          {pClass} • {p.age || 14} yrs • {p.gender || 'Student'}
                        </span>
                        {pSchool && <span className="roster-school-name">{pSchool}</span>}
                      </div>
                    </div>


                    <div className="roster-item-right">
                      {p.score > 0 && (
                        <span className="roster-score-pill">
                          {p.score} pts
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-text-muted)' }}>
                <p>No participants found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPage;
