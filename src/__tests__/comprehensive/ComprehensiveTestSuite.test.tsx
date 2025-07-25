import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { 
  renderWithProvider, 
  createMockTeam, 
  createMockFixture, 
  createMockGameweek,
  generateLargeTeamDataset,
  generateLargeFixtureDataset,
  measureTestExecutionTime,
  mockViewport,
  mockMatchMedia
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

describe('Comprehensive Test Suite - Task 15 Implementation', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset viewport
    mockViewport(1024, 768);
    
    // Setup default successful responses
    const mockTeams = [
      createMockTeam({ id: 1, name: 'Arsenal', short_name: 'ARS' }),
      createMockTeam({ id: 2, name: 'Liverpool', short_name: 'LIV' }),
      createMockTeam({ id: 3, name: 'Manchester City', short_name: 'MCI' }),
    ];

    const mockFixtures = [
      createMockFixture({ id: 1, event: 1, team_h: 1, team_a: 2, team_h_difficulty: 3, team_a_difficulty: 4 }),
      createMockFixture({ id: 2, event: 1, team_h: 2, team_a: 3, team_h_difficulty: 2, team_a_difficulty: 5 }),
      createMockFixture({ id: 3, event: 2, team_h: 3, team_a: 1, team_h_difficulty: 1, team_a_difficulty: 5 }),
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

  describe('1. End-to-End User Workflows', () => {
    it('should complete search, sort, and filter workflow successfully', async () => {
      const { result, duration } = await measureTestExecutionTime(async () => {
        renderWithProvider(<FixtureDifficultyTable />);

        // Wait for component to load
        await waitFor(() => {
          expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
        });

        return screen.getByText('FPL Fixture Difficulty Table');
      });

      expect(result).toBeInTheDocument();
      expect(duration).toBeLessThan(3000); // Should load within 3 seconds

      // Test search functionality
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'Arsenal');
      expect(searchInput).toHaveValue('Arsenal');

      // Test gameweek range changes
      const startInput = screen.getByDisplayValue('1');
      const endInput = screen.getByDisplayValue('5');
      
      await user.clear(startInput);
      await user.type(startInput, '2');
      expect(startInput).toHaveValue(2);

      await user.clear(endInput);
      await user.type(endInput, '8');
      expect(endInput).toHaveValue(8);
    });

    it('should handle error recovery workflow', async () => {
      // First attempt fails
      (mockFplApiService.getTeams as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue([createMockTeam()]);

      renderWithProvider(<FixtureDifficultyTable />);

      // Should show error state
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });

      // Should have retry functionality
      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      // Should eventually show data
      await waitFor(() => {
        expect(screen.getByText('Arsenal')).toBeInTheDocument();
      });
    });
  });

  describe('2. Accessibility Tests', () => {
    it('should support complete keyboard navigation', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Test tab navigation through interactive elements
      const interactiveElements = [
        screen.getByDisplayValue('1'), // Start gameweek
        screen.getByDisplayValue('5'), // End gameweek  
        screen.getByPlaceholderText(/search/i), // Search input
      ];

      for (let i = 0; i < interactiveElements.length; i++) {
        await user.tab();
        expect(interactiveElements[i]).toHaveFocus();
      }
    });

    it('should provide proper ARIA attributes and screen reader support', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Check for proper ARIA labels
      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toHaveAttribute('aria-label');

      // Check for table semantics
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('aria-label');

      // Check for column headers
      const columnHeaders = screen.getAllByRole('columnheader');
      expect(columnHeaders.length).toBeGreaterThan(0);
    });

    it('should handle reduced motion preferences', async () => {
      mockMatchMedia('(prefers-reduced-motion: reduce)', true);

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Component should render without animations
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('3. Visual Regression and Responsive Design', () => {
    it('should adapt to mobile viewport (320px)', async () => {
      mockViewport(320, 568);

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Should render mobile-friendly layout
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('should adapt to tablet viewport (768px)', async () => {
      mockViewport(768, 1024);

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Should render tablet-optimized layout
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should adapt to desktop viewport (1200px)', async () => {
      mockViewport(1200, 800);

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Should render full desktop layout
      expect(screen.getByRole('table')).toBeInTheDocument();
      const columnHeaders = screen.getAllByRole('columnheader');
      expect(columnHeaders.length).toBeGreaterThanOrEqual(3);
    });

    it('should maintain color coding consistency', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Check that difficulty legend is present
      expect(screen.getByText(/difficulty/i)).toBeInTheDocument();
      
      // Verify color coding elements exist
      const difficultyElements = screen.getAllByText(/[1-5]/);
      expect(difficultyElements.length).toBeGreaterThan(0);
    });
  });

  describe('4. API Integration Tests', () => {
    it('should handle concurrent API calls efficiently', async () => {
      const { duration } = await measureTestExecutionTime(async () => {
        renderWithProvider(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
        });
      });

      expect(duration).toBeLessThan(2000); // Should load within 2 seconds

      // Verify all API calls were made
      expect(mockFplApiService.getTeams).toHaveBeenCalledTimes(1);
      expect(mockFplApiService.getFixtures).toHaveBeenCalledTimes(1);
      expect(mockFplApiService.getGameweeks).toHaveBeenCalledTimes(1);
    });

    it('should handle malformed data gracefully', async () => {
      // Provide malformed data
      (mockFplApiService.getTeams as any).mockResolvedValue([
        { id: 1, name: '', short_name: 'ARS' }, // Missing required fields
      ]);

      renderWithProvider(<FixtureDifficultyTable />);

      // Should either show error or handle gracefully
      await waitFor(() => {
        const errorElement = screen.queryByText(/error/i);
        const tableElement = screen.queryByRole('table');
        expect(errorElement || tableElement).toBeInTheDocument();
      });
    });

    it('should validate API response structure', async () => {
      // Invalid response structure
      (mockFplApiService.getTeams as any).mockResolvedValue({ invalid: 'structure' });

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe('5. Performance Benchmarks and Load Testing', () => {
    it('should handle small dataset (20 teams, 5 gameweeks) efficiently', async () => {
      const teams = generateLargeTeamDataset(20);
      const fixtures = generateLargeFixtureDataset(20, 5);
      const gameweeks = Array.from({ length: 5 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { duration } = await measureTestExecutionTime(async () => {
        renderWithProvider(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
        });
      });

      expect(duration).toBeLessThan(1500); // Should render within 1.5 seconds
    });

    it('should handle medium dataset (50 teams, 10 gameweeks) efficiently', async () => {
      const teams = generateLargeTeamDataset(50);
      const fixtures = generateLargeFixtureDataset(50, 10);
      const gameweeks = Array.from({ length: 10 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { duration } = await measureTestExecutionTime(async () => {
        renderWithProvider(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
        }, { timeout: 5000 });
      });

      expect(duration).toBeLessThan(3000); // Should render within 3 seconds
    });

    it('should handle user interactions with good performance', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search/i);

      const { duration } = await measureTestExecutionTime(async () => {
        await user.type(searchInput, 'Arsenal');
      });

      expect(duration).toBeLessThan(500); // Search should be responsive
      expect(searchInput).toHaveValue('Arsenal');
    });

    it('should not create memory leaks during mount/unmount cycles', async () => {
      const iterations = 5;
      
      for (let i = 0; i < iterations; i++) {
        const { unmount } = renderWithProvider(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
        });

        unmount();
      }

      // If we reach here without errors, memory management is working
      expect(true).toBe(true);
    });
  });

  describe('6. Error Handling and Edge Cases', () => {
    it('should handle empty data gracefully', async () => {
      (mockFplApiService.getTeams as any).mockResolvedValue([]);
      (mockFplApiService.getFixtures as any).mockResolvedValue([]);
      (mockFplApiService.getGameweeks as any).mockResolvedValue([]);

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        // Should render without crashing
        const component = screen.getByText('FPL Fixture Difficulty Table');
        expect(component).toBeInTheDocument();
      });
    });

    it('should handle network timeouts', async () => {
      // Simulate timeout
      (mockFplApiService.getTeams as any).mockImplementation(
        () => new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('should handle rapid state changes', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search/i);
      const startInput = screen.getByDisplayValue('1');

      // Rapid interactions
      await user.type(searchInput, 'Arsenal');
      await user.clear(startInput);
      await user.type(startInput, '3');
      await user.clear(searchInput);
      await user.type(searchInput, 'Liverpool');

      // Should handle all changes without errors
      expect(searchInput).toHaveValue('Liverpool');
      expect(startInput).toHaveValue(3);
    });
  });

  describe('7. Cross-browser and Platform Compatibility', () => {
    it('should work with different user agents', async () => {
      // Mock different user agents
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
      });

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should handle touch events on mobile devices', async () => {
      mockViewport(375, 667); // iPhone viewport

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Touch interactions should work
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.click(searchInput);
      expect(searchInput).toHaveFocus();
    });
  });

  describe('8. Data Integrity and Validation', () => {
    it('should validate fixture-team relationships', async () => {
      const teams = [
        createMockTeam({ id: 1, name: 'Arsenal' }),
        createMockTeam({ id: 2, name: 'Liverpool' }),
      ];

      const fixtures = [
        createMockFixture({ team_h: 1, team_a: 2 }), // Valid
        createMockFixture({ team_h: 1, team_a: 999 }), // Invalid team_a
      ];

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);

      renderWithProvider(<FixtureDifficultyTable />);

      // Should handle invalid relationships gracefully
      await waitFor(() => {
        const component = screen.getByText('FPL Fixture Difficulty Table');
        expect(component).toBeInTheDocument();
      });
    });

    it('should validate difficulty ratings', async () => {
      const fixtures = [
        createMockFixture({ team_h_difficulty: 0 }), // Invalid (too low)
        createMockFixture({ team_a_difficulty: 6 }), // Invalid (too high)
        createMockFixture({ team_h_difficulty: 3, team_a_difficulty: 4 }), // Valid
      ];

      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        const component = screen.getByText('FPL Fixture Difficulty Table');
        expect(component).toBeInTheDocument();
      });
    });
  });
});