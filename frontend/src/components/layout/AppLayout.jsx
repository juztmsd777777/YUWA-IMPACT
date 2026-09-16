import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useFieldApp } from '../../context/FieldAppContext';
import { WifiOff } from 'lucide-react';

export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isOnline, selectedProgram, selectedSchool, offlineRecords } = useFieldApp();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebarMobile = () => {
    setIsSidebarOpen(false);
  };

  const pendingCount = offlineRecords.filter(r => r.status === 'Pending Sync').length;

  return (
    <div className="app-shell">
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="app-body">
        <Sidebar isOpen={isSidebarOpen} onCloseMobile={closeSidebarMobile} />

        <div className="app-main-viewport">
          {/* Offline Awareness Banner */}
          {!isOnline && (
            <div className="offline-alert-banner">
              <div className="offline-alert-content">
                <WifiOff size={18} className="offline-alert-icon" />
                <div>
                  <strong>Working in Offline Mode:</strong> Internet is currently unavailable. Your field entries will be safely preserved in local storage.
                </div>
              </div>
              <Link to="/offline" className="offline-alert-link">
                View Queue ({pendingCount} items)
              </Link>
            </div>
          )}

          <main className="main-content-area">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
