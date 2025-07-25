import { AppAction } from './AppContext';
import { SortOption } from '../types';
import { Team, Fixture, Gameweek, TeamFixture } from '../types';

// Action Creators
export const actions = {
  // Loading and Error Actions
  setLoading: (loading: boolean): AppAction => ({
    type: 'SET_LOADING',
    payload: loading,
  }),

  setError: (error: string | null): AppAction => ({
    type: 'SET_ERROR',
    payload: error,
  }),

  // Data Actions
  setTeams: (teams: Team[]): AppAction => ({
    type: 'SET_TEAMS',
    payload: teams,
  }),

  setFixtures: (fixtures: Fixture[]): AppAction => ({
    type: 'SET_FIXTURES',
    payload: fixtures,
  }),

  setGameweeks: (gameweeks: Gameweek[]): AppAction => ({
    type: 'SET_GAMEWEEKS',
    payload: gameweeks,
  }),

  setFilteredTeams: (filteredTeams: TeamFixture[]): AppAction => ({
    type: 'SET_FILTERED_TEAMS',
    payload: filteredTeams,
  }),

  // UI State Actions
  setSelectedGameweeks: (gameweeks: number): AppAction => ({
    type: 'SET_SELECTED_GAMEWEEKS',
    payload: gameweeks,
  }),

  setSearchTerm: (searchTerm: string): AppAction => ({
    type: 'SET_SEARCH_TERM',
    payload: searchTerm,
  }),

  setSortBy: (sortBy: SortOption): AppAction => ({
    type: 'SET_SORT_BY',
    payload: sortBy,
  }),

  setSortDirection: (direction: 'asc' | 'desc'): AppAction => ({
    type: 'SET_SORT_DIRECTION',
    payload: direction,
  }),

  // Utility Actions
  resetState: (): AppAction => ({
    type: 'RESET_STATE',
  }),

  // Combined Actions for common operations
  toggleSortDirection: (currentDirection: 'asc' | 'desc'): AppAction => ({
    type: 'SET_SORT_DIRECTION',
    payload: currentDirection === 'asc' ? 'desc' : 'asc',
  }),

  clearSearch: (): AppAction => ({
    type: 'SET_SEARCH_TERM',
    payload: '',
  }),
};

// Thunk-like action creators for complex operations
export const asyncActions = {
  // Action to handle sort change with direction toggle
  handleSortChange: (
    newSortBy: SortOption,
    currentSortBy: SortOption,
    currentDirection: 'asc' | 'desc'
  ): AppAction[] => {
    if (newSortBy === currentSortBy) {
      // Toggle direction if same sort option
      return [actions.toggleSortDirection(currentDirection)];
    } else {
      // Change sort option and reset to ascending
      return [
        actions.setSortBy(newSortBy),
        actions.setSortDirection('asc'),
      ];
    }
  },

  // Action to handle error with loading state
  handleError: (error: string): AppAction[] => [
    actions.setLoading(false),
    actions.setError(error),
  ],

  // Action to start loading operation
  startLoading: (): AppAction[] => [
    actions.setLoading(true),
    actions.setError(null),
  ],

  // Action to complete loading operation
  completeLoading: (): AppAction[] => [
    actions.setLoading(false),
    actions.setError(null),
  ],
};