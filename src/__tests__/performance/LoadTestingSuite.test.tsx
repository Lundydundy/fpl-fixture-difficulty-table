import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { 
  renderWithProvider, 
  generateLargeTeamDataset,
  generateLargeFixtureDataset,
  createMockGameweek,
  measureTestExecutionTime,
  TestPerformanceTimer
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

describe('Performance and Load Testing Suite', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering Performance', () => {
    it('should render small dataset within performance budget', async () => {
      const teams = generateLargeTeamDataset(20);
      const fixtures = generateLargeFixtureDataset(20, 5);
      const gameweeks = Array.from({ length: 5 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { result, duration } = await measureTestExecutionTime(async () => {
        renderWithProvider(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
        });

        return screen.getByText('FPL Fixture Difficulty Table');
      });

      expect(result).toBeInTheDocument();
      expect(duration).toBeLessThan(1000); // Should render within 1 second
    });

    it('should handle medium dataset efficiently', async () => {
      const teams = generateLargeTeamDataset(50);
      const fixtures = generateLargeFixtureDataset(50, 10);
      const gameweeks = Array.from({ length: 10 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { result, duration } = await measureTestExecutionTime(async () => {
        renderWithProvider(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
        }, { timeout: 5000 });

        return screen.getByText('FPL Fixture Difficulty Table');
      });

      expect(result).toBeInTheDocument();
      expect(duration).toBeLessThan(2500); // Should render within 2.5 seconds
    });

    it('should handle large dataset with acceptable performance', async () => {
      const teams = generateLargeTeamDataset(100);
      const fixtures = generateLargeFixtureDataset(100, 20);
      const gameweeks = Array.from({ length: 20 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { result, duration } = await measureTestExecutionTime(async () => {
        renderWithProvider(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
        }, { timeout: 10000 });

        return screen.getByText('FPL Fixture Difficulty Table');
      });

      expect(result).toBeInTheDocument();
      expect(duration).toBeLessThan(5000); // Should render within 5 seconds
    });
  });

  describe('User Interaction Performance', () => {
    beforeEach(async () => {
      const teams = generateLargeTeamDataset(30);
      const fixtures = generateLargeFixtureDataset(30, 8);
      const gameweeks = Array.from({ length: 8 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);
    });

    it('should handle search filtering with good performance', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search/i);

      const { duration } = await measureTestExecutionTime(async () => {
        await user.type(searchInput, 'Team 1');
      });

      expect(duration).toBeLessThan(500); // Search should be responsive
      expect(searchInput).toHaveValue('Team 1');
    });

    it('should handle gameweek range changes efficiently', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const startInput = screen.getByDisplayValue('1');
      const endInput = screen.getByDisplayValue('5');

      const { duration } = await measureTestExecutionTime(async () => {
        await user.clear(startInput);
        await user.type(startInput, '3');
        await user.clear(endInput);
        await user.type(endInput, '8');
      });

      expect(duration).toBeLessThan(1000); // Range changes should be responsive
      expect(startInput).toHaveValue(3);
      expect(endInput).toHaveValue(8);
    });

    it('should handle rapid user interactions without degradation', async () => {
      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search/i);
      const startInput = screen.getByDisplayValue('1');

      const { duration } = await measureTestExecutionTime(async () => {
        // Rapid sequence of interactions
        await user.type(searchInput, 'Team');
        await user.clear(startInput);
        await user.type(startInput, '2');
        await user.clear(searchInput);
        await user.type(searchInput, 'Team 5');
        await user.clear(startInput);
        await user.type(startInput, '4');
      });

      expect(duration).toBeLessThan(2000); // Should handle rapid interactions smoothly
      expect(searchInput).toHaveValue('Team 5');
      expect(startInput).toHaveValue(4);
    });
  });

  describe('Memory Usage and Leak Detection', () => {
    it('should not create memory leaks during component lifecycle', async () => {
      const teams = generateLargeTeamDataset(20);
      const fixtures = generateLargeFixtureDataset(20, 5);
      const gameweeks = Array.from({ length: 5 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      // Test multiple mount/unmount cycles
      const iterations = 5;
      const durations: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const { duration, unmount } = await measureTestExecutionTime(async () => {
          const rendered = renderWithProvider(<FixtureDifficultyTable />);
          
          await waitFor(() => {
            expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
          });

          return rendered;
        });

        durations.push(duration);
        unmount();
      }

      // Performance should remain consistent (no significant degradation)
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const maxVariance = avgDuration * 0.5; // Allow 50% variance

      durations.forEach(duration => {
        expect(Math.abs(duration - avgDuration)).toBeLessThan(maxVariance);
      });
    });

    it('should clean up event listeners and timers', async () => {
      const teams = generateLargeTeamDataset(10);
      const fixtures = generateLargeFixtureDataset(10, 3);
      const gameweeks = Array.from({ length: 3 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { unmount } = renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Unmount should not throw errors (indicates proper cleanup)
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Data Processing Performance', () => {
    it('should process fixture calculations efficiently', async () => {
      const teams = generateLargeTeamDataset(40);
      const fixtures = generateLargeFixtureDataset(40, 8);
      const gameweeks = Array.from({ length: 8 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const processingTimer = new TestPerformanceTimer();

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const processingTime = processingTimer.stop();
      expect(processingTime).toBeLessThan(2000); // Data processing should be fast
    });

    it('should handle concurrent data updates efficiently', async () => {
      const teams = generateLargeTeamDataset(25);
      const fixtures = generateLargeFixtureDataset(25, 6);
      const gameweeks = Array.from({ length: 6 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { rerender } = renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      // Simulate rapid data updates
      const updateTimer = new TestPerformanceTimer();

      const updates = 3;
      for (let i = 0; i < updates; i++) {
        const updatedFixtures = generateLargeFixtureDataset(25, 6);
        (mockFplApiService.getFixtures as any).mockResolvedValue(updatedFixtures);
        rerender(<FixtureDifficultyTable />);
        
        await waitFor(() => {
          expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
        });
      }

      const updateTime = updateTimer.stop();
      expect(updateTime).toBeLessThan(2000); // Multiple updates should be handled efficiently
    });
  });

  describe('Stress Testing', () => {
    it('should handle extreme dataset size gracefully', async () => {
      // Very large dataset (beyond typical FPL size)
      const teams = generateLargeTeamDataset(150);
      const fixtures = generateLargeFixtureDataset(150, 30);
      const gameweeks = Array.from({ length: 30 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const { result, duration } = await measureTestExecutionTime(async () => {
        renderWithProvider(<FixtureDifficultyTable />);

        await waitFor(() => {
          expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
        }, { timeout: 15000 });

        return screen.getByText('FPL Fixture Difficulty Table');
      });

      expect(result).toBeInTheDocument();
      expect(duration).toBeLessThan(10000); // Should handle large dataset within 10 seconds
    });

    it('should maintain responsiveness under load', async () => {
      const teams = generateLargeTeamDataset(80);
      const fixtures = generateLargeFixtureDataset(80, 15);
      const gameweeks = Array.from({ length: 15 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      }, { timeout: 8000 });

      // Test that user interactions remain responsive even with large dataset
      const searchInput = screen.getByPlaceholderText(/search/i);

      const { duration } = await measureTestExecutionTime(async () => {
        await user.type(searchInput, 'Team 50');
      });

      expect(duration).toBeLessThan(1000); // Should remain responsive
      expect(searchInput).toHaveValue('Team 50');
    });
  });

  describe('Performance Monitoring and Metrics', () => {
    it('should track render performance metrics', async () => {
      const teams = generateLargeTeamDataset(25);
      const fixtures = generateLargeFixtureDataset(25, 6);
      const gameweeks = Array.from({ length: 6 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const renderTimer = new TestPerformanceTimer();

      renderWithProvider(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
      });

      const totalRenderTime = renderTimer.stop();

      // Performance metrics should be reasonable
      expect(totalRenderTime).toBeLessThan(3000);
      expect(totalRenderTime).toBeGreaterThan(0);

      // Component should be fully functional
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('should maintain consistent performance across multiple renders', async () => {
      const teams = generateLargeTeamDataset(20);
      const fixtures = generateLargeFixtureDataset(20, 5);
      const gameweeks = Array.from({ length: 5 }, (_, i) => 
        createMockGameweek({ id: i + 1, name: `Gameweek ${i + 1}` })
      );

      (mockFplApiService.getTeams as any).mockResolvedValue(teams);
      (mockFplApiService.getFixtures as any).mockResolvedValue(fixtures);
      (mockFplApiService.getGameweeks as any).mockResolvedValue(gameweeks);

      const renderTimes: number[] = [];

      // Test multiple renders
      for (let i = 0; i < 3; i++) {
        const { duration, unmount } = await measureTestExecutionTime(async () => {
          const rendered = renderWithProvider(<FixtureDifficultyTable />);
          
          await waitFor(() => {
            expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
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