import React from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopHeader({ title, subtitle, showDateRange = true, showFilterButton = true }) {
  return (
    <div className="page-top-bar">
      <div className="page-title-group">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="page-top-actions">
        {showDateRange && (
          <div className="date-selector-pill">
            <Calendar size={15} color="#1b6348" />
            <span>01/04/2025 - 30/04/2025</span>
          </div>
        )}

        {showFilterButton && (
          <Link to='/dashboard/filters' className="btn btn-outline btn-sm">
            <Filter size={14} />
            <span>Filters</span>
          </Link>
        )}
      </div>
    </div>
  );
}

