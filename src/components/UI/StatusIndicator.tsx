import React from 'react';

interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'loading' | 'error';
  label: string;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, className = '' }) => {
  const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-gray-400',
    loading: 'bg-blue-500 animate-pulse',
    error: 'bg-red-500'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`w-2 h-2 rounded-full ${statusColors[status]} mr-2`}></div>
      <span className="text-xs text-gray-600 dark:text-gray-300">{label}</span>
    </div>
  );
};

export default StatusIndicator;
