import React, { useMemo, useState } from 'react';
import { Team, Fixture } from '../types';
import { getCustomDifficulty } from '../utils/customDifficulty';
import './FixtureRunAnalyzer.css';

interface FixtureRun {
  team: Team;
  startGameweek: number;
  endGameweek: number;
  averageDifficulty: number;
  fixtures: Array<{
    gameweek: number;
    opponent: string;
    isHome: boolean;
    difficulty: number;
  }>;
  runLength: number;
}

interface FixtureRunAnalyzerProps {
  teams: Team[];
  fixtures: Fixture[];
}

const FixtureRunAnalyzer: React.FC<FixtureRunAnalyzerProps> = ({ teams, fixtures }) => {
  const [minRunLength, setMinRunLength] = useState(4);
  const [maxRunLength, setMaxRunLength] = useState(6);
  const [maxDifficulty, setMaxDifficulty] = useState(2.5);
  const [showTopN, setShowTopN] = useState(10);
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);



  // Analyze all possible fixture runs for all teams
  const fixtureRuns = useMemo(() => {
    const runs: FixtureRun[] = [];

    // Filter teams if specific teams are selected
    const teamsToAnalyze = selectedTeamIds.length > 0
      ? teams.filter(team => selectedTeamIds.includes(team.id))
      : teams;

    teamsToAnalyze.forEach(team => {
      // Get all fixtures for this team, sorted by gameweek
      const teamFixtures = fixtures
        .filter(fixture => fixture.team_h === team.id || fixture.team_a === team.id)
        .map(fixture => {
          const isHome = fixture.team_h === team.id;
          const opponentId = isHome ? fixture.team_a : fixture.team_h;
          const opponentTeam = teams.find(t => t.id === opponentId);
          const originalDifficulty = isHome ? fixture.team_h_difficulty : fixture.team_a_difficulty;
          
          return {
            gameweek: fixture.event,
            opponent: opponentTeam?.name || 'Unknown',
            isHome,
            difficulty: opponentTeam ? getCustomDifficulty(opponentTeam, isHome, originalDifficulty) : originalDifficulty
          };
        })
        .sort((a, b) => a.gameweek - b.gameweek);

      // Analyze all possible runs within the specified length range
      for (let start = 0; start <= teamFixtures.length - minRunLength; start++) {
        for (let length = minRunLength; length <= Math.min(maxRunLength, teamFixtures.length - start); length++) {
          const runFixtures = teamFixtures.slice(start, start + length);
          const averageDifficulty = runFixtures.reduce((sum, f) => sum + f.difficulty, 0) / runFixtures.length;

          // Only include runs that meet our difficulty criteria
          if (averageDifficulty <= maxDifficulty) {
            runs.push({
              team,
              startGameweek: runFixtures[0].gameweek,
              endGameweek: runFixtures[runFixtures.length - 1].gameweek,
              averageDifficulty,
              fixtures: runFixtures,
              runLength: length
            });
          }
        }
      }
    });

    // Sort by average difficulty (best runs first), then by run length (longer runs preferred)
    return runs
      .sort((a, b) => {
        const difficultyDiff = a.averageDifficulty - b.averageDifficulty;
        if (Math.abs(difficultyDiff) < 0.1) {
          return b.runLength - a.runLength; // Prefer longer runs if difficulty is similar
        }
        return difficultyDiff;
      })
      .slice(0, showTopN);
  }, [teams, fixtures, minRunLength, maxRunLength, maxDifficulty, showTopN, selectedTeamIds]);

  // Get upcoming runs (next 10 gameweeks from current)
  const upcomingRuns = useMemo(() => {
    const currentGameweek = Math.max(1, Math.min(38, new Date().getMonth() * 3 + 1)); // Rough estimate
    return fixtureRuns.filter(run =>
      run.startGameweek >= currentGameweek &&
      run.startGameweek <= currentGameweek + 10
    );
  }, [fixtureRuns, minRunLength, maxRunLength, maxDifficulty, selectedTeamIds]);

  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty <= 2) return '#10b981'; // Green
    if (difficulty <= 2.5) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const formatGameweekRange = (start: number, end: number): string => {
    return start === end ? `GW${start}` : `GW${start}-${end}`;
  };

  return (
    <div className="fixture-run-analyzer">
      <div className="analyzer-header">
        <h2>Best Fixture Runs Analysis</h2>
        <p>Find teams with consistently easy fixtures across multiple gameweeks</p>
        <div className="custom-difficulty-info">
          <small>
            📝 Custom ratings: Man City & Arsenal away = 5 (hardest)
          </small>
        </div>
      </div>

      <div className="analyzer-controls">
        <div className="control-group">
          <label htmlFor="team-selection">Teams (leave empty for all):</label>
          <select
            id="team-selection"
            multiple
            value={selectedTeamIds.map(String)}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => Number(option.value));
              setSelectedTeamIds(values);
            }}
            size={4}
          >
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <small>Hold Ctrl/Cmd to select multiple teams</small>
        </div>

        <div className="control-group">
          <label htmlFor="min-run-length">Min Run Length:</label>
          <select
            id="min-run-length"
            value={minRunLength}
            onChange={(e) => {
              const newMin = Number(e.target.value);
              setMinRunLength(newMin);
              if (newMin > maxRunLength) {
                setMaxRunLength(newMin);
              }
            }}
          >
            <option value={3}>3 gameweeks</option>
            <option value={4}>4 gameweeks</option>
            <option value={5}>5 gameweeks</option>
            <option value={6}>6 gameweeks</option>
            <option value={7}>7 gameweeks</option>
            <option value={8}>8 gameweeks</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="max-run-length">Max Run Length:</label>
          <select
            id="max-run-length"
            value={maxRunLength}
            onChange={(e) => {
              const newMax = Number(e.target.value);
              setMaxRunLength(newMax);
              if (newMax < minRunLength) {
                setMinRunLength(newMax);
              }
            }}
          >
            <option value={3}>3 gameweeks</option>
            <option value={4}>4 gameweeks</option>
            <option value={5}>5 gameweeks</option>
            <option value={6}>6 gameweeks</option>
            <option value={7}>7 gameweeks</option>
            <option value={8}>8 gameweeks</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="max-difficulty">Max Average Difficulty:</label>
          <select
            id="max-difficulty"
            value={maxDifficulty}
            onChange={(e) => setMaxDifficulty(Number(e.target.value))}
          >
            <option value={2.0}>2.0 (Very Easy)</option>
            <option value={2.5}>2.5 (Easy)</option>
            <option value={3.0}>3.0 (Moderate)</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="show-top-n">Show Top:</label>
          <select
            id="show-top-n"
            value={showTopN}
            onChange={(e) => setShowTopN(Number(e.target.value))}
          >
            <option value={5}>5 runs</option>
            <option value={10}>10 runs</option>
            <option value={15}>15 runs</option>
            <option value={20}>20 runs</option>
          </select>
        </div>

        {selectedTeamIds.length > 0 && (
          <div className="selected-teams-info">
            <strong>Analyzing {selectedTeamIds.length} team{selectedTeamIds.length === 1 ? '' : 's'}:</strong>
            <div className="selected-teams-list">
              {selectedTeamIds.map(teamId => {
                const team = teams.find(t => t.id === teamId);
                return team ? (
                  <span key={teamId} className="selected-team-badge">
                    {team.name}
                    <button
                      onClick={() => setSelectedTeamIds(prev => prev.filter(id => id !== teamId))}
                      className="remove-team-btn"
                      title={`Remove ${team.name}`}
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
              <button
                onClick={() => setSelectedTeamIds([])}
                className="clear-teams-btn"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="analyzer-sections">
        {upcomingRuns.length > 0 && (
          <div className="upcoming-runs-section">
            <h3>🔥 Upcoming Great Runs</h3>
            <div className="runs-grid">
              {upcomingRuns.slice(0, 5).map((run, index) => (
                <div key={`${run.team.id}-${run.startGameweek}`} className="run-card upcoming">
                  <div className="run-header">
                    <span className="team-name">{run.team.name}</span>
                    <span className="gameweek-range">{formatGameweekRange(run.startGameweek, run.endGameweek)}</span>
                  </div>
                  <div className="run-stats">
                    <div className="difficulty-score" style={{ color: getDifficultyColor(run.averageDifficulty) }}>
                      {run.averageDifficulty.toFixed(1)}
                    </div>
                    <div className="run-length">{run.runLength} games</div>
                  </div>
                  <div className="fixtures-preview">
                    {run.fixtures.map((fixture, i) => (
                      <span
                        key={i}
                        className={`fixture-opponent ${fixture.isHome ? 'home' : 'away'}`}
                        style={{ color: getDifficultyColor(fixture.difficulty) }}
                      >
                        {fixture.isHome ? 'vs' : '@'} {fixture.opponent.slice(0, 3).toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="all-runs-section">
          <h3>📊 Best Fixture Runs (Season)</h3>
          <div className="runs-table">
            <div className="table-header">
              <div className="col-team">Team</div>
              <div className="col-gameweeks">Gameweeks</div>
              <div className="col-difficulty">Avg Difficulty</div>
              <div className="col-length">Length</div>
              <div className="col-fixtures">Fixtures</div>
            </div>
            {fixtureRuns.map((run, index) => (
              <div key={`${run.team.id}-${run.startGameweek}-${index}`} className="table-row">
                <div className="col-team" data-label="Team">
                  <span style={{color: "white"}} className="team-name">{run.team.name}</span>
                </div>
                <div className="col-gameweeks" data-label="Gameweeks">
                  {formatGameweekRange(run.startGameweek, run.endGameweek)}
                </div>
                <div className="col-difficulty" data-label="Difficulty">
                  <span
                    className="difficulty-badge"
                    style={{
                      backgroundColor: getDifficultyColor(run.averageDifficulty),
                      color: 'white'
                    }}
                  >
                    {run.averageDifficulty.toFixed(1)}
                  </span>
                </div>
                <div className="col-length" data-label="Length">{run.runLength} games</div>
                <div className="col-fixtures" data-label="Fixtures">
                  <div>
                    {run.fixtures.map((fixture, i) => (
                      <span
                        key={i}
                        className={`fixture-chip ${fixture.isHome ? 'home' : 'away'}`}
                        title={`GW${fixture.gameweek}: ${fixture.isHome ? 'vs' : '@'} ${fixture.opponent} (${fixture.difficulty})`}
                      >
                        {fixture.opponent.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {fixtureRuns.length === 0 && (
        <div className="no-runs-message">
          <p>No fixture runs found matching your criteria.</p>
          <p>Try increasing the maximum difficulty or reducing the minimum run length.</p>
        </div>
      )}
    </div>
  );
};

export default FixtureRunAnalyzer;