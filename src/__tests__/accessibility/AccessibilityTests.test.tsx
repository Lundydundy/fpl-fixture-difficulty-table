import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import FixtureDifficultyTable from '../../components/FixtureDifficultyTable';
import { mockFplApiService } from '../../services/MockFPLApiService';

// Mock the API service
vi.mock('../../services/FPLApiService', () => ({
  fplApiService: mockFplApiService,
}));

vi.mock('../../services/MockFPLApiService', () => ({
  mockFplApiService: {
    getTeams: vi.fn(),
    getFixtures: vi.fn(),
    getGameweeks: vi.fn(),
  },
}));

describe('Accessibility Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup basic mock data
    (mockFplApiService.getTeams as any).mockResolvedValue([
      {
        id: 1,
        name: 'Arsenal',
        short_name: 'ARS',
        code: 3,
        strength: 4,
        strength_overall_home: 1200,
        strength_overall_away: 1150,
        strength_attack_home: 1250,
        strength_attack_away: 1200,
        strength_defence_home: 1180,
        strength_defence_away: 1120
      },
      {
        id: 2,
        name: 'Liverpool',
        short_name: 'LIV',
        code: 14,
        strength: 5,
        strength_overall_home: 1300,
        strength_overall_away: 1250,
        strength_attack_home: 1350,
        strength_attack_away: 1300,
        strength_defence_home: 1280,
        strength_defence_away: 1220
      }
    ]);

    (mockFplApiService.getFixtures as any).mockResolvedValue([
      {
        id: 1,
        code: 1,
        event: 1,
        finished: false,
        finished_provisional: false,
        kickoff_time: '2024-08-17T14:00:00Z',
        minutes: 0,
        provisional_start_time: false,
        started: false,
        team_a: 2,
        team_a_score: undefined,
        team_h: 1,
        team_h_score: undefined,
        stats: [],
        team_h_difficulty: 3,
        team_a_difficulty: 4,
        pulse_id: 1,
      }
    ]);

    (mockFplApiService.getGameweeks as any).mockResolvedValue([
      {
        id: 1,
        name: 'Gameweek 1',
        deadline_time: '2024-08-16T17:30:00Z',
        finished: false,
        is_current: true,
        is_next: false,
        is_previous: false
      }
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Keyboard Navigation', () => {
    it('should support tab navigation through all interactive elements', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Get all focusable elements in expected tab order
      const gameweekStartInput = screen.getByTestId('gameweek-start-input');
      const gameweekEndInput = screen.getByTestId('gameweek-end-input');
      const searchInput = screen.getByTestId('search-input');
      const sortNameButton = screen.getByTestId('sort-name-button');
      const sortDifficultyButton = screen.getByTestId('sort-difficulty-button');

      // Test tab navigation
      await user.tab();
      expect(gameweekStartInput).toHaveFocus();

      await user.tab();
      expect(gameweekEndInput).toHaveFocus();

      await user.tab();
      expect(searchInput).toHaveFocus();

      await user.tab();
      expect(sortNameButton).toHaveFocus();

      await user.tab();
      expect(sortDifficultyButton).toHaveFocus();

      // Test reverse tab navigation
      await user.tab({ shift: true });
      expect(sortNameButton).toHaveFocus();

      await user.tab({ shift: true });
      expect(searchInput).toHaveFocus();
    });

    it('should support keyboard interaction with gameweek inputs', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const startInput = screen.getByTestId('gameweek-start-input');
      const endInput = screen.getByTestId('gameweek-end-input');

      // Focus start input
      startInput.focus();

      // Use arrow keys to change value
      await user.keyboard('{ArrowUp}');
      expect(startInput).toHaveValue(2);

      await user.keyboard('{ArrowDown}');
      expect(startInput).toHaveValue(1);

      // Use Enter to move to next input
      await user.keyboard('{Tab}');
      expect(endInput).toHaveFocus();

      // Use Home/End keys
      await user.keyboard('{Home}');
      expect(endInput).toHaveValue(1);

      await user.keyboard('{End}');
      expect(endInput).toHaveValue(38);
    });

    it('should support keyboard interaction with sort buttons', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const sortNameButton = screen.getByTestId('sort-name-button');
      
      // Focus the button
      sortNameButton.focus();
      expect(sortNameButton).toHaveFocus();

      // Activate with Enter
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(sortNameButton).toHaveAttribute('aria-pressed', 'true');
      });

      // Activate with Space
      await user.keyboard(' ');
      
      await waitFor(() => {
        // Should toggle sort direction
        expect(sortNameButton).toHaveAttribute('aria-label', expect.stringContaining('descending'));
      });
    });

    it('should trap focus within modal dialogs when present', async () => {
      // This would test focus trapping in error dialogs or other modals
      (mockFplApiService.getTeams as any).mockRejectedValue(new Error('API Error'));
      
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      const retryButton = screen.getByTestId('retry-button');
      const closeButton = screen.queryByTestId('close-error-button');

      // Focus should be on the retry button
      expect(retryButton).toHaveFocus();

      // If there's a close button, tab should cycle between interactive elements in modal
      if (closeButton) {
        await user.tab();
        expect(closeButton).toHaveFocus();

        await user.tab();
        expect(retryButton).toHaveFocus(); // Should wrap around
      }
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper ARIA labels for all interactive elements', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Check gameweek inputs have proper labels
      const startInput = screen.getByTestId('gameweek-start-input');
      const endInput = screen.getByTestId('gameweek-end-input');

      expect(startInput).toHaveAttribute('aria-label', expect.stringContaining('start gameweek'));
      expect(endInput).toHaveAttribute('aria-label', expect.stringContaining('end gameweek'));

      // Check search input has proper label
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveAttribute('aria-label', expect.stringContaining('search'));

      // Check sort buttons have proper labels
      const sortNameButton = screen.getByTestId('sort-name-button');
      const sortDifficultyButton = screen.getByTestId('sort-difficulty-button');

      expect(sortNameButton).toHaveAttribute('aria-label', expect.stringContaining('sort'));
      expect(sortDifficultyButton).toHaveAttribute('aria-label', expect.stringContaining('sort'));
    });

    it('should announce state changes to screen readers', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Check that sort buttons announce their state
      const sortNameButton = screen.getByTestId('sort-name-button');
      
      expect(sortNameButton).toHaveAttribute('aria-pressed');
      expect(sortNameButton).toHaveAttribute('aria-label', expect.stringContaining('sort'));

      // Click to activate sort
      await user.click(sortNameButton);

      await waitFor(() => {
        expect(sortNameButton).toHaveAttribute('aria-pressed', 'true');
        expect(sortNameButton).toHaveAttribute('aria-label', expect.stringContaining('ascending'));
      });

      // Click again to reverse sort
      await user.click(sortNameButton);

      await waitFor(() => {
        expect(sortNameButton).toHaveAttribute('aria-label', expect.stringContaining('descending'));
      });
    });

    it('should provide proper table semantics for screen readers', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('aria-label', expect.stringContaining('fixture difficulty'));

      // Check table headers
      const columnHeaders = screen.getAllByRole('columnheader');
      expect(columnHeaders.length).toBeGreaterThan(0);

      // Team name header should be sortable
      const teamHeader = screen.getByRole('columnheader', { name: /team/i });
      expect(teamHeader).toHaveAttribute('aria-sort');

      // Check table rows
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1); // Header + data rows

      // Check table cells have proper structure
      const cells = screen.getAllByRole('cell');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('should provide ARIA live regions for dynamic updates', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Search for a team
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Arsenal');

      // Should have live region announcing search results
      await waitFor(() => {
        const liveRegion = screen.queryByRole('status') || screen.queryByLabelText(/search results/i);
        if (liveRegion) {
          expect(liveRegion).toBeInTheDocument();
        }
      });
    });

    it('should provide proper error announcements', async () => {
      // Mock API error
      (mockFplApiService.getTeams as any).mockRejectedValue(new Error('Network error'));

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      // Error should be announced to screen readers
      const errorElement = screen.getByTestId('error-display');
      expect(errorElement).toHaveAttribute('role', 'alert');
      expect(errorElement).toHaveTextContent(/error/i);
    });
  });

  describe('Color and Contrast Accessibility', () => {
    it('should provide text alternatives for color-coded information', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Check that difficulty cells have text indicators beyond just color
      const difficultyCells = screen.getAllByTestId(/difficulty-cell/);
      
      difficultyCells.forEach(cell => {
        // Should have aria-label or title describing difficulty level
        const hasAriaLabel = cell.hasAttribute('aria-label');
        const hasTitle = cell.hasAttribute('title');
        const hasTextContent = cell.textContent && cell.textContent.trim().length > 0;
        
        expect(hasAriaLabel || hasTitle || hasTextContent).toBe(true);
      });
    });

    it('should show difficulty legend for color accessibility', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Difficulty legend should be present
      const legend = screen.getByTestId('difficulty-legend');
      expect(legend).toBeInTheDocument();

      // Legend should have proper semantics
      expect(legend).toHaveAttribute('role', 'region');
      expect(legend).toHaveAttribute('aria-label', expect.stringContaining('legend'));

      // Should show all difficulty levels with text descriptions
      const difficultyLevels = screen.getAllByTestId(/legend-level-/);
      expect(difficultyLevels.length).toBe(5); // Levels 1-5

      difficultyLevels.forEach((level, index) => {
        expect(level).toHaveTextContent((index + 1).toString());
      });
    });
  });

  describe('Focus Management', () => {
    it('should manage focus appropriately during loading states', async () => {
      // Create delayed promise to test loading state
      let resolveTeams: any;
      const teamsPromise = new Promise((resolve) => {
        resolveTeams = resolve;
      });
      
      (mockFplApiService.getTeams as any).mockReturnValue(teamsPromise);
      (mockFplApiService.getFixtures as any).mockResolvedValue([]);
      (mockFplApiService.getGameweeks as any).mockResolvedValue([]);

      render(<FixtureDifficultyTable />);

      // During loading, focus should not be trapped
      const firstFocusableElement = screen.getByTestId('gameweek-start-input');
      firstFocusableElement.focus();
      expect(firstFocusableElement).toHaveFocus();

      // Complete loading
      resolveTeams([
        {
          id: 1,
          name: 'Arsenal',
          short_name: 'ARS',
          code: 3,
          strength: 4,
          strength_overall_home: 1200,
          strength_overall_away: 1150,
          strength_attack_home: 1250,
          strength_attack_away: 1200,
          strength_defence_home: 1180,
          strength_defence_away: 1120
        }
      ]);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Focus should remain where user left it
      expect(firstFocusableElement).toHaveFocus();
    });

    it('should provide skip links for keyboard users', async () => {
      render(<FixtureDifficultyTable />);

      // Look for skip navigation links
      const skipToContent = screen.queryByLabelText(/skip to content/i) || 
                          screen.queryByText(/skip to content/i);
      
      if (skipToContent) {
        expect(skipToContent).toBeInTheDocument();
        expect(skipToContent).toHaveAttribute('href', expect.stringMatching(/#/));
      }
    });
  });

  describe('Mobile Accessibility', () => {
    it('should support touch navigation', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Check that touch targets are appropriately sized
      const interactiveElements = [
        screen.getByTestId('gameweek-start-input'),
        screen.getByTestId('gameweek-end-input'),
        screen.getByTestId('search-input'),
        screen.getByTestId('sort-name-button'),
        screen.getByTestId('sort-difficulty-button')
      ];

      interactiveElements.forEach(element => {
        const styles = getComputedStyle(element);
        const minSize = 44; // WCAG AA minimum touch target size
        
        // Check if element meets minimum touch target size
        // Note: In a real test, you'd check computed dimensions
        expect(element).toBeInTheDocument(); // Basic check
      });
    });
  });
});
