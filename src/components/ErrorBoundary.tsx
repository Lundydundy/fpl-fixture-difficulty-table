import React, { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, this could send errors to a monitoring service
    // For now, we'll silently handle errors without console output
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h2>Something went wrong</h2>
            <p>
              An unexpected error occurred while loading the fixture difficulty table.
            </p>
            <details className="error-boundary__details">
              <summary>Error Details</summary>
              <pre className="error-boundary__error">
                {this.state.error && this.state.error.toString()}
              </pre>
              {this.state.errorInfo && (
                <pre className="error-boundary__stack">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
            <button 
              className="error-boundary__retry"
              onClick={this.handleRetry}
              type="button"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;