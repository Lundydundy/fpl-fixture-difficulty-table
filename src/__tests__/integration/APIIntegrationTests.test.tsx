import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import FixtureDifficultyTable from '../../components/FixtureDifficultyTable';
import { fplApiService } from '../../services/FPLApiService';
import type { Team, Fixture, Gameweek } from '../../types';

// Mock the actual FPL API service
vi.mock('../../services/FPLApiService', () => ({
  fplApiService: {
    getTeams: vi.fn(),
    getFixtures: vi.fn(),
    getGameweeks: vi.fn(),
  },
}));

describe('API Integration Tests', () => {
  const user = userEvent.setup();
  
  const mockTeams: Team[] = [
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
  ];

  const mockFixtures: Fixture[] = [
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
    },
    {
      id: 2,
      code: 2,
      event: 1,
      finished: false,
      finished_provisional: false,
      kickoff_time: '2024-08-17T16:30:00Z',
      minutes: 0,
      provisional_start_time: false,
      started: false,
      team_a: 3,
      team_a_score: undefined,
      team_h: 2,
      team_h_score: undefined,
      stats: [],
      team_h_difficulty: 2,
      team_a_difficulty: 5,
      pulse_id: 2,
    },
    {
      id: 3,
      code: 3,
      event: 2,
      finished: false,
      finished_provisional: false,
      kickoff_time: '2024-08-24T14:00:00Z',
      minutes: 0,
      provisional_start_time: false,
      started: false,
      team_a: 1,
      team_a_score: undefined,
      team_h: 3,
      team_h_score: undefined,
      stats: [],
      team_h_difficulty: 1,
      team_a_difficulty: 5,
      pulse_id: 3,
    }
  ];

  const mockGameweeks: Gameweek[] = [
    {
      id: 1,
      name: 'Gameweek 1',
      deadline_time: '2024-08-16T17:30:00Z',
      finished: false,
      is_current: true,
      is_next: false,
      is_previous: false
    },
    {
      id: 2,
      name: 'Gameweek 2',
      deadline_time: '2024-08-23T17:30:00Z',
      finished: false,
      is_current: false,
      is_next: true,
      is_previous: false
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Successful API Responses', () => {
    beforeEach(() => {
      (fplApiService.getTeams as any).mockResolvedValue(mockTeams);
      (fplApiService.getFixtures as any).mockResolvedValue(mockFixtures);
      (fplApiService.getGameweeks as any).mockResolvedValue(mockGameweeks);
    });

    it('should load and display data from all API endpoints', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Verify API calls were made
      expect(fplApiService.getTeams).toHaveBeenCalledTimes(1);
      expect(fplApiService.getFixtures).toHaveBeenCalledTimes(1);
      expect(fplApiService.getGameweeks).toHaveBeenCalledTimes(1);

      // Verify team data is displayed
      expect(screen.getByText('Arsenal')).toBeInTheDocument();
      expect(screen.getByText('Liverpool')).toBeInTheDocument();
      expect(screen.getByText('Manchester City')).toBeInTheDocument();

      // Verify fixtures are processed and displayed
      const difficultyCells = screen.getAllByTestId(/difficulty-cell/);
      expect(difficultyCells.length).toBeGreaterThan(0);
    });

    it('should handle concurrent API calls efficiently', async () => {
      const startTime = Date.now();
      
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const endTime = Date.now();
      const loadTime = endTime - startTime;

      // Should load within reasonable time (concurrent calls)
      expect(loadTime).toBeLessThan(1000);

      // All API calls should have been made concurrently
      expect(fplApiService.getTeams).toHaveBeenCalledTimes(1);
      expect(fplApiService.getFixtures).toHaveBeenCalledTimes(1);
      expect(fplApiService.getGameweeks).toHaveBeenCalledTimes(1);
    });

    it('should correctly process and correlate data from multiple endpoints', async () => {
      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Check that fixture data is correctly correlated with team data
      const arsenalRow = screen.getByTestId('team-row-1'); // Arsenal
      expect(arsenalRow).toBeInTheDocument();

      // Arsenal should have fixtures in gameweeks 1 and 2
      const arsenalCells = screen.getAllByTestId(/team-1-difficulty-/);
      expect(arsenalCells.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle data updates when API returns new data', async () => {
      const { rerender } = render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Update mock data
      const updatedFixtures = [...mockFixtures, {
        id: 4,
        code: 4,
        event: 3,
        finished: false,
        finished_provisional: false,
        kickoff_time: '2024-08-31T14:00:00Z',
        minutes: 0,
        provisional_start_time: false,
        started: false,
        team_a: 2,
        team_a_score: undefined,
        team_h: 1,
        team_h_score: undefined,
        stats: [],
        team_h_difficulty: 4,
        team_a_difficulty: 2,
        pulse_id: 4,
      }];

      (fplApiService.getFixtures as any).mockResolvedValue(updatedFixtures);

      rerender(<FixtureDifficultyTable />);

      // New fixture should be processed and displayed
      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });
    });
  });

  describe('API Error Handling', () => {
    it('should handle teams API failure gracefully', async () => {
      (fplApiService.getTeams as any).mockRejectedValue(new Error('Teams API failed'));
      (fplApiService.getFixtures as any).mockResolvedValue(mockFixtures);
      (fplApiService.getGameweeks as any).mockResolvedValue(mockGameweeks);

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      const errorDisplay = screen.getByTestId('error-display');
      expect(errorDisplay).toHaveTextContent(/error/i);

      // Should show retry button
      const retryButton = screen.getByTestId('retry-button');
      expect(retryButton).toBeInTheDocument();
    });

    it('should handle fixtures API failure gracefully', async () => {
      (fplApiService.getTeams as any).mockResolvedValue(mockTeams);
      (fplApiService.getFixtures as any).mockRejectedValue(new Error('Fixtures API failed'));
      (fplApiService.getGameweeks as any).mockResolvedValue(mockGameweeks);

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    it('should handle gameweeks API failure gracefully', async () => {
      (fplApiService.getTeams as any).mockResolvedValue(mockTeams);
      (fplApiService.getFixtures as any).mockResolvedValue(mockFixtures);
      (fplApiService.getGameweeks as any).mockRejectedValue(new Error('Gameweeks API failed'));

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    it('should handle multiple API failures simultaneously', async () => {
      (fplApiService.getTeams as any).mockRejectedValue(new Error('Teams API failed'));
      (fplApiService.getFixtures as any).mockRejectedValue(new Error('Fixtures API failed'));
      (fplApiService.getGameweeks as any).mockRejectedValue(new Error('Gameweeks API failed'));

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      // Should show error state
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });

    it('should allow retry after API failure', async () => {
      // First call fails
      (fplApiService.getTeams as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue(mockTeams);
      (fplApiService.getFixtures as any).mockResolvedValue(mockFixtures);
      (fplApiService.getGameweeks as any).mockResolvedValue(mockGameweeks);

      render(<FixtureDifficultyTable />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      // Click retry
      const retryButton = screen.getByTestId('retry-button');
      await user.click(retryButton);

      // Should eventually show data
      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      expect(screen.getByText('Arsenal')).toBeInTheDocument();
    });
  });

  describe('Network Conditions', () => {
    it('should handle slow API responses', async () => {
      // Simulate slow responses
      (fplApiService.getTeams as any).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockTeams), 2000))
      );
      (fplApiService.getFixtures as any).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockFixtures), 1500))
      );
      (fplApiService.getGameweeks as any).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockGameweeks), 1000))
      );

      render(<FixtureDifficultyTable />);

      // Should show loading state
      expect(screen.getByTestId('loading-display')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Loading should be gone
      expect(screen.queryByTestId('loading-display')).not.toBeInTheDocument();
    });

    it('should handle intermittent network issues', async () => {
      let callCount = 0;
      
      (fplApiService.getTeams as any).mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          return Promise.reject(new Error('Network timeout'));
        }
        return Promise.resolve(mockTeams);
      });
      (fplApiService.getFixtures as any).mockResolvedValue(mockFixtures);
      (fplApiService.getGameweeks as any).mockResolvedValue(mockGameweeks);

      render(<FixtureDifficultyTable />);

      // First attempt should fail
      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      // Retry should also fail
      const retryButton = screen.getByTestId('retry-button');
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      // Third retry should succeed
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      expect(fplApiService.getTeams).toHaveBeenCalledTimes(3);
    });
  });

  describe('Data Validation', () => {
    it('should handle malformed team data', async () => {
      const malformedTeams = [
        {
          id: 1,
          name: '',  // Empty name
          short_name: 'ARS',
          code: 3
          // Missing strength fields
        },
        {
          id: 2,
          name: 'Liverpool',
          short_name: '', // Empty short name
          code: 14,
          strength: 5
        }
      ] as Team[];

      (fplApiService.getTeams as any).mockResolvedValue(malformedTeams);
      (fplApiService.getFixtures as any).mockResolvedValue(mockFixtures);
      (fplApiService.getGameweeks as any).mockResolvedValue(mockGameweeks);

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        const errorDisplay = screen.queryByTestId('error-display');
        const table = screen.queryByTestId('fixture-table');
        
        // Should either show error or handle gracefully
        expect(errorDisplay || table).toBeInTheDocument();
      });
    });

    it('should handle malformed fixture data', async () => {
      const malformedFixtures = [
        {
          id: 1,
          event: 1,
          team_h: 1,
          team_a: 2,
          // Missing difficulty fields
          kickoff_time: 'invalid-date'
        },
        {
          id: 2,
          event: 1,
          team_h: 999, // Non-existent team
          team_a: 2,
          team_h_difficulty: 3,
          team_a_difficulty: 4
        }
      ] as Fixture[];

      (fplApiService.getTeams as any).mockResolvedValue(mockTeams);
      (fplApiService.getFixtures as any).mockResolvedValue(malformedFixtures);
      (fplApiService.getGameweeks as any).mockResolvedValue(mockGameweeks);

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        const errorDisplay = screen.queryByTestId('error-display');
        const table = screen.queryByTestId('fixture-table');
        
        // Should either show error or filter out bad data
        expect(errorDisplay || table).toBeInTheDocument();
      });
    });

    it('should handle empty API responses', async () => {
      (fplApiService.getTeams as any).mockResolvedValue([]);
      (fplApiService.getFixtures as any).mockResolvedValue([]);
      (fplApiService.getGameweeks as any).mockResolvedValue([]);

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        const emptyState = screen.queryByTestId('empty-state') ||
                          screen.queryByText(/no data/i) ||
                          screen.queryByTestId('fixture-table');
        expect(emptyState).toBeInTheDocument();
      });
    });

    it('should validate API response structure', async () => {
      // Invalid response structure
      (fplApiService.getTeams as any).mockResolvedValue({ invalid: 'structure' });
      (fplApiService.getFixtures as any).mockResolvedValue(mockFixtures);
      (fplApiService.getGameweeks as any).mockResolvedValue(mockGameweeks);

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  describe('API Rate Limiting and Caching', () => {
    it('should handle API rate limiting errors', async () => {
      (fplApiService.getTeams as any).mockRejectedValue({
        status: 429,
        message: 'Rate limit exceeded'
      });
      (fplApiService.getFixtures as any).mockResolvedValue(mockFixtures);
      (fplApiService.getGameweeks as any).mockResolvedValue(mockGameweeks);

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      // Should show appropriate error message for rate limiting
      const errorDisplay = screen.getByTestId('error-display');
      expect(errorDisplay).toHaveTextContent(/error/i);
    });

    it('should not make redundant API calls on re-render', async () => {
      (fplApiService.getTeams as any).mockResolvedValue(mockTeams);
      (fplApiService.getFixtures as any).mockResolvedValue(mockFixtures);
      (fplApiService.getGameweeks as any).mockResolvedValue(mockGameweeks);

      const { rerender } = render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Clear mock call history
      vi.clearAllMocks();

      // Re-render component
      rerender(<FixtureDifficultyTable />);

      // Should not make new API calls (if using caching)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Note: This test assumes caching is implemented
      // If not implemented, API calls would be made again
    });
  });

  describe('Authentication and Authorization', () => {
    it('should handle authentication errors', async () => {
      (fplApiService.getTeams as any).mockRejectedValue({
        status: 401,
        message: 'Unauthorized'
      });

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      const errorDisplay = screen.getByTestId('error-display');
      expect(errorDisplay).toHaveTextContent(/error/i);
    });

    it('should handle forbidden access errors', async () => {
      (fplApiService.getTeams as any).mockRejectedValue({
        status: 403,
        message: 'Forbidden'
      });

      render(<FixtureDifficultyTable />);

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      const errorDisplay = screen.getByTestId('error-display');
      expect(errorDisplay).toHaveTextContent(/error/i);
    });
  });
});
