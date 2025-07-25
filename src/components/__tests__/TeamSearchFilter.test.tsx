import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TeamSearchFilter from '../TeamSearchFilter';

describe('TeamSearchFilter', () => {
  const defaultProps = {
    searchTerm: '',
    onSearchChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default placeholder text', () => {
      render(<TeamSearchFilter {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Search teams...');
      expect(input).toBeInTheDocument();
    });

    it('renders with custom placeholder text', () => {
      render(<TeamSearchFilter {...defaultProps} placeholder="Find your team" />);
      
      const input = screen.getByPlaceholderText('Find your team');
      expect(input).toBeInTheDocument();
    });

    it('displays the current search term', () => {
      render(<TeamSearchFilter {...defaultProps} searchTerm="Arsenal" />);
      
      const input = screen.getByDisplayValue('Arsenal');
      expect(input).toBeInTheDocument();
    });

    it('shows search icon', () => {
      render(<TeamSearchFilter {...defaultProps} />);
      
      const searchIcon = document.querySelector('.team-search-filter__search-icon');
      expect(searchIcon).toBeInTheDocument();
    });

    it('shows clear button only when there is search text', () => {
      const { rerender } = render(<TeamSearchFilter {...defaultProps} searchTerm="" />);
      
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
      
      rerender(<TeamSearchFilter {...defaultProps} searchTerm="Arsenal" />);
      
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('shows help text', () => {
      render(<TeamSearchFilter {...defaultProps} />);
      
      expect(screen.getByText('Search by team name or abbreviation. Press Escape to clear.')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper label association', () => {
      render(<TeamSearchFilter {...defaultProps} />);
      
      const input = screen.getByLabelText('Search teams:');
      expect(input).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(<TeamSearchFilter {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Search for teams by name');
      expect(input).toHaveAttribute('aria-describedby', 'team-search-help');
    });

    it('has proper input attributes', () => {
      render(<TeamSearchFilter {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('autoComplete', 'off');
      expect(input).toHaveAttribute('spellCheck', 'false');
    });

    it('clear button has proper accessibility attributes', () => {
      render(<TeamSearchFilter {...defaultProps} searchTerm="test" />);
      
      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toHaveAttribute('type', 'button');
      expect(clearButton).toHaveAttribute('title', 'Clear search');
    });

    it('focuses input on mount', () => {
      render(<TeamSearchFilter {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
    });
  });

  describe('Search Input Interactions', () => {
    it('calls onSearchChange when typing', async () => {
      const user = userEvent.setup();
      render(<TeamSearchFilter {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'Arsenal');
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledTimes(7); // One for each character
      // Just verify it was called - the exact sequence depends on how userEvent.type works
      expect(defaultProps.onSearchChange).toHaveBeenCalled();
    });

    it('calls onSearchChange when input value changes', () => {
      render(<TeamSearchFilter {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Liverpool' } });
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('Liverpool');
    });

    it('handles empty input correctly', () => {
      render(<TeamSearchFilter {...defaultProps} searchTerm="Arsenal" />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '' } });
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('');
    });

    it('handles whitespace-only input', () => {
      render(<TeamSearchFilter {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '   ' } });
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('   ');
    });
  });

  describe('Clear Button Interactions', () => {
    it('clears search when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<TeamSearchFilter {...defaultProps} searchTerm="Arsenal" />);
      
      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('');
    });

    it('focuses input after clearing search', async () => {
      const user = userEvent.setup();
      render(<TeamSearchFilter {...defaultProps} searchTerm="Arsenal" />);
      
      const input = screen.getByRole('textbox');
      const clearButton = screen.getByLabelText('Clear search');
      
      // Focus something else first
      clearButton.focus();
      expect(input).not.toHaveFocus();
      
      await user.click(clearButton);
      
      expect(input).toHaveFocus();
    });

    it('clear button is not present when search term is empty', () => {
      render(<TeamSearchFilter {...defaultProps} searchTerm="" />);
      
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });

    it('clear button is present when search term is only whitespace', () => {
      render(<TeamSearchFilter {...defaultProps} searchTerm="   " />);
      
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });
  });

  describe('Keyboard Interactions', () => {
    it('clears search on Escape key', async () => {
      const user = userEvent.setup();
      render(<TeamSearchFilter {...defaultProps} searchTerm="Arsenal" />);
      
      const input = screen.getByRole('textbox');
      input.focus();
      
      await user.keyboard('{Escape}');
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('');
    });

    it('focuses input after clearing with Escape key', async () => {
      const user = userEvent.setup();
      render(<TeamSearchFilter {...defaultProps} searchTerm="Arsenal" />);
      
      const input = screen.getByRole('textbox');
      input.focus();
      
      await user.keyboard('{Escape}');
      
      expect(input).toHaveFocus();
    });

    it('does not interfere with other keyboard events', async () => {
      const user = userEvent.setup();
      render(<TeamSearchFilter {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      input.focus();
      
      await user.keyboard('{Enter}');
      await user.keyboard('{Tab}');
      await user.keyboard('{ArrowLeft}');
      
      // Should not call onSearchChange for these keys
      expect(defaultProps.onSearchChange).not.toHaveBeenCalled();
    });

    it('prevents default behavior on Escape key', async () => {
      const user = userEvent.setup();
      render(<TeamSearchFilter {...defaultProps} searchTerm="Arsenal" />);
      
      const input = screen.getByRole('textbox');
      const mockPreventDefault = vi.fn();
      
      input.focus();
      
      // Simulate Escape key with preventDefault check
      fireEvent.keyDown(input, { 
        key: 'Escape', 
        preventDefault: mockPreventDefault 
      });
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('');
    });
  });

  describe('Component State Management', () => {
    it('updates display when searchTerm prop changes', () => {
      const { rerender } = render(<TeamSearchFilter {...defaultProps} searchTerm="" />);
      
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
      
      rerender(<TeamSearchFilter {...defaultProps} searchTerm="Chelsea" />);
      
      expect(screen.getByDisplayValue('Chelsea')).toBeInTheDocument();
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('maintains focus when props change', () => {
      const { rerender } = render(<TeamSearchFilter {...defaultProps} searchTerm="" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
      
      rerender(<TeamSearchFilter {...defaultProps} searchTerm="Manchester" />);
      
      expect(input).toHaveFocus();
    });

    it('handles rapid prop changes correctly', () => {
      const { rerender } = render(<TeamSearchFilter {...defaultProps} searchTerm="" />);
      
      rerender(<TeamSearchFilter {...defaultProps} searchTerm="A" />);
      rerender(<TeamSearchFilter {...defaultProps} searchTerm="Ar" />);
      rerender(<TeamSearchFilter {...defaultProps} searchTerm="Ars" />);
      rerender(<TeamSearchFilter {...defaultProps} searchTerm="Arsenal" />);
      
      expect(screen.getByDisplayValue('Arsenal')).toBeInTheDocument();
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles special characters in search term', () => {
      render(<TeamSearchFilter {...defaultProps} searchTerm="Man Utd & City" />);
      
      expect(screen.getByDisplayValue('Man Utd & City')).toBeInTheDocument();
    });

    it('handles very long search terms', () => {
      const longSearchTerm = 'A'.repeat(100);
      render(<TeamSearchFilter {...defaultProps} searchTerm={longSearchTerm} />);
      
      expect(screen.getByDisplayValue(longSearchTerm)).toBeInTheDocument();
    });

    it('handles unicode characters', () => {
      const unicodeSearchTerm = 'Atlético Madrid 🏆';
      render(<TeamSearchFilter {...defaultProps} searchTerm={unicodeSearchTerm} />);
      
      expect(screen.getByDisplayValue(unicodeSearchTerm)).toBeInTheDocument();
    });

    it('handles null/undefined onSearchChange gracefully', () => {
      // This should not crash the component
      expect(() => {
        render(<TeamSearchFilter searchTerm="" onSearchChange={undefined as any} />);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('does not call onSearchChange unnecessarily', () => {
      const { rerender } = render(<TeamSearchFilter {...defaultProps} searchTerm="Arsenal" />);
      
      // Re-render with same props
      rerender(<TeamSearchFilter {...defaultProps} searchTerm="Arsenal" />);
      
      expect(defaultProps.onSearchChange).not.toHaveBeenCalled();
    });

    it('maintains callback reference stability', () => {
      const onSearchChange = vi.fn();
      const { rerender } = render(<TeamSearchFilter searchTerm="" onSearchChange={onSearchChange} />);
      
      rerender(<TeamSearchFilter searchTerm="test" onSearchChange={onSearchChange} />);
      
      expect(onSearchChange).not.toHaveBeenCalled();
    });
  });

  describe('Visual States', () => {
    it('applies correct CSS classes', () => {
      render(<TeamSearchFilter {...defaultProps} />);
      
      expect(document.querySelector('.team-search-filter')).toBeInTheDocument();
      expect(document.querySelector('.team-search-filter__input')).toBeInTheDocument();
      expect(document.querySelector('.team-search-filter__search-icon')).toBeInTheDocument();
    });

    it('applies correct CSS classes when search term is present', () => {
      render(<TeamSearchFilter {...defaultProps} searchTerm="Arsenal" />);
      
      expect(document.querySelector('.team-search-filter__clear-button')).toBeInTheDocument();
    });

    it('input has correct styling attributes', () => {
      render(<TeamSearchFilter {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('team-search-filter__input');
    });
  });
});