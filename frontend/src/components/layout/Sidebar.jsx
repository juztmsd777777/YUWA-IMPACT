import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Compass,
  Building2,
  Users,
  CalendarCheck,
  Camera,
  Database,
  RefreshCw,
  HelpCircle,
  MapPin
} from 'lucide-react';
import { useFieldApp } from '../../context/FieldAppContext';

export const Sidebar = ({ isOpen, onCloseMobile }) => {
  const { offlineRecords, isSyncing, fieldWorker } = useFieldApp();

  const pendingOfflineCount = offlineRecords.filter(r => r.status === 'Pending Sync').length;

  const navItems = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/programs', label: 'Programs', icon: Compass },
    { to: '/schools', label: 'Schools', icon: Building2 },
    { to: '/participants', label: 'Participants', icon: Users },
    { to: '/activities', label: 'Activities', icon: CalendarCheck },
    { to: '/photos', label: 'Photos', icon: Camera },
    {
      to: '/offline',
      label: 'Offline Data',
      icon: Database,
      badge: pendingOfflineCount > 0 ? pendingOfflineCount : null,
      badgeType: 'amber'
    },
    {
      to: '/sync',
      label: 'Sync',
      icon: RefreshCw,
      badge: pendingOfflineCount > 0 ? 'Pending' : null,
      badgeType: 'pending'
    }
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}

      <aside className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-nav-section">
          <div className="sidebar-section-title">FIELD DATA WORKFLOW</div>
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'nav-item-active' : ''}`
                  }
                  onClick={onCloseMobile}
                >
                  <Icon
                    size={19}
                    className={`nav-icon ${item.to === '/sync' && isSyncing ? 'animate-spin' : ''}`}
                  />
                  <span className="nav-label">{item.label}</span>
                  {item.badge && (
                    <span className={`nav-badge ${item.badgeType || ''}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-help-link">
            <HelpCircle size={18} />
            <span>Help & Support</span>
          </div>

          <div className="sidebar-fieldworker-card">
            <div className="fw-avatar">{fieldWorker.avatar}</div>
            <div className="fw-details">
              <div className="fw-name">{fieldWorker.name}</div>
              <div className="fw-location">
                <MapPin size={12} />
                <span>{fieldWorker.location}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
