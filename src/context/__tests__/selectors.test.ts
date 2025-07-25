import {
  getTeamsWithUpdatedDifficulties,
  getTeamsForGameweekRange,
  getCurrentGameweekRange,
  canCalculateAggregateDifficulties,
  getTeamsSortedByDifficulty,
  getAggregateDifficultyStats
} from '../selectors';
import { AppState, Team, Fixture } from '../../types';

// Mock data for testing
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
    name: 'Chelsea',
    short_name: 'CHE',
    code: 8,
    strength: 4,
    strength_overall_home: 1180,
    strength_overall_away: 1130,
    strength_attack_home: 1220,
    strength_attack_away: 1180,
    strength_defence_home: 1160,
    strength_defence_away: 1100
  },
  {
    id: 3,
    name: 'Brighton',
    short_name: 'BHA',
    code: 36,
    strength: 3,
    strength_overall_home: 1100,
    strength_overall_away: 1050,
    strength_attack_home: 1120,
    strength_attack_away: 1080,
    strength_defence_home: 1080,
    strength_defence_away: 1020
  }
];

const mockFixtures: Fixture[] = [
  {
    id: 1,
    code: 12345,
    event: 1,
    finished: false,
    kickoff_time: '2024-08-17T14:00:00Z',
    team_a: 2, // Chelsea away
    team_h: 1, // Arsenal home
    team_a_difficulty: 3,
    team_h_difficulty: 2
  },
  {
    id: 2,
    code: 12346,
    event: 2,
    finished: false,
    kickoff_time: '2024-08-24T14:00:00Z',
    team_a: 1, // Arsenal away
    team_h: 3, // Brighton home
    team_a_difficulty: 4,
    team_h_difficulty: 1
  },
  {
    id: 3,
    code: 12347,
    event: 3,
    finished: false,
    kickoff_time: '2024-08-31T14:00:00Z',
    team_a: 3, // Brighton away
    team_h: 2, // Chelsea home
    team_a_difficulty: 5,
    team_h_difficulty: 2
  }
];

const createMockState = (overrides: Partial<AppState> = {}): AppState => ({
  teams: mockTeams,
  fixtures: mockFixtures,
  gameweeks: [],
  filteredTeams: [],
  selectedGameweeks: 5,
  gameweekRange: { start: 1, end: 3 },
  searchTerm: '',
  sortBy: 'team',
  sortDirection: 'asc',
  loading: false,
  error: null,
  ...overrides
});

