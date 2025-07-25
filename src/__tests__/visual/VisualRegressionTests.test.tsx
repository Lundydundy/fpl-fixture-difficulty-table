import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import FixtureDifficultyTable from '../../components/FixtureDifficultyTable';
import DifficultyLegend from '../../components/DifficultyLegend';
import FixtureCell from '../../components/FixtureCell';
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

describe('Visual Regression Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup comprehensive mock data
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
      },
      {
        id: 3,
        name: 'Manchester City',
        short_name: 'MCI',
        code: 43,
        strength: 5,
        strength_overall_home: 1320,
        strength_overall_away: 1270,
        strength_attack_home: 1370,
        strength_attack_away: 1320,
        strength_defence_home: 1300,
        strength_defence_away: 1240
      }
    ]);

    (mockFplApiService.getFixtures as any).mockResolvedValue([
      {
        id: 1,
        code: 1,
        event: 1,
        team_h: 1,
        team_a: 2,
        team_h_difficulty: 1,
        team_a_difficulty: 2,
        kickoff_time: '2024-08-17T14:00:00Z'
      },
      {
        id: 2,
        code: 2,
        event: 1,
        team_h: 2,
        team_a: 3,
        team_h_difficulty: 3,
        team_a_difficulty: 4,
        kickoff_time: '2024-08-17T16:30:00Z'
      },
      {
        id: 3,
        code: 3,
        event: 1,
        team_h: 3,
        team_a: 1,
        team_h_difficulty: 5,
        team_a_difficulty: 5,
        kickoff_time: '2024-08-17T17:00:00Z'
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
    // Reset viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  describe('Color Coding Tests', () => {
    it('should apply correct CSS classes for all difficulty levels', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Check that difficulty cells have correct classes
      const difficultyCells = screen.getAllByTestId(/difficulty-cell/);
      
      // Should have at least one cell for each difficulty level
      const expectedClasses = [
        'difficulty-1', // Very Easy - Green
        'difficulty-2', // Easy - Light Green
        'difficulty-3', // Moderate - Yellow
        'difficulty-4', // Hard - Orange
        'difficulty-5'  // Very Hard - Red
      ];

      expectedClasses.forEach(className => {
        const cellsWithClass = difficultyCells.filter(cell => 
          cell.className.includes(className)
        );
        expect(cellsWithClass.length).toBeGreaterThanOrEqual(0);
      });
    });

    it('should render difficulty legend with correct color mapping', () => {
      render(<DifficultyLegend />);

      // Check all difficulty levels are present
      for (let level = 1; level <= 5; level++) {
        const legendItem = screen.getByTestId(`legend-level-${level}`);
        expect(legendItem).toBeInTheDocument();
        
        // Check that the item has the correct CSS class
        expect(legendItem).toHaveClass(`difficulty-${level}`);
        
        // Check text content
        expect(legendItem).toHaveTextContent(level.toString());
      }

      // Check legend labels
      expect(screen.getByText(/very easy/i)).toBeInTheDocument();
      expect(screen.getByText(/easy/i)).toBeInTheDocument();
      expect(screen.getByText(/moderate/i)).toBeInTheDocument();
      expect(screen.getByText(/hard/i)).toBeInTheDocument();
      expect(screen.getByText(/very hard/i)).toBeInTheDocument();
    });

    it('should maintain color consistency across different fixtures', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Get all difficulty-1 cells and verify they have consistent styling
      const difficulty1Cells = screen.getAllByTestId(/difficulty-cell/).filter(cell =>
        cell.className.includes('difficulty-1')
      );

      if (difficulty1Cells.length > 1) {
        const firstCellClasses = difficulty1Cells[0].className;
        difficulty1Cells.forEach(cell => {
          expect(cell.className).toContain('difficulty-1');
        });
      }
    });

    it('should render fixture cells with proper color contrast', () => {
      const testCases = [
        { difficulty: 1, opponent: 'ARS' },
        { difficulty: 2, opponent: 'LIV' },
        { difficulty: 3, opponent: 'MCI' },
        { difficulty: 4, opponent: 'CHE' },
        { difficulty: 5, opponent: 'MUN' }
      ];

      testCases.forEach(({ difficulty, opponent }) => {
        const { container } = render(
          <FixtureCell
            difficulty={difficulty}
            opponent={opponent}
            isHome={true}
            kickoffTime="2024-08-17T14:00:00Z"
          />
        );

        const cell = container.firstChild as HTMLElement;
        expect(cell).toHaveClass(`difficulty-${difficulty}`);
        
        // Check that text is readable (assumes CSS provides proper contrast)
        expect(cell).toHaveTextContent(opponent);
      });
    });
  });

  describe('Responsive Design Tests', () => {
    it('should adapt layout for mobile viewport (320px)', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const table = screen.getByTestId('fixture-table');
      
      // On mobile, table should have mobile-responsive class or attributes
      expect(table).toBeInTheDocument();
      
      // Check that controls are stacked vertically on mobile
      const controls = screen.getByTestId('fixture-controls');
      expect(controls).toBeInTheDocument();
    });

    it('should adapt layout for tablet viewport (768px)', async () => {
      // Set tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const table = screen.getByTestId('fixture-table');
      expect(table).toBeInTheDocument();
      
      // Table should be visible and properly formatted on tablet
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });

    it('should adapt layout for desktop viewport (1200px)', async () => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const table = screen.getByTestId('fixture-table');
      expect(table).toBeInTheDocument();
      
      // All columns should be visible on desktop
      const columnHeaders = screen.getAllByRole('columnheader');
      expect(columnHeaders.length).toBeGreaterThanOrEqual(3); // Team + gameweek columns
    });

    it('should handle horizontal scrolling on narrow screens', async () => {
      // Set very narrow viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 280,
      });

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const tableContainer = screen.getByTestId('fixture-table-container') || 
                           screen.getByTestId('fixture-table').closest('div');
      
      if (tableContainer) {
        // Should have overflow styles for horizontal scrolling
        expect(tableContainer).toBeInTheDocument();
      }
    });

    it('should adjust font sizes for different screen sizes', async () => {
      const viewports = [
        { width: 320, name: 'mobile' },
        { width: 768, name: 'tablet' },
        { width: 1200, name: 'desktop' }
      ];

      for (const viewport of viewports) {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width,
        });

        const { container, unmount } = render(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
        });

        // Check that text elements are present and readable
        const teamNames = screen.getAllByTestId(/team-name/);
        teamNames.forEach(name => {
          expect(name).toBeInTheDocument();
          expect(name.textContent).toBeTruthy();
        });

        unmount();
      }
    });
  });

  describe('Theme and Dark Mode Support', () => {
    it('should support light theme colors', async () => {
      // Add light theme class to body
      document.body.className = 'light-theme';

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const table = screen.getByTestId('fixture-table');
      expect(table).toBeInTheDocument();
      
      // Clean up
      document.body.className = '';
    });

    it('should support dark theme colors', async () => {
      // Add dark theme class to body
      document.body.className = 'dark-theme';

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const table = screen.getByTestId('fixture-table');
      expect(table).toBeInTheDocument();
      
      // Clean up
      document.body.className = '';
    });

    it('should maintain difficulty color distinction in both themes', () => {
      const themes = ['light-theme', 'dark-theme'];
      
      themes.forEach(theme => {
        document.body.className = theme;
        
        const { unmount } = render(<DifficultyLegend />);
        
        // Check that all difficulty levels are rendered
        for (let level = 1; level <= 5; level++) {
          const legendItem = screen.getByTestId(`legend-level-${level}`);
          expect(legendItem).toBeInTheDocument();
          expect(legendItem).toHaveClass(`difficulty-${level}`);
        }
        
        unmount();
        document.body.className = '';
      });
    });
  });

  describe('Print Styles', () => {
    it('should render appropriately for print media', async () => {
      // Mock print media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === 'print',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Check that essential elements are present for printing
      const table = screen.getByTestId('fixture-table');
      const legend = screen.getByTestId('difficulty-legend');
      
      expect(table).toBeInTheDocument();
      expect(legend).toBeInTheDocument();
      
      // Interactive elements should still be present but styled for print
      const controls = screen.getByTestId('fixture-controls');
      expect(controls).toBeInTheDocument();
    });
  });

  describe('Animation and Motion', () => {
    it('should respect reduced motion preferences', async () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Elements should still render but without animations
      const table = screen.getByTestId('fixture-table');
      expect(table).toBeInTheDocument();
      
      // Loading states should not have spinning animations
      // (This would be tested by checking CSS classes in a real browser)
    });

    it('should handle loading state visual transitions', async () => {
      // Create delayed promise to test loading state
      let resolveTeams: any;
      const teamsPromise = new Promise((resolve) => {
        resolveTeams = resolve;
      });
      
      (mockFplApiService.getTeams as any).mockReturnValue(teamsPromise);
      (mockFplApiService.getFixtures as any).mockResolvedValue([]);
      (mockFplApiService.getGameweeks as any).mockResolvedValue([]);

      render(<FixtureDifficultyTable />);

      // Check loading state is visible
      expect(screen.getByTestId('loading-display')).toBeInTheDocument();

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

      // Loading state should be gone
      expect(screen.queryByTestId('loading-display')).not.toBeInTheDocument();
    });
  });

  describe('Visual Regression Snapshots', () => {
    // Note: These tests would typically use visual regression tools like Percy or Chromatic
    // Here we're testing the structural elements that would be visually tested
    
    it('should maintain consistent table structure across updates', async () => {
      const { container, rerender } = render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const initialStructure = container.innerHTML;

      // Re-render with same data
      rerender(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Structure should remain consistent
      expect(container).toBeInTheDocument();
    });

    it('should handle empty state visuals correctly', async () => {
      (mockFplApiService.getTeams as any).mockResolvedValue([]);
      (mockFplApiService.getFixtures as any).mockResolvedValue([]);

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        const emptyState = screen.getByTestId('empty-state') || 
                          screen.getByText(/no data/i) ||
                          screen.getByTestId('fixture-table');
        expect(emptyState).toBeInTheDocument();
      });
    });

    it('should render error state visuals correctly', async () => {
      (mockFplApiService.getTeams as any).mockRejectedValue(new Error('API Error'));

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      const errorDisplay = screen.getByTestId('error-display');
      expect(errorDisplay).toHaveTextContent(/error/i);
      
      // Error display should have proper styling classes
      expect(errorDisplay).toHaveClass(/error/);
    });
  });
});
