import React, { useState } from 'react';
import FixtureTable from '../FixtureTable';
import { TeamFixture, Team, ProcessedFixture, SortOption } from '../../types';

// Mock team data for demo
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
    strength_defence_away: 1120,
  },
  {
    id: 2,
    name: 'Chelsea',
    short_name: 'CHE',
    code: 8,
    strength: 4,
    strength_overall_home: 1180,
    strength_overall_away: 1130,
    strength_attack_home: 1230,
    strength_attack_away: 1180,
    strength_defence_home: 1160,
    strength_defence_away: 1100,
  },
  {
    id: 3,
    name: 'Brighton & Hove Albion',
    short_name: 'BHA',
    code: 36,
    strength: 3,
    strength_overall_home: 1100,
    strength_overall_away: 1050,
    strength_attack_home: 1150,
    strength_attack_away: 1100,
    strength_defence_home: 1080,
    strength_defence_away: 1020,
  },
];

// Helper function to create mock fixtures
const createMockFixture = (
  opponent: Team,
  difficulty: number,
  isHome: boolean,
  gameweek: number
): ProcessedFixture => ({
  opponent,
  isHome,
  difficulty,
  gameweek,
  kickoffTime: '2024-08-17T14:00:00Z',
});

// Create demo data
const createDemoTeamFixtures = (): TeamFixture[] => [
  {
    team: mockTeams[0], // Arsenal
    fixtures: [
      createMockFixture(mockTeams[1], 4, true, 1),  // vs Chelsea (H) - Hard
      createMockFixture(mockTeams[2], 2, false, 2), // vs Brighton (A) - Easy
    ],
    averageDifficulty: 3.0,
  },
  {
    team: mockTeams[1], // Chelsea
    fixtures: [
      createMockFixture(mockTeams[0], 3, false, 1), // vs Arsenal (A) - Medium
      createMockFixture(mockTeams[2], 1, true, 2),  // vs Brighton (H) - Very Easy
    ],
    averageDifficulty: 2.0,
  },
  {
    team: mockTeams[2], // Brighton
    fixtures: [
      createMockFixture(mockTeams[0], 3, true, 2),  // vs Arsenal (H) - Medium
    ],
    averageDifficulty: 3.0,
  },
];

export const FixtureTableDemo: React.FC = () => {
  const [gameweeks, setGameweeks] = useState(4);
  const [sortBy, setSortBy] = useState<SortOption>('team');
  const [teams] = useState(createDemoTeamFixtures());

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>FixtureTable Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Gameweeks: {gameweeks}
          <input
            type="range"
            min="1"
            max="8"
            value={gameweeks}
            onChange={(e) => setGameweeks(Number(e.target.value))}
          />
        </label>
      </div>

      <FixtureTable
        teams={teams}
        gameweeks={gameweeks}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default FixtureTableDemo;