import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  className = ''
}) => {
  return (
    <div className={`loading-spinner ${className}`} role="status" aria-live="polite">
      <div className={`loading-spinner__spinner loading-spinner__spinner--${size}`} aria-hidden="true" />
      {message && (
        <p className="loading-spinner__message">{message}</p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;