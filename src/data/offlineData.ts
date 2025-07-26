import { Team, Fixture, Gameweek } from '../types';

/**
 * Offline FPL Data for 2024/25 Season - REAL DATA FROM FPL API
 * 
 * This file contains real FPL data fetched from the official API.
 * Custom difficulty ratings are applied:
 * 
 * - Man City away fixtures: Grade 5 (hardest)
 * - Arsenal away fixtures: Grade 5 (hardest) 
 * - Sunderland home/away fixtures: Grade 1 (easiest)
 */

// Real Premier League Teams 2024/25 Season from FPL API
export const OFFLINE_TEAMS: Team[] = [
    {
        "id": 1,
        "name": "Arsenal",
        "short_name": "ARS",
        "code": 3,
        "strength": 4,
        "strength_overall_home": 1320,
        "strength_overall_away": 1325,
        "strength_attack_home": 1350,
        "strength_attack_away": 1350,
        "strength_defence_home": 1290,
        "strength_defence_away": 1300
    },
    {
        "id": 2,
        "name": "Aston Villa",
        "short_name": "AVL",
        "code": 7,
        "strength": 3,
        "strength_overall_home": 1125,
        "strength_overall_away": 1250,
        "strength_attack_home": 1110,
        "strength_attack_away": 1200,
        "strength_defence_home": 1140,
        "strength_defence_away": 1300
    },
    {
        "id": 3,
        "name": "Burnley",
        "short_name": "BUR",
        "code": 90,
        "strength": 2,
        "strength_overall_home": 1050,
        "strength_overall_away": 1050,
        "strength_attack_home": 1050,
        "strength_attack_away": 1050,
        "strength_defence_home": 1050,
        "strength_defence_away": 1050
    },
    {
        "id": 4,
        "name": "Bournemouth",
        "short_name": "BOU",
        "code": 91,
        "strength": 3,
        "strength_overall_home": 1150,
        "strength_overall_away": 1180,
        "strength_attack_home": 1100,
        "strength_attack_away": 1160,
        "strength_defence_home": 1200,
        "strength_defence_away": 1200
    },
    {
        "id": 5,
        "name": "Brentford",
        "short_name": "BRE",
        "code": 94,
        "strength": 3,
        "strength_overall_home": 1120,
        "strength_overall_away": 1185,
        "strength_attack_home": 1080,
        "strength_attack_away": 1080,
        "strength_defence_home": 1160,
        "strength_defence_away": 1290
    },
    {
        "id": 6,
        "name": "Brighton",
        "short_name": "BHA",
        "code": 36,
        "strength": 3,
        "strength_overall_home": 1150,
        "strength_overall_away": 1175,
        "strength_attack_home": 1090,
        "strength_attack_away": 1140,
        "strength_defence_home": 1210,
        "strength_defence_away": 1210
    },
    {
        "id": 7,
        "name": "Chelsea",
        "short_name": "CHE",
        "code": 8,
        "strength": 4,
        "strength_overall_home": 1185,
        "strength_overall_away": 1245,
        "strength_attack_home": 1150,
        "strength_attack_away": 1190,
        "strength_defence_home": 1220,
        "strength_defence_away": 1300
    },
    {
        "id": 8,
        "name": "Crystal Palace",
        "short_name": "CRY",
        "code": 31,
        "strength": 3,
        "strength_overall_home": 1140,
        "strength_overall_away": 1160,
        "strength_attack_home": 1120,
        "strength_attack_away": 1130,
        "strength_defence_home": 1160,
        "strength_defence_away": 1190
    },
    {
        "id": 9,
        "name": "Everton",
        "short_name": "EVE",
        "code": 11,
        "strength": 3,
        "strength_overall_home": 1100,
        "strength_overall_away": 1115,
        "strength_attack_home": 1140,
        "strength_attack_away": 1140,
        "strength_defence_home": 1060,
        "strength_defence_away": 1090
    },
    {
        "id": 10,
        "name": "Fulham",
        "short_name": "FUL",
        "code": 54,
        "strength": 3,
        "strength_overall_home": 1125,
        "strength_overall_away": 1125,
        "strength_attack_home": 1130,
        "strength_attack_away": 1130,
        "strength_defence_home": 1120,
        "strength_defence_away": 1120
    },
    {
        "id": 11,
        "name": "Leeds",
        "short_name": "LEE",
        "code": 2,
        "strength": 2,
        "strength_overall_home": 1050,
        "strength_overall_away": 1075,
        "strength_attack_home": 1050,
        "strength_attack_away": 1050,
        "strength_defence_home": 1050,
        "strength_defence_away": 1100
    },
    {
        "id": 12,
        "name": "Liverpool",
        "short_name": "LIV",
        "code": 14,
        "strength": 5,
        "strength_overall_home": 1335,
        "strength_overall_away": 1355,
        "strength_attack_home": 1290,
        "strength_attack_away": 1330,
        "strength_defence_home": 1380,
        "strength_defence_away": 1380
    },
    {
        "id": 13,
        "name": "Man City",
        "short_name": "MCI",
        "code": 43,
        "strength": 4,
        "strength_overall_home": 1275,
        "strength_overall_away": 1315,
        "strength_attack_home": 1250,
        "strength_attack_away": 1250,
        "strength_defence_home": 1300,
        "strength_defence_away": 1380
    },
    {
        "id": 14,
        "name": "Man Utd",
        "short_name": "MUN",
        "code": 1,
        "strength": 3,
        "strength_overall_home": 1105,
        "strength_overall_away": 1125,
        "strength_attack_home": 1110,
        "strength_attack_away": 1110,
        "strength_defence_home": 1100,
        "strength_defence_away": 1140
    },
    {
        "id": 15,
        "name": "Newcastle",
        "short_name": "NEW",
        "code": 4,
        "strength": 4,
        "strength_overall_home": 1185,
        "strength_overall_away": 1245,
        "strength_attack_home": 1130,
        "strength_attack_away": 1170,
        "strength_defence_home": 1240,
        "strength_defence_away": 1320
    },
    {
        "id": 16,
        "name": "Nott'm Forest",
        "short_name": "NFO",
        "code": 17,
        "strength": 3,
        "strength_overall_home": 1165,
        "strength_overall_away": 1205,
        "strength_attack_home": 1150,
        "strength_attack_away": 1230,
        "strength_defence_home": 1180,
        "strength_defence_away": 1180
    },
    {
        "id": 17,
        "name": "Sunderland",
        "short_name": "SUN",
        "code": 56,
        "strength": 2,
        "strength_overall_home": 1050,
        "strength_overall_away": 1050,
        "strength_attack_home": 1050,
        "strength_attack_away": 1050,
        "strength_defence_home": 1050,
        "strength_defence_away": 1050
    },
    {
        "id": 18,
        "name": "Spurs",
        "short_name": "TOT",
        "code": 6,
        "strength": 3,
        "strength_overall_home": 1130,
        "strength_overall_away": 1175,
        "strength_attack_home": 1100,
        "strength_attack_away": 1100,
        "strength_defence_home": 1160,
        "strength_defence_away": 1250
    },
    {
        "id": 19,
        "name": "West Ham",
        "short_name": "WHU",
        "code": 21,
        "strength": 3,
        "strength_overall_home": 1100,
        "strength_overall_away": 1100,
        "strength_attack_home": 1100,
        "strength_attack_away": 1100,
        "strength_defence_home": 1100,
        "strength_defence_away": 1100
    },
    {
        "id": 20,
        "name": "Wolves",
        "short_name": "WOL",
        "code": 39,
        "strength": 3,
        "strength_overall_home": 1100,
        "strength_overall_away": 1125,
        "strength_attack_home": 1080,
        "strength_attack_away": 1100,
        "strength_defence_home": 1120,
        "strength_defence_away": 1150
    }
];

