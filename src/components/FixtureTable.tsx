import React, { useMemo, useCallback } from 'react';
import { TeamFixture, SortOption, Gameweek, TeamNameDisplay } from '../types';
import { FixtureCell } from './FixtureCell';
import './FixtureTable.css';

import { GameweekRange } from '../types';

export interface FixtureTableProps {
  teams: TeamFixture[];
  gameweekRange: GameweekRange;
  gameweeks: Gameweek[];
  teamNameDisplay: TeamNameDisplay;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

/**
 * FixtureTable component displays the main data table with team rows and fixture columns.
 * Provides sorting functionality and proper accessibility features.
 * Optimized with React.memo and useMemo for better performance.
 */
export const FixtureTable: React.FC<FixtureTableProps> = ({
  teams,
  gameweekRange,
  gameweeks,
  teamNameDisplay,
  sortBy,
  onSortChange
}) => {
  /**
   * Handle sort column click - memoized to prevent unnecessary re-renders
   */
  const handleSortClick = useCallback((sortOption: SortOption) => {
    onSortChange(sortOption);
  }, [onSortChange]);

  /**
   * Get sort indicator for column headers - memoized
   */
  const getSortIndicator = useCallback((column: SortOption): string => {
    if (sortBy !== column) return '';
    return ' ↓'; // Simple down arrow for active sort
  }, [sortBy]);

  /**
   * Format gameweek deadline date to "Aug 15" format
   */
  const formatGameweekDate = useCallback((deadline_time: string): string => {
    try {
      const date = new Date(deadline_time);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
      const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return '';
    }
  }, []);

  /**
   * Get gameweek date by gameweek number
   */
  const getGameweekDate = useCallback((gameweekNumber: number): string => {
    const gameweek = gameweeks.find(gw => gw.id === gameweekNumber);
    return gameweek ? formatGameweekDate(gameweek.deadline_time) : '';
  }, [gameweeks, formatGameweekDate]);

  /**
   * Get team name based on display preference
   */
  const getTeamName = useCallback((team: TeamFixture['team']): string => {
    return teamNameDisplay === 'short' ? team.short_name : team.name;
  }, [teamNameDisplay]);

  /**
   * Generate gameweek column headers - memoized to prevent recalculation
   */
  const gameweekHeaders = useMemo(() => {
    const headers = [];
    for (let i = gameweekRange.start; i <= gameweekRange.end; i++) {
      const gameweekDate = getGameweekDate(i);
      headers.push(
        <th key={`gw-${i}`} className="gameweek-header" scope="col">
          <div className="gameweek-header-content">
            <div className="gameweek-number">GW{i}</div>
            {gameweekDate && (
              <div className="gameweek-date">{gameweekDate}</div>
            )}
          </div>
        </th>
      );
    }
    return headers;
  }, [gameweekRange, getGameweekDate]);

  /**
   * Render fixture cells for a team's gameweeks
   */
  const renderTeamFixtures = (teamFixture: TeamFixture) => {
    const cells = [];
    
    for (let gameweek = gameweekRange.start; gameweek <= gameweekRange.end; gameweek++) {
      const fixture = teamFixture.fixtures.find(f => f.gameweek === gameweek);
      
      if (fixture) {
        cells.push(
          <td key={`${teamFixture.team.id}-gw${gameweek}`} className="fixture-cell-container">
            <FixtureCell fixture={fixture} />
          </td>
        );
      } else {
        // Empty cell for gameweeks without fixtures
        cells.push(
          <td key={`${teamFixture.team.id}-gw${gameweek}`} className="fixture-cell-container empty">
            <div className="no-fixture" aria-label="No fixture this gameweek">
              -
            </div>
          </td>
        );
      }
    }
    
    return cells;
  };

  if (!teams || teams.length === 0) {
    return (
      <div className="fixture-table-container">
        <div className="no-teams-message" role="status" aria-live="polite">
          No teams to display
        </div>
      </div>
    );
  }

  return (
    <div className="fixture-table-container">
      <table className={`fixture-table team-names-${teamNameDisplay}`} role="table" aria-label="Fixture difficulty table">
        <thead>
          <tr>
            <th 
              className={`team-header sortable ${sortBy === 'team' ? 'active' : ''}`}
              scope="col"
              role="columnheader"
              tabIndex={0}
              onClick={() => handleSortClick('team')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSortClick('team');
                }
              }}
              aria-sort={sortBy === 'team' ? 'ascending' : 'none'}
              aria-label={`Sort by team name${getSortIndicator('team')}`}
            >
              Team{getSortIndicator('team')}
            </th>
            <th 
              className={`difficulty-header sortable ${sortBy === 'difficulty' ? 'active' : ''}`}
              scope="col"
              role="columnheader"
              tabIndex={0}
              onClick={() => handleSortClick('difficulty')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSortClick('difficulty');
                }
              }}
              aria-sort={sortBy === 'difficulty' ? 'ascending' : 'none'}
              aria-label={`Sort by average difficulty${getSortIndicator('difficulty')}`}
            >
              Avg Difficulty{getSortIndicator('difficulty')}
            </th>
            {gameweekHeaders}
          </tr>
        </thead>
        <tbody>
          {teams.map((teamFixture) => (
            <tr key={teamFixture.team.id} className="team-row">
              <td className="team-name-cell" scope="row">
                <div 
                  className="team-name" 
                  title={`${teamFixture.team.name} (${teamFixture.team.short_name})`}
                >
                  {getTeamName(teamFixture.team)}
                </div>
              </td>
              <td className="difficulty-score-cell">
                <div 
                  className="difficulty-score"
                  aria-label={`Average difficulty: ${teamFixture.averageDifficulty}`}
                >
                  {teamFixture.averageDifficulty.toFixed(1)}
                </div>
              </td>
              {renderTeamFixtures(teamFixture)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Export memoized component for performance optimization
export const MemoizedFixtureTable = React.memo(FixtureTable);
MemoizedFixtureTable.displayName = 'FixtureTable';

export default MemoizedFixtureTable;