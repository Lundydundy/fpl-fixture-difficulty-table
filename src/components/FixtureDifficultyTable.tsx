import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { FixtureDifficultyTableProps, GameweekRange } from '../types';
import { useAppContext } from '../context/AppContext';
import { selectors } from '../context/selectors';
import { fplApiService } from '../services/FPLApiService';
import { errorHandlingService, ErrorInfo } from '../services/ErrorHandlingService';
import { accessibilityService } from '../services/AccessibilityService';
import { 
  transformFixtureData, 
  filterTeams, 
  sortTeams
} from '../utils/dataProcessing';

// Import child components
import GameweekRangeInput from './GameweekRangeInput';
import TeamSearchFilter from './TeamSearchFilter';
import FixtureTable from './FixtureTable';
import DifficultyLegend from './DifficultyLegend';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';
import SkeletonLoader from './SkeletonLoader';
import ErrorDisplay from './ErrorDisplay';

import TeamSelector from './TeamSelector';
import FixtureRunAnalyzer from './FixtureRunAnalyzer';
import ServiceModeSelector from './ServiceModeSelector';

import './FixtureDifficultyTable.css';

const FixtureDifficultyTable: React.FC<FixtureDifficultyTableProps> = ({
  initialGameweeks = 5,
  defaultSortBy = 'team'
}) => {
  const { state, dispatch } = useAppContext();
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'table' | 'analyzer'>('table');

  // Memoized selectors
  const isLoading = useMemo(() => selectors.isLoading(state), [state]);
  const error = useMemo(() => selectors.getError(state), [state]);
  const hasData = useMemo(() => selectors.hasData(state), [state]);
  const isDataReady = useMemo(() => selectors.isDataReady(state), [state]);
  const sortedTeams = useMemo(() => selectors.getSortedTeams(state), [state]);
  const searchResultsCount = useMemo(() => selectors.getSearchResultsCount(state), [state]);
  const shouldShowNoResults = useMemo(() => selectors.shouldShowNoResults(state), [state]);

  // Initialize component state and accessibility service
  useEffect(() => {
    dispatch({ type: 'SET_SELECTED_GAMEWEEKS', payload: initialGameweeks });
    dispatch({ type: 'SET_SORT_BY', payload: defaultSortBy });
    
    // Initialize accessibility service
    accessibilityService.init();
    
    return () => {
      accessibilityService.cleanup();
    };
  }, [dispatch, initialGameweeks, defaultSortBy]);

  // Load initial data with enhanced error handling
  const loadData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    setErrorInfo(null);

    try {
      // Use configured FPL API service (defaults to offline)
      const apiService = fplApiService;
      console.log('🔧 Using FPL API service mode:', fplApiService.getCurrentMode());
      
      // Use error handling service with retry logic
      const [teams, fixtures, gameweeks] = await errorHandlingService.withRetry(
        async () => {
          return Promise.all([
            errorHandlingService.withTimeout(apiService.getTeams(), 10000),
            errorHandlingService.withTimeout(apiService.getFixtures(), 10000),
            errorHandlingService.withTimeout(apiService.getGameweeks(), 10000)
          ]);
        },
        { maxRetries: 3, baseDelay: 1000 }
      );

      // Update state with fetched data
      dispatch({ type: 'SET_TEAMS', payload: teams });
      dispatch({ type: 'SET_FIXTURES', payload: fixtures });
      dispatch({ type: 'SET_GAMEWEEKS', payload: gameweeks });
      
      // Initialize with all teams selected if no selection exists
      if (state.selectedTeamIds.length === 0) {
        dispatch({ type: 'SET_SELECTED_TEAM_IDS', payload: teams.map(team => team.id) });
      }
      
      // Reset retry count on success
      setRetryCount(0);

    } catch (err) {
      const currentRetryCount = retryCount + 1;
      setRetryCount(currentRetryCount);
      
      // Create detailed error info
      const errorDetails = errorHandlingService.createErrorInfo(err, currentRetryCount);
      setErrorInfo(errorDetails);
      
      // Log error for monitoring (silently handled)
      errorHandlingService.logError(errorDetails);
      
      // Set user-friendly error message
      const userMessage = errorHandlingService.getUserFriendlyMessage(errorDetails.type, errorDetails.message);
      dispatch({ type: 'SET_ERROR', payload: userMessage });
      
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, retryCount]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []); // Remove loadData dependency to avoid infinite loops

  // Update filtered teams when data changes - memoized for performance
  const processedTeams = useMemo(() => {
    if (!hasData) return [];

    // Use the actual gameweek range from state
    const { start: startGameweek, end: endGameweek } = state.gameweekRange;
    
    // Filter fixtures to the selected gameweek range
    const filteredFixtures = state.fixtures.filter(fixture => 
      fixture.event >= startGameweek && 
      fixture.event <= endGameweek
    );

    let teams = transformFixtureData(
      filteredFixtures, 
      state.teams, 
      endGameweek // Use end gameweek as max
    );

    // Apply combined filtering (search + team selection)
    teams = filterTeams(teams, state.searchTerm, state.selectedTeamIds);

    // Apply sorting
    teams = sortTeams(teams, state.sortBy, state.sortDirection);

    return teams;
  }, [
    hasData,
    state.fixtures,
    state.teams,
    state.gameweeks,
    state.gameweekRange,
    state.searchTerm,
    state.selectedTeamIds,
    state.sortBy,
    state.sortDirection
  ]);

  // Update filtered teams when processed data changes
  useEffect(() => {
    dispatch({ type: 'SET_FILTERED_TEAMS', payload: processedTeams });
  }, [processedTeams, dispatch]);

  // Handle gameweek range change
  const handleGameweekChange = useCallback((range: GameweekRange) => {
    const gameweekCount = range.end - range.start + 1;
    dispatch({ type: 'SET_SELECTED_GAMEWEEKS', payload: gameweekCount });
    dispatch({ type: 'SET_GAMEWEEK_RANGE', payload: range });
    
    // Announce gameweek change to screen readers
    accessibilityService.announceGameweekChange(range.start, range.end);
  }, [dispatch]);

  // Handle search term change
  const handleSearchChange = useCallback((searchTerm: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: searchTerm });
  }, [dispatch]);

  // Handle team selection change
  const handleTeamSelectionChange = useCallback((selectedTeamIds: number[]) => {
    dispatch({ type: 'SET_SELECTED_TEAM_IDS', payload: selectedTeamIds });
    
    // Announce team selection change
    const teamCount = selectedTeamIds.length;
    const message = teamCount === 0 
      ? 'All teams selected' 
      : `${teamCount} team${teamCount === 1 ? '' : 's'} selected`;
    accessibilityService.announce(message);
  }, [dispatch]);

  // Handle sort change
  const handleSortChange = useCallback((sortBy: typeof state.sortBy) => {
    // Toggle direction if same sort option is selected
    const newDirection = state.sortBy === sortBy && state.sortDirection === 'asc' 
      ? 'desc' 
      : 'asc';
    
    dispatch({ type: 'SET_SORT_BY', payload: sortBy });
    dispatch({ type: 'SET_SORT_DIRECTION', payload: newDirection });
    
    // Announce sort change to screen readers
    accessibilityService.announceSortChange(sortBy, newDirection);
  }, [dispatch, state.sortBy, state.sortDirection]);

  // Handle retry after error
  const handleRetry = useCallback(() => {
    loadData();
  }, [loadData]);

  // Use the gameweek range from state
  const gameweekRange: GameweekRange = useMemo(() => {
    return state.gameweekRange;
  }, [state.gameweekRange]);

  // Enhanced loading UI with skeleton screens
  if (isLoading && !hasData) {
    return (
      <div className="fixture-difficulty-table">
        <header className="fixture-difficulty-table__header">
          <h1>FPL Fixture Difficulty Table</h1>
          <p>Analyze upcoming fixtures and difficulty ratings for all Premier League teams</p>
        </header>

        <SkeletonLoader type="controls" />
        
        <div className="fixture-difficulty-table__content">
          <LoadingSpinner size="large" message="Loading fixture data..." />
          <SkeletonLoader type="table" rows={10} columns={6} />
        </div>
      </div>
    );
  }

  // Enhanced error UI - show when error and no data
  if (error && !hasData && errorInfo) {
    return (
      <div className="fixture-difficulty-table">
        <header className="fixture-difficulty-table__header">
          <h1>FPL Fixture Difficulty Table</h1>
          <p>Analyze upcoming fixtures and difficulty ratings for all Premier League teams</p>
        </header>

        <ErrorDisplay
          type={errorInfo.type}
          onRetry={handleRetry}
          variant="card"
          showDetails={true}
          retryCount={retryCount}
          maxRetries={3}
        />
      </div>
    );
  }

  // Error fallback for ErrorBoundary
  const errorFallback = (
    <ErrorDisplay
      type="unknown"
      message="An unexpected error occurred while rendering the fixture difficulty table."
      onRetry={handleRetry}
      variant="card"
      showDetails={false}
      retryCount={retryCount}
      maxRetries={3}
    />
  );

  return (
    <ErrorBoundary fallback={errorFallback}>
      <div className="fixture-difficulty-table">
        <header className="fixture-difficulty-table__header">
          <h1>FPL Fixture Difficulty Table</h1>
          <p>Analyze upcoming fixtures and difficulty ratings for all Premier League teams</p>
        </header>



        {/* Primary Controls - Most Important */}
        <div className="fixture-difficulty-table__primary-controls">
          <div className="fixture-difficulty-table__gameweek-control">
            <GameweekRangeInput
              value={gameweekRange}
              min={1}
              max={38}
              onChange={handleGameweekChange}
            />
          </div>
        </div>

        {/* Secondary Controls - Filtering */}
        <div className="fixture-difficulty-table__secondary-controls">
          <div className="fixture-difficulty-table__filter-group">
            <TeamSelector
              teams={state.teams}
              selectedTeams={state.selectedTeamIds}
              onSelectionChange={handleTeamSelectionChange}
              placeholder="Select teams to display..."
            />
          </div>

          <div className="fixture-difficulty-table__filter-group">
            <TeamSearchFilter
              searchTerm={state.searchTerm}
              onSearchChange={handleSearchChange}
              placeholder="Search teams..."
            />
          </div>
        </div>

        {/* Legend - Less Prominent */}
        <div className="fixture-difficulty-table__legend-section">
          <DifficultyLegend />
        </div>

        {/* Tab Navigation */}
        <div className="fixture-difficulty-table__tabs">
          <button 
            className={`tab-button ${activeTab === 'table' ? 'active' : ''}`}
            onClick={() => setActiveTab('table')}
            type="button"
          >
            📊 Fixture Table
          </button>
          <button 
            className={`tab-button ${activeTab === 'analyzer' ? 'active' : ''}`}
            onClick={() => setActiveTab('analyzer')}
            type="button"
          >
            🔍 Best Runs Analysis
          </button>
        </div>

        <div className="fixture-difficulty-table__content">
          {isLoading && hasData && (
            <div className="fixture-difficulty-table__updating">
              <span>Updating...</span>
            </div>
          )}

          {shouldShowNoResults && (
            <div className="fixture-difficulty-table__no-results">
              <p>No teams found matching "{state.searchTerm}"</p>
              <button 
                onClick={() => handleSearchChange('')}
                className="fixture-difficulty-table__clear-search"
                type="button"
              >
                Clear search
              </button>
            </div>
          )}

          {isDataReady && !shouldShowNoResults && (
            <>
              {activeTab === 'table' && (
                <>
                  <div className="fixture-difficulty-table__stats">
                    <span>
                      Showing {searchResultsCount} team{searchResultsCount === 1 ? '' : 's'}
                      {state.selectedTeamIds.length > 0 && state.selectedTeamIds.length < state.teams.length && 
                        ` (${state.selectedTeamIds.length} selected)`}
                      {state.searchTerm && ` matching "${state.searchTerm}"`}
                    </span>
                    <span>
                      Analyzing gameweeks {state.gameweekRange.start}-{state.gameweekRange.end}
                    </span>
                  </div>

                  <FixtureTable
                    teams={sortedTeams}
                    gameweekRange={state.gameweekRange}
                    gameweeks={state.gameweeks}
                    sortBy={state.sortBy}
                    onSortChange={handleSortChange}
                  />
                </>
              )}

              {activeTab === 'analyzer' && (
                <FixtureRunAnalyzer
                  teams={state.teams}
                  fixtures={state.fixtures}
                />
              )}
            </>
          )}
        </div>

        {error && hasData && errorInfo && (
          <ErrorDisplay
            type={errorInfo.type}
            onRetry={handleRetry}
            variant="banner"
            showDetails={false}
            retryCount={retryCount}
            maxRetries={3}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default FixtureDifficultyTable;