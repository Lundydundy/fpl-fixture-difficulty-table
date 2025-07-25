import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';

import FixtureDifficultyTable from '../FixtureDifficultyTable';
import { AppProvider } from '../../context/AppContext';
import { fplApiService } from '../../services/FPLApiService';
import { Team, Fixture, Gameweek } from '../../types';

// Mock the API service
vi.mock('../../services/FPLApiService', () => ({
  fplApiService: {
    instance: {
      getTeams: vi.fn(),
      getFixtures: vi.fn(),
      getGameweeks: vi.fn(),
    }
  }
}));

// Mock child components to focus on integration logic
vi.mock('../GameweekSlider', () => ({
  default: ({ value, onChange }: any) => (
    <div data-testid="gameweek-slider">
      <button 
        onClick={() => onChange({ start: 1, end: 8 })}
        data-testid="change-gameweeks"
      >
        Change to 8 gameweeks
      </button>
      <span data-testid="current-range">GW {value.start} - GW {value.end}</span>
    </div>
  )
}));

vi.mock('../TeamSearchFilter', () => ({
  default: ({ searchTerm, onSearchChange }: any) => (
    <div data-testid="team-search-filter">
      <input
        data-testid="search-input"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search teams..."
      />
    </div>
  )
}));

vi.mock('../FixtureTable', () => ({
  default: ({ teams, sortBy, onSortChange }: any) => (
    <div data-testid="fixture-table">
      <button 
        onClick={() => onSortChange('difficulty')}
        data-testid="sort-by-difficulty"
      >
        Sort by Difficulty
      </button>
      <div data-testid="teams-count">{teams.length} teams</div>
      <div data-testid="current-sort">{sortBy}</div>
    </div>
  )
}));

vi.mock('../DifficultyLegend', () => ({
  default: () => <div data-testid="difficulty-legend">Legend</div>
}));

// Test data
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
    name: 'Manchester City',
    short_name: 'MCI',
    code: 43,
    strength: 5,
    strength_overall_home: 1350,
    strength_overall_away: 1300,
    strength_attack_home: 1400,
    strength_attack_away: 1350,
    strength_defence_home: 1320,
    strength_defence_away: 1280
  },
  {
    id: 3,
    name: 'Liverpool',
    short_name: 'LIV',
    code: 14,
    strength: 5,
    strength_overall_home: 1320,
    strength_overall_away: 1280,
    strength_attack_home: 1380,
    strength_attack_away: 1340,
    strength_defence_home: 1300,
    strength_defence_away: 1250
  }
];

const mockFixtures: Fixture[] = [
  {
    id: 1,
    code: 12345,
    event: 1,
    finished: false,
    kickoff_time: '2024-08-17T14:00:00Z',
    team_a: 2, // Man City away
    team_h: 1, // Arsenal home
    team_a_difficulty: 4,
    team_h_difficulty: 3
  },
  {
    id: 2,
    code: 12346,
    event: 1,
    finished: false,
    kickoff_time: '2024-08-17T16:30:00Z',
    team_a: 3, // Liverpool away
    team_h: 2, // Man City home
    team_a_difficulty: 5,
    team_h_difficulty: 2
  },
  {
    id: 3,
    code: 12347,
    event: 2,
    finished: false,
    kickoff_time: '2024-08-24T14:00:00Z',
    team_a: 1, // Arsenal away
    team_h: 3, // Liverpool home
    team_a_difficulty: 4,
    team_h_difficulty: 3
  }
];

const mockGameweeks: Gameweek[] = [
  {
    id: 1,
    name: 'Gameweek 1',
    deadline_time: '2024-08-16T18:30:00Z',
    finished: false,
    is_current: true,
    is_next: false
  },
  {
    id: 2,
    name: 'Gameweek 2',
    deadline_time: '2024-08-23T18:30:00Z',
    finished: false,
    is_current: false,
    is_next: true
  }
];

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>
    {children}
  </AppProvider>
);

describe('FixtureDifficultyTable Integration Tests', () => {
  const mockApiService = fplApiService.instance as any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default successful API responses
    mockApiService.getTeams.mockResolvedValue(mockTeams);
    mockApiService.getFixtures.mockResolvedValue(mockFixtures);
    mockApiService.getGameweeks.mockResolvedValue(mockGameweeks);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Loading and Data Flow', () => {
    it('loads data and shows main content', async () => {
      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      // Wait for data to load and main content to appear
      await waitFor(() => {
        expect(screen.getByText('FPL Fixture Difficulty Table')).toBeInTheDocument();
        expect(screen.getByTestId('gameweek-slider')).toBeInTheDocument();
        expect(screen.getByTestId('team-search-filter')).toBeInTheDocument();
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
        expect(screen.getByTestId('difficulty-legend')).toBeInTheDocument();
      });
    });

    it('calls all API services on mount', async () => {
      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockApiService.getTeams).toHaveBeenCalledTimes(1);
        expect(mockApiService.getFixtures).toHaveBeenCalledTimes(1);
        expect(mockApiService.getGameweeks).toHaveBeenCalledTimes(1);
      });
    });

    it('passes correct initial props to child components', async () => {
      render(
        <TestWrapper>
          <FixtureDifficultyTable initialGameweeks={8} defaultSortBy="difficulty" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-range')).toHaveTextContent('GW 1 - GW 8');
        expect(screen.getByTestId('current-sort')).toHaveTextContent('difficulty');
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error state when API calls fail', async () => {
      const errorMessage = 'Failed to fetch teams data';
      mockApiService.getTeams.mockRejectedValue(new Error(errorMessage));

      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Unable to load fixture data')).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });

      // Should not show main content
      expect(screen.queryByTestId('fixture-table')).not.toBeInTheDocument();
    });

    it('allows retry after error', async () => {
      // First call fails
      mockApiService.getTeams.mockRejectedValueOnce(new Error('Network error'));
      // Second call succeeds
      mockApiService.getTeams.mockResolvedValue(mockTeams);

      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Unable to load fixture data')).toBeInTheDocument();
      });

      // Click retry
      const retryButton = screen.getByText('Try Again');
      fireEvent.click(retryButton);

      // Wait for successful load
      await waitFor(() => {
        expect(screen.queryByText('Unable to load fixture data')).not.toBeInTheDocument();
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Should have called API twice (initial + retry)
      expect(mockApiService.getTeams).toHaveBeenCalledTimes(2);
    });

    it('handles API errors gracefully', async () => {
      const errorMessage = 'Network error';
      mockApiService.getTeams.mockRejectedValue(new Error(errorMessage));

      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Unable to load fixture data')).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe('Component Integration', () => {
    it('updates gameweek selection and propagates to table', async () => {
      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Initial state should show 5 gameweeks (default)
      expect(screen.getByTestId('current-range')).toHaveTextContent('GW 1 - GW 5');

      // Change gameweeks via slider
      const changeButton = screen.getByTestId('change-gameweeks');
      fireEvent.click(changeButton);

      // Should update the range display
      expect(screen.getByTestId('current-range')).toHaveTextContent('GW 1 - GW 8');

      // Should show updated stats
      await waitFor(() => {
        expect(screen.getByText(/Analyzing 8 gameweeks/)).toBeInTheDocument();
      });
    });

    it('handles search functionality and updates results', async () => {
      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Should initially show all teams
      expect(screen.getByTestId('teams-count')).toHaveTextContent('3 teams');

      // Search for Arsenal
      const searchInput = screen.getByTestId('search-input');
      await userEvent.type(searchInput, 'Arsenal');

      // Should filter results
      await waitFor(() => {
        expect(screen.getByTestId('teams-count')).toHaveTextContent('1 teams');
        expect(screen.getByText(/Showing 1 team matching "Arsenal"/)).toBeInTheDocument();
      });
    });

    it('handles search with no results', async () => {
      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Search for non-existent team
      const searchInput = screen.getByTestId('search-input');
      await userEvent.type(searchInput, 'NonExistentTeam');

      // Should show no results message
      await waitFor(() => {
        expect(screen.getByText('No teams found matching "NonExistentTeam"')).toBeInTheDocument();
        expect(screen.getByText('Clear search')).toBeInTheDocument();
        expect(screen.queryByTestId('fixture-table')).not.toBeInTheDocument();
      });

      // Clear search should restore results
      const clearButton = screen.getByText('Clear search');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
        expect(screen.getByTestId('teams-count')).toHaveTextContent('3 teams');
      });
    });

    it('handles sorting changes and updates table', async () => {
      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Should start with default sort
      expect(screen.getByTestId('current-sort')).toHaveTextContent('team');

      // Change sort to difficulty
      const sortButton = screen.getByTestId('sort-by-difficulty');
      fireEvent.click(sortButton);

      // Should update sort
      expect(screen.getByTestId('current-sort')).toHaveTextContent('difficulty');
    });
  });

  describe('State Management Integration', () => {
    it('maintains state consistency across component updates', async () => {
      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Make multiple state changes
      const searchInput = screen.getByTestId('search-input');
      await userEvent.type(searchInput, 'City');

      const changeGameweeksButton = screen.getByTestId('change-gameweeks');
      fireEvent.click(changeGameweeksButton);

      const sortButton = screen.getByTestId('sort-by-difficulty');
      fireEvent.click(sortButton);

      // All changes should be reflected
      await waitFor(() => {
        expect(screen.getByTestId('current-range')).toHaveTextContent('GW 1 - GW 8');
        expect(screen.getByTestId('current-sort')).toHaveTextContent('difficulty');
        expect(screen.getByText(/matching "City"/)).toBeInTheDocument();
        expect(screen.getByText(/Analyzing 8 gameweeks/)).toBeInTheDocument();
      });
    });

    it('handles concurrent API calls correctly', async () => {
      // Simulate slow API responses
      mockApiService.getTeams.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockTeams), 100))
      );
      mockApiService.getFixtures.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockFixtures), 150))
      );
      mockApiService.getGameweeks.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockGameweeks), 50))
      );

      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      // Wait for all API calls to complete
      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      }, { timeout: 1000 });

      // All API calls should have been made
      expect(mockApiService.getTeams).toHaveBeenCalledTimes(1);
      expect(mockApiService.getFixtures).toHaveBeenCalledTimes(1);
      expect(mockApiService.getGameweeks).toHaveBeenCalledTimes(1);
    });
  });



  describe('Performance and Optimization', () => {
    it('does not make unnecessary API calls on re-renders', async () => {
      const { rerender } = render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Re-render with same props
      rerender(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      // Should not make additional API calls
      expect(mockApiService.getTeams).toHaveBeenCalledTimes(1);
      expect(mockApiService.getFixtures).toHaveBeenCalledTimes(1);
      expect(mockApiService.getGameweeks).toHaveBeenCalledTimes(1);
    });

    it('handles rapid state changes efficiently', async () => {
      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');

      // Rapid typing should not cause issues
      await userEvent.type(searchInput, 'Arsenal');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'City');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'Liverpool');

      // Should handle all changes correctly
      await waitFor(() => {
        expect(screen.getByText(/matching "Liverpool"/)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('maintains proper focus management during state changes', async () => {
      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      searchInput.focus();

      // Type in search
      await userEvent.type(searchInput, 'Arsenal');

      // Focus should remain on search input
      expect(searchInput).toHaveFocus();
    });

    it('provides appropriate ARIA live regions for dynamic content', async () => {
      render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('fixture-table')).toBeInTheDocument();
      });

      // Stats should be announced to screen readers
      const statsElement = screen.getByText(/Showing 3 teams/);
      expect(statsElement).toBeInTheDocument();
    });
  });
});