import { AppState } from '../types';

/**
 * Selector functions for accessing computed state values
 */
export const selectors = {
  /**
   * Check if data is currently loading
   */
  isLoading: (state: AppState): boolean => state.loading,

  /**
   * Get current error message
   */
  getError: (state: AppState): string | null => state.error,

  /**
   * Check if we have any data loaded
   */
  hasData: (state: AppState): boolean => 
    state.teams.length > 0 || state.fixtures.length > 0 || state.gameweeks.length > 0,

  /**
   * Check if all required data is loaded and ready
   */
  isDataReady: (state: AppState): boolean => 
    state.teams.length > 0 && state.fixtures.length > 0 && state.gameweeks.length > 0,

  /**
   * Get sorted and filtered teams
   */
  getSortedTeams: (state: AppState) => state.filteredTeams,

  /**
   * Get count of search results
   */
  getSearchResultsCount: (state: AppState): number => state.filteredTeams.length,

  /**
   * Check if we should show "no results" message
   */
  shouldShowNoResults: (state: AppState): boolean => 
    state.searchTerm.length > 0 && state.filteredTeams.length === 0 && !state.loading,

  /**
   * Get current gameweek
   */
  getCurrentGameweek: (state: AppState): number => 
    state.gameweeks.find(gw => gw.is_current)?.id || 1,

  /**
   * Check if data is stale (could be enhanced with timestamp tracking)
   */
  isDataStale: (_state: AppState): boolean => false, // Placeholder for future implementation

  /**
   * Get loading state for specific data types
   */
  getLoadingStates: (state: AppState) => ({
    teams: state.loading && state.teams.length === 0,
    fixtures: state.loading && state.fixtures.length === 0,
    gameweeks: state.loading && state.gameweeks.length === 0,
    updating: state.loading && state.teams.length > 0
  })
};