import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const message = 'Loading fixture data...';
    render(<LoadingSpinner message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    expect(document.querySelector('.loading-spinner__spinner--small')).toBeInTheDocument();

    rerender(<LoadingSpinner size="medium" />);
    expect(document.querySelector('.loading-spinner__spinner--medium')).toBeInTheDocument();

    rerender(<LoadingSpinner size="large" />);
    expect(document.querySelector('.loading-spinner__spinner--large')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-spinner';
    render(<LoadingSpinner className={customClass} />);
    
    expect(document.querySelector(`.${customClass}`)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner message="Loading..." />);
    
    const container = document.querySelector('.loading-spinner');
    expect(container).toBeInTheDocument();
  });
});