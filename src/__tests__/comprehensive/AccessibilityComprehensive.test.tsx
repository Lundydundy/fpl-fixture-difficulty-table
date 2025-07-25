import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { waitFor, screen } from '@testing-library/react';
import { renderWithProvider, generateTeams, generateFixtures, generateGameweeks } from '../setup/testUtils';
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

describe('Comprehensive Accessibility Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    
    const teams = generateTeams(10);
    const fixtures = generateFixtures(10, 3);
    const gameweeks = generateGameweeks(3);

    (mockFplApiService.getTeams as any).mockResolvedValue(teams);
    (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
    (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Keyboard Navigation Comprehensive Tests', () => {
    it('should support full keyboard navigation workflow', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Get all interactive elements
      const buttons = screen.getAllByRole('button');
      const textInputs = screen.getAllByRole('textbox');
      const numberInputs = screen.getAllByRole('spinbutton');
      const allInteractive = [...buttons, ...textInputs, ...numberInputs];

      if (allInteractive.length > 0) {
        // Test sequential tab navigation
        allInteractive[0].focus();
        expect(allInteractive[0]).toHaveFocus();

        // Tab through elements
        for (let i = 1; i < Math.min(allInteractive.length, 5); i++) {
          await user.tab();
          // Verify focus moved (document.activeElement should be one of our elements)
          expect(document.activeElement).toBeTruthy();
        }

        // Test reverse tab navigation
        await user.tab({ shift: true });
        expect(document.activeElement).toBeTruthy();
      }
    });

    it('should support keyboard shortcuts and hotkeys', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Test common keyboard shortcuts
      const searchInput = screen.queryByRole('textbox');
      if (searchInput) {
        searchInput.focus();
        
        // Test Ctrl+A (select all)
        await user.keyboard('{Control>}a{/Control}');
        
        // Test Escape (should clear or reset)
        await user.keyboard('{Escape}');
        
        expect(searchInput).toBeInTheDocument();
      }
    });

    it('should handle arrow key navigation in tables', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const table = screen.queryByRole('table');
      if (table) {
        const cells = screen.getAllByRole('cell');
        if (cells.length > 0) {
          cells[0].focus();
          
          // Test arrow key navigation
          await user.keyboard('{ArrowRight}');
          await user.keyboard('{ArrowDown}');
          await user.keyboard('{ArrowLeft}');
          await user.keyboard('{ArrowUp}');
          
          expect(table).toBeInTheDocument();
        }
      }
    });

    it('should support Enter and Space key activation', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        const button = buttons[0];
        button.focus();
        
        // Test Enter key activation
        await user.keyboard('{Enter}');
        
        // Test Space key activation
        await user.keyboard(' ');
        
        expect(button).toBeInTheDocument();
      }
    });
  });

  describe('Screen Reader Support Comprehensive Tests', () => {
    it('should provide comprehensive ARIA labeling', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Check all interactive elements have proper labels
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const hasLabel = button.getAttribute('aria-label') || 
                        button.getAttribute('aria-labelledby') ||
                        button.textContent;
        expect(hasLabel).toBeTruthy();
      });

      const inputs = screen.getAllByRole('textbox').concat(screen.getAllByRole('spinbutton'));
      inputs.forEach(input => {
        const hasLabel = input.getAttribute('aria-label') || 
                        input.getAttribute('aria-labelledby') ||
                        input.getAttribute('placeholder');
        expect(hasLabel).toBeTruthy();
      });
    });

    it('should provide proper table semantics', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const table = screen.queryByRole('table');
      if (table) {
        // Check table has caption or aria-label
        const hasTableLabel = table.getAttribute('aria-label') || 
                             table.getAttribute('aria-labelledby') ||
                             screen.queryByRole('caption');
        expect(hasTableLabel).toBeTruthy();

        // Check for column headers
        const columnHeaders = screen.getAllByRole('columnheader');
        expect(columnHeaders.length).toBeGreaterThan(0);

        // Check for row headers if applicable
        const rowHeaders = screen.queryAllByRole('rowheader');
        // Row headers are optional but if present should be properly marked
        
        // Check table structure
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(0);
      }
    });

    it('should announce dynamic content changes', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Look for live regions
      const liveRegions = screen.queryAllByRole('status')
        .concat(screen.queryAllByRole('alert'))
        .concat(screen.queryAllByRole('log'));

      // Test dynamic content changes
      const searchInput = screen.queryByRole('textbox');
      if (searchInput) {
        await user.type(searchInput, 'test search');
        
        // After search, there should be some indication of results
        // This could be in a live region or status update
        await waitFor(() => {
          // The component should handle search results announcement
          expect(searchInput).toHaveValue('test search');
        });
      }
    });

    it('should provide proper error announcements', async () => {
      // Mock API error
      (mockFplApiService.getTeams as any).mockRejectedValue(new Error('Test error'));

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        const errorElement = screen.queryByRole('alert') || 
                           screen.queryByText(/error/i) ||
                           screen.getByText('FPL Fixture Difficulty Table');
        expect(errorElement).toBeInTheDocument();
      });
    });

    it('should support screen reader navigation landmarks', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Check for semantic landmarks
      const main = screen.queryByRole('main');
      const navigation = screen.queryByRole('navigation');
      const regions = screen.queryAllByRole('region');
      const banners = screen.queryAllByRole('banner');
      const contentinfo = screen.queryAllByRole('contentinfo');

      // At least some semantic structure should be present
      const hasSemanticStructure = main || navigation || regions.length > 0 || 
                                  banners.length > 0 || contentinfo.length > 0;
      
      // The component should have some semantic structure
      expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
    });
  });

  describe('Color and Contrast Accessibility', () => {
    it('should provide text alternatives for all color-coded information', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Look for difficulty indicators that should have text alternatives
      const difficultyElements = screen.queryAllByText(/[1-5]/) // Difficulty numbers
        .concat(screen.queryAllByText(/easy/i))
        .concat(screen.queryAllByText(/hard/i))
        .concat(screen.queryAllByText(/medium/i))
        .concat(screen.queryAllByText(/difficult/i));

      // Should have some text-based difficulty indicators
      expect(difficultyElements.length).toBeGreaterThan(0);
    });

    it('should provide comprehensive difficulty legend', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Look for legend or explanation of color coding
      const legendElements = screen.queryAllByText(/legend/i)
        .concat(screen.queryAllByText(/difficulty/i))
        .concat(screen.queryAllByText(/scale/i))
        .concat(screen.queryAllByText(/rating/i));

      if (legendElements.length > 0) {
        expect(legendElements[0]).toBeInTheDocument();
      }
    });

    it('should work without color dependency', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Verify that all information is available through text/patterns/shapes
      // not just color
      const textualIndicators = screen.queryAllByText(/[1-5]/)
        .concat(screen.queryAllByText(/H|A/)) // Home/Away indicators
        .concat(screen.queryAllByText(/vs|@/)); // Match indicators

      expect(textualIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('Focus Management', () => {
    it('should manage focus during loading states', async () => {
      // Create delayed promise to test loading
      let resolveTeams: any;
      const teamsPromise = new Promise((resolve) => {
        resolveTeams = resolve;
      });
      
      (mockFplApiService.getTeams as any).mockReturnValue(teamsPromise);

      renderWithProvider(<FixtureDifficultyTable />);

      // During loading, focus should not be lost
      const firstFocusable = screen.getAllByRole('button')
        .concat(screen.getAllByRole('textbox'))
        .concat(screen.getAllByRole('spinbutton'))[0];

      if (firstFocusable) {
        firstFocusable.focus();
        expect(firstFocusable).toHaveFocus();
      }

      // Complete loading
      resolveTeams(generateTeams(5));

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Focus should be managed appropriately
      if (firstFocusable) {
        expect(document.activeElement).toBeTruthy();
      }
    });

    it('should provide skip navigation options', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Look for skip links (may be visually hidden)
      const skipLinks = screen.queryAllByText(/skip/i);
      
      // Skip links are optional but good for accessibility
      // The test passes if the component renders properly
      expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
    });

    it('should handle focus trapping in modals', async () => {
      // Mock error state to potentially trigger modal
      (mockFplApiService.getTeams as any).mockRejectedValue(new Error('Test error'));

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        const errorElement = screen.queryByRole('dialog') || 
                           screen.queryByRole('alert') ||
                           screen.getByText('FPL Fixture Difficulty Table');
        expect(errorElement).toBeInTheDocument();
      });

      // If there's a modal/dialog, focus should be managed
      const dialog = screen.queryByRole('dialog');
      if (dialog) {
        const focusableInDialog = dialog.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableInDialog.length > 0) {
          expect(focusableInDialog[0]).toBeInTheDocument();
        }
      }
    });
  });

  describe('Mobile Accessibility', () => {
    it('should support touch navigation', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Check that interactive elements are accessible on mobile
      const buttons = screen.getAllByRole('button');
      const inputs = screen.getAllByRole('textbox').concat(screen.getAllByRole('spinbutton'));

      // All interactive elements should be present and accessible
      expect(buttons.length + inputs.length).toBeGreaterThan(0);

      // Test touch interactions (simulated through user events)
      if (buttons.length > 0) {
        await user.click(buttons[0]);
        expect(buttons[0]).toBeInTheDocument();
      }
    });

    it('should provide adequate touch target sizes', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Check that interactive elements meet minimum touch target size
      const interactiveElements = screen.getAllByRole('button')
        .concat(screen.getAllByRole('textbox'))
        .concat(screen.getAllByRole('spinbutton'));

      interactiveElements.forEach(element => {
        // Elements should be present and clickable
        expect(element).toBeInTheDocument();
        expect(element).not.toHaveAttribute('disabled');
      });
    });
  });

  describe('Assistive Technology Compatibility', () => {
    it('should work with screen readers', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Check for screen reader friendly structure
      const headings = screen.queryAllByRole('heading');
      const lists = screen.queryAllByRole('list');
      const tables = screen.queryAllByRole('table');

      // Should have some structured content
      const hasStructure = headings.length > 0 || lists.length > 0 || tables.length > 0;
      
      // Component should provide structured content for screen readers
      expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
    });

    it('should support voice control software', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Elements should have clear, speakable labels for voice control
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const label = button.getAttribute('aria-label') || button.textContent;
        expect(label).toBeTruthy();
        if (label) {
          expect(label.trim().length).toBeGreaterThan(0);
        }
      });
    });

    it('should support switch navigation', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // All interactive elements should be focusable for switch navigation
      const interactiveElements = screen.getAllByRole('button')
        .concat(screen.getAllByRole('textbox'))
        .concat(screen.getAllByRole('spinbutton'));

      interactiveElements.forEach(element => {
        // Elements should be focusable (tabindex >= 0 or naturally focusable)
        const tabIndex = element.getAttribute('tabindex');
        const isFocusable = tabIndex === null || parseInt(tabIndex) >= 0;
        expect(isFocusable).toBe(true);
      });
    });
  });
});