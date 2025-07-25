import React from 'react';
import './ErrorDisplay.css';

export type ErrorType = 
  | 'network'
  | 'timeout'
  | 'parsing'
  | 'not_found'
  | 'server'
  | 'unknown';

interface ErrorDisplayProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'banner' | 'card' | 'inline';
  showDetails?: boolean;
  retryCount?: number;
  maxRetries?: number;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  type,
  message,
  onRetry,
  onDismiss,
  variant = 'card',
  showDetails = false,
  retryCount = 0,
  maxRetries = 3
}) => {
  const getErrorConfig = (errorType: ErrorType) => {
    const configs = {
      network: {
        title: 'Connection Error',
        defaultMessage: 'Unable to connect to FPL servers. Please check your internet connection and try again.',
        icon: '🌐',
        canRetry: true
      },
      timeout: {
        title: 'Request Timeout',
        defaultMessage: 'The request took too long to complete. Please try again.',
        icon: '⏱️',
        canRetry: true
      },
      parsing: {
        title: 'Data Error',
        defaultMessage: 'Error processing fixture data. Some information may be incomplete.',
        icon: '⚠️',
        canRetry: true
      },
      not_found: {
        title: 'Data Not Found',
        defaultMessage: 'The requested fixture data could not be found.',
        icon: '🔍',
        canRetry: false
      },
      server: {
        title: 'Server Error',
        defaultMessage: 'FPL servers are currently experiencing issues. Please try again later.',
        icon: '🔧',
        canRetry: true
      },
      unknown: {
        title: 'Unexpected Error',
        defaultMessage: 'An unexpected error occurred. Please try again.',
        icon: '❌',
        canRetry: true
      }
    };

    return configs[errorType];
  };

  const config = getErrorConfig(type);
  const displayMessage = message || config.defaultMessage;
  const shouldShowRetryButton = config.canRetry && onRetry;
  const isRetryDisabled = retryCount >= maxRetries;

  const renderRetryButton = () => {
    if (!shouldShowRetryButton) return null;

    return (
      <button
        className="error-display__retry-button"
        onClick={onRetry}
        type="button"
        disabled={isRetryDisabled}
      >
        {retryCount > 0 ? `Retry (${retryCount}/${maxRetries})` : 'Try Again'}
      </button>
    );
  };

  const renderDismissButton = () => {
    if (!onDismiss) return null;

    return (
      <button
        className="error-display__dismiss-button"
        onClick={onDismiss}
        type="button"
        aria-label="Dismiss error"
      >
        ✕
      </button>
    );
  };

  const renderErrorContent = () => (
    <>
      <div className="error-display__header">
        <span className="error-display__icon" role="img" aria-hidden="true">
          {config.icon}
        </span>
        <h3 className="error-display__title">{config.title}</h3>
        {renderDismissButton()}
      </div>
      
      <p className="error-display__message">{displayMessage}</p>
      
      {showDetails && message && message !== config.defaultMessage && (
        <details className="error-display__details">
          <summary>Technical Details</summary>
          <pre className="error-display__technical">{message}</pre>
        </details>
      )}
      
      <div className="error-display__actions">
        {renderRetryButton()}
        {retryCount >= maxRetries && (
          <p className="error-display__max-retries">
            Maximum retry attempts reached. Please refresh the page or try again later.
          </p>
        )}
      </div>
    </>
  );

  const className = `error-display error-display--${variant} error-display--${type}`;

  return (
    <div className={className} role="alert" aria-live="polite">
      <div className="error-display__content">
        {renderErrorContent()}
      </div>
    </div>
  );
};

export default ErrorDisplay;