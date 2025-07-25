import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorDisplay from '../ErrorDisplay';

describe('ErrorDisplay', () => {
  it('renders network error with default message', () => {
    render(<ErrorDisplay type="network" />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText(/Unable to connect to FPL servers/)).toBeInTheDocument();
  });

  it('renders custom error message', () => {
    const customMessage = 'Custom error occurred';
    render(<ErrorDisplay type="network" message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorDisplay type="network" onRetry={onRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders dismiss button when onDismiss is provided', () => {
    const onDismiss = vi.fn();
    render(<ErrorDisplay type="network" onDismiss={onDismiss} />);
    
    const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
    expect(dismissButton).toBeInTheDocument();
    
    fireEvent.click(dismissButton);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('shows retry count when retryCount > 0', () => {
    const onRetry = vi.fn();
    render(<ErrorDisplay type="network" onRetry={onRetry} retryCount={2} maxRetries={3} />);
    
    expect(screen.getByText('Retry (2/3)')).toBeInTheDocument();
  });

  it('disables retry button when max retries reached', () => {
    const onRetry = vi.fn();
    render(<ErrorDisplay type="network" onRetry={onRetry} retryCount={3} maxRetries={3} />);
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeDisabled();
    expect(screen.getByText(/Maximum retry attempts reached/)).toBeInTheDocument();
  });

  it('shows technical details when showDetails is true', () => {
    const customMessage = 'Custom error';
    render(
      <ErrorDisplay 
        type="network" 
        message={customMessage}
        showDetails={true}
      />
    );
    
    const details = screen.getByText('Technical Details');
    expect(details).toBeInTheDocument();
  });

  it('renders different error types with appropriate styling', () => {
    const errorTypes = ['network', 'timeout', 'parsing', 'server', 'not_found', 'unknown'] as const;
    
    errorTypes.forEach(type => {
      const { container, unmount } = render(<ErrorDisplay type={type} />);
      expect(container.querySelector(`.error-display--${type}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('renders different variants', () => {
    const variants = ['banner', 'card', 'inline'] as const;
    
    variants.forEach(variant => {
      const { container, unmount } = render(<ErrorDisplay type="network" variant={variant} />);
      expect(container.querySelector(`.error-display--${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('does not show retry button for non-retryable errors', () => {
    const onRetry = vi.fn();
    render(<ErrorDisplay type="not_found" onRetry={onRetry} />);
    
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ErrorDisplay type="network" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('shows appropriate icons for different error types', () => {
    const { container } = render(<ErrorDisplay type="network" />);
    const icon = container.querySelector('.error-display__icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('🌐');
  });
});