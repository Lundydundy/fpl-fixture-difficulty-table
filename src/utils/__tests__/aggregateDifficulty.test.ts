import {
  calculateAverageDifficulty,
  calculateAggregateForGameweekRange,
  calculateAggregateForNextGameweeks,
  updateTeamFixturesForGameweekRangeSelection,
  recalculateTeamDifficulties,
  transformFixtureDataForRange,
  sortTeamsByAggregateDifficulty
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
  }
];

const mockFixtures: Fixture[] = [
  {
    id: 1,
    code: 12345,
    event: 1,
    finished: false,
    kickoff_time: '2024-08-17T14:00:00Z',
    team_a: 2,
    team_h: 1,
    team_a_difficulty: 3,
    team_h_difficulty: 2
  },
  {
    id: 2,
    code: 12346,
    event: 2,
    finished: false,
    kickoff_time: '2024-08-24T14:00:00Z',
    team_a: 1,
    team_h: 2,
    team_a_difficulty: 4,
    team_h_difficulty: 1
  },
  {
    id: 3,
    code: 12347,
    event: 3,
    finished: false,
    kickoff_time: '2024-08-31T14:00:00Z',
    team_a: 2,
    team_h: 1,
    team_a_difficulty: 5,
    team_h_difficulty: 2
  }
];

const mockProcessedFixtures: ProcessedFixture[] = [
  {
    opponent: mockTeams[1],
    isHome: true,
    difficulty: 2,
    gameweek: 1,
    kickoffTime: '2024-08-17T14:00:00Z'
  },
  {
    opponent: mockTeams[1],
    isHome: false,
    difficulty: 4,
    gameweek: 2,
    kickoffTime: '2024-08-24T14:00:00Z'
  },
  {
    opponent: mockTeams[1],
    isHome: true,
    difficulty: 2,
    gameweek: 3,
    kickoffTime: '2024-08-31T14:00:00Z'
  }
];

describe('Aggregate Difficulty Calculations', () => {
  describe('calculateAverageDifficulty', () => {
    it('should calculate correct average difficulty and round to one decimal place', () => {
      const fixtures = [
        { ...mockProcessedFixtures[0], difficulty: 2 },
        { ...mockProcessedFixtures[1], difficulty: 4 },
        { ...mockProcessedFixtures[2], difficulty: 3 }
      ];
      
      const result = calculateAverageDifficulty(fixtures);
      expect(result).toBe(3.0); // (2 + 4 + 3) / 3 = 3.0
    });

    it('should handle decimal averages and round to one decimal place', () => {
      const fixtures = [
        { ...mockProcessedFixtures[0], difficulty: 1 },
        { ...mockProcessedFixtures[1], difficulty: 2 },
        { ...mockProcessedFixtures[2], difficulty: 3 }
      ];
      
      const result = calculateAverageDifficulty(fixtures);
      expect(result).toBe(2.0); // (1 + 2 + 3) / 3 = 2.0
    });

    it('should handle complex decimal rounding correctly', () => {
      const fixtures = [
        { ...mockProcessedFixtures[0], difficulty: 2 },
        { ...mockProcessedFixtures[1], difficulty: 3 }
      ];
      
      const result = calculateAverageDifficulty(fixtures);
      expect(result).toBe(2.5); // (2 + 3) / 2 = 2.5
    });

    it('should return 0 for empty fixtures array', () => {
      const result = calculateAverageDifficulty([]);
      expect(result).toBe(0);
    });

    it('should handle single fixture correctly', () => {
      const fixtures = [{ ...mockProcessedFixtures[0], difficulty: 4 }];
      const result = calculateAverageDifficulty(fixtures);
      expect(result).toBe(4.0);
    });
  });

  describe('calculateAggregateForGameweekRange', () => {
    it('should calculate aggregate difficulty for specific gameweek range', () => {
      const fixtures = mockProcessedFixtures;
      const result = calculateAggregateForGameweekRange(fixtures, 1, 2);
      
      // Should include gameweeks 1 and 2: difficulties 2 and 4
      expect(result).toBe(3.0); // (2 + 4) / 2 = 3.0
    });

    it('should handle single gameweek range', () => {
      const fixtures = mockProcessedFixtures;
      const result = calculateAggregateForGameweekRange(fixtures, 2, 2);
      
      // Should include only gameweek 2: difficulty 4
      expect(result).toBe(4.0);
    });

    it('should return 0 for invalid range (start > end)', () => {
      const fixtures = mockProcessedFixtures;
      const result = calculateAggregateForGameweekRange(fixtures, 3, 1);
      expect(result).toBe(0);
    });

    it('should return 0 for invalid gameweek numbers', () => {
      const fixtures = mockProcessedFixtures;
      const result1 = calculateAggregateForGameweekRange(fixtures, 0, 2);
      const result2 = calculateAggregateForGameweekRange(fixtures, 1, 0);
      expect(result1).toBe(0);
      expect(result2).toBe(0);
    });

    it('should return 0 for empty fixtures array', () => {
      const result = calculateAggregateForGameweekRange([], 1, 3);
      expect(result).toBe(0);
    });

    it('should handle range with no matching fixtures', () => {
      const fixtures = mockProcessedFixtures;
      const result = calculateAggregateForGameweekRange(fixtures, 10, 15);
      expect(result).toBe(0);
    });
  });

  describe('calculateAggregateForNextGameweeks', () => {
    it('should calculate aggregate for next 5 gameweeks by default', () => {
      const fixtures = [
        { ...mockProcessedFixtures[0], gameweek: 1, difficulty: 2 },
        { ...mockProcessedFixtures[1], gameweek: 2, difficulty: 3 },
        { ...mockProcessedFixtures[2], gameweek: 3, difficulty: 4 },
        { ...mockProcessedFixtures[0], gameweek: 4, difficulty: 1 },
        { ...mockProcessedFixtures[1], gameweek: 5, difficulty: 5 }
      ];
      
      const result = calculateAggregateForNextGameweeks(fixtures, 5, 1);
      expect(result).toBe(3.0); // (2 + 3 + 4 + 1 + 5) / 5 = 3.0
    });

    it('should handle custom number of gameweeks', () => {
      const fixtures = mockProcessedFixtures;
      const result = calculateAggregateForNextGameweeks(fixtures, 2, 1);
      expect(result).toBe(3.0); // (2 + 4) / 2 = 3.0
    });

    it('should handle different starting gameweek', () => {
      const fixtures = mockProcessedFixtures;
      const result = calculateAggregateForNextGameweeks(fixtures, 2, 2);
      expect(result).toBe(3.0); // gameweeks 2-3: (4 + 2) / 2 = 3.0
    });

    it('should return 0 for invalid parameters', () => {
      const fixtures = mockProcessedFixtures;
      const result1 = calculateAggregateForNextGameweeks(fixtures, 0, 1);
      const result2 = calculateAggregateForNextGameweeks([], 5, 1);
      expect(result1).toBe(0);
      expect(result2).toBe(0);
    });
  });

  describe('updateTeamFixturesForGameweekRangeSelection', () => {
    it('should update team fixtures with new aggregate difficulties', () => {
      const teamFixtures: TeamFixture[] = [
        {
          team: mockTeams[0],
          fixtures: mockProcessedFixtures,
          averageDifficulty: 0 // Will be recalculated
        }
      ];

      const result = updateTeamFixturesForGameweekRangeSelection(teamFixtures, 1, 2);
      
      expect(result).toHaveLength(1);
      expect(result[0].averageDifficulty).toBe(3.0); // (2 + 4) / 2 = 3.0
      expect(result[0].team).toBe(mockTeams[0]);
      expect(result[0].fixtures).toBe(mockProcessedFixtures);
    });

    it('should handle multiple teams', () => {
      const teamFixtures: TeamFixture[] = [
        {
          team: mockTeams[0],
          fixtures: [
            { ...mockProcessedFixtures[0], difficulty: 2 },
            { ...mockProcessedFixtures[1], difficulty: 4 }
          ],
          averageDifficulty: 0
        },
        {
          team: mockTeams[1],
          fixtures: [
            { ...mockProcessedFixtures[0], difficulty: 1 },
            { ...mockProcessedFixtures[1], difficulty: 3 }
          ],
          averageDifficulty: 0
        }
      ];

      const result = updateTeamFixturesForGameweekRangeSelection(teamFixtures, 1, 2);
      
      expect(result).toHaveLength(2);
      expect(result[0].averageDifficulty).toBe(3.0); // (2 + 4) / 2
      expect(result[1].averageDifficulty).toBe(2.0); // (1 + 3) / 2
    });

    it('should handle teams with no fixtures in range', () => {
      const teamFixtures: TeamFixture[] = [
        {
          team: mockTeams[0],
          fixtures: [
            { ...mockProcessedFixtures[0], gameweek: 10, difficulty: 2 }
          ],
          averageDifficulty: 0
        }
      ];

      const result = updateTeamFixturesForGameweekRangeSelection(teamFixtures, 1, 5);
      
      expect(result).toHaveLength(1);
      expect(result[0].averageDifficulty).toBe(0); // No fixtures in range
    });
  });

  describe('transformFixtureDataForRange', () => {
    it('should transform fixture data for specific gameweek range', () => {
      const result = transformFixtureDataForRange(mockTeams, mockFixtures, 1, 2);
      
      expect(result).toHaveLength(2); // Both teams
      
      // Check Arsenal's fixtures (team_h in fixtures 1 and 3, team_a in fixture 2)
      const arsenalData = result.find(tf => tf.team.id === 1);
      expect(arsenalData).toBeDefined();
      expect(arsenalData!.fixtures).toHaveLength(2); // Gameweeks 1 and 2
      
      // Check Chelsea's fixtures
      const chelseaData = result.find(tf => tf.team.id === 2);
      expect(chelseaData).toBeDefined();
      expect(chelseaData!.fixtures).toHaveLength(2); // Gameweeks 1 and 2
    });

    it('should filter out finished fixtures', () => {
      const fixturesWithFinished = [
        ...mockFixtures,
        {
          ...mockFixtures[0],
          id: 999,
          event: 1,
          finished: true
        }
      ];

      const result = transformFixtureDataForRange(mockTeams, fixturesWithFinished, 1, 3);
      
      // Should not include the finished fixture
      const arsenalData = result.find(tf => tf.team.id === 1);
      expect(arsenalData!.fixtures).toHaveLength(3); // Only unfinished fixtures
    });

    it('should handle empty gameweek range', () => {
      const result = transformFixtureDataForRange(mockTeams, mockFixtures, 10, 15);
      
      expect(result).toHaveLength(2); // Both teams present
      expect(result[0].fixtures).toHaveLength(0); // No fixtures in range
      expect(result[1].fixtures).toHaveLength(0); // No fixtures in range
      expect(result[0].averageDifficulty).toBe(0);
      expect(result[1].averageDifficulty).toBe(0);
    });
  });

  describe('recalculateTeamDifficulties', () => {
    it('should recalculate all team difficulties for new gameweek range', () => {
      const result = recalculateTeamDifficulties(mockTeams, mockFixtures, 1, 2);
      
      expect(result).toHaveLength(2);
      
      // Verify that difficulties are calculated for the specified range
      const arsenalData = result.find(tf => tf.team.id === 1);
      const chelseaData = result.find(tf => tf.team.id === 2);
      
      expect(arsenalData).toBeDefined();
      expect(chelseaData).toBeDefined();
      expect(arsenalData!.averageDifficulty).toBeGreaterThan(0);
      expect(chelseaData!.averageDifficulty).toBeGreaterThan(0);
    });

    it('should handle edge case with no fixtures in range', () => {
      const result = recalculateTeamDifficulties(mockTeams, mockFixtures, 20, 25);
      
      expect(result).toHaveLength(2);
      expect(result[0].averageDifficulty).toBe(0);
      expect(result[1].averageDifficulty).toBe(0);
    });
  });

  describe('Sorting by Aggregate Difficulty', () => {
    it('should sort teams by difficulty in ascending order (easiest first)', () => {
      const teamFixtures: TeamFixture[] = [
        {
          team: { ...mockTeams[0], name: 'Arsenal' },
          fixtures: [
            { ...mockProcessedFixtures[0], difficulty: 4 },
            { ...mockProcessedFixtures[1], difficulty: 5 }
          ],
          averageDifficulty: 4.5
        },
        {
          team: { ...mockTeams[1], name: 'Chelsea' },
          fixtures: [
            { ...mockProcessedFixtures[0], difficulty: 1 },
            { ...mockProcessedFixtures[1], difficulty: 2 }
          ],
          averageDifficulty: 1.5
        }
      ];

      const result = sortTeamsByAggregateDifficulty(teamFixtures, 'easiest');
      
      expect(result).toHaveLength(2);
      expect(result[0].team.name).toBe('Chelsea'); // Lower difficulty first
      expect(result[1].team.name).toBe('Arsenal');
      expect(result[0].averageDifficulty).toBe(1.5);
      expect(result[1].averageDifficulty).toBe(4.5);
    });

    it('should sort teams by difficulty in descending order (hardest first)', () => {
      const teamFixtures: TeamFixture[] = [
        {
          team: { ...mockTeams[0], name: 'Arsenal' },
          fixtures: [
            { ...mockProcessedFixtures[0], difficulty: 1 },
            { ...mockProcessedFixtures[1], difficulty: 2 }
          ],
          averageDifficulty: 1.5
        },
        {
          team: { ...mockTeams[1], name: 'Chelsea' },
          fixtures: [
            { ...mockProcessedFixtures[0], difficulty: 4 },
            { ...mockProcessedFixtures[1], difficulty: 5 }
          ],
          averageDifficulty: 4.5
        }
      ];

      const result = sortTeamsByAggregateDifficulty(teamFixtures, 'hardest');
      
      expect(result).toHaveLength(2);
      expect(result[0].team.name).toBe('Chelsea'); // Higher difficulty first
      expect(result[1].team.name).toBe('Arsenal');
      expect(result[0].averageDifficulty).toBe(4.5);
      expect(result[1].averageDifficulty).toBe(1.5);
    });

    it('should handle teams with equal difficulty by sorting alphabetically', () => {
      const teamFixtures: TeamFixture[] = [
        {
          team: { ...mockTeams[0], name: 'Wolves' },
          fixtures: [{ ...mockProcessedFixtures[0], difficulty: 3 }],
          averageDifficulty: 3.0
        },
        {
          team: { ...mockTeams[1], name: 'Arsenal' },
          fixtures: [{ ...mockProcessedFixtures[0], difficulty: 3 }],
          averageDifficulty: 3.0
        }
      ];

      const result = sortTeamsByAggregateDifficulty(teamFixtures, 'easiest');
      
      expect(result).toHaveLength(2);
      expect(result[0].team.name).toBe('Arsenal'); // Alphabetically first
      expect(result[1].team.name).toBe('Wolves');
    });

    it('should handle teams with zero difficulty (no fixtures)', () => {
      const teamFixtures: TeamFixture[] = [
        {
          team: { ...mockTeams[0], name: 'Arsenal' },
          fixtures: [],
          averageDifficulty: 0
        },
        {
          team: { ...mockTeams[1], name: 'Chelsea' },
          fixtures: [{ ...mockProcessedFixtures[0], difficulty: 3 }],
          averageDifficulty: 3.0
        }
      ];

      const result = sortTeamsByAggregateDifficulty(teamFixtures, 'easiest');
      
      expect(result).toHaveLength(2);
      expect(result[0].team.name).toBe('Arsenal'); // Zero difficulty comes first
      expect(result[1].team.name).toBe('Chelsea');
    });

    it('should handle multiple teams with zero difficulty alphabetically', () => {
      const teamFixtures: TeamFixture[] = [
        {
          team: { ...mockTeams[0], name: 'Wolves' },
          fixtures: [],
          averageDifficulty: 0
        },
        {
          team: { ...mockTeams[1], name: 'Arsenal' },
          fixtures: [],
          averageDifficulty: 0
        }
      ];

      const result = sortTeamsByAggregateDifficulty(teamFixtures, 'easiest');
      
      expect(result).toHaveLength(2);
      expect(result[0].team.name).toBe('Arsenal'); // Alphabetically first when both have 0
      expect(result[1].team.name).toBe('Wolves');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle extreme difficulty values correctly', () => {
      const extremeFixtures: ProcessedFixture[] = [
        { ...mockProcessedFixtures[0], difficulty: 1 },
        { ...mockProcessedFixtures[1], difficulty: 5 },
        { ...mockProcessedFixtures[2], difficulty: 1 }
      ];
      
      const result = calculateAverageDifficulty(extremeFixtures);
      expect(result).toBe(2.3); // (1 + 5 + 1) / 3 = 2.333... rounded to 2.3
    });

    it('should handle large gameweek ranges', () => {
      const fixtures = Array.from({ length: 38 }, (_, i) => ({
        ...mockProcessedFixtures[0],
        gameweek: i + 1,
        difficulty: (i % 5) + 1 // Cycle through difficulties 1-5
      }));

      const result = calculateAggregateForGameweekRange(fixtures, 1, 38);
      // With 38 fixtures cycling 1,2,3,4,5: 7 complete cycles (35) + 3 extra (1,2,3)
      // (7*15 + 6) / 38 = 111/38 = 2.921... rounds to 2.9
      expect(result).toBe(2.9);
    });

    it('should maintain precision with many fixtures', () => {
      const fixtures = Array.from({ length: 100 }, (_, i) => ({
        ...mockProcessedFixtures[0],
        gameweek: i + 1,
        difficulty: 3
      }));

      const result = calculateAverageDifficulty(fixtures);
      expect(result).toBe(3.0);
    });
  });
});