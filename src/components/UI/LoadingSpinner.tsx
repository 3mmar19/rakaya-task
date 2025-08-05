import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };
  
  const colorClasses = {
    primary: 'text-blue-600 dark:text-blue-400',
    white: 'text-white'
  };

  return (
    <div className={`inline-block ${colorClasses[color]} ${className}`} role="status" aria-label="Loading">
      <Loader className={`${sizeClasses[size]} animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
