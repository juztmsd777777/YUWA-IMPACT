import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  School, 
  ClipboardList, 
  Camera, 
  SlidersHorizontal, 
  FileText, 
  Settings,
  Leaf
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { 
      name: 'Field Worker App', 
      path: '/', 
      icon: Leaf,
      activeWhen: ['/programs', '/activities/new', '/participants']
    },
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard,
      activeWhen: ['/dashboard']
    },
    { 
      name: 'Impact & Evaluation', 
      path: '/dashboard/evaluation', 
      icon: TrendingUp,
      activeWhen: ['/dashboard/evaluation']
    },
    { 
      name: 'Schools', 
      path: '/schools/sunrise-high-school', 
      icon: School,
      activeWhen: ['/schools']
    },
    { 
      name: 'Activities', 
      path: '/activities/green-quiz-12apr2025', 
      icon: ClipboardList,
      activeWhen: ['/activities']
    },
    { 
      name: 'Evidence', 
      path: '/schools/sunrise-high-school', 
      icon: Camera,
      badge: '1.2k',
      activeWhen: []
    },
    { 
      name: 'Filters', 
      path: '/filters', 
      icon: SlidersHorizontal,
      activeWhen: ['/filters']
    },
    { 
      name: 'Reports', 
      path: '/dashboard/evaluation', 
      icon: FileText,
      activeWhen: []
    },
    { 
      name: 'Settings', 
      path: '/dashboard', 
      icon: Settings,
      activeWhen: []
    }
  ];

  const isItemActive = (item) => {
    if (item.activeWhen.length === 0) return false;
    return item.activeWhen.some(prefix => location.pathname.startsWith(prefix));
  };

  return (
    <aside className="sidebar">
      {/* Brand / Logo */}
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">
          <Leaf size={22} strokeWidth={2.5} />
        </div>
        <div className="sidebar-brand-text">
          <h1>YUWA</h1>
          <span>Waste Warriors Society</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-title">Main Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item);
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`sidebar-nav-item ${active ? 'active' : ''}`}
            >
              <Icon className="sidebar-nav-icon" />
              <span>{item.name}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">WW</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Admin Portal</div>
            <div className="sidebar-user-role">Waste Warriors Society</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

