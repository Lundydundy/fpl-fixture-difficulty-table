import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FixtureTable from '../FixtureTable';
import { TeamFixture, Team, ProcessedFixture, SortOption } from '../../types';

// Mock team data for testing
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
    name: 'Brighton',
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

// Helper function to create mock team fixtures
const createMockTeamFixtures = (): TeamFixture[] => [
  {
    team: mockTeams[0], // Arsenal
    fixtures: [
      createMockFixture(mockTeams[1], 4, true, 1), // vs Chelsea (H)
      createMockFixture(mockTeams[2], 2, false, 2), // vs Brighton (A)
    ],
    averageDifficulty: 3.0,
  },
  {
    team: mockTeams[1], // Chelsea
    fixtures: [
      createMockFixture(mockTeams[0], 3, false, 1), // vs Arsenal (A)
      createMockFixture(mockTeams[2], 1, true, 2), // vs Brighton (H)
    ],
    averageDifficulty: 2.0,
  },
  {
    team: mockTeams[2], // Brighton
    fixtures: [
      createMockFixture(mockTeams[0], 3, true, 2), // vs Arsenal (H)
    ],
    averageDifficulty: 3.0,
  },
];

describe('FixtureTable', () => {
  const defaultProps = {
    teams: createMockTeamFixtures(),
    gameweeks: 2,
    sortBy: 'team' as SortOption,
    onSortChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders table with proper structure', () => {
      render(<FixtureTable {...defaultProps} />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('aria-label', 'Fixture difficulty table');
    });

    it('renders table headers correctly', () => {
      render(<FixtureTable {...defaultProps} />);
      
      expect(screen.getByRole('columnheader', { name: /sort by team name/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /sort by average difficulty/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /gw1/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /gw2/i })).toBeInTheDocument();
    });

    it('renders team names correctly', () => {
      render(<FixtureTable {...defaultProps} />);
      
      expect(screen.getByText('Arsenal')).toBeInTheDocument();
      expect(screen.getByText('Chelsea')).toBeInTheDocument();
      expect(screen.getByText('Brighton')).toBeInTheDocument();
    });

    it('displays average difficulty scores', () => {
      render(<FixtureTable {...defaultProps} />);
      
      const difficultyScores = screen.getAllByText(/\d+\.\d+/);
      expect(difficultyScores.length).toBeGreaterThan(0);
      expect(screen.getByText('2.0')).toBeInTheDocument(); // Chelsea
    });

    it('renders gameweek headers dynamically', () => {
      const propsWithMoreGameweeks = { ...defaultProps, gameweeks: 5 };
      render(<FixtureTable {...propsWithMoreGameweeks} />);
      
      expect(screen.getByRole('columnheader', { name: /gw1/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /gw2/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /gw3/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /gw4/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /gw5/i })).toBeInTheDocument();
    });
  });

  describe('Fixture Cell Rendering', () => {
    it('renders fixture cells for teams with fixtures', () => {
      render(<FixtureTable {...defaultProps} />);
      
      // Arsenal should have fixtures in GW1 and GW2
      const arsenalRow = screen.getByText('Arsenal').closest('tr');
      expect(arsenalRow).toBeInTheDocument();
      
      // Check for opponent short names in fixture cells
      const cheElements = screen.getAllByText('CHE');
      const bhaElements = screen.getAllByText('BHA');
      expect(cheElements.length).toBeGreaterThan(0);
      expect(bhaElements.length).toBeGreaterThan(0);
    });

    it('renders empty cells for gameweeks without fixtures', () => {
      render(<FixtureTable {...defaultProps} />);
      
      // Brighton only has a fixture in GW2, so GW1 should be empty
      const emptyCells = screen.getAllByText('-');
      expect(emptyCells.length).toBeGreaterThan(0);
    });

    it('provides accessibility labels for empty cells', () => {
      render(<FixtureTable {...defaultProps} />);
      
      const emptyCell = screen.getByLabelText('No fixture this gameweek');
      expect(emptyCell).toBeInTheDocument();
    });
  });

  describe('Sorting Functionality', () => {
    it('calls onSortChange when team header is clicked', () => {
      const mockOnSortChange = vi.fn();
      render(<FixtureTable {...defaultProps} onSortChange={mockOnSortChange} />);
      
      const teamHeader = screen.getByRole('columnheader', { name: /team/i });
      fireEvent.click(teamHeader);
      
      expect(mockOnSortChange).toHaveBeenCalledWith('team');
    });

    it('calls onSortChange when difficulty header is clicked', () => {
      const mockOnSortChange = vi.fn();
      render(<FixtureTable {...defaultProps} onSortChange={mockOnSortChange} />);
      
      const difficultyHeader = screen.getByRole('columnheader', { name: /sort by average difficulty/i });
      fireEvent.click(difficultyHeader);
      
      expect(mockOnSortChange).toHaveBeenCalledWith('difficulty');
    });

    it('handles keyboard navigation for sorting', () => {
      const mockOnSortChange = vi.fn();
      render(<FixtureTable {...defaultProps} onSortChange={mockOnSortChange} />);
      
      const teamHeader = screen.getByRole('columnheader', { name: /team/i });
      
      // Test Enter key
      fireEvent.keyDown(teamHeader, { key: 'Enter' });
      expect(mockOnSortChange).toHaveBeenCalledWith('team');
      
      // Test Space key
      fireEvent.keyDown(teamHeader, { key: ' ' });
      expect(mockOnSortChange).toHaveBeenCalledTimes(2);
    });

    it('ignores other keyboard keys for sorting', () => {
      const mockOnSortChange = vi.fn();
      render(<FixtureTable {...defaultProps} onSortChange={mockOnSortChange} />);
      
      const teamHeader = screen.getByRole('columnheader', { name: /team/i });
      fireEvent.keyDown(teamHeader, { key: 'Tab' });
      
      expect(mockOnSortChange).not.toHaveBeenCalled();
    });

    it('shows sort indicators for active sort column', () => {
      render(<FixtureTable {...defaultProps} sortBy="team" />);
      
      const teamHeader = screen.getByRole('columnheader', { name: /team/i });
      expect(teamHeader).toHaveClass('active');
      expect(teamHeader.textContent).toContain('↓');
    });

    it('applies correct aria-sort attributes', () => {
      render(<FixtureTable {...defaultProps} sortBy="difficulty" />);
      
      const teamHeader = screen.getByRole('columnheader', { name: /sort by team name/i });
      const difficultyHeader = screen.getByRole('columnheader', { name: /sort by average difficulty/i });
      
      expect(teamHeader).toHaveAttribute('aria-sort', 'none');
      expect(difficultyHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  describe('Accessibility Features', () => {
    it('has proper table semantics', () => {
      render(<FixtureTable {...defaultProps} />);
      
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-label', 'Fixture difficulty table');
    });

    it('uses proper scope attributes for headers', () => {
      render(<FixtureTable {...defaultProps} />);
      
      const teamHeader = screen.getByRole('columnheader', { name: /sort by team name/i });
      const difficultyHeader = screen.getByRole('columnheader', { name: /sort by average difficulty/i });
      
      expect(teamHeader).toHaveAttribute('scope', 'col');
      expect(difficultyHeader).toHaveAttribute('scope', 'col');
    });

    it('uses scope="row" for team name cells', () => {
      render(<FixtureTable {...defaultProps} />);
      
      const arsenalCell = screen.getByText('Arsenal').closest('td');
      expect(arsenalCell).toHaveAttribute('scope', 'row');
    });

    it('provides aria-labels for difficulty scores', () => {
      render(<FixtureTable {...defaultProps} />);
      
      const difficultyScores = screen.getAllByLabelText(/Average difficulty:/);
      expect(difficultyScores.length).toBeGreaterThan(0);
      expect(difficultyScores[0]).toBeInTheDocument();
    });

    it('makes sortable headers focusable', () => {
      render(<FixtureTable {...defaultProps} />);
      
      const teamHeader = screen.getByRole('columnheader', { name: /sort by team name/i });
      const difficultyHeader = screen.getByRole('columnheader', { name: /sort by average difficulty/i });
      
      expect(teamHeader).toHaveAttribute('tabIndex', '0');
      expect(difficultyHeader).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Empty State Handling', () => {
    it('displays no teams message when teams array is empty', () => {
      render(<FixtureTable {...defaultProps} teams={[]} />);
      
      const noTeamsMessage = screen.getByRole('status');
      expect(noTeamsMessage).toHaveTextContent('No teams to display');
      expect(noTeamsMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('displays no teams message when teams is undefined', () => {
      render(<FixtureTable {...defaultProps} teams={undefined as any} />);
      
      expect(screen.getByRole('status')).toHaveTextContent('No teams to display');
    });

    it('does not render table when no teams', () => {
      render(<FixtureTable {...defaultProps} teams={[]} />);
      
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles teams with no fixtures', () => {
      const teamsWithNoFixtures: TeamFixture[] = [
        {
          team: mockTeams[0],
          fixtures: [],
          averageDifficulty: 0,
        },
      ];
      
      render(<FixtureTable {...defaultProps} teams={teamsWithNoFixtures} />);
      
      expect(screen.getByText('Arsenal')).toBeInTheDocument();
      expect(screen.getByText('0.0')).toBeInTheDocument();
    });

    it('handles single gameweek correctly', () => {
      render(<FixtureTable {...defaultProps} gameweeks={1} />);
      
      expect(screen.getByRole('columnheader', { name: /gw1/i })).toBeInTheDocument();
      expect(screen.queryByRole('columnheader', { name: /gw2/i })).not.toBeInTheDocument();
    });

    it('handles large number of gameweeks', () => {
      render(<FixtureTable {...defaultProps} gameweeks={15} />);
      
      expect(screen.getByText('GW1')).toBeInTheDocument();
      expect(screen.getByText('GW15')).toBeInTheDocument();
    });

    it('handles teams with long names', () => {
      const teamsWithLongNames: TeamFixture[] = [
        {
          team: {
            ...mockTeams[0],
            name: 'Very Long Team Name That Might Cause Layout Issues',
          },
          fixtures: [],
          averageDifficulty: 2.5,
        },
      ];
      
      render(<FixtureTable {...defaultProps} teams={teamsWithLongNames} />);
      
      expect(screen.getByText('Very Long Team Name That Might Cause Layout Issues')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('integrates properly with FixtureCell components', () => {
      render(<FixtureTable {...defaultProps} />);
      
      // Check that FixtureCell components are rendered with proper data
      const fixtureCells = screen.getAllByRole('cell').filter(cell => 
        cell.classList.contains('fixture-cell')
      );
      
      expect(fixtureCells.length).toBeGreaterThan(0);
    });

    it('maintains table structure with mixed fixture data', () => {
      const mixedTeams: TeamFixture[] = [
        {
          team: mockTeams[0],
          fixtures: [createMockFixture(mockTeams[1], 4, true, 1)],
          averageDifficulty: 4.0,
        },
        {
          team: mockTeams[1],
          fixtures: [], // No fixtures
          averageDifficulty: 0,
        },
        {
          team: mockTeams[2],
          fixtures: [
            createMockFixture(mockTeams[0], 2, false, 1),
            createMockFixture(mockTeams[1], 3, true, 2),
          ],
          averageDifficulty: 2.5,
        },
      ];
      
      render(<FixtureTable {...defaultProps} teams={mixedTeams} />);
      
      // Should render all teams
      expect(screen.getByText('Arsenal')).toBeInTheDocument();
      expect(screen.getByText('Chelsea')).toBeInTheDocument();
      expect(screen.getByText('Brighton')).toBeInTheDocument();
      
      // Should show proper difficulty scores
      expect(screen.getByText('4.0')).toBeInTheDocument();
      expect(screen.getByText('0.0')).toBeInTheDocument();
      expect(screen.getByText('2.5')).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('renders efficiently with large datasets', () => {
      const largeTeamSet: TeamFixture[] = Array.from({ length: 20 }, (_, index) => ({
        team: {
          ...mockTeams[0],
          id: index + 1,
          name: `Team ${index + 1}`,
          short_name: `T${index + 1}`,
        },
        fixtures: [
          createMockFixture(mockTeams[1], Math.floor(Math.random() * 5) + 1, true, 1),
          createMockFixture(mockTeams[2], Math.floor(Math.random() * 5) + 1, false, 2),
        ],
        averageDifficulty: Math.round((Math.random() * 4 + 1) * 10) / 10,
      }));
      
      const startTime = performance.now();
      render(<FixtureTable {...defaultProps} teams={largeTeamSet} gameweeks={5} />);
      const endTime = performance.now();
      
      // Should render within reasonable time (less than 100ms for 20 teams)
      expect(endTime - startTime).toBeLessThan(100);
      
      // Should render all teams
      expect(screen.getByText('Team 1')).toBeInTheDocument();
      expect(screen.getByText('Team 20')).toBeInTheDocument();
    });
  });
});