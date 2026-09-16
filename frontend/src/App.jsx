import { NavLink, Route, Routes, useLocation, Navigate } from "react-router-dom";
import StatusChip from "./components/StatusChip.jsx";
import Sidebar from "./components/Sidebar.jsx";
import FieldHome from "./pages/field/FieldHome.jsx";
import ProgramSelect from "./pages/field/ProgramSelect.jsx";
import SchoolSelect from "./pages/field/SchoolSelect.jsx";
import ActivityForm from "./pages/field/ActivityForm.jsx";
import ParticipantsPage from "./pages/field/ParticipantsPage.jsx";
import PhotoEvidence from "./pages/field/PhotoEvidence.jsx";
import OfflineData from "./pages/field/OfflineData.jsx";
import SyncStatus from "./pages/field/SyncStatus.jsx";
import DashboardHome from "./pages/dashboard/DashboardHome.jsx";
import ActivityDetail from "./pages/dashboard/ActivityDetail.jsx";
import EvaluationPage from "./pages/dashboard/EvaluationPage.jsx";
import SchoolDetail from "./pages/dashboard/SchoolDetail.jsx";
import FiltersPage from "./pages/dashboard/FiltersPage.jsx";
import { FieldAppProvider } from "./context/FieldAppContext.jsx";

export default function App() {
  const location = useLocation();

  // Check if current route is part of the Admin Dashboard
  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/impact-evaluation") ||
    location.pathname.startsWith("/filters") ||
    (location.pathname.startsWith("/schools/") && location.pathname !== "/schools") ||
    (location.pathname.startsWith("/activities/") && location.pathname !== "/activities/new");

  if (isDashboardRoute) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-wrapper">
          <Routes>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/admin/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/evaluation" element={<EvaluationPage />} />
            <Route path="/impact-evaluation" element={<EvaluationPage />} />
            <Route path="/dashboard/schools/:schoolId" element={<SchoolDetail />} />
            <Route path="/schools/:schoolId" element={<SchoolDetail />} />
            <Route path="/dashboard/activities/:activityId" element={<ActivityDetail />} />
            <Route path="/activities/:activityId" element={<ActivityDetail />} />
            <Route path="/dashboard/filters" element={<FiltersPage />} />
            <Route path="/filters" element={<FiltersPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    );
  }

  // Field Worker App Layout
  return (
    <FieldAppProvider>
      <div className="app-shell">
        <header className="top-nav">
          <NavLink to="/" className="brand">
            YUWA Field App
          </NavLink>
          <nav className="nav-links">
            <NavLink to="/">Field</NavLink>
            <NavLink to="/programs">Programs</NavLink>
            <NavLink to="/schools">Schools</NavLink>
            <NavLink to="/participants">Participants</NavLink>
            <NavLink to="/activities">Activities</NavLink>
            <NavLink to="/photos">Photos</NavLink>
            <NavLink to="/offline">Offline</NavLink>
            <NavLink to="/sync">Sync</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </nav>
          <StatusChip />
        </header>
        <Routes>
          <Route path="/" element={<FieldHome />} />
          <Route path="/programs" element={<ProgramSelect />} />
          <Route path="/schools" element={<SchoolSelect />} />
          <Route path="/activities" element={<ActivityForm />} />
          <Route path="/activities/new" element={<ActivityForm />} />
          <Route path="/participants" element={<ParticipantsPage />} />
          <Route path="/photos" element={<PhotoEvidence />} />
          <Route path="/offline" element={<OfflineData />} />
          <Route path="/sync" element={<SyncStatus />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/activities/:id" element={<ActivityDetail />} />
          <Route path="/dashboard/evaluation" element={<EvaluationPage />} />
        </Routes>
      </div>
    </FieldAppProvider>
  );
}

