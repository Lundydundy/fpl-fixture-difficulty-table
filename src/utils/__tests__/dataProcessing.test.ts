import {
  transformFixtureData,
  calculateAverageDifficulty,
  calculateAggregatedifficulty,
  filterTeamsBySearch,
  sortTeams,
  updateTeamFixturesForGameweekRange,
  getFixturesForGameweekRange,
  validateDifficultyRating,
  getDifficultyColorClass,
  formatTeamName,
  getCurrentGameweek,
  filterFixturesByGameweekRange
} from '../dataProcessing';
import { Team, Fixture, ProcessedFixture, TeamFixture } from '../../types';

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
    name: 'Manchester City',
    short_name: 'MCI',
    code: 43,
    strength: 5,
    strength_overall_home: 1350,
    strength_overall_away: 1320,
    strength_attack_home: 1400,
    strength_attack_away: 1380,
    strength_defence_home: 1300,
    strength_defence_away: 1280
  },
  {
    id: 3,
    name: 'Brighton & Hove Albion',
    short_name: 'BHA',
    code: 36,
    strength: 3,
    strength_overall_home: 1050,
    strength_overall_away: 1000,
    strength_attack_home: 1080,
    strength_attack_away: 1020,
    strength_defence_home: 1020,
    strength_defence_away: 980
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
    team_a: 3, // Brighton away
    team_h: 2, // Man City home
    team_a_difficulty: 5,
    team_h_difficulty: 2
  },
  {
    id: 3,
    code: 12347,
    event: 2,
    finished: false,
    kickoff_time: '2024-08-24T15:00:00Z',
    team_a: 1, // Arsenal away
    team_h: 3, // Brighton home
    team_a_difficulty: 2,
    team_h_difficulty: 4
  },
  {
    id: 4,
    code: 12348,
    event: 2,
    finished: true, // This should be filtered out
    kickoff_time: '2024-08-24T17:30:00Z',
    team_a: 2,
    team_h: 1,
    team_a_difficulty: 3,
    team_h_difficulty: 4
  }
];

const mockProcessedFixtures: ProcessedFixture[] = [
  {
    opponent: mockTeams[1], // Man City
    isHome: true,
    difficulty: 3,
    gameweek: 1,
    kickoffTime: '2024-08-17T14:00:00Z'
  },
  {
    opponent: mockTeams[2], // Brighton
    isHome: false,
    difficulty: 2,
    gameweek: 2,
    kickoffTime: '2024-08-24T15:00:00Z'
  },
  {
    opponent: mockTeams[0], // Arsenal
    isHome: true,
    difficulty: 4,
    gameweek: 3,
    kickoffTime: '2024-08-31T15:00:00Z'
  }
];

describe('Data Processing Utilities', () => {
  describe('transformFixtureData', () => {
    it('should transform fixture data correctly', () => {
      const result = transformFixtureData(mockFixtures, mockTeams, 15);
      
      expect(result).toHaveLength(3); // Should have all 3 teams
      expect(result[0].team.name).toBe('Arsenal');
      expect(result[0].fixtures).toHaveLength(2); // Arsenal has 2 upcoming fixtures
      expect(result[0].fixtures[0].opponent.name).toBe('Manchester City');
      expect(result[0].fixtures[0].isHome).toBe(true);
      expect(result[0].fixtures[0].difficulty).toBe(3);
    });

    it('should filter out finished fixtures', () => {
      const result = transformFixtureData(mockFixtures, mockTeams, 15);
      
      // Check that no team has fixtures with finished status
      // The finished fixture (id: 4) should not appear in any team's fixtures
      result.forEach(teamFixture => {
        teamFixture.fixtures.forEach(fixture => {
          // Check that this fixture is not the finished one by checking opponent combinations
          const isFinishedFixture = (fixture.gameweek === 2 && 
            ((fixture.opponent.id === 2 && fixture.isHome === true) || 
             (fixture.opponent.id === 1 && fixture.isHome === false)));
          expect(isFinishedFixture).toBe(false);
        });
      });
    });

    it('should respect maxGameweeks parameter', () => {
      const result = transformFixtureData(mockFixtures, mockTeams, 1);
      
      result.forEach(teamFixture => {
        teamFixture.fixtures.forEach(fixture => {
          expect(fixture.gameweek).toBeLessThanOrEqual(1);
        });
      });
    });

    it('should sort fixtures by gameweek', () => {
      const result = transformFixtureData(mockFixtures, mockTeams, 15);
      const arsenalFixtures = result.find(tf => tf.team.name === 'Arsenal')?.fixtures;
      
      expect(arsenalFixtures).toBeDefined();
      if (arsenalFixtures && arsenalFixtures.length > 1) {
        for (let i = 1; i < arsenalFixtures.length; i++) {
          expect(arsenalFixtures[i].gameweek).toBeGreaterThanOrEqual(arsenalFixtures[i - 1].gameweek);
        }
      }
    });
  });

  describe('calculateAverageDifficulty', () => {
    it('should calculate average difficulty correctly', () => {
      const fixtures = mockProcessedFixtures.slice(0, 2); // difficulty 3 and 2
      const result = calculateAverageDifficulty(fixtures);
      
      expect(result).toBe(2.5); // (3 + 2) / 2 = 2.5
    });

    it('should round to one decimal place', () => {
      const fixtures = [
        { ...mockProcessedFixtures[0], difficulty: 1 },
        { ...mockProcessedFixtures[1], difficulty: 2 },
        { ...mockProcessedFixtures[2], difficulty: 3 }
      ];
      const result = calculateAverageDifficulty(fixtures);
      
      expect(result).toBe(2.0); // (1 + 2 + 3) / 3 = 2.0
    });

    it('should return 0 for empty fixtures array', () => {
      const result = calculateAverageDifficulty([]);
      expect(result).toBe(0);
    });

    it('should handle single fixture', () => {
      const fixtures = [mockProcessedFixtures[0]];
      const result = calculateAverageDifficulty(fixtures);
      
      expect(result).toBe(3);
    });
  });

  describe('calculateAggregatedifficulty', () => {
    it('should calculate aggregate difficulty for specified range', () => {
      const result = calculateAggregatedifficulty(mockProcessedFixtures, 2);
      
      expect(result).toBe(2.5); // First 2 fixtures: (3 + 2) / 2 = 2.5
    });

    it('should return 0 for invalid gameweek range', () => {
      expect(calculateAggregatedifficulty(mockProcessedFixtures, 0)).toBe(0);
      expect(calculateAggregatedifficulty(mockProcessedFixtures, -1)).toBe(0);
    });

    it('should return 0 for empty fixtures', () => {
      const result = calculateAggregatedifficulty([], 5);
      expect(result).toBe(0);
    });

    it('should handle range larger than fixtures array', () => {
      const result = calculateAggregatedifficulty(mockProcessedFixtures, 10);
      
      // Should use all available fixtures
      expect(result).toBe(3.0); // (3 + 2 + 4) / 3 = 3.0
    });
  });

  describe('filterTeamsBySearch', () => {
    const mockTeamFixtures: TeamFixture[] = mockTeams.map(team => ({
      team,
      fixtures: [],
      averageDifficulty: 0
    }));

    it('should filter teams by full name', () => {
      const result = filterTeamsBySearch(mockTeamFixtures, 'Arsenal');
      
      expect(result).toHaveLength(1);
      expect(result[0].team.name).toBe('Arsenal');
    });

    it('should filter teams by partial name (case insensitive)', () => {
      const result = filterTeamsBySearch(mockTeamFixtures, 'man');
      
      expect(result).toHaveLength(1);
      expect(result[0].team.name).toBe('Manchester City');
    });

    it('should filter teams by short name', () => {
      const result = filterTeamsBySearch(mockTeamFixtures, 'BHA');
      
      expect(result).toHaveLength(1);
      expect(result[0].team.name).toBe('Brighton & Hove Albion');
    });

    it('should return all teams for empty search term', () => {
      const result = filterTeamsBySearch(mockTeamFixtures, '');
      expect(result).toHaveLength(3);
    });

    it('should return all teams for whitespace-only search term', () => {
      const result = filterTeamsBySearch(mockTeamFixtures, '   ');
      expect(result).toHaveLength(3);
    });

    it('should return empty array for no matches', () => {
      const result = filterTeamsBySearch(mockTeamFixtures, 'NonExistentTeam');
      expect(result).toHaveLength(0);
    });

    it('should handle special characters in search', () => {
      const result = filterTeamsBySearch(mockTeamFixtures, '&');
      
      expect(result).toHaveLength(1);
      expect(result[0].team.name).toBe('Brighton & Hove Albion');
    });
  });

  describe('sortTeams', () => {
    const mockTeamFixtures: TeamFixture[] = [
      { team: mockTeams[2], fixtures: [], averageDifficulty: 3.5 }, // Brighton
      { team: mockTeams[0], fixtures: [], averageDifficulty: 2.1 }, // Arsenal
      { team: mockTeams[1], fixtures: [], averageDifficulty: 4.2 }  // Man City
    ];

    it('should sort teams alphabetically by default', () => {
      const result = sortTeams(mockTeamFixtures, 'team');
      
      expect(result[0].team.name).toBe('Arsenal');
      expect(result[1].team.name).toBe('Brighton & Hove Albion');
      expect(result[2].team.name).toBe('Manchester City');
    });

    it('should sort teams alphabetically in descending order', () => {
      const result = sortTeams(mockTeamFixtures, 'alphabetical', 'desc');
      
      expect(result[0].team.name).toBe('Manchester City');
      expect(result[1].team.name).toBe('Brighton & Hove Albion');
      expect(result[2].team.name).toBe('Arsenal');
    });

    it('should sort teams by difficulty (ascending)', () => {
      const result = sortTeams(mockTeamFixtures, 'difficulty', 'asc');
      
      expect(result[0].averageDifficulty).toBe(2.1); // Arsenal
      expect(result[1].averageDifficulty).toBe(3.5); // Brighton
      expect(result[2].averageDifficulty).toBe(4.2); // Man City
    });

    it('should sort teams by difficulty (descending)', () => {
      const result = sortTeams(mockTeamFixtures, 'difficulty', 'desc');
      
      expect(result[0].averageDifficulty).toBe(4.2); // Man City
      expect(result[1].averageDifficulty).toBe(3.5); // Brighton
      expect(result[2].averageDifficulty).toBe(2.1); // Arsenal
    });

    it('should not mutate original array', () => {
      const original = [...mockTeamFixtures];
      sortTeams(mockTeamFixtures, 'difficulty');
      
      expect(mockTeamFixtures).toEqual(original);
    });
  });

  describe('updateTeamFixturesForGameweekRange', () => {
    const mockTeamFixtures: TeamFixture[] = [
      {
        team: mockTeams[0],
        fixtures: mockProcessedFixtures,
        averageDifficulty: 3.0
      }
    ];

    it('should update average difficulty for new gameweek range', () => {
      const result = updateTeamFixturesForGameweekRange(mockTeamFixtures, 2);
      
      expect(result[0].averageDifficulty).toBe(2.5); // First 2 fixtures: (3 + 2) / 2
    });

    it('should preserve team and fixtures data', () => {
      const result = updateTeamFixturesForGameweekRange(mockTeamFixtures, 2);
      
      expect(result[0].team).toEqual(mockTeams[0]);
      expect(result[0].fixtures).toEqual(mockProcessedFixtures);
    });
  });

  describe('getFixturesForGameweekRange', () => {
    it('should return correct number of fixtures', () => {
      const result = getFixturesForGameweekRange(mockProcessedFixtures, 2);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockProcessedFixtures[0]);
      expect(result[1]).toEqual(mockProcessedFixtures[1]);
    });

    it('should return empty array for invalid range', () => {
      expect(getFixturesForGameweekRange(mockProcessedFixtures, 0)).toEqual([]);
      expect(getFixturesForGameweekRange(mockProcessedFixtures, -1)).toEqual([]);
    });

    it('should return all fixtures if range is larger than array', () => {
      const result = getFixturesForGameweekRange(mockProcessedFixtures, 10);
      
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockProcessedFixtures);
    });
  });

  describe('validateDifficultyRating', () => {
    it('should validate correct difficulty ratings', () => {
      expect(validateDifficultyRating(1)).toBe(true);
      expect(validateDifficultyRating(2)).toBe(true);
      expect(validateDifficultyRating(3)).toBe(true);
      expect(validateDifficultyRating(4)).toBe(true);
      expect(validateDifficultyRating(5)).toBe(true);
    });

    it('should reject invalid difficulty ratings', () => {
      expect(validateDifficultyRating(0)).toBe(false);
      expect(validateDifficultyRating(6)).toBe(false);
      expect(validateDifficultyRating(-1)).toBe(false);
      expect(validateDifficultyRating(3.5)).toBe(false);
      expect(validateDifficultyRating(NaN)).toBe(false);
    });
  });

  describe('getDifficultyColorClass', () => {
    it('should return correct color classes for valid difficulties', () => {
      expect(getDifficultyColorClass(1)).toBe('difficulty-easy');
      expect(getDifficultyColorClass(2)).toBe('difficulty-easy');
      expect(getDifficultyColorClass(3)).toBe('difficulty-medium');
      expect(getDifficultyColorClass(4)).toBe('difficulty-hard');
      expect(getDifficultyColorClass(5)).toBe('difficulty-hard');
    });

    it('should return unknown class for invalid difficulties', () => {
      expect(getDifficultyColorClass(0)).toBe('difficulty-unknown');
      expect(getDifficultyColorClass(6)).toBe('difficulty-unknown');
      expect(getDifficultyColorClass(3.5)).toBe('difficulty-unknown');
    });
  });

  describe('formatTeamName', () => {
    it('should return full name by default', () => {
      const result = formatTeamName(mockTeams[0]);
      expect(result).toBe('Arsenal');
    });

    it('should return short name when requested', () => {
      const result = formatTeamName(mockTeams[0], true);
      expect(result).toBe('ARS');
    });

    it('should handle long team names', () => {
      const result = formatTeamName(mockTeams[2], true);
      expect(result).toBe('BHA');
    });
  });

  describe('getCurrentGameweek', () => {
    const mockGameweeks = [
      { id: 1, is_current: false },
      { id: 2, is_current: true },
      { id: 3, is_current: false }
    ];

    it('should return current gameweek id', () => {
      const result = getCurrentGameweek(mockGameweeks);
      expect(result).toBe(2);
    });

    it('should return 1 if no current gameweek found', () => {
      const gameweeksWithoutCurrent = [
        { id: 1, is_current: false },
        { id: 2, is_current: false }
      ];
      const result = getCurrentGameweek(gameweeksWithoutCurrent);
      expect(result).toBe(1);
    });

    it('should return 1 for empty gameweeks array', () => {
      const result = getCurrentGameweek([]);
      expect(result).toBe(1);
    });
  });

  describe('filterFixturesByGameweekRange', () => {
    it('should filter fixtures by gameweek range', () => {
      const result = filterFixturesByGameweekRange(mockFixtures, 1, 2);
      
      // Should include: fixture 1 (gw1), fixture 2 (gw1), fixture 3 (gw2)
      // Should exclude: fixture 4 (gw2, finished)
      expect(result).toHaveLength(3); // Three unfinished fixtures in gameweeks 1-2
      expect(result.every(f => f.event >= 1 && f.event <= 2)).toBe(true);
      expect(result.every(f => !f.finished)).toBe(true);
    });

    it('should exclude finished fixtures', () => {
      const result = filterFixturesByGameweekRange(mockFixtures, 1, 5);
      
      expect(result.every(f => !f.finished)).toBe(true);
    });

    it('should return empty array for invalid range', () => {
      const result = filterFixturesByGameweekRange(mockFixtures, 10, 2);
      expect(result).toHaveLength(0);
    });

    it('should handle single gameweek range', () => {
      const result = filterFixturesByGameweekRange(mockFixtures, 1, 1);
      
      expect(result).toHaveLength(2); // Both fixtures in gameweek 1
      expect(result.every(f => f.event === 1)).toBe(true);
    });
  });
});