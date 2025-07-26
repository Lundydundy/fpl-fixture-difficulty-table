import { Team, Fixture } from '../types';
import { getCustomDifficultyById } from './customDifficulty';

export interface FixtureRun {
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
  score: number; // Composite score considering difficulty and length
}

export interface AnalysisOptions {
  minRunLength: number;
  maxDifficulty: number;
  maxResults: number;
  currentGameweek?: number;
}

/**
 * Analyze fixture runs for all teams to find the best periods
 */
export function analyzeFixtureRuns(
  teams: Team[],
  fixtures: Fixture[],
  options: AnalysisOptions
): FixtureRun[] {
  const { minRunLength, maxDifficulty, maxResults, currentGameweek = 1 } = options;
  const runs: FixtureRun[] = [];

  teams.forEach(team => {
    // Get all fixtures for this team, sorted by gameweek
    const teamFixtures = fixtures
      .filter(fixture => fixture.team_h === team.id || fixture.team_a === team.id)
      .map(fixture => ({
        gameweek: fixture.event,
        opponent: fixture.team_h === team.id 
          ? teams.find(t => t.id === fixture.team_a)?.name || 'Unknown'
          : teams.find(t => t.id === fixture.team_h)?.name || 'Unknown',
        isHome: fixture.team_h === team.id,
        difficulty: fixture.team_h === team.id ? fixture.team_h_difficulty : fixture.team_a_difficulty
      }))
      .sort((a, b) => a.gameweek - b.gameweek);

    // Analyze all possible runs
    for (let start = 0; start <= teamFixtures.length - minRunLength; start++) {
      for (let length = minRunLength; length <= Math.min(8, teamFixtures.length - start); length++) {
        const runFixtures = teamFixtures.slice(start, start + length);
        const averageDifficulty = runFixtures.reduce((sum, f) => sum + f.difficulty, 0) / runFixtures.length;
        
        // Only include runs that meet our difficulty criteria
        if (averageDifficulty <= maxDifficulty) {
          // Calculate a composite score (lower is better)
          // Factors: average difficulty (60%), length bonus (40%)
          const difficultyScore = averageDifficulty / 5; // Normalize to 0-1
          const lengthBonus = Math.min(length / 8, 1); // Normalize to 0-1, longer is better
          const score = difficultyScore * 0.6 + (1 - lengthBonus) * 0.4;

          runs.push({
            team,
            startGameweek: runFixtures[0].gameweek,
            endGameweek: runFixtures[runFixtures.length - 1].gameweek,
            averageDifficulty,
            fixtures: runFixtures,
            runLength: length,
            score
          });
        }
      }
    }
  });

  // Sort by score (best runs first)
  return runs
    .sort((a, b) => a.score - b.score)
    .slice(0, maxResults);
}

/**
 * Find upcoming fixture runs (next N gameweeks)
 */
export function findUpcomingRuns(
  runs: FixtureRun[],
  currentGameweek: number,
  lookAheadGameweeks: number = 10
): FixtureRun[] {
  return runs.filter(run => 
    run.startGameweek >= currentGameweek && 
    run.startGameweek <= currentGameweek + lookAheadGameweeks
  );
}

/**
 * Get the current gameweek based on date (rough estimation)
 */
export function getCurrentGameweek(): number {
  const now = new Date();
  const seasonStart = new Date(now.getFullYear(), 7, 15); // Rough season start (August 15)
  
  if (now < seasonStart) {
    // Pre-season, return 1
    return 1;
  }
  
  const weeksSinceStart = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return Math.min(Math.max(weeksSinceStart + 1, 1), 38);
}

/**
 * Find teams with consistently good fixtures over a period
 */
export function findConsistentPerformers(
  teams: Team[],
  fixtures: Fixture[],
  startGW: number,
  endGW: number,
  maxAvgDifficulty: number = 2.5
): Array<{
  team: Team;
  averageDifficulty: number;
  fixtureCount: number;
  fixtures: Array<{
    gameweek: number;
    opponent: string;
    isHome: boolean;
    difficulty: number;
  }>;
}> {
  return teams.map(team => {
    const teamFixtures = fixtures
      .filter(fixture => 
        (fixture.team_h === team.id || fixture.team_a === team.id) &&
        fixture.event >= startGW &&
        fixture.event <= endGW
      )
      .map(fixture => ({
        gameweek: fixture.event,
        opponent: fixture.team_h === team.id 
          ? teams.find(t => t.id === fixture.team_a)?.name || 'Unknown'
          : teams.find(t => t.id === fixture.team_h)?.name || 'Unknown',
        isHome: fixture.team_h === team.id,
        difficulty: fixture.team_h === team.id ? fixture.team_h_difficulty : fixture.team_a_difficulty
      }))
      .sort((a, b) => a.gameweek - b.gameweek);

    const averageDifficulty = teamFixtures.length > 0 
      ? teamFixtures.reduce((sum, f) => sum + f.difficulty, 0) / teamFixtures.length
      : 5; // Worst possible if no fixtures

    return {
      team,
      averageDifficulty,
      fixtureCount: teamFixtures.length,
      fixtures: teamFixtures
    };
  })
  .filter(result => result.averageDifficulty <= maxAvgDifficulty && result.fixtureCount > 0)
  .sort((a, b) => a.averageDifficulty - b.averageDifficulty);
}

/**
 * Generate insights and recommendations
 */
export function generateInsights(runs: FixtureRun[], currentGameweek: number): string[] {
  const insights: string[] = [];
  
  if (runs.length === 0) {
    insights.push("No excellent fixture runs found with current criteria.");
    return insights;
  }

  // Best overall run
  const bestRun = runs[0];
  insights.push(
    `🏆 Best fixture run: ${bestRun.team.name} (GW${bestRun.startGameweek}-${bestRun.endGameweek}) ` +
    `with ${bestRun.averageDifficulty.toFixed(1)} average difficulty over ${bestRun.runLength} games.`
  );

  // Upcoming opportunities
  const upcomingRuns = findUpcomingRuns(runs, currentGameweek, 6);
  if (upcomingRuns.length > 0) {
    const nextBest = upcomingRuns[0];
    insights.push(
      `🔥 Next great opportunity: ${nextBest.team.name} starting GW${nextBest.startGameweek} ` +
      `(${nextBest.averageDifficulty.toFixed(1)} difficulty).`
    );
  }

  // Long runs
  const longRuns = runs.filter(run => run.runLength >= 6);
  if (longRuns.length > 0) {
    insights.push(
      `📈 Longest easy run: ${longRuns[0].team.name} with ${longRuns[0].runLength} consecutive ` +
      `favorable fixtures (GW${longRuns[0].startGameweek}-${longRuns[0].endGameweek}).`
    );
  }

  // Teams with multiple good runs
  const teamRunCounts = runs.reduce((acc, run) => {
    acc[run.team.name] = (acc[run.team.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const multipleRunTeams = Object.entries(teamRunCounts)
    .filter(([, count]) => count >= 3)
    .sort(([, a], [, b]) => b - a);

  if (multipleRunTeams.length > 0) {
    const [teamName, count] = multipleRunTeams[0];
    insights.push(
      `🎯 Most consistent: ${teamName} appears in ${count} different excellent fixture runs.`
    );
  }

  return insights;
}

/**
 * Export fixture runs to a shareable format
 */
export function exportFixtureRuns(runs: FixtureRun[]): string {
  const header = "Team,Start GW,End GW,Length,Avg Difficulty,Fixtures\n";
  const rows = runs.map(run => {
    const fixtures = run.fixtures.map(f => 
      `${f.isHome ? 'vs' : '@'}${f.opponent}(${f.difficulty})`
    ).join(';');
    
    return `${run.team.name},${run.startGameweek},${run.endGameweek},${run.runLength},${run.averageDifficulty.toFixed(1)},"${fixtures}"`;
  }).join('\n');
  
  return header + rows;
}