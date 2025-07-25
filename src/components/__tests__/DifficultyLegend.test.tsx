import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DifficultyLegend from '../DifficultyLegend';

describe('DifficultyLegend', () => {
  it('renders with default visible state', () => {
    render(<DifficultyLegend />);
    
    expect(screen.getByRole('button', { name: /difficulty legend.*hide/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /fixture difficulty color coding explanation/i })).toBeInTheDocument();
    expect(screen.getByText('Fixture Difficulty Scale')).toBeInTheDocument();
  });

  it('displays all difficulty levels with correct labels', () => {
    render(<DifficultyLegend />);
    
    expect(screen.getByText('1 - Very Easy')).toBeInTheDocument();
    expect(screen.getByText('2 - Easy')).toBeInTheDocument();
    expect(screen.getByText('3 - Medium')).toBeInTheDocument();
    expect(screen.getByText('4 - Hard')).toBeInTheDocument();
    expect(screen.getByText('5 - Very Hard')).toBeInTheDocument();
  });

  it('displays difficulty descriptions', () => {
    render(<DifficultyLegend />);
    
    expect(screen.getByText('Easiest fixtures - favorable matchups')).toBeInTheDocument();
    expect(screen.getByText('Easy fixtures - good opportunities')).toBeInTheDocument();
    expect(screen.getByText('Average difficulty - neutral matchups')).toBeInTheDocument();
    expect(screen.getByText('Difficult fixtures - challenging matchups')).toBeInTheDocument();
    expect(screen.getByText('Hardest fixtures - avoid if possible')).toBeInTheDocument();
  });

  it('displays home/away explanation', () => {
    render(<DifficultyLegend />);
    
    expect(screen.getByText('Home (H)')).toBeInTheDocument();
    expect(screen.getByText('Away (A)')).toBeInTheDocument();
    expect(screen.getByText(/indicators show fixture venue/)).toBeInTheDocument();
    expect(screen.getByText(/Home fixtures may be slightly easier/)).toBeInTheDocument();
  });

  it('toggles visibility when button is clicked', () => {
    render(<DifficultyLegend />);
    
    const toggleButton = screen.getByRole('button', { name: /difficulty legend.*hide/i });
    
    // Initially visible
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click to hide
    fireEvent.click(toggleButton);
    
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /difficulty legend.*show/i })).toBeInTheDocument();
    
    // Click to show again
    fireEvent.click(toggleButton);
    
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('uses controlled visibility when showLegend prop is provided', () => {
    const onToggle = vi.fn();
    render(<DifficultyLegend showLegend={false} onToggle={onToggle} />);
    
    // Should be hidden initially
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /difficulty legend.*show/i })).toBeInTheDocument();
    
    // Click should call onToggle
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('calls onToggle with correct value when controlled', () => {
    const onToggle = vi.fn();
    render(<DifficultyLegend showLegend={true} onToggle={onToggle} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('has proper accessibility attributes', () => {
    render(<DifficultyLegend />);
    
    const toggleButton = screen.getByRole('button');
    const legendContent = screen.getByRole('region');
    
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(toggleButton).toHaveAttribute('aria-controls', 'difficulty-legend-content');
    expect(legendContent).toHaveAttribute('id', 'difficulty-legend-content');
    expect(legendContent).toHaveAttribute('aria-label', 'Fixture difficulty color coding explanation');
  });

  it('displays color samples with correct CSS classes', () => {
    render(<DifficultyLegend />);
    
    const colorSamples = screen.getAllByText(/^[1-5]$/);
    
    expect(colorSamples[0]).toHaveClass('legend-color-sample', 'difficulty-easy'); // 1
    expect(colorSamples[1]).toHaveClass('legend-color-sample', 'difficulty-easy'); // 2
    expect(colorSamples[2]).toHaveClass('legend-color-sample', 'difficulty-medium'); // 3
    expect(colorSamples[3]).toHaveClass('legend-color-sample', 'difficulty-hard'); // 4
    expect(colorSamples[4]).toHaveClass('legend-color-sample', 'difficulty-hard'); // 5
  });

  it('has proper list structure for legend items', () => {
    render(<DifficultyLegend />);
    
    const legendItems = screen.getByRole('list');
    const listItems = screen.getAllByRole('listitem');
    
    expect(legendItems).toBeInTheDocument();
    expect(listItems).toHaveLength(5);
  });

  it('toggle icon changes based on visibility state', () => {
    render(<DifficultyLegend />);
    
    const toggleButton = screen.getByRole('button');
    
    // Initially expanded (down arrow)
    expect(toggleButton.querySelector('.toggle-icon')).toHaveTextContent('▼');
    
    // Click to collapse (right arrow)
    fireEvent.click(toggleButton);
    expect(toggleButton.querySelector('.toggle-icon')).toHaveTextContent('▶');
  });

  it('renders without onToggle callback', () => {
    render(<DifficultyLegend showLegend={true} />);
    
    // Should render without errors
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('region')).toBeInTheDocument();
    
    // Clicking should not cause errors
    fireEvent.click(screen.getByRole('button'));
  });
});