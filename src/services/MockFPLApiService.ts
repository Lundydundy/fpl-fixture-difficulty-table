import { Team, Fixture, Gameweek } from '../types';
// import { errorHandlingService } from './ErrorHandlingService';
import { cacheService } from './CacheService';

// Mock data that represents realistic FPL data
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
        name: 'Aston Villa',
        short_name: 'AVL',
        code: 7,
        strength: 3,
        strength_overall_home: 1100,
        strength_overall_away: 1050,
        strength_attack_home: 1150,
        strength_attack_away: 1100,
        strength_defence_home: 1080,
        strength_defence_away: 1020
    },
    {
        id: 3,
        name: 'Bournemouth',
        short_name: 'BOU',
        code: 91,
        strength: 2,
        strength_overall_home: 950,
        strength_overall_away: 900,
        strength_attack_home: 1000,
        strength_attack_away: 950,
        strength_defence_home: 920,
        strength_defence_away: 880
    },
    {
        id: 4,
        name: 'Brentford',
        short_name: 'BRE',
        code: 94,
        strength: 3,
        strength_overall_home: 1050,
        strength_overall_away: 1000,
        strength_attack_home: 1100,
        strength_attack_away: 1050,
        strength_defence_home: 1020,
        strength_defence_away: 980
    },
    {
        id: 5,
        name: 'Brighton & Hove Albion',
        short_name: 'BHA',
        code: 36,
        strength: 3,
        strength_overall_home: 1080,
        strength_overall_away: 1030,
        strength_attack_home: 1120,
        strength_attack_away: 1070,
        strength_defence_home: 1050,
        strength_defence_away: 1000
    },
    {
        id: 6,
        name: 'Chelsea',
        short_name: 'CHE',
        code: 8,
        strength: 4,
        strength_overall_home: 1180,
        strength_overall_away: 1130,
        strength_attack_home: 1220,
        strength_attack_away: 1170,
        strength_defence_home: 1150,
        strength_defence_away: 1100
    },
    {
        id: 7,
        name: 'Crystal Palace',
        short_name: 'CRY',
        code: 31,
        strength: 3,
        strength_overall_home: 1020,
        strength_overall_away: 970,
        strength_attack_home: 1070,
        strength_attack_away: 1020,
        strength_defence_home: 990,
        strength_defence_away: 940
    },
    {
        id: 8,
        name: 'Everton',
        short_name: 'EVE',
        code: 11,
        strength: 2,
        strength_overall_home: 980,
        strength_overall_away: 930,
        strength_attack_home: 1020,
        strength_attack_away: 970,
        strength_defence_home: 950,
        strength_defence_away: 900
    },
    {
        id: 9,
        name: 'Fulham',
        short_name: 'FUL',
        code: 54,
        strength: 3,
        strength_overall_home: 1040,
        strength_overall_away: 990,
        strength_attack_home: 1080,
        strength_attack_away: 1030,
        strength_defence_home: 1010,
        strength_defence_away: 960
    },
    {
        id: 10,
        name: 'Ipswich Town',
        short_name: 'IPS',
        code: 40,
        strength: 2,
        strength_overall_home: 900,
        strength_overall_away: 850,
        strength_attack_home: 950,
        strength_attack_away: 900,
        strength_defence_home: 870,
        strength_defence_away: 820
    },
    {
        id: 11,
        name: 'Leicester City',
        short_name: 'LEI',
        code: 13,
        strength: 2,
        strength_overall_home: 920,
        strength_overall_away: 870,
        strength_attack_home: 970,
        strength_attack_away: 920,
        strength_defence_home: 890,
        strength_defence_away: 840
    },
    {
        id: 12,
        name: 'Liverpool',
        short_name: 'LIV',
        code: 14,
        strength: 5,
        strength_overall_home: 1320,
        strength_overall_away: 1280,
        strength_attack_home: 1380,
        strength_attack_away: 1340,
        strength_defence_home: 1300,
        strength_defence_away: 1250
    },
    {
        id: 13,
        name: 'Manchester City',
        short_name: 'MCI',
        code: 43,
        strength: 5,
        strength_overall_home: 1350,
        strength_overall_away: 1300,
        strength_attack_home: 1400,
        strength_attack_away: 1350,
        strength_defence_home: 1320,
        strength_defence_away: 1280
    },
    {
        id: 14,
        name: 'Manchester United',
        short_name: 'MUN',
        code: 1,
        strength: 4,
        strength_overall_home: 1150,
        strength_overall_away: 1100,
        strength_attack_home: 1200,
        strength_attack_away: 1150,
        strength_defence_home: 1120,
        strength_defence_away: 1070
    },
    {
        id: 15,
        name: 'Newcastle United',
        short_name: 'NEW',
        code: 4,
        strength: 4,
        strength_overall_home: 1120,
        strength_overall_away: 1070,
        strength_attack_home: 1170,
        strength_attack_away: 1120,
        strength_defence_home: 1090,
        strength_defence_away: 1040
    },
    {
        id: 16,
        name: 'Nottingham Forest',
        short_name: 'NFO',
        code: 17,
        strength: 2,
        strength_overall_home: 960,
        strength_overall_away: 910,
        strength_attack_home: 1010,
        strength_attack_away: 960,
        strength_defence_home: 930,
        strength_defence_away: 880
    },
    {
        id: 17,
        name: 'Southampton',
        short_name: 'SOU',
        code: 20,
        strength: 2,
        strength_overall_home: 880,
        strength_overall_away: 830,
        strength_attack_home: 930,
        strength_attack_away: 880,
        strength_defence_home: 850,
        strength_defence_away: 800
    },
    {
        id: 18,
        name: 'Tottenham Hotspur',
        short_name: 'TOT',
        code: 6,
        strength: 4,
        strength_overall_home: 1160,
        strength_overall_away: 1110,
        strength_attack_home: 1210,
        strength_attack_away: 1160,
        strength_defence_home: 1130,
        strength_defence_away: 1080
    },
    {
        id: 19,
        name: 'West Ham United',
        short_name: 'WHU',
        code: 21,
        strength: 3,
        strength_overall_home: 1000,
        strength_overall_away: 950,
        strength_attack_home: 1050,
        strength_attack_away: 1000,
        strength_defence_home: 970,
        strength_defence_away: 920
    },
    {
        id: 20,
        name: 'Wolverhampton Wanderers',
        short_name: 'WOL',
        code: 39,
        strength: 2,
        strength_overall_home: 940,
        strength_overall_away: 890,
        strength_attack_home: 990,
        strength_attack_away: 940,
        strength_defence_home: 910,
        strength_defence_away: 860
    }
];

