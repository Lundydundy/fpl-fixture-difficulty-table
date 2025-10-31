import { Team } from '../types';

/**
 * Apply custom difficulty ratings for specific teams
 * 
 * Custom Rules:
 * - Man City away fixtures: Grade 5 (hardest)
 * - Arsenal away fixtures: Grade 5 (hardest)
 * - Sunderland home/away fixtures: Grade 1 (easiest)
 */
export function getCustomDifficulty(
  opponentTeam: Team | string, 
  isHome: boolean, 
  originalDifficulty: number
): number {
  const opponentName = typeof opponentTeam === 'string' ? opponentTeam : opponentTeam.name;

  // Arsenal away fixtures are grade 5 (hardest)
  if (!isHome && (opponentName === 'Arsenal')) {
    return 5;
  }
  

  return originalDifficulty;
}

/**
 * Get custom difficulty by team ID (for cases where we only have IDs)
 */
export function getCustomDifficultyById(
  teams: Team[],
  opponentId: number,
  isHome: boolean,
  originalDifficulty: number
): number {
  const opponentTeam = teams.find(t => t.id === opponentId);
  if (!opponentTeam) {
    return originalDifficulty;
  }
  
  return getCustomDifficulty(opponentTeam, isHome, originalDifficulty);
}

/**
 * List of teams with custom difficulty ratings for display purposes
 */
export const CUSTOM_DIFFICULTY_TEAMS = {
  hardest: [
    { name: 'Manchester City', condition: 'away', difficulty: 5 },
    { name: 'Arsenal', condition: 'away', difficulty: 5 }
  ],
  easiest: [
    { name: 'Sunderland', condition: 'home/away', difficulty: 1 }
  ]
} as const;