import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard';
import ImpactEvaluation from './pages/ImpactEvaluation';
import SchoolDetails from './pages/SchoolDetails';
import ActivityDetails from './pages/ActivityDetails';
import Filters from './pages/Filters';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Unified Reusable Dark Green Sidebar */}
        <Sidebar />

        {/* Main Routed Content Area */}
        <main className="main-wrapper">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Page 9: Admin Dashboard */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Page 10: Impact / Evaluation Dashboard */}
            <Route path="/impact-evaluation" element={<ImpactEvaluation />} />
            
            {/* Page 11: School Details */}
            <Route path="/schools/:schoolId" element={<SchoolDetails />} />
            
            {/* Page 12: Activity Details */}
            <Route path="/activities/:activityId" element={<ActivityDetails />} />
            
            {/* Page 13: Filters */}
            <Route path="/filters" element={<Filters />} />

            {/* Fallback to Admin Dashboard */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