const mockGameweeks: Gameweek[] = [
    {
        id: 1,
        name: 'Gameweek 1',
        deadline_time: '2024-08-16T18:30:00Z',
        finished: false,
        is_current: true,
        is_next: false
    },
    {
        id: 2,
        name: 'Gameweek 2',
        deadline_time: '2024-08-23T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    },
    {
        id: 3,
        name: 'Gameweek 3',
        deadline_time: '2024-08-30T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    },
    {
        id: 4,
        name: 'Gameweek 4',
        deadline_time: '2024-09-13T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    },
    {
        id: 5,
        name: 'Gameweek 5',
        deadline_time: '2024-09-20T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: true
    },
    {
        id: 6,
        name: 'Gameweek 6',
        deadline_time: '2024-09-27T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    },
    {
        id: 7,
        name: 'Gameweek 7',
        deadline_time: '2024-10-04T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    },
    {
        id: 8,
        name: 'Gameweek 8',
        deadline_time: '2024-10-18T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    },
    {
        id: 9,
        name: 'Gameweek 9',
        deadline_time: '2024-10-25T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    },
    {
        id: 10,
        name: 'Gameweek 10',
        deadline_time: '2024-11-01T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    },
    {
        id: 11,
        name: 'Gameweek 11',
        deadline_time: '2024-11-08T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    },
    {
        id: 12,
        name: 'Gameweek 12',
        deadline_time: '2024-11-22T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    },
    {
        id: 13,
        name: 'Gameweek 13',
        deadline_time: '2024-11-29T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    },
    {
        id: 14,
        name: 'Gameweek 14',
        deadline_time: '2024-12-06T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    },
    {
        id: 15,
        name: 'Gameweek 15',
        deadline_time: '2024-12-13T18:30:00Z',
        finished: false,
        is_current: false,
        is_next: false
    }
];

// Generate realistic fixture data
const generateMockFixtures = (): Fixture[] => {
    const fixtures: Fixture[] = [];
    let fixtureId = 1;

    // Generate fixtures for gameweeks 1-15 (upcoming fixtures)
    for (let gameweek = 1; gameweek <= 15; gameweek++) {
        // Create 10 fixtures per gameweek (20 teams = 10 matches)
        const teamsThisWeek = [...mockTeams];
        const shuffledTeams = teamsThisWeek.sort(() => Math.random() - 0.5);

        for (let i = 0; i < shuffledTeams.length; i += 2) {
            if (i + 1 < shuffledTeams.length) {
                const homeTeam = shuffledTeams[i];
                const awayTeam = shuffledTeams[i + 1];

                // Calculate difficulty based on team strength (inverse relationship)
                const homeDifficulty = Math.max(1, Math.min(5, Math.round(6 - (awayTeam.strength))));
                const awayDifficulty = Math.max(1, Math.min(5, Math.round(6 - (homeTeam.strength))));

                fixtures.push({
                    id: fixtureId++,
                    code: 12345 + fixtureId,
                    event: gameweek,
                    finished: false,
                    kickoff_time: `2024-${String(8 + Math.floor(gameweek / 4)).padStart(2, '0')}-${String(15 + (gameweek % 4) * 7).padStart(2, '0')}T${14 + (i % 3)}:${i % 2 === 0 ? '00' : '30'}:00Z`,
                    team_a: awayTeam.id,
                    team_h: homeTeam.id,
                    team_a_difficulty: awayDifficulty,
                    team_h_difficulty: homeDifficulty
                });
            }
        }
    }

    return fixtures;
};

const mockFixtures = generateMockFixtures();

class MockFPLApiService {
    private readonly MOCK_DELAY = 800; // Simulate network delay
    private readonly ERROR_RATE = 0.1; // 10% chance of error for testing
    private readonly TIMEOUT_RATE = 0.05; // 5% chance of timeout for testing

    /**
     * Simulate network delay
     */
    private async delay(ms: number = this.MOCK_DELAY): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Simulate random errors for testing error handling
     */
    private simulateError(): void {
        const random = Math.random();
        
        if (random < this.TIMEOUT_RATE) {
            throw new Error('Request timeout after 10000ms');
        }
        
        if (random < this.ERROR_RATE) {
            const errorTypes = [
                'Network error: Failed to fetch',
                'Server error: 500 Internal Server Error',
                'JSON parse error: Unexpected token',
                'CORS error: Access blocked'
            ];
            const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
            throw new Error(randomError);
        }
    }

    /**
     * Fetch all teams with caching and error handling
     */
    async getTeams(): Promise<Team[]> {
        // Check cache first
        const cached = cacheService.getTeams();
        if (cached) {
            return cached;
        }

        try {
            // Simulate potential errors
            this.simulateError();
            
            await this.delay();
            const teams = [...mockTeams];
            
            // Cache the result
            cacheService.setTeams(teams);
            
            return teams;
        } catch (error) {
            // Try to return stale data for graceful degradation
            const staleData = cacheService.getStaleTeams();
            if (staleData) {
                return staleData.data;
            }
            
            // Re-throw error if no stale data available
            throw error;
        }
    }

    /**
     * Fetch all fixtures with caching and error handling
     */
    async getFixtures(): Promise<Fixture[]> {
        // Check cache first
        const cached = cacheService.getFixtures();
        if (cached) {
            return cached;
        }

        try {
            // Simulate potential errors
            this.simulateError();
            
            await this.delay();
            const fixtures = [...mockFixtures];
            
            // Cache the result
            cacheService.setFixtures(fixtures);
            
            return fixtures;
        } catch (error) {
            // Try to return stale data for graceful degradation
            const staleData = cacheService.getStaleFixtures();
            if (staleData) {
                return staleData.data;
            }
            
            // Re-throw error if no stale data available
            throw error;
        }
    }

    /**
     * Fetch all gameweeks with caching and error handling
     */
    async getGameweeks(): Promise<Gameweek[]> {
        // Check cache first
        const cached = cacheService.getGameweeks();
        if (cached) {
            return cached;
        }

        try {
            // Simulate potential errors
            this.simulateError();
            
            await this.delay();
            const gameweeks = [...mockGameweeks];
            
            // Cache the result
            cacheService.setGameweeks(gameweeks);
            
            return gameweeks;
        } catch (error) {
            // Try to return stale data for graceful degradation
            const staleData = cacheService.getStaleGameweeks();
            if (staleData) {
                return staleData.data;
            }
            
            // Re-throw error if no stale data available
            throw error;
        }
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        cacheService.clear();
    }

    /**
     * Get cache statistics
     */
    getCacheStats(): { size: number; keys: string[]; hitRate: number; totalRequests: number; hits: number } {
        return cacheService.getStats();
    }

    /**
     * Force error for testing (development only)
     */
    forceError(errorType: 'network' | 'timeout' | 'server' | 'parsing' = 'network'): void {
        const errorMessages = {
            network: 'Network error: Failed to fetch',
            timeout: 'Request timeout after 10000ms',
            server: 'Server error: 500 Internal Server Error',
            parsing: 'JSON parse error: Unexpected token'
        };
        
        throw new Error(errorMessages[errorType]);
    }
}

// Export singleton instance
export const mockFplApiService = new MockFPLApiService();
export default MockFPLApiService;