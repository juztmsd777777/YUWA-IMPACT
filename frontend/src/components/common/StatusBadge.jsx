import React from 'react';
import { Wifi, WifiOff, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status, text, showIcon = true, size = 'md' }) => {
  const normalized = (status || '').toLowerCase();

  let config = {
    bg: 'var(--color-primary-lightest)',
    color: 'var(--color-primary-light)',
    border: 'var(--color-primary-subtle)',
    label: text || 'Online',
    icon: Wifi
  };

  if (normalized === 'online') {
    config = {
      bg: '#DCFCE7',
      color: '#15803D',
      border: '#86EFAC',
      label: text || 'Online',
      icon: Wifi
    };
  } else if (normalized === 'offline') {
    config = {
      bg: '#FEE2E2',
      color: '#B91C1C',
      border: '#FCA5A5',
      label: text || 'Offline',
      icon: WifiOff
    };
  } else if (normalized === 'pending' || normalized === 'pending sync') {
    config = {
      bg: '#FEF3C7',
      color: '#B45309',
      border: '#FCD34D',
      label: text || 'Pending Sync',
      icon: Clock
    };
  } else if (normalized === 'synced' || normalized === 'success') {
    config = {
      bg: '#ECFDF5',
      color: '#047857',
      border: '#A7F3D0',
      label: text || 'Synced',
      icon: CheckCircle2
    };
  } else if (normalized === 'failed' || normalized === 'error') {
    config = {
      bg: '#FEF2F2',
      color: '#DC2626',
      border: '#FECACA',
      label: text || 'Failed',
      icon: AlertCircle
    };
  }

  const IconComponent = config.icon;
  const isSm = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? '4px' : '6px',
        padding: isSm ? '2px 8px' : '4px 10px',
        fontSize: isSm ? '0.75rem' : '0.8125rem',
        fontWeight: '600',
        borderRadius: 'var(--radius-full)',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        lineHeight: 1.2,
        userSelect: 'none'
      }}
    >
      {showIcon && <IconComponent size={isSm ? 12 : 14} />}
      <span>{config.label}</span>
    </span>
  );
};