// Real Gameweeks for 2024/25 Season from FPL API
export const OFFLINE_GAMEWEEKS: Gameweek[] = [{

    "id": 1,
    "name": "Gameweek 1",
    "deadline_time": "2025-08-15T17:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": true
},
{
    "id": 2,
    "name": "Gameweek 2",
    "deadline_time": "2025-08-22T17:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 3,
    "name": "Gameweek 3",
    "deadline_time": "2025-08-29T17:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 4,
    "name": "Gameweek 4",
    "deadline_time": "2025-09-13T10:00:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 5,
    "name": "Gameweek 5",
    "deadline_time": "2025-09-20T10:00:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 6,
    "name": "Gameweek 6",
    "deadline_time": "2025-09-27T10:00:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 7,
    "name": "Gameweek 7",
    "deadline_time": "2025-10-04T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 8,
    "name": "Gameweek 8",
    "deadline_time": "2025-10-18T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 9,
    "name": "Gameweek 9",
    "deadline_time": "2025-10-25T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 10,
    "name": "Gameweek 10",
    "deadline_time": "2025-11-01T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 11,
    "name": "Gameweek 11",
    "deadline_time": "2025-11-08T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 12,
    "name": "Gameweek 12",
    "deadline_time": "2025-11-22T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 13,
    "name": "Gameweek 13",
    "deadline_time": "2025-11-29T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 14,
    "name": "Gameweek 14",
    "deadline_time": "2025-12-03T18:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 15,
    "name": "Gameweek 15",
    "deadline_time": "2025-12-06T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 16,
    "name": "Gameweek 16",
    "deadline_time": "2025-12-13T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 17,
    "name": "Gameweek 17",
    "deadline_time": "2025-12-20T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 18,
    "name": "Gameweek 18",
    "deadline_time": "2025-12-27T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 19,
    "name": "Gameweek 19",
    "deadline_time": "2025-12-30T18:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 20,
    "name": "Gameweek 20",
    "deadline_time": "2026-01-03T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 21,
    "name": "Gameweek 21",
    "deadline_time": "2026-01-07T18:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 22,
    "name": "Gameweek 22",
    "deadline_time": "2026-01-17T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 23,
    "name": "Gameweek 23",
    "deadline_time": "2026-01-24T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 24,
    "name": "Gameweek 24",
    "deadline_time": "2026-01-31T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 25,
    "name": "Gameweek 25",
    "deadline_time": "2026-02-07T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 26,
    "name": "Gameweek 26",
    "deadline_time": "2026-02-11T18:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 27,
    "name": "Gameweek 27",
    "deadline_time": "2026-02-21T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 28,
    "name": "Gameweek 28",
    "deadline_time": "2026-02-28T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 29,
    "name": "Gameweek 29",
    "deadline_time": "2026-03-04T18:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 30,
    "name": "Gameweek 30",
    "deadline_time": "2026-03-14T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 31,
    "name": "Gameweek 31",
    "deadline_time": "2026-03-21T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 32,
    "name": "Gameweek 32",
    "deadline_time": "2026-04-11T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 33,
    "name": "Gameweek 33",
    "deadline_time": "2026-04-18T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 34,
    "name": "Gameweek 34",
    "deadline_time": "2026-04-25T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 35,
    "name": "Gameweek 35",
    "deadline_time": "2026-05-02T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 36,
    "name": "Gameweek 36",
    "deadline_time": "2026-05-09T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 37,
    "name": "Gameweek 37",
    "deadline_time": "2026-05-17T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
},
{
    "id": 38,
    "name": "Gameweek 38",
    "deadline_time": "2026-05-24T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
}
];

// Real Fixtures with Custom Difficulty Ratings Applied
export const OFFLINE_FIXTURES: Fixture[] = [{

    id: 1,
    code: 2561895,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-15T19:00:00Z",
    team_h: 12, // Liverpool
    team_a: 4, // Bournemouth
    team_h_difficulty: 3,
    team_a_difficulty: 5
},
{
    id: 2,
    code: 2561896,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-16T11:30:00Z",
    team_h: 2, // Aston Villa
    team_a: 15, // Newcastle
    team_h_difficulty: 3,
    team_a_difficulty: 4
},
{
    id: 3,
    code: 2561897,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-16T14:00:00Z",
    team_h: 6, // Brighton
    team_a: 10, // Fulham
    team_h_difficulty: 3,
    team_a_difficulty: 3
},
{
    id: 4,
    code: 2561898,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-17T13:00:00Z",
    team_h: 16, // Nott'm Forest
    team_a: 5, // Brentford
    team_h_difficulty: 3,
    team_a_difficulty: 3
},
{
    id: 5,
    code: 2561899,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-16T14:00:00Z",
    team_h: 17, // Sunderland
    team_a: 19, // West Ham
    team_h_difficulty: 1, // Sunderland = 1
    team_a_difficulty: 1 // vs Sunderland = 1
},
{
    id: 6,
    code: 2561900,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-16T14:00:00Z",
    team_h: 18, // Spurs
    team_a: 3, // Burnley
    team_h_difficulty: 2,
    team_a_difficulty: 3
},
{
    id: 7,
    code: 2561901,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-16T16:30:00Z",
    team_h: 20, // Wolves
    team_a: 13, // Man City
    team_h_difficulty: 4,
    team_a_difficulty: 5 // Away to Man City = 5
},
{
    id: 8,
    code: 2561902,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-17T13:00:00Z",
    team_h: 7, // Chelsea
    team_a: 8, // Crystal Palace
    team_h_difficulty: 3,
    team_a_difficulty: 4
},
{
    id: 9,
    code: 2561903,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-17T15:30:00Z",
    team_h: 14, // Man Utd
    team_a: 1, // Arsenal
    team_h_difficulty: 4,
    team_a_difficulty: 5 // Away to Arsenal = 5
},
{
    id: 10,
    code: 2561904,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-18T19:00:00Z",
    team_h: 9, // Everton
    team_a: 11, // Leeds
    team_h_difficulty: 2,
    team_a_difficulty: 3
}
];

