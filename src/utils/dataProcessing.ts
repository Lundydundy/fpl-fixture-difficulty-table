import { Team, Fixture, ProcessedFixture, TeamFixture, SortOption } from '../types';
import { getCustomDifficultyById } from './customDifficulty';

/**
 * Transform raw fixture data from API to UI-friendly format
 * Converts fixtures into a format that's easier to work with in components
 */
export function transformFixtureData(
  fixtures: Fixture[],
  teams: Team[],
  maxGameweeks: number = 15
): TeamFixture[] {
  // Create a map for quick team lookup
  const teamMap = new Map<number, Team>();
  teams.forEach(team => teamMap.set(team.id, team));

  // Filter fixtures to the specified gameweek range
  // maxGameweeks parameter is actually the end gameweek, not a count
  const filteredFixtures = fixtures.filter(fixture => 
    fixture.event <= maxGameweeks
  );

  // Group fixtures by team
  const teamFixturesMap = new Map<number, ProcessedFixture[]>();

  // Initialize all teams with empty fixture arrays
  teams.forEach(team => {
    teamFixturesMap.set(team.id, []);
  });

  // Process each fixture and add to both home and away teams
  filteredFixtures.forEach(fixture => {
    const homeTeam = teamMap.get(fixture.team_h);
    const awayTeam = teamMap.get(fixture.team_a);

    if (homeTeam && awayTeam) {
      // Add fixture for home team
      const homeFixture: ProcessedFixture = {
        opponent: awayTeam,
        isHome: true,
        difficulty: getCustomDifficultyById(teams, fixture.team_a, true, fixture.team_h_difficulty),
        gameweek: fixture.event,
        kickoffTime: fixture.kickoff_time
      };
      teamFixturesMap.get(fixture.team_h)?.push(homeFixture);

      // Add fixture for away team
      const awayFixture: ProcessedFixture = {
        opponent: homeTeam,
        isHome: false,
        difficulty: getCustomDifficultyById(teams, fixture.team_h, false, fixture.team_a_difficulty),
        gameweek: fixture.event,
        kickoffTime: fixture.kickoff_time
      };
      teamFixturesMap.get(fixture.team_a)?.push(awayFixture);
    }
  });

  // Convert to TeamFixture array with calculated average difficulty
  const teamFixtures: TeamFixture[] = teams.map(team => {
    const fixtures = teamFixturesMap.get(team.id) || [];
    
    // Sort fixtures by gameweek
    fixtures.sort((a, b) => a.gameweek - b.gameweek);

    return {
      team,
      fixtures,
      averageDifficulty: calculateAverageDifficulty(fixtures)
    };
  });

  return teamFixtures;
}

/**
 * Calculate average difficulty score for a team's fixtures
 * Returns rounded value to one decimal place
 */
export function calculateAverageDifficulty(fixtures: ProcessedFixture[]): number {
  if (fixtures.length === 0) {
    return 0;
  }

  const totalDifficulty = fixtures.reduce((sum, fixture) => sum + fixture.difficulty, 0);
  const average = totalDifficulty / fixtures.length;
  
  // Round to one decimal place
  return Math.round(average * 10) / 10;
}

/**
 * Calculate aggregate difficulty for a specific gameweek range
 * Used when user adjusts the gameweek slider
 */
export function calculateAggregatedifficulty(
  fixtures: ProcessedFixture[],
  gameweekRange: number
): number {
  if (fixtures.length === 0 || gameweekRange <= 0) {
    return 0;
  }

  // Filter fixtures to only include those within the specified range
  const filteredFixtures = fixtures.slice(0, gameweekRange);
  
  return calculateAverageDifficulty(filteredFixtures);
}

/**
 * Calculate aggregate difficulty for a specific gameweek range (start to end)
 * Supports both single gameweek range and start/end gameweek selection
 */
export function calculateAggregateForGameweekRange(
  fixtures: ProcessedFixture[],
  startGameweek: number,
  endGameweek: number
): number {
  if (fixtures.length === 0 || startGameweek > endGameweek || startGameweek < 1 || endGameweek < 1) {
    return 0;
  }

  // Filter fixtures to only include those within the specified gameweek range
  const filteredFixtures = fixtures.filter(fixture => 
    fixture.gameweek >= startGameweek && fixture.gameweek <= endGameweek
  );
  
  return calculateAverageDifficulty(filteredFixtures);
}

/**
 * Calculate aggregate difficulty for the next N gameweeks from current position
 * This is the primary metric mentioned in requirements (next 5 gameweeks)
 */
export function calculateAggregateForNextGameweeks(
  fixtures: ProcessedFixture[],
  numberOfGameweeks: number = 5,
  currentGameweek: number = 1
): number {
  if (fixtures.length === 0 || numberOfGameweeks <= 0) {
    return 0;
  }

  const endGameweek = currentGameweek + numberOfGameweeks - 1;
  return calculateAggregateForGameweekRange(fixtures, currentGameweek, endGameweek);
}

/**
 * Filter teams based on search term
 * Supports partial matching and is case-insensitive
 * Enhanced to handle multiple search terms and better matching
 */
export function filterTeamsBySearch(
  teamFixtures: TeamFixture[],
  searchTerm: string
): TeamFixture[] {
  if (!searchTerm || !searchTerm.trim()) {
    return teamFixtures;
  }

  const normalizedSearch = searchTerm.toLowerCase().trim();

  return teamFixtures.filter(teamFixture => {
    const teamName = teamFixture.team.name.toLowerCase();
    const shortName = teamFixture.team.short_name.toLowerCase();
    
    // Simple includes check for better reliability
    return teamName.includes(normalizedSearch) || 
           shortName.includes(normalizedSearch);
  });
}

/**
 * Filter teams based on selected team IDs
 * If no teams are selected, return all teams
 */
export function filterTeamsBySelection(
  teamFixtures: TeamFixture[],
  selectedTeamIds: number[]
): TeamFixture[] {
  if (selectedTeamIds.length === 0) {
    return teamFixtures;
  }

  return teamFixtures.filter(teamFixture => 
    selectedTeamIds.includes(teamFixture.team.id)
  );
}

/**
 * Combined filter function for both search and team selection
 */
export function filterTeams(
  teamFixtures: TeamFixture[],
  searchTerm: string,
  selectedTeamIds: number[]
): TeamFixture[] {
  let filtered = teamFixtures;
  
  // Apply team selection filter first
  filtered = filterTeamsBySelection(filtered, selectedTeamIds);
  
  // Then apply search filter
  filtered = filterTeamsBySearch(filtered, searchTerm);
  
  return filtered;
}

/**
 * Sort teams by different criteria
 * Supports team name (alphabetical) and difficulty score sorting
 * Enhanced to handle aggregate difficulty scores properly
 */
export function sortTeams(
  teamFixtures: TeamFixture[],
  sortBy: SortOption,
  direction: 'asc' | 'desc' = 'asc'
): TeamFixture[] {
  const sortedTeams = [...teamFixtures];

  sortedTeams.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'team':
      case 'alphabetical':
        comparison = a.team.name.localeCompare(b.team.name);
        break;
      
      case 'difficulty':
        // Sort by aggregate difficulty score
        comparison = a.averageDifficulty - b.averageDifficulty;
        // If difficulties are equal, fall back to alphabetical sorting
        if (comparison === 0) {
          comparison = a.team.name.localeCompare(b.team.name);
        }
        break;
      
      default:
        comparison = a.team.name.localeCompare(b.team.name);
    }

    return direction === 'desc' ? -comparison : comparison;
  });

  return sortedTeams;
}

/**
 * Sort teams by aggregate difficulty with enhanced options
 * Provides more granular control over difficulty-based sorting
 */
export function sortTeamsByAggregateDifficulty(
  teamFixtures: TeamFixture[],
  direction: 'easiest' | 'hardest' = 'easiest'
): TeamFixture[] {
  const sortDirection = direction === 'easiest' ? 'asc' : 'desc';
  return sortTeams(teamFixtures, 'difficulty', sortDirection);
}

/**
 * Update team fixtures with new gameweek range
 * Recalculates average difficulty based on the new range
 */
export function updateTeamFixturesForGameweekRange(
  teamFixtures: TeamFixture[],
  gameweekRange: number
): TeamFixture[] {
  return teamFixtures.map(teamFixture => ({
    ...teamFixture,
    averageDifficulty: calculateAggregatedifficulty(teamFixture.fixtures, gameweekRange)
  }));
}

/**
 * Update team fixtures with new gameweek range (start to end)
 * Recalculates average difficulty based on the specified gameweek range
 * This function supports dynamic updates when gameweek range changes
 */
export function updateTeamFixturesForGameweekRangeSelection(
  teamFixtures: TeamFixture[],
  startGameweek: number,
  endGameweek: number
): TeamFixture[] {
  return teamFixtures.map(teamFixture => ({
    ...teamFixture,
    averageDifficulty: calculateAggregateForGameweekRange(
      teamFixture.fixtures, 
      startGameweek, 
      endGameweek
    )
  }));
}

/**
 * Recalculate all team difficulties for a new gameweek range
 * This is the main function to call when gameweek range changes dynamically
 */
export function recalculateTeamDifficulties(
  teams: Team[],
  fixtures: Fixture[],
  startGameweek: number,
  endGameweek: number
): TeamFixture[] {
  // First transform the data with the new range
  const teamFixtures = transformFixtureDataForRange(teams, fixtures, startGameweek, endGameweek);
  
  // Then update the average difficulties
  return updateTeamFixturesForGameweekRangeSelection(teamFixtures, startGameweek, endGameweek);
}

/**
 * Transform fixture data for a specific gameweek range
 * Similar to transformFixtureData but filters by gameweek range
 */
export function transformFixtureDataForRange(
  teams: Team[],
  fixtures: Fixture[],
  startGameweek: number,
  endGameweek: number
): TeamFixture[] {
  // Create a map for quick team lookup
  const teamMap = new Map<number, Team>();
  teams.forEach(team => teamMap.set(team.id, team));

  // Filter fixtures to only include the specified gameweek range
  const rangeFixtures = fixtures.filter(fixture => 
    !fixture.finished && 
    fixture.event >= startGameweek && 
    fixture.event <= endGameweek
  );

  // Group fixtures by team
  const teamFixturesMap = new Map<number, ProcessedFixture[]>();

  // Initialize all teams with empty fixture arrays
  teams.forEach(team => {
    teamFixturesMap.set(team.id, []);
  });

  // Process each fixture and add to both home and away teams
  rangeFixtures.forEach(fixture => {
    const homeTeam = teamMap.get(fixture.team_h);
    const awayTeam = teamMap.get(fixture.team_a);

    if (homeTeam && awayTeam) {
      // Add fixture for home team
      const homeFixture: ProcessedFixture = {
        opponent: awayTeam,
        isHome: true,
        difficulty: getCustomDifficultyById(teams, fixture.team_a, true, fixture.team_h_difficulty),
        gameweek: fixture.event,
        kickoffTime: fixture.kickoff_time
      };
      teamFixturesMap.get(fixture.team_h)?.push(homeFixture);

      // Add fixture for away team
      const awayFixture: ProcessedFixture = {
        opponent: homeTeam,
        isHome: false,
        difficulty: getCustomDifficultyById(teams, fixture.team_h, false, fixture.team_a_difficulty),
        gameweek: fixture.event,
        kickoffTime: fixture.kickoff_time
      };
      teamFixturesMap.get(fixture.team_a)?.push(awayFixture);
    }
  });

  // Convert to TeamFixture array with calculated average difficulty
  const teamFixtures: TeamFixture[] = teams.map(team => {
    const fixtures = teamFixturesMap.get(team.id) || [];
    
    // Sort fixtures by gameweek
    fixtures.sort((a, b) => a.gameweek - b.gameweek);

    return {
      team,
      fixtures,
      averageDifficulty: calculateAverageDifficulty(fixtures)
    };
  });

  return teamFixtures;
}

/**
 * Get fixtures for a specific gameweek range
 * Used to limit the display to selected number of gameweeks
 */
export function getFixturesForGameweekRange(
  fixtures: ProcessedFixture[],
  gameweekRange: number
): ProcessedFixture[] {
  if (gameweekRange <= 0) {
    return [];
  }

  return fixtures.slice(0, gameweekRange);
}

/**
 * Validate difficulty rating
 * Ensures difficulty is within valid FPL range (1-5)
 */
export function validateDifficultyRating(difficulty: number): boolean {
  return difficulty >= 1 && difficulty <= 5 && Number.isInteger(difficulty);
}

/**
 * Get difficulty color class based on rating
 * Maps difficulty ratings to CSS color classes
 */
export function getDifficultyColorClass(difficulty: number): string {
  if (!validateDifficultyRating(difficulty)) {
    return 'difficulty-unknown';
  }

  if (difficulty <= 2) {
    return 'difficulty-easy'; // Green
  } else if (difficulty === 3) {
    return 'difficulty-medium'; // Yellow/Amber
  } else {
    return 'difficulty-hard'; // Red
  }
}

/**
 * Format team name for display
 * Handles long team names for mobile display
 */
export function formatTeamName(team: Team, useShortName: boolean = false): string {
  return useShortName ? team.short_name : team.name;
}

/**
 * Get current gameweek from gameweeks data
 * Helper function to identify the current gameweek
 */
export function getCurrentGameweek(gameweeks: any[]): number {
  const currentGameweek = gameweeks.find(gw => gw.is_current);
  return currentGameweek ? currentGameweek.id : 1;
}

/**
 * Filter fixtures by gameweek range starting from current gameweek
 * Used to ensure we only show relevant upcoming fixtures
 */
export function filterFixturesByGameweekRange(
  fixtures: Fixture[],
  startGameweek: number,
  gameweekRange: number
): Fixture[] {
  const endGameweek = startGameweek + gameweekRange - 1;
  
  return fixtures.filter(fixture => 
    fixture.event >= startGameweek && 
    fixture.event <= endGameweek &&
    !fixture.finished
  );
}