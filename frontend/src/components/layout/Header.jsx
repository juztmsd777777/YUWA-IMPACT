import React from 'react';
import { Search, Menu, X, Sprout, Wifi, WifiOff } from 'lucide-react';
import { useFieldApp } from '../../context/FieldAppContext';
import { StatusBadge } from '../common/StatusBadge';

export const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const { isOnline, manualOfflineSimulation, setManualOfflineSimulation, fieldWorker } = useFieldApp();

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="header-brand">
          <div className="brand-logo-icon">
            <Sprout size={24} color="#FFFFFF" strokeWidth={2.2} />
          </div>
          <div className="brand-titles">
            <div className="brand-name">
              <span className="brand-accent">YUWA</span> Portal
            </div>
            <div className="brand-org">Waste Warriors Society</div>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search school, participant, or activity..."
            className="search-input"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="header-right">
        {/* Interactive connection badge with quick toggle for testing offline features */}
        <div
          className="connection-status-wrapper"
          title="Click to toggle offline mode simulation"
          onClick={() => setManualOfflineSimulation(prev => !prev)}
        >
          <StatusBadge
            status={isOnline ? 'online' : 'offline'}
            text={isOnline ? 'Online' : 'Offline'}
          />
          <button
            type="button"
            className="sim-toggle-pill"
            aria-label="Toggle network simulation"
          >
            {manualOfflineSimulation ? 'End Sim' : 'Sim Offline'}
          </button>
        </div>

        {/* Field Worker Profile chip */}
        <div className="user-profile-chip">
          <div className="user-avatar" title={fieldWorker.name}>
            {fieldWorker.avatar}
          </div>
          <div className="user-info-text">
            <span className="user-name">{fieldWorker.name}</span>
            <span className="user-role">{fieldWorker.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
