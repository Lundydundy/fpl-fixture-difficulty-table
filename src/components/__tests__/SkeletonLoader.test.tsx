import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SkeletonLoader from '../SkeletonLoader';

describe('SkeletonLoader', () => {
  it('renders table skeleton with default props', () => {
    render(<SkeletonLoader type="table" />);
    
    const skeleton = screen.getByLabelText('Loading content');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('skeleton-loader');
  });

  it('renders table skeleton with custom rows and columns', () => {
    render(<SkeletonLoader type="table" rows={3} columns={4} />);
    
    // Check for table structure
    const tableHeader = document.querySelector('.skeleton-loader__table-header');
    const tableRows = document.querySelectorAll('.skeleton-loader__table-row');
    
    expect(tableHeader).toBeInTheDocument();
    expect(tableRows).toHaveLength(3);
  });

  it('renders controls skeleton', () => {
    render(<SkeletonLoader type="controls" />);
    
    const controlsContainer = document.querySelector('.skeleton-loader__controls');
    expect(controlsContainer).toBeInTheDocument();
  });

  it('renders text skeleton', () => {
    render(<SkeletonLoader type="text" />);
    
    const textContainer = document.querySelector('.skeleton-loader__text');
    expect(textContainer).toBeInTheDocument();
  });

  it('renders card skeleton', () => {
    render(<SkeletonLoader type="card" />);
    
    const cardContainer = document.querySelector('.skeleton-loader__card');
    expect(cardContainer).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-skeleton';
    render(<SkeletonLoader type="text" className={customClass} />);
    
    const skeleton = screen.getByLabelText('Loading content');
    expect(skeleton).toHaveClass(customClass);
  });

  it('has proper accessibility attributes', () => {
    render(<SkeletonLoader type="table" />);
    
    const skeleton = screen.getByLabelText('Loading content');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
  });

  it('defaults to text skeleton for unknown type', () => {
    // @ts-ignore - testing fallback behavior
    render(<SkeletonLoader type="unknown" />);
    
    const textContainer = document.querySelector('.skeleton-loader__text');
    expect(textContainer).toBeInTheDocument();
  });
});