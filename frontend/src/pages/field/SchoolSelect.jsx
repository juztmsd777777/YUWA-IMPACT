import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Building2,
  MapPin,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  Info
} from 'lucide-react';
import { useFieldApp } from '../../context/FieldAppContext';
import { schoolService } from '../../services/schoolService';
import '../../styles/Schools.css';

export const SchoolSelect = () => {
  const navigate = useNavigate();
  const { schools, setSchools, selectedSchool, setSelectedSchool } = useFieldApp();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('nearby'); // 'nearby' or 'all'
  const [districtFilter, setDistrictFilter] = useState('all');
  const [mandalFilter, setMandalFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Add School Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolLocation, setNewSchoolLocation] = useState('');
  const [newSchoolDistrict, setNewSchoolDistrict] = useState('Warangal');
  const [newSchoolMandal, setNewSchoolMandal] = useState('Warangal Urban');
  const [newSchoolCode, setNewSchoolCode] = useState('');
  const [modalError, setModalError] = useState('');

  // Filtered schools
  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const matchesSearch =
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.code && school.code.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDistrict =
        districtFilter === 'all' || school.district === districtFilter;

      const matchesMandal =
        mandalFilter === 'all' || school.mandal === mandalFilter;

      // Nearby filter prioritizes schools under 8km
      if (activeTab === 'nearby') {
        const distanceNum = parseFloat(school.distance || '0');
        return matchesSearch && matchesDistrict && matchesMandal && distanceNum <= 8.5;
      }

      return matchesSearch && matchesDistrict && matchesMandal;
    });
  }, [schools, searchTerm, activeTab, districtFilter, mandalFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage) || 1;
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectSchool = (school) => {
    setSelectedSchool(school);
    // Proceed to Step 4: Participant Entry in the field worker flow
    navigate('/participants');
  };

  const handleCreateSchoolSubmit = async (e) => {
    e.preventDefault();
    if (!newSchoolName.trim() || !newSchoolLocation.trim()) {
      setModalError('Please enter both School Name and Location.');
      return;
    }

    const payload = {
      name: newSchoolName.trim(),
      location: newSchoolLocation.trim(),
      district: newSchoolDistrict,
      mandal: newSchoolMandal,
      code: newSchoolCode.trim() || `SCH-${Date.now().toString().slice(-4)}`,
      distance: '0.8 km (New)',
      participantsCount: 0,
      totalActivities: 0,
      type: 'New Registered School'
    };

    const created = await schoolService.createSchool(payload);
    setSchools(prev => [created, ...prev]);
    setSelectedSchool(created);

    // Reset & close
    setNewSchoolName('');
    setNewSchoolLocation('');
    setNewSchoolCode('');
    setModalError('');
    setIsModalOpen(false);
  };

  return (
    <div className="schools-page-container">
      {/* 1. Header Section */}
      <div className="schools-header-section">
        <div className="schools-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-back-nav"
              onClick={() => navigate('/programs')}
              title="Return to Program Selection"
            >
              ← Back to Programs
            </button>
          </div>
          <h1 className="schools-heading" style={{ marginTop: '8px' }}>Select School</h1>
          <p className="schools-subheading">
            Search and select a school from the list or add a new school
          </p>
        </div>

        <button
          type="button"
          className="add-school-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>+ Add School</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="schools-filter-card">
        <div className="school-search-box">
          <Search size={18} className="school-search-icon" />
          <input
            type="text"
            placeholder="Search by school name, location or code..."
            className="school-search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="schools-filter-row">
          <div className="tabs-group">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'nearby' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('nearby');
                setCurrentPage(1);
              }}
            >
              Nearby Schools
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('all');
                setCurrentPage(1);
              }}
            >
              All Schools ({schools.length})
            </button>
          </div>

          <div className="dropdown-filters">
            <select
              className="filter-select"
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by district"
            >
              <option value="all">All Districts</option>
              <option value="Warangal">Warangal</option>
              <option value="Hanamkonda">Hanamkonda</option>
              <option value="Jayashankar Bhupalpally">Jayashankar Bhupalpally</option>
              <option value="Jangaon">Jangaon</option>
            </select>

            <select
              className="filter-select"
              value={mandalFilter}
              onChange={(e) => {
                setMandalFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by mandal"
            >
              <option value="all">All Mandals</option>
              <option value="Warangal Urban">Warangal Urban</option>
              <option value="Narsampet">Narsampet</option>
              <option value="Regonda">Regonda</option>
              <option value="Deveruppula">Deveruppula</option>
              <option value="Hanamkonda">Hanamkonda</option>
              <option value="Kazipet">Kazipet</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Schools List */}
      <div className="schools-list">
        {paginatedSchools.length > 0 ? (
          paginatedSchools.map((school) => {
            const isSelected = selectedSchool?.id === school.id;
            return (
              <div
                key={school.id}
                className={`school-list-item ${isSelected ? 'selected' : ''}`}
              >
                <div className="school-item-left">
                  <div className="school-item-icon">
                    <Building2 size={24} />
                  </div>

                  <div className="school-item-info">
                    <div className="school-title-row">
                      <h2 className="school-name">{school.name}</h2>
                      {school.code && (
                        <span className="school-code-badge">{school.code}</span>
                      )}
                    </div>

                    <div className="school-location-row">
                      <span className="school-loc-text">
                        <MapPin size={13} />
                        {school.location}
                      </span>
                      <span className="school-metric-pill">
                        <Users size={12} />
                        {school.participantsCount} participants
                      </span>
                    </div>
                  </div>
                </div>

                <div className="school-item-right">
                  <span className="school-distance">{school.distance}</span>

                  <button
                    type="button"
                    className={`school-select-btn ${isSelected ? 'selected' : 'primary'}`}
                    onClick={() => handleSelectSchool(school)}
                  >
                    {isSelected ? (
                      <>
                        <Check size={16} />
                        <span>Selected</span>
                      </>
                    ) : (
                      <span>Select</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-schools-state">
            <Building2 size={40} />
            <p>No schools found matching your search or filters.</p>
            <button
              type="button"
              className="tab-btn"
              onClick={() => {
                setSearchTerm('');
                setDistrictFilter('all');
                setMandalFilter('all');
                setActiveTab('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Pagination */}
      {totalPages > 1 && (
        <div className="schools-pagination-row">
          <button
            type="button"
            className="page-nav-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              className={`page-nav-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            className="page-nav-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* 5. Add School Modal (Local UI abstraction, handoff ready for Member 3) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New School</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSchoolSubmit} className="modal-form">
              {modalError && (
                <div className="modal-notice-box" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', borderColor: '#FECACA' }}>
                  <AlertCircle size={16} />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">School Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sunrise Model High School"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location / Address *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kazipet Railway Colony"
                  value={newSchoolLocation}
                  onChange={(e) => setNewSchoolLocation(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <select
                    className="form-input"
                    value={newSchoolDistrict}
                    onChange={(e) => setNewSchoolDistrict(e.target.value)}
                  >
                    <option value="Warangal">Warangal</option>
                    <option value="Hanamkonda">Hanamkonda</option>
                    <option value="Jayashankar Bhupalpally">Jayashankar Bhupalpally</option>
                    <option value="Jangaon">Jangaon</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Mandal</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Mandal"
                    value={newSchoolMandal}
                    onChange={(e) => setNewSchoolMandal(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">School Code (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. SMHS-KZP-07"
                  value={newSchoolCode}
                  onChange={(e) => setNewSchoolCode(e.target.value)}
                />
              </div>

              <div className="modal-notice-box">
                <Info size={16} />
                <span>
                  Backend API handoff: School is saved to your local field session and queued for backend sync.
                </span>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save & Select School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolSelect;
