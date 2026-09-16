import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ label, value, trend, isPositive = true, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        {Icon && (
          <div className="stat-card-icon-wrap">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="stat-card-value">{value}</div>

      {trend && (
        <div className={`stat-card-trend ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
