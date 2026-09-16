import React from 'react';
import TopHeader from '../components/TopHeader';
import StatCard from '../components/StatCard';
import { 
  IMPACT_KPIS, 
  BEFORE_AFTER_DATA, 
  PROGRAM_COMPARISON_DATA, 
  PROGRAM_PERFORMANCE_TABLE 
} from '../data/mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Award, TrendingUp, Users, School, CheckCircle } from 'lucide-react';

export default function ImpactEvaluation() {
  const kpiIcons = [Award, TrendingUp, Users, School];

  return (
    <div className="main-content">
      {/* Top Bar */}
      <TopHeader 
        title="Impact & Evaluation" 
        subtitle="Pre vs Post assessment analysis and comparative environmental learning outcomes"
        showDateRange={true}
      />

      {/* KPI Cards */}
      <div className="stat-grid-4">
        {IMPACT_KPIS.map((kpi, idx) => {
          const Icon = kpiIcons[idx] || Award;
          return (
            <StatCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              trend={kpi.trend}
              isPositive={kpi.isPositive}
              icon={Icon}
            />
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="charts-grid-2">
        {/* Before vs After Assessment Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Before vs After Assessment</h3>
              <p className="chart-subtitle">Baseline vs Endline score comparison across core waste management modules</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={BEFORE_AFTER_DATA}
                margin={{ top: 15, right: 20, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5ece6" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fill: '#526357', fontSize: 11 }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  unit="%" 
                  domain={[0, 100]} 
                  tick={{ fill: '#7b8e81', fontSize: 11 }} 
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`]}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '8px', 
                    border: '1px solid #c2e2ce',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }} 
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
                />
                <Bar dataKey="pre" name="Before (Pre)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="post" name="After (Post)" fill="#0f4632" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Program Comparison Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Program Comparison</h3>
              <p className="chart-subtitle">Comparative performance dimensions: Ecolympics vs Green Gurukul</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={PROGRAM_COMPARISON_DATA}
                margin={{ top: 15, right: 20, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5ece6" />
                <XAxis 
                  dataKey="metric" 
                  tick={{ fill: '#526357', fontSize: 11 }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  unit="%" 
                  domain={[0, 100]} 
                  tick={{ fill: '#7b8e81', fontSize: 11 }} 
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`]}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '8px', 
                    border: '1px solid #c2e2ce',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }} 
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
                />
                <Bar dataKey="Ecolympics" name="Ecolympics" fill="#1b6348" radius={[4, 4, 0, 0]} />
                <Bar dataKey="GreenGurukul" name="Green Gurukul" fill="#65a30d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Program Performance Table */}
      <div className="table-container">
        <div className="table-header-bar">
          <h3 className="table-header-title">Program Performance</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Consolidated evaluation metrics
          </span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Program</th>
                <th>Enrolled Schools</th>
                <th>Total Students</th>
                <th>Pre-Score</th>
                <th>Post-Score</th>
                <th>Net Improvement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {PROGRAM_PERFORMANCE_TABLE.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={16} color="var(--primary-green)" />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.schools}</td>
                  <td>{item.students}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{item.preScore}</td>
                  <td style={{ fontWeight: 600 }}>{item.postScore}</td>
                  <td>
                    <span className="badge badge-success" style={{ fontWeight: 700 }}>
                      {item.netImprovement}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-ecolympics">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
