import React, { useState, useMemo } from 'react';
import GameweekRangeInput from '../GameweekRangeInput';
import { GameweekRange, Team, Fixture, ProcessedFixture, TeamFixture } from '../../types';

// Mock data for demonstration
const mockTeams: Team[] = [
  { id: 1, name: 'Arsenal', short_name: 'ARS', code: 3, strength: 4, strength_overall_home: 4, strength_overall_away: 4, strength_attack_home: 4, strength_attack_away: 4, strength_defence_home: 4, strength_defence_away: 4 },
  { id: 2, name: 'Manchester City', short_name: 'MCI', code: 11, strength: 5, strength_overall_home: 5, strength_overall_away: 5, strength_attack_home: 5, strength_attack_away: 5, strength_defence_home: 5, strength_defence_away: 5 },
  { id: 3, name: 'Liverpool', short_name: 'LIV', code: 14, strength: 5, strength_overall_home: 5, strength_overall_away: 5, strength_attack_home: 5, strength_attack_away: 5, strength_defence_home: 5, strength_defence_away: 5 },
  { id: 4, name: 'Chelsea', short_name: 'CHE', code: 8, strength: 4, strength_overall_home: 4, strength_overall_away: 4, strength_attack_home: 4, strength_attack_away: 4, strength_defence_home: 4, strength_defence_away: 4 },
  { id: 5, name: 'Tottenham', short_name: 'TOT', code: 6, strength: 4, strength_overall_home: 4, strength_overall_away: 4, strength_attack_home: 4, strength_attack_away: 4, strength_defence_home: 4, strength_defence_away: 4 },
  { id: 6, name: 'Brighton', short_name: 'BHA', code: 36, strength: 3, strength_overall_home: 3, strength_overall_away: 3, strength_attack_home: 3, strength_attack_away: 3, strength_defence_home: 3, strength_defence_away: 3 },
];

const mockFixtures: Fixture[] = [
  // GW 1
  { id: 1, code: 1, event: 1, finished: false, kickoff_time: '2024-08-17T14:00:00Z', team_a: 6, team_h: 1, team_a_difficulty: 4, team_h_difficulty: 3 },
  { id: 2, code: 2, event: 1, finished: false, kickoff_time: '2024-08-17T16:30:00Z', team_a: 2, team_h: 4, team_a_difficulty: 4, team_h_difficulty: 5 },
  { id: 3, code: 3, event: 1, finished: false, kickoff_time: '2024-08-18T16:30:00Z', team_a: 5, team_h: 3, team_a_difficulty: 5, team_h_difficulty: 4 },
  
  // GW 2
  { id: 4, code: 4, event: 2, finished: false, kickoff_time: '2024-08-24T14:00:00Z', team_a: 1, team_h: 2, team_a_difficulty: 5, team_h_difficulty: 4 },
  { id: 5, code: 5, event: 2, finished: false, kickoff_time: '2024-08-24T16:30:00Z', team_a: 3, team_h: 6, team_a_difficulty: 3, team_h_difficulty: 5 },
  { id: 6, code: 6, event: 2, finished: false, kickoff_time: '2024-08-25T16:30:00Z', team_a: 4, team_h: 5, team_a_difficulty: 4, team_h_difficulty: 4 },
  
  // GW 3
  { id: 7, code: 7, event: 3, finished: false, kickoff_time: '2024-08-31T14:00:00Z', team_a: 2, team_h: 3, team_a_difficulty: 5, team_h_difficulty: 5 },
  { id: 8, code: 8, event: 3, finished: false, kickoff_time: '2024-08-31T16:30:00Z', team_a: 6, team_h: 4, team_a_difficulty: 4, team_h_difficulty: 3 },
  { id: 9, code: 9, event: 3, finished: false, kickoff_time: '2024-09-01T16:30:00Z', team_a: 5, team_h: 1, team_a_difficulty: 4, team_h_difficulty: 4 },
  
  // GW 4
  { id: 10, code: 10, event: 4, finished: false, kickoff_time: '2024-09-07T14:00:00Z', team_a: 1, team_h: 6, team_a_difficulty: 3, team_h_difficulty: 4 },
  { id: 11, code: 11, event: 4, finished: false, kickoff_time: '2024-09-07T16:30:00Z', team_a: 4, team_h: 2, team_a_difficulty: 5, team_h_difficulty: 4 },
  { id: 12, code: 12, event: 4, finished: false, kickoff_time: '2024-09-08T16:30:00Z', team_a: 3, team_h: 5, team_a_difficulty: 4, team_h_difficulty: 5 },
  
  // GW 5
  { id: 13, code: 13, event: 5, finished: false, kickoff_time: '2024-09-14T14:00:00Z', team_a: 2, team_h: 1, team_a_difficulty: 4, team_h_difficulty: 5 },
  { id: 14, code: 14, event: 5, finished: false, kickoff_time: '2024-09-14T16:30:00Z', team_a: 6, team_h: 3, team_a_difficulty: 5, team_h_difficulty: 3 },
  { id: 15, code: 15, event: 5, finished: false, kickoff_time: '2024-09-15T16:30:00Z', team_a: 5, team_h: 4, team_a_difficulty: 4, team_h_difficulty: 4 },
];

const getDifficultyColor = (difficulty: number): string => {
  switch (difficulty) {
    case 1: return '#00ff87'; // Very Easy - Bright Green
    case 2: return '#01ff70'; // Easy - Green
    case 3: return '#ffdd00'; // Average - Yellow
    case 4: return '#ff6900'; // Hard - Orange
    case 5: return '#ff0000'; // Very Hard - Red
    default: return '#e5e7eb'; // Default - Gray
  }
};

const getDifficultyText = (difficulty: number): string => {
  switch (difficulty) {
    case 1: return 'Very Easy';
    case 2: return 'Easy';
    case 3: return 'Average';
    case 4: return 'Hard';
    case 5: return 'Very Hard';
    default: return 'Unknown';
  }
};

/**
 * Demo component showing GameweekRangeInput integrated with a fixture difficulty table
 */
const GameweekRangeInputWithTableDemo: React.FC = () => {
  const [gameweekRange, setGameweekRange] = useState<GameweekRange>({ start: 1, end: 3 });

  // Process fixtures for the selected gameweek range
  const processedTeamFixtures = useMemo((): TeamFixture[] => {
    return mockTeams.map(team => {
      const teamFixtures: ProcessedFixture[] = [];
      
      // Find fixtures for this team within the selected range
      for (let gw = gameweekRange.start; gw <= gameweekRange.end; gw++) {
        const fixture = mockFixtures.find(f => 
          f.event === gw && (f.team_h === team.id || f.team_a === team.id)
        );
        
        if (fixture) {
          const isHome = fixture.team_h === team.id;
          const opponentId = isHome ? fixture.team_a : fixture.team_h;
          const opponent = mockTeams.find(t => t.id === opponentId);
          const difficulty = isHome ? fixture.team_h_difficulty : fixture.team_a_difficulty;
          
          if (opponent) {
            teamFixtures.push({
              opponent,
              isHome,
              difficulty,
              gameweek: gw,
              kickoffTime: fixture.kickoff_time
            });
          }
        }
      }
      
      // Calculate average difficulty
      const averageDifficulty = teamFixtures.length > 0 
        ? teamFixtures.reduce((sum, f) => sum + f.difficulty, 0) / teamFixtures.length
        : 0;
      
      return {
        team,
        fixtures: teamFixtures,
        averageDifficulty: Math.round(averageDifficulty * 10) / 10
      };
    });
  }, [gameweekRange]);

  const gameweekCount = gameweekRange.end - gameweekRange.start + 1;
  const gameweekHeaders = [];
  for (let gw = gameweekRange.start; gw <= gameweekRange.end; gw++) {
    gameweekHeaders.push(gw);
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>FPL Fixture Difficulty Table Demo</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Select a gameweek range to analyze fixture difficulty for each team.
      </p>

      {/* Gameweek Range Input */}
      <GameweekRangeInput
        value={gameweekRange}
        min={1}
        max={38}
        onChange={setGameweekRange}
      />

      {/* Summary */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#f9fafb', 
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Analysis Summary</h3>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Showing fixture difficulty for <strong>{mockTeams.length} teams</strong> across{' '}
          <strong>{gameweekCount} gameweek{gameweekCount === 1 ? '' : 's'}</strong>{' '}
          (GW {gameweekRange.start} to GW {gameweekRange.end})
        </p>
      </div>

      {/* Difficulty Legend */}
      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        backgroundColor: '#fef3c7', 
        borderRadius: '0.5rem',
        border: '1px solid #f59e0b'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>Difficulty Legend:</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map(difficulty => (
            <div key={difficulty} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: getDifficultyColor(difficulty),
                borderRadius: '4px',
                border: '1px solid #000'
              }} />
              <span style={{ fontSize: '0.875rem', color: '#92400e' }}>
                {difficulty} - {getDifficultyText(difficulty)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fixture Difficulty Table */}
      <div style={{ marginTop: '2rem', overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '1px solid #e5e7eb',
                fontWeight: 600,
                color: '#374151'
              }}>
                Team
              </th>
              {gameweekHeaders.map(gw => (
                <th key={gw} style={{ 
                  padding: '0.75rem', 
                  textAlign: 'center', 
                  borderBottom: '1px solid #e5e7eb',
                  fontWeight: 600,
                  color: '#374151',
                  minWidth: '80px'
                }}>
                  GW {gw}
                </th>
              ))}
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'center', 
                borderBottom: '1px solid #e5e7eb',
                fontWeight: 600,
                color: '#374151'
              }}>
                Avg
              </th>
            </tr>
          </thead>
          <tbody>
            {processedTeamFixtures.map(teamFixture => (
              <tr key={teamFixture.team.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ 
                  padding: '0.75rem', 
                  fontWeight: 500,
                  color: '#374151'
                }}>
                  {teamFixture.team.short_name}
                </td>
                {gameweekHeaders.map(gw => {
                  const fixture = teamFixture.fixtures.find(f => f.gameweek === gw);
                  return (
                    <td key={gw} style={{ 
                      padding: '0.5rem', 
                      textAlign: 'center'
                    }}>
                      {fixture ? (
                        <div style={{
                          backgroundColor: getDifficultyColor(fixture.difficulty),
                          color: fixture.difficulty >= 4 ? '#ffffff' : '#000000',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          border: '1px solid rgba(0,0,0,0.1)'
                        }}>
                          {fixture.opponent.short_name}
                          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                            {fixture.isHome ? '(H)' : '(A)'}
                          </div>
                        </div>
                      ) : (
                        <div style={{ 
                          color: '#9ca3af', 
                          fontSize: '0.875rem' 
                        }}>
                          -
                        </div>
                      )}
                    </td>
                  );
                })}
                <td style={{ 
                  padding: '0.75rem', 
                  textAlign: 'center',
                  fontWeight: 600,
                  color: teamFixture.averageDifficulty >= 4 ? '#ef4444' : 
                        teamFixture.averageDifficulty <= 2 ? '#10b981' : '#6b7280'
                }}>
                  {teamFixture.averageDifficulty > 0 ? teamFixture.averageDifficulty.toFixed(1) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Usage Instructions */}
      <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
        <h4>How to use:</h4>
        <ul>
          <li>Enter start and end gameweek numbers in the input fields above</li>
          <li>The table will automatically update to show fixtures for the selected range</li>
          <li>Each cell shows the opponent and venue (H = Home, A = Away)</li>
          <li>Colors indicate difficulty: Green = Easy, Yellow = Average, Orange/Red = Hard</li>
          <li>The "Avg" column shows the average difficulty across all selected gameweeks</li>
          <li>Use this to identify teams with favorable or difficult fixture runs</li>
        </ul>
      </div>
    </div>
  );
};

export default GameweekRangeInputWithTableDemo;