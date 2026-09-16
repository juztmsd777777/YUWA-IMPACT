import React from 'react';
import TopHeader from '../components/TopHeader';
import StatCard from '../components/StatCard';
import ProgramCard from '../components/ProgramCard';
import ActivityTable from '../components/ActivityTable';
import { 
  OVERVIEW_METRICS, 
  PROGRAMS, 
  ALL_ACTIVITIES 
} from '../data/mockData';
import { School, Users, ClipboardCheck, Camera } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="main-content">
      {/* Page Header */}
      <TopHeader 
        title="Overview" 
        subtitle="Waste Warriors Society environmental education and field performance metrics"
        showDateRange={true}
        showFilterButton={true}
      />

      {/* Summary / Statistic Cards */}
      <div className="stat-grid-4">
        <StatCard
          label="Total schools reached"
          value={OVERVIEW_METRICS.totalSchools.value}
          trend={OVERVIEW_METRICS.totalSchools.trend}
          isPositive={OVERVIEW_METRICS.totalSchools.isPositive}
          icon={School}
        />
        <StatCard
          label="Total students reached"
          value={OVERVIEW_METRICS.totalStudents.value}
          trend={OVERVIEW_METRICS.totalStudents.trend}
          isPositive={OVERVIEW_METRICS.totalStudents.isPositive}
          icon={Users}
        />
        <StatCard
          label="Total activities"
          value={OVERVIEW_METRICS.totalActivities.value}
          trend={OVERVIEW_METRICS.totalActivities.trend}
          isPositive={OVERVIEW_METRICS.totalActivities.isPositive}
          icon={ClipboardCheck}
        />
        <StatCard
          label="Total photos/evidence"
          value={OVERVIEW_METRICS.totalEvidence.value}
          trend={OVERVIEW_METRICS.totalEvidence.trend}
          isPositive={OVERVIEW_METRICS.totalEvidence.isPositive}
          icon={Camera}
        />
      </div>

      {/* Program Summary Cards */}
      <div className="program-cards-grid">
        {PROGRAMS.map((prog) => (
          <ProgramCard key={prog.id} program={prog} />
        ))}
      </div>

      {/* Recent Activities Table */}
      <ActivityTable 
        activities={ALL_ACTIVITIES.slice(0, 5)} 
        title="Recent Activities" 
        showSchoolColumn={true} 
      />
    </div>
  );
}