describe('Context Selectors', () => {
  describe('getTeamsWithUpdatedDifficulties', () => {
    it('should return teams with updated aggregate difficulties', () => {
      const state = createMockState();
      const result = getTeamsWithUpdatedDifficulties(state);
      
      expect(result).toHaveLength(3);
      
      // Check that each team has calculated average difficulty
      result.forEach(teamFixture => {
        expect(teamFixture.averageDifficulty).toBeGreaterThanOrEqual(0);
        expect(typeof teamFixture.averageDifficulty).toBe('number');
      });
    });

    it('should apply search filter when search term is provided', () => {
      const state = createMockState({ searchTerm: 'Arsenal' });
      const result = getTeamsWithUpdatedDifficulties(state);
      
      expect(result).toHaveLength(1);
      expect(result[0].team.name).toBe('Arsenal');
    });

    it('should apply sorting based on state sortBy and sortDirection', () => {
      const state = createMockState({ 
        sortBy: 'difficulty', 
        sortDirection: 'asc' 
      });
      const result = getTeamsWithUpdatedDifficulties(state);
      
      expect(result).toHaveLength(3);
      
      // Should be sorted by difficulty (easiest first)
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].averageDifficulty).toBeLessThanOrEqual(result[i + 1].averageDifficulty);
      }
    });

    it('should return empty array when no teams or fixtures', () => {
      const stateNoTeams = createMockState({ teams: [] });
      const stateNoFixtures = createMockState({ fixtures: [] });
      
      expect(getTeamsWithUpdatedDifficulties(stateNoTeams)).toEqual([]);
      expect(getTeamsWithUpdatedDifficulties(stateNoFixtures)).toEqual([]);
    });

    it('should handle case-insensitive search', () => {
      const state = createMockState({ searchTerm: 'chelsea' });
      const result = getTeamsWithUpdatedDifficulties(state);
      
      expect(result).toHaveLength(1);
      expect(result[0].team.name).toBe('Chelsea');
    });
  });

  describe('getTeamsForGameweekRange', () => {
    it('should return teams with difficulties calculated for specific range', () => {
      const state = createMockState();
      const result = getTeamsForGameweekRange(state, 1, 2);
      
      expect(result).toHaveLength(3);
      
      // Each team should have fixtures only from gameweeks 1-2
      result.forEach(teamFixture => {
        teamFixture.fixtures.forEach(fixture => {
          expect(fixture.gameweek).toBeGreaterThanOrEqual(1);
          expect(fixture.gameweek).toBeLessThanOrEqual(2);
        });
      });
    });

    it('should return empty array when no teams or fixtures', () => {
      const stateNoTeams = createMockState({ teams: [] });
      const stateNoFixtures = createMockState({ fixtures: [] });
      
      expect(getTeamsForGameweekRange(stateNoTeams, 1, 5)).toEqual([]);
      expect(getTeamsForGameweekRange(stateNoFixtures, 1, 5)).toEqual([]);
    });

    it('should handle single gameweek range', () => {
      const state = createMockState();
      const result = getTeamsForGameweekRange(state, 2, 2);
      
      expect(result).toHaveLength(3);
      
      // Check that only gameweek 2 fixtures are included
      result.forEach(teamFixture => {
        teamFixture.fixtures.forEach(fixture => {
          expect(fixture.gameweek).toBe(2);
        });
      });
    });
  });

  describe('getCurrentGameweekRange', () => {
    it('should return the current gameweek range from state', () => {
      const state = createMockState({ gameweekRange: { start: 5, end: 10 } });
      const result = getCurrentGameweekRange(state);
      
      expect(result).toEqual({ start: 5, end: 10 });
    });
  });

  describe('canCalculateAggregateDifficulties', () => {
    it('should return true when teams and fixtures are available', () => {
      const state = createMockState();
      expect(canCalculateAggregateDifficulties(state)).toBe(true);
    });

    it('should return false when teams are missing', () => {
      const state = createMockState({ teams: [] });
      expect(canCalculateAggregateDifficulties(state)).toBe(false);
    });

    it('should return false when fixtures are missing', () => {
      const state = createMockState({ fixtures: [] });
      expect(canCalculateAggregateDifficulties(state)).toBe(false);
    });

    it('should return false when both teams and fixtures are missing', () => {
      const state = createMockState({ teams: [], fixtures: [] });
      expect(canCalculateAggregateDifficulties(state)).toBe(false);
    });
  });

  describe('getTeamsSortedByDifficulty', () => {
    it('should return teams sorted by difficulty (easiest first) by default', () => {
      const state = createMockState();
      const result = getTeamsSortedByDifficulty(state);
      
      expect(result).toHaveLength(3);
      
      // Should be sorted easiest to hardest
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].averageDifficulty).toBeLessThanOrEqual(result[i + 1].averageDifficulty);
      }
    });

    it('should return teams sorted by difficulty (hardest first) when specified', () => {
      const state = createMockState();
      const result = getTeamsSortedByDifficulty(state, 'hardest');
      
      expect(result).toHaveLength(3);
      
      // Should be sorted hardest to easiest
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].averageDifficulty).toBeGreaterThanOrEqual(result[i + 1].averageDifficulty);
      }
    });

    it('should handle empty state gracefully', () => {
      const state = createMockState({ teams: [], fixtures: [] });
      const result = getTeamsSortedByDifficulty(state);
      
      expect(result).toEqual([]);
    });
  });

  describe('getAggregateDifficultyStats', () => {
    it('should return correct difficulty statistics', () => {
      const state = createMockState();
      const result = getAggregateDifficultyStats(state);
      
      expect(result).toHaveProperty('averageDifficulty');
      expect(result).toHaveProperty('easiestTeam');
      expect(result).toHaveProperty('hardestTeam');
      expect(result).toHaveProperty('teamsWithFixtures');
      
      expect(typeof result.averageDifficulty).toBe('number');
      expect(result.averageDifficulty).toBeGreaterThanOrEqual(0);
      expect(result.teamsWithFixtures).toBeGreaterThan(0);
    });

    it('should identify easiest and hardest teams correctly', () => {
      const state = createMockState();
      const result = getAggregateDifficultyStats(state);
      
      if (result.easiestTeam && result.hardestTeam) {
        expect(result.easiestTeam.averageDifficulty).toBeLessThanOrEqual(
          result.hardestTeam.averageDifficulty
        );
      }
    });

    it('should handle state with no fixtures gracefully', () => {
      const state = createMockState({ fixtures: [] });
      const result = getAggregateDifficultyStats(state);
      
      expect(result.averageDifficulty).toBe(0);
      expect(result.easiestTeam).toBeNull();
      expect(result.hardestTeam).toBeNull();
      expect(result.teamsWithFixtures).toBe(0);
    });

    it('should handle state with no teams gracefully', () => {
      const state = createMockState({ teams: [] });
      const result = getAggregateDifficultyStats(state);
      
      expect(result.averageDifficulty).toBe(0);
      expect(result.easiestTeam).toBeNull();
      expect(result.hardestTeam).toBeNull();
      expect(result.teamsWithFixtures).toBe(0);
    });

    it('should round average difficulty to one decimal place', () => {
      const state = createMockState();
      const result = getAggregateDifficultyStats(state);
      
      // Check that the average difficulty is rounded to one decimal place
      const decimalPlaces = (result.averageDifficulty.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(1);
    });
  });

  describe('Integration Tests', () => {
    it('should maintain consistency between different selectors', () => {
      const state = createMockState();
      
      const teamsWithDifficulties = getTeamsWithUpdatedDifficulties(state);
      const teamsSortedByDifficulty = getTeamsSortedByDifficulty(state);
      const stats = getAggregateDifficultyStats(state);
      
      // All should return the same number of teams (when no search filter)
      expect(teamsWithDifficulties).toHaveLength(teamsSortedByDifficulty.length);
      expect(stats.teamsWithFixtures).toBeLessThanOrEqual(teamsWithDifficulties.length);
    });

    it('should handle gameweek range changes consistently', () => {
      const state1 = createMockState({ gameweekRange: { start: 1, end: 2 } });
      const state2 = createMockState({ gameweekRange: { start: 2, end: 3 } });
      
      const teams1 = getTeamsWithUpdatedDifficulties(state1);
      const teams2 = getTeamsWithUpdatedDifficulties(state2);
      
      // Both should return the same teams but potentially different difficulties
      expect(teams1).toHaveLength(teams2.length);
      
      // Verify that difficulties can be different for different ranges
      const arsenal1 = teams1.find(t => t.team.name === 'Arsenal');
      const arsenal2 = teams2.find(t => t.team.name === 'Arsenal');
      
      expect(arsenal1).toBeDefined();
      expect(arsenal2).toBeDefined();
      // Difficulties might be different due to different gameweek ranges
    });
  });
});