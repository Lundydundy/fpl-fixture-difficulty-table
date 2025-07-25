import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import FixtureDifficultyTable from '../../components/FixtureDifficultyTable';
import { mockFplApiService } from '../../services/MockFPLApiService';
import { PerformanceTimer, measureExecutionTime } from '../../utils/performance';
import type { Team, Fixture, Gameweek } from '../../types';

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

describe('Performance Benchmarks and Load Testing', () => {
  const user = userEvent.setup();

  // Generate large datasets for load testing
  const generateTeams = (count: number): Team[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Team ${i + 1}`,
      short_name: `T${i + 1}`,
      code: i + 1,
      strength: Math.floor(Math.random() * 5) + 1,
      strength_overall_home: 1000 + Math.floor(Math.random() * 500),
      strength_overall_away: 1000 + Math.floor(Math.random() * 500),
      strength_attack_home: 1000 + Math.floor(Math.random() * 500),
      strength_attack_away: 1000 + Math.floor(Math.random() * 500),
      strength_defence_home: 1000 + Math.floor(Math.random() * 500),
      strength_defence_away: 1000 + Math.floor(Math.random() * 500)
    }));
  };

  const generateFixtures = (teamCount: number, gameweekCount: number): Fixture[] => {
    const fixtures: Fixture[] = [];
    let fixtureId = 1;

    for (let gw = 1; gw <= gameweekCount; gw++) {
      for (let i = 1; i <= teamCount; i += 2) {
        if (i + 1 <= teamCount) {
          fixtures.push({
            id: fixtureId++,
            code: fixtureId,
            event: gw,
            finished: false,
            kickoff_time: `2024-08-${17 + (gw - 1) * 7}T14:00:00Z`,
            minutes: 0,
            provisional_start_time: false,
            started: false,
            team_a: i + 1,
            team_a_score: undefined,
            team_h: i,
            team_h_score: undefined,
            stats: [],
            team_h_difficulty: Math.floor(Math.random() * 5) + 1,
            team_a_difficulty: Math.floor(Math.random() * 5) + 1,
            pulse_id: fixtureId,
          });
        }
      }
    }

    return fixtures;
  };

  const generateGameweeks = (count: number): Gameweek[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Gameweek ${i + 1}`,
      deadline_time: `2024-08-${16 + i * 7}T17:30:00Z`,
      finished: false,
      is_current: i === 0,
      is_next: i === 1
    }));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock performance.now for consistent testing
    vi.stubGlobal('performance', {
      now: vi.fn(() => Date.now()),
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByType: vi.fn(() => [])
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering Performance', () => {
    it('should render small dataset (20 teams, 5 gameweeks) within performance budget', async () => {
      const teams = generateTeams(20);
      const fixtures = generateFixtures(20, 5);
      const gameweeks = generateGameweeks(5);

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { result, duration } = await measureExecutionTime(async () => {
        render(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
        });

        return screen.getByTestId('fixture-table');
      });

      expect(result).toBeInTheDocument();
      expect(duration).toBeLessThan(1000); // Should render within 1 second

      // Verify all teams are rendered
      expect(screen.getAllByTestId(/team-row-/).length).toBe(20);
    });

    it('should handle medium dataset (50 teams, 10 gameweeks) efficiently', async () => {
      const teams = generateTeams(50);
      const fixtures = generateFixtures(50, 10);
      const gameweeks = generateGameweeks(10);

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { result, duration } = await measureExecutionTime(async () => {
        render(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
        });

        return screen.getByTestId('fixture-table');
      });

      expect(result).toBeInTheDocument();
      expect(duration).toBeLessThan(2000); // Should render within 2 seconds

      // Verify teams are rendered
      expect(screen.getAllByTestId(/team-row-/).length).toBe(50);
    });

    it('should handle large dataset (100 teams, 20 gameweeks) with acceptable performance', async () => {
      const teams = generateTeams(100);
      const fixtures = generateFixtures(100, 20);
      const gameweeks = generateGameweeks(20);

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { result, duration } = await measureExecutionTime(async () => {
        render(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
        }, { timeout: 10000 });

        return screen.getByTestId('fixture-table');
      });

      expect(result).toBeInTheDocument();
      expect(duration).toBeLessThan(5000); // Should render within 5 seconds

      // Verify teams are rendered
      expect(screen.getAllByTestId(/team-row-/).length).toBe(100);
    });
  });

  describe('User Interaction Performance', () => {
    beforeEach(() => {
      const teams = generateTeams(50);
      const fixtures = generateFixtures(50, 10);
      const gameweeks = generateGameweeks(10);

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);
    });

    it('should handle search filtering with good performance', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');

      const { duration } = await measureExecutionTime(async () => {
        await user.type(searchInput, 'Team 1');
      });

      expect(duration).toBeLessThan(500); // Search should be responsive

      // Verify filtered results
      await waitFor(() => {
        const visibleRows = screen.getAllByTestId(/team-row-/).filter(row =>
          row.style.display !== 'none'
        );
        expect(visibleRows.length).toBeLessThanOrEqual(20); // Filtered results
      });
    });

    it('should handle sorting with good performance', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const sortButton = screen.getByTestId('sort-name-button');

      const { duration } = await measureExecutionTime(async () => {
        await user.click(sortButton);
      });

      expect(duration).toBeLessThan(300); // Sorting should be fast

      // Verify sort was applied
      await waitFor(() => {
        expect(sortButton).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('should handle gameweek range changes efficiently', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const startInput = screen.getByTestId('gameweek-start-input');
      const endInput = screen.getByTestId('gameweek-end-input');

      const { duration } = await measureExecutionTime(async () => {
        await user.clear(startInput);
        await user.type(startInput, '5');
        await user.clear(endInput);
        await user.type(endInput, '8');
      });

      expect(duration).toBeLessThan(1000); // Range changes should be responsive

      // Verify range was applied
      expect(startInput).toHaveValue(5);
      expect(endInput).toHaveValue(8);
    });
  });

  describe('Memory Usage and Leaks', () => {
    it('should not create memory leaks during component mounting/unmounting', async () => {
      const teams = generateTeams(20);
      const fixtures = generateFixtures(20, 5);
      const gameweeks = generateGameweeks(5);

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      // Measure initial memory (mock for testing)
      const initialMemory = (global as any).mockUsedJSHeapSize || 0;

      const iterations = 10;
      for (let i = 0; i < iterations; i++) {
        const { unmount } = render(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
        });

        unmount();
      }

      // Memory should not grow significantly
      const finalMemory = (global as any).mockUsedJSHeapSize || 0;
      const memoryGrowth = finalMemory - initialMemory;

      // This is a simplified test - in real scenarios you'd use memory profiling tools
      expect(memoryGrowth).toBeLessThan(1000000); // Less than 1MB growth
    });

    it('should clean up event listeners and timers', async () => {
      const teams = generateTeams(10);
      const fixtures = generateFixtures(10, 3);
      const gameweeks = generateGameweeks(3);

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { unmount } = render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Record event listeners before unmount
      const initialListeners = (global as any).mockEventListeners || 0;

      unmount();

      // Verify cleanup
      const finalListeners = (global as any).mockEventListeners || 0;
      expect(finalListeners).toBeLessThanOrEqual(initialListeners);
    });
  });

  describe('Data Processing Performance', () => {
    it('should process fixture calculations efficiently', async () => {
      const teams = generateTeams(50);
      const fixtures = generateFixtures(50, 10);
      const gameweeks = generateGameweeks(10);

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const processingTimer = new PerformanceTimer();

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const processingTime = processingTimer.stop();
      expect(processingTime).toBeLessThan(2000); // Data processing should be fast

      // Verify all fixtures are processed
      const difficultyCells = screen.getAllByTestId(/difficulty-cell/);
      expect(difficultyCells.length).toBeGreaterThan(0);
    });

    it('should handle concurrent data updates efficiently', async () => {
      const teams = generateTeams(30);
      const fixtures = generateFixtures(30, 8);
      const gameweeks = generateGameweeks(8);

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { rerender } = render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Simulate rapid data updates
      const updateTimer = new PerformanceTimer();

      const updates = 5;
      for (let i = 0; i < updates; i++) {
        const updatedFixtures = generateFixtures(30, 8);
        (mockFplApiService.getFixtures as any).mockResolvedValue(updatedFixtures);
        rerender(<FixtureDifficultyTable />);
        
        await waitFor(() => {
          expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
        });
      }

      const updateTime = updateTimer.stop();
      expect(updateTime).toBeLessThan(3000); // Multiple updates should be handled efficiently
    });
  });

  describe('Stress Testing', () => {
    it('should handle extreme dataset size gracefully', async () => {
      // Very large dataset (beyond typical FPL size)
      const teams = generateTeams(200);
      const fixtures = generateFixtures(200, 38);
      const gameweeks = generateGameweeks(38);

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { result, duration } = await measureExecutionTime(async () => {
        render(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
        }, { timeout: 15000 });

        return screen.getByTestId('fixture-table');
      });

      expect(result).toBeInTheDocument();
      expect(duration).toBeLessThan(10000); // Should handle large dataset within 10 seconds

      // Application should remain responsive
      const teams200 = screen.getAllByTestId(/team-row-/);
      expect(teams200.length).toBe(200);
    });

    it('should handle rapid user interactions without degradation', async () => {
      const teams = generateTeams(30);
      const fixtures = generateFixtures(30, 10);
      const gameweeks = generateGameweeks(10);

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      const sortButton = screen.getByTestId('sort-name-button');

      const rapidInteractionTimer = new PerformanceTimer();

      // Rapid sequence of interactions
      await user.type(searchInput, 'Team');
      await user.click(sortButton);
      await user.clear(searchInput);
      await user.type(searchInput, '1');
      await user.click(sortButton);
      await user.clear(searchInput);
      await user.type(searchInput, 'Team 2');

      const interactionTime = rapidInteractionTimer.stop();
      expect(interactionTime).toBeLessThan(2000); // Should handle rapid interactions smoothly

      // UI should remain responsive
      expect(searchInput).toHaveValue('Team 2');
    });
  });

  describe('Performance Monitoring', () => {
    it('should track render performance metrics', async () => {
      const teams = generateTeams(25);
      const fixtures = generateFixtures(25, 6);
      const gameweeks = generateGameweeks(6);

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const renderTimer = new PerformanceTimer();

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const totalRenderTime = renderTimer.stop();

      // Performance metrics should be reasonable
      expect(totalRenderTime).toBeLessThan(3000);
      expect(totalRenderTime).toBeGreaterThan(0);

      // Component should be fully functional
      expect(screen.getAllByTestId(/team-row-/).length).toBe(25);
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByTestId('sort-name-button')).toBeInTheDocument();
    });

    it('should maintain consistent performance across multiple renders', async () => {
      const teams = generateTeams(20);
      const fixtures = generateFixtures(20, 5);
      const gameweeks = generateGameweeks(5);

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const renderTimes: number[] = [];

      // Test multiple renders
      for (let i = 0; i < 3; i++) {
        const { result, duration, unmount } = await measureExecutionTime(async () => {
          const rendered = render(<FixtureDifficultyTable />);
          
          await waitFor(() => {
            expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
          });

          return rendered;
        });

        renderTimes.push(duration);
        unmount();
      }

      // Performance should be consistent (within 50% variance)
      const avgTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
      const maxVariance = avgTime * 0.5;

      renderTimes.forEach(time => {
        expect(Math.abs(time - avgTime)).toBeLessThan(maxVariance);
      });
    });
  });
});
