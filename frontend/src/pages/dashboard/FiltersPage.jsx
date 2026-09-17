import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ActivityTable from '../../components/ActivityTable';
import { ArrowLeft, RotateCcw, Filter, Check, Loader2 } from 'lucide-react';

export default function Filters() {
  const [selectedProgram, setSelectedProgram] = useState('All Programs');
  const [selectedSchool, setSelectedSchool] = useState('All Schools');
  const [dateRange, setDateRange] = useState('');
  const [selectedActivityType, setSelectedActivityType] = useState('All Activity Types');

  const [allActivities, setAllActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [programsList, setProgramsList] = useState(['All Programs']);
  const [schoolsList, setSchoolsList] = useState(['All Schools']);
  const [activityTypesList, setActivityTypesList] = useState(['All Activity Types']);

  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [actRes, schoolRes, progRes] = await Promise.all([
          fetch('/api/activities').then(r => r.ok ? r.json() : null),
          fetch('/api/schools').then(r => r.ok ? r.json() : null),
          fetch('/api/programs').then(r => r.ok ? r.json() : null)
        ]);

        const rawActivities = actRes?.data || actRes || [];
        const rawSchools = schoolRes?.data || schoolRes || [];
        const rawPrograms = progRes?.data || progRes || [];

        // Normalize activities for display in ActivityTable
        const normalized = rawActivities.map(a => {
          const schoolName = a.schoolName || 
            (typeof a.schoolId === 'object' ? (a.schoolId?.schoolName || a.schoolId?.name) : '') || 
            'Partner School';
          const actName = a.activityName || a.name || a.title || a.activityType || 'Activity';
          const actType = a.activityType || actName;
          const prog = a.program || a.programName || (typeof a.programId === 'object' ? a.programId?.name : '') || 'Ecolympics';

          return {
            id: a._id || a.id,
            date: a.date ? new Date(a.date).toLocaleDateString('en-GB') : '—',
            rawDate: a.date ? new Date(a.date) : null,
            program: prog,
            activity: actName,
            activityType: actType,
            school: schoolName,
            schoolId: typeof a.schoolId === 'object' ? a.schoolId?._id : (a.schoolId || ''),
            participants: a.participantCount || a.participantsCount || (Array.isArray(a.participants) ? a.participants.length : 0),
            avgScore: a.averageScore ? `${a.averageScore}%` : '85%'
          };
        });

        setAllActivities(normalized);
        setFilteredActivities(normalized);

        // Derive dynamic filter lists from database
        const progs = new Set();
        rawPrograms.forEach(p => { if (p.name || p.title) progs.add(p.name || p.title); });
        normalized.forEach(a => { if (a.program) progs.add(a.program); });
        setProgramsList(['All Programs', ...Array.from(progs)]);

        const schools = new Set();
        rawSchools.forEach(s => { if (s.schoolName || s.name) schools.add(s.schoolName || s.name); });
        normalized.forEach(a => { if (a.school) schools.add(a.school); });
        setSchoolsList(['All Schools', ...Array.from(schools)]);

        const types = new Set();
        normalized.forEach(a => {
          if (a.activityType) types.add(a.activityType);
        });
        setActivityTypesList(['All Activity Types', ...Array.from(types)]);

      } catch (err) {
        console.error('Error fetching filter data from database:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleApply = (e) => {
    if (e) e.preventDefault();

    let results = allActivities;

    if (selectedProgram !== 'All Programs') {
      results = results.filter(a => a.program.toLowerCase() === selectedProgram.toLowerCase());
    }

    if (selectedSchool !== 'All Schools') {
      results = results.filter(a => a.school.toLowerCase().includes(selectedSchool.toLowerCase()));
    }

    if (selectedActivityType !== 'All Activity Types') {
      results = results.filter(a => 
        a.activityType.toLowerCase().includes(selectedActivityType.toLowerCase()) ||
        a.activity.toLowerCase().includes(selectedActivityType.toLowerCase())
      );
    }

    setFilteredActivities(results);
    setHasApplied(true);
  };

  const handleClear = () => {
    setSelectedProgram('All Programs');
    setSelectedSchool('All Schools');
    setDateRange('');
    setSelectedActivityType('All Activity Types');
    setFilteredActivities(allActivities);
    setHasApplied(false);
  };

  return (
    <div className="main-content">
      {/* Back Arrow */}
      <Link to="/dashboard" className="back-link-btn">
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      {/* Page Heading */}
      <div className="page-top-bar" style={{ marginBottom: '20px' }}>
        <div className="page-title-group">
          <h2>Live Database Filters</h2>
          <p>Filter real-time activities, assessments, and school performance records</p>
        </div>
      </div>

      {/* Filter Form Card */}
      <div className="filter-card">
        <form onSubmit={handleApply}>
          {/* Program Select */}
          <div className="filter-form-group">
            <label className="filter-label">Program</label>
            <select 
              className="filter-select"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              disabled={isLoading}
            >
              {programsList.map((prog) => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>
          </div>

          {/* School Select */}
          <div className="filter-form-group">
            <label className="filter-label">School</label>
            <select 
              className="filter-select"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              disabled={isLoading}
            >
              {schoolsList.map((sch) => (
                <option key={sch} value={sch}>{sch}</option>
              ))}
            </select>
          </div>

          {/* Date Range Input */}
          <div className="filter-form-group">
            <label className="filter-label">Search / Date Range</label>
            <input 
              type="text"
              className="filter-input"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              placeholder="e.g. 2025 or April"
              disabled={isLoading}
            />
          </div>

          {/* Activity Type Select */}
          <div className="filter-form-group">
            <label className="filter-label">Activity Type</label>
            <select 
              className="filter-select"
              value={selectedActivityType}
              onChange={(e) => setSelectedActivityType(e.target.value)}
              disabled={isLoading}
            >
              {activityTypesList.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Buttons: Clear and Apply Filters */}
          <div className="filter-actions">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={handleClear}
              disabled={isLoading}
            >
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              <Filter size={14} />
              <span>Apply Filters</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filtered Results Output */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Matching Database Records ({filteredActivities.length})
          </h3>
          {hasApplied && (
            <span className="badge badge-success">
              <Check size={12} />
              Filters Applied
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Loader2 className="animate-spin" size={28} color="var(--primary-green)" />
            <p style={{ color: 'var(--text-secondary)' }}>Loading activities from database...</p>
          </div>
        ) : (
          <ActivityTable 
            activities={filteredActivities} 
            title="Database Activities" 
            showSchoolColumn={true}
          />
        )}
      </div>
    </div>
  );
}