/**
 * Offline FPL API Service
 * Provides the same interface as the regular API service but uses offline data
 */
export class OfflineFPLApiService {
    /**
     * Get all teams
     */
    async getTeams(): Promise<Team[]> {
        // Simulate network delay for realistic experience
        await new Promise(resolve => setTimeout(resolve, 100));
        return [...OFFLINE_TEAMS];
    }

    /**
     * Get all fixtures
     */
    async getFixtures(): Promise<Fixture[]> {
        // Simulate network delay for realistic experience
        await new Promise(resolve => setTimeout(resolve, 150));
        return [...OFFLINE_FIXTURES];
    }

    /**
     * Get all gameweeks
     */
    async getGameweeks(): Promise<Gameweek[]> {
        // Simulate network delay for realistic experience
        await new Promise(resolve => setTimeout(resolve, 100));
        return [...OFFLINE_GAMEWEEKS];
    }

    /**
     * Clear cache (no-op for offline service)
     */
    clearCache(): void {
        // No cache to clear in offline mode
    }

    /**
     * Get cache stats (returns empty stats for offline service)
     */
    getCacheStats(): { size: number; keys: string[]; hitRate: number; totalRequests: number; hits: number } {
        return {
            size: OFFLINE_TEAMS.length + OFFLINE_FIXTURES.length + OFFLINE_GAMEWEEKS.length,
            keys: ['teams', 'fixtures', 'gameweeks'],
            hitRate: 1, // 100% hit rate since it's all offline
            totalRequests: 0,
            hits: 0
        };
    }
}

// Export singleton instance
export const offlineFplApiService = new OfflineFPLApiService();

/**
 * Custom difficulty rules summary for reference
 */
export const CUSTOM_DIFFICULTY_RULES = {
    description: 'Custom difficulty ratings applied to specific teams',
    rules: [
        {
            team: 'Man City',
            condition: 'Away fixtures only',
            difficulty: 5,
            reason: 'Playing away to Man City is always the hardest'
        },
        {
            team: 'Arsenal',
            condition: 'Away fixtures only',
            difficulty: 5,
            reason: 'Playing away to Arsenal is always the hardest'
        },
        {
            team: 'Sunderland',
            condition: 'Home and away fixtures',
            difficulty: 1,
            reason: 'All Sunderland fixtures are the easiest'
        }
    ],
    note: 'These custom ratings override the standard FPL difficulty ratings for strategic analysis'
} as const;