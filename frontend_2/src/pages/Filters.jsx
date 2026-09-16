import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ActivityTable from '../components/ActivityTable';
import { ALL_ACTIVITIES, FILTER_OPTIONS } from '../data/mockData';
import { ArrowLeft, RotateCcw, Filter, Check } from 'lucide-react';

export default function Filters() {
  const [selectedProgram, setSelectedProgram] = useState('All Programs');
  const [selectedSchool, setSelectedSchool] = useState('All Schools');
  const [dateRange, setDateRange] = useState('01/04/2025 - 30/04/2025');
  const [selectedActivityType, setSelectedActivityType] = useState('All Activity Types');

  const [filteredActivities, setFilteredActivities] = useState(ALL_ACTIVITIES);
  const [hasApplied, setHasApplied] = useState(false);

  const handleApply = (e) => {
    if (e) e.preventDefault();
    
    let results = ALL_ACTIVITIES;

    if (selectedProgram !== 'All Programs') {
      results = results.filter(a => a.program.toLowerCase() === selectedProgram.toLowerCase());
    }

    if (selectedSchool !== 'All Schools') {
      results = results.filter(a => a.school.toLowerCase().includes(selectedSchool.toLowerCase()));
    }

    if (selectedActivityType !== 'All Activity Types') {
      results = results.filter(a => a.activityType.toLowerCase() === selectedActivityType.toLowerCase());
    }

    setFilteredActivities(results);
    setHasApplied(true);
  };

  const handleClear = () => {
    setSelectedProgram('All Programs');
    setSelectedSchool('All Schools');
    setDateRange('01/04/2025 - 30/04/2025');
    setSelectedActivityType('All Activity Types');
    setFilteredActivities(ALL_ACTIVITIES);
    setHasApplied(false);
  };

  return (
    <div className="main-content">
      {/* Back Arrow */}
      <Link to="/admin/dashboard" className="back-link-btn">
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      {/* Page Heading */}
      <div className="page-top-bar" style={{ marginBottom: '20px' }}>
        <div className="page-title-group">
          <h2>Filters</h2>
          <p>Filter activities, assessments, and school performance records</p>
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
            >
              {FILTER_OPTIONS.programs.map((prog) => (
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
            >
              {FILTER_OPTIONS.schools.map((sch) => (
                <option key={sch} value={sch}>{sch}</option>
              ))}
            </select>
          </div>

          {/* Date Range Input */}
          <div className="filter-form-group">
            <label className="filter-label">Date Range</label>
            <input 
              type="text"
              className="filter-input"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              placeholder="DD/MM/YYYY - DD/MM/YYYY"
            />
          </div>

          {/* Activity Type Select */}
          <div className="filter-form-group">
            <label className="filter-label">Activity Type</label>
            <select 
              className="filter-select"
              value={selectedActivityType}
              onChange={(e) => setSelectedActivityType(e.target.value)}
            >
              {FILTER_OPTIONS.activityTypes.map((type) => (
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
            >
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>

            <button 
              type="submit" 
              className="btn btn-primary"
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
            Matching Records ({filteredActivities.length})
          </h3>
          {hasApplied && (
            <span className="badge badge-success">
              <Check size={12} />
              Filters Applied
            </span>
          )}
        </div>

        <ActivityTable 
          activities={filteredActivities} 
          title="Filtered Activities" 
          showSchoolColumn={true}
        />
      </div>
    </div>
  );
}
