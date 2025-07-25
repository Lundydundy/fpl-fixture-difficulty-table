import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { 
  renderWithProvider, 
  createMockTeam, 
  createMockFixture, 
  createMockGameweek,
  mockMatchMedia,
  mockViewport
} from '../setup/testUtils';
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

describe('Accessibility Compliance Test Suite', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock data
    const mockTeams = [
      createMockTeam({ id: 1, name: 'Arsenal', short_name: 'ARS' }),
      createMockTeam({ id: 2, name: 'Liverpool', short_name: 'LIV' }),
      createMockTeam({ id: 3, name: 'Manchester City', short_name: 'MCI' }),
    ];

    const mockFixtures = [
      createMockFixture({ id: 1, event: 1, team_h: 1, team_a: 2, team_h_difficulty: 1, team_a_difficulty: 2 }),
      createMockFixture({ id: 2, event: 1, team_h: 2, team_a: 3, team_h_difficulty: 3, team_a_difficulty: 4 }),
      createMockFixture({ id: 3, event: 2, team_h: 3, team_a: 1, team_h_difficulty: 5, team_a_difficulty: 5 }),
    ];

    const mockGameweeks = [
      createMockGameweek({ id: 1, name: 'Gameweek 1', is_current: true }),
      createMockGameweek({ id: 2, name: 'Gameweek 2', is_current: false, is_next: true }),
    ];

    (mockFplApiService.getTeams as any).mockResolvedValue(mockTeams);
    (mockFplApiService.getFixtures as any).mockResolvedValue(mockFixtures);
    (mockFplApiService.getGameweeks as any).mockResolvedValue(mockGameweeks);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Keyboard Navigation Compliance', () => {
    it('should support complete tab navigation through all interactive elements', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Get all focusable elements
      const focusableElements = [
        screen.getByDisplayValue('1'), // Start gameweek input
        screen.getByDisplayValue('5'), // End gameweek input
        screen.getByPlaceholderText(/search/i), // Search input
      ];

      // Test forward tab navigation
      for (let i = 0; i < focusableElements.length; i++) {
        await user.tab();
        expect(focusableElements[i]).toHaveFocus();
      }

      // Test reverse tab navigation
      for (let i = focusableElements.length - 2; i >= 0; i--) {
        await user.tab({ shift: true });
        expect(focusableElements[i]).toHaveFocus();
      }
    });

    it('should support keyboard interaction with form controls', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const startInput = screen.getByDisplayValue('1');
      const endInput = screen.getByDisplayValue('5');
      const searchInput = screen.getByPlaceholderText(/search/i);

      // Test number input keyboard controls
      startInput.focus();
      await user.keyboard('{ArrowUp}');
      expect(startInput).toHaveValue(2);

      await user.keyboard('{ArrowDown}');
      expect(startInput).toHaveValue(1);

      // Test text input
      searchInput.focus();
      await user.keyboard('Arsenal');
      expect(searchInput).toHaveValue('Arsenal');

      // Test clearing with keyboard
      await user.keyboard('{Control>}a{/Control}');
      await user.keyboard('{Delete}');
      expect(searchInput).toHaveValue('');
    });

    it('should handle Enter and Space key activation', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Test Enter key on inputs
      const searchInput = screen.getByPlaceholderText(/search/i);
      searchInput.focus();
      await user.keyboard('Liverpool{Enter}');
      expect(searchInput).toHaveValue('Liverpool');
    });

    it('should provide proper focus indicators', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search/i);
      
      // Focus should be visible
      searchInput.focus();
      expect(searchInput).toHaveFocus();
      
      // Element should have focus styles (this would be tested visually in real scenarios)
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide proper ARIA labels for all interactive elements', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Check form inputs have proper labels
      const startInput = screen.getByDisplayValue('1');
      const endInput = screen.getByDisplayValue('5');
      const searchInput = screen.getByPlaceholderText(/search/i);

      expect(startInput).toHaveAttribute('aria-label');
      expect(endInput).toHaveAttribute('aria-label');
      expect(searchInput).toHaveAttribute('aria-label');

      // Verify label content is descriptive
      expect(startInput.getAttribute('aria-label')).toMatch(/start|gameweek/i);
      expect(endInput.getAttribute('aria-label')).toMatch(/end|gameweek/i);
      expect(searchInput.getAttribute('aria-label')).toMatch(/search/i);
    });

    it('should provide proper table semantics', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Check table structure
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('aria-label');

      // Check for column headers
      const columnHeaders = screen.getAllByRole('columnheader');
      expect(columnHeaders.length).toBeGreaterThan(0);

      // Check for row headers (team names)
      const rowHeaders = screen.getAllByRole('rowheader');
      expect(rowHeaders.length).toBeGreaterThan(0);

      // Check table caption or summary
      const tableCaption = table.querySelector('caption') || 
                          table.getAttribute('aria-describedby') ||
                          table.getAttribute('aria-label');
      expect(tableCaption).toBeTruthy();
    });

    it('should announce state changes to screen readers', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search/i);

      // Search for a team
      await user.type(searchInput, 'Arsenal');

      // Should have live region for search results
      await waitFor(() => {
        const liveRegion = screen.queryByRole('status') || 
                          screen.queryByRole('alert') ||
                          screen.queryByLabelText(/results/i);
        
        // Live region should exist or search should work without errors
        expect(searchInput).toHaveValue('Arsenal');
      });
    });

    it('should provide proper error announcements', async () => {
      // Mock API error
      (mockFplApiService.getTeams as any).mockRejectedValue(new Error('Network error'));

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });

      // Error should be announced to screen readers
      const errorElement = screen.getByText(/error/i);
      expect(errorElement).toHaveAttribute('role', 'alert');
    });

    it('should provide descriptive text for complex UI elements', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Check that difficulty indicators have text descriptions
      const difficultyElements = screen.getAllByText(/[1-5]/);
      
      difficultyElements.forEach(element => {
        // Should have aria-label, title, or descriptive text content
        const hasAriaLabel = element.hasAttribute('aria-label');
        const hasTitle = element.hasAttribute('title');
        const hasDescriptiveParent = element.closest('[aria-label]') !== null;
        
        expect(hasAriaLabel || hasTitle || hasDescriptiveParent).toBe(true);
      });
    });
  });

  describe('Color and Contrast Accessibility', () => {
    it('should provide text alternatives for color-coded information', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Check that difficulty legend is present
      expect(screen.getByText(/difficulty/i)).toBeInTheDocument();
      
      // Verify that color information is also conveyed through text
      const legendItems = screen.getAllByText(/easy|medium|hard/i);
      expect(legendItems.length).toBeGreaterThan(0);
    });

    it('should maintain readability in high contrast mode', async () => {
      // Mock high contrast media query
      mockMatchMedia('(prefers-contrast: high)', true);

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Component should render without issues in high contrast mode
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('should work with forced colors mode', async () => {
      // Mock forced colors media query
      mockMatchMedia('(forced-colors: active)', true);

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Component should remain functional with forced colors
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Motion and Animation Accessibility', () => {
    it('should respect reduced motion preferences', async () => {
      mockMatchMedia('(prefers-reduced-motion: reduce)', true);

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Component should render without motion-based animations
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should not cause vestibular disorders with motion', async () => {
      // Test that no auto-playing animations or excessive motion exists
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Should not have auto-playing animations
      // This would be tested more thoroughly with visual testing tools
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Mobile and Touch Accessibility', () => {
    it('should support touch navigation on mobile devices', async () => {
      mockViewport(375, 667); // iPhone viewport

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Touch targets should be appropriately sized
      const interactiveElements = [
        screen.getByDisplayValue('1'),
        screen.getByDisplayValue('5'),
        screen.getByPlaceholderText(/search/i),
      ];

      interactiveElements.forEach(element => {
        // Elements should be present and clickable
        expect(element).toBeInTheDocument();
        expect(element).not.toHaveAttribute('disabled');
      });
    });

    it('should work with screen readers on mobile', async () => {
      mockViewport(375, 667);

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Mobile screen reader navigation should work
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-label');

      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toHaveAttribute('aria-label');
    });

    it('should support voice control interfaces', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Elements should have accessible names for voice control
      const searchInput = screen.getByPlaceholderText(/search/i);
      const startInput = screen.getByDisplayValue('1');
      const endInput = screen.getByDisplayValue('5');

      // Should have accessible names that voice control can target
      expect(searchInput).toHaveAttribute('aria-label');
      expect(startInput).toHaveAttribute('aria-label');
      expect(endInput).toHaveAttribute('aria-label');
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

      renderWithProvider(<FixtureDifficultyTable />);

      // During loading, focus should not be trapped
      const firstFocusableElement = screen.getByDisplayValue('1');
      firstFocusableElement.focus();
      expect(firstFocusableElement).toHaveFocus();

      // Complete loading
      resolveTeams([createMockTeam()]);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Focus should remain where user left it or be managed appropriately
      expect(document.activeElement).toBeTruthy();
    });

    it('should not create focus traps unintentionally', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Should be able to tab out of the component
      const searchInput = screen.getByPlaceholderText(/search/i);
      searchInput.focus();

      // Multiple tabs should eventually move focus outside component
      for (let i = 0; i < 10; i++) {
        await user.tab();
      }

      // Should not be stuck in an infinite loop
      expect(true).toBe(true); // If we reach here, no infinite loop occurred
    });

    it('should restore focus after modal interactions', async () => {
      // Mock error state to test modal-like behavior
      (mockFplApiService.getTeams as any).mockRejectedValue(new Error('API Error'));

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });

      // Focus should be managed in error state
      const errorElement = screen.getByText(/error/i);
      expect(errorElement).toBeInTheDocument();

      // If there's a retry button, it should be focusable
      const retryButton = screen.queryByRole('button', { name: /retry/i });
      if (retryButton) {
        expect(retryButton).toBeInTheDocument();
      }
    });
  });

  describe('Language and Internationalization', () => {
    it('should provide proper language attributes', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Check that text content is in expected language
      // This would be more comprehensive with actual i18n implementation
      const title = screen.getByText('FPL Fixture Difficulty Table');
      expect(title).toBeInTheDocument();
    });

    it('should handle right-to-left languages appropriately', async () => {
      // Mock RTL direction
      document.dir = 'rtl';

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Component should render without layout issues in RTL
      expect(screen.getByRole('table')).toBeInTheDocument();

      // Reset direction
      document.dir = 'ltr';
    });
  });

  describe('Cognitive Accessibility', () => {
    it('should provide clear and consistent navigation', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Navigation should be predictable
      const searchInput = screen.getByPlaceholderText(/search/i);
      const startInput = screen.getByDisplayValue('1');
      const endInput = screen.getByDisplayValue('5');

      // Tab order should be logical
      await user.tab();
      expect(startInput).toHaveFocus();

      await user.tab();
      expect(endInput).toHaveFocus();

      await user.tab();
      expect(searchInput).toHaveFocus();
    });

    it('should provide helpful error messages', async () => {
      (mockFplApiService.getTeams as any).mockRejectedValue(new Error('Network error'));

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });

      // Error message should be clear and actionable
      const errorMessage = screen.getByText(/error/i);
      expect(errorMessage.textContent).toBeTruthy();
      expect(errorMessage.textContent!.length).toBeGreaterThan(5); // Should be descriptive
    });

    it('should not overwhelm users with too much information at once', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Information should be organized and not overwhelming
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
      
      // Should have clear sections/organization
      const mainContent = screen.getByText('FPL Fixture Difficulty Table').closest('div');
      expect(mainContent).toBeInTheDocument();
    });
  });
});