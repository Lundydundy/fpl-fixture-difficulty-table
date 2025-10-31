import { Team, Fixture, Gameweek } from '../types';
import { OFFLINE_TEAMS, OFFLINE_FIXTURES, OFFLINE_GAMEWEEKS, CUSTOM_DIFFICULTY_RULES } from '../data/offlineData';

/**
 * Offline FPL API Service
 * 
 * This service provides the same interface as the regular FPL API service
 * but uses pre-loaded offline data. Perfect for:
 * - Working without internet connection
 * - Faster loading times
 * - Consistent data for testing
 * - Custom difficulty ratings already applied
 */
class OfflineFPLApiService {
    private readonly SIMULATE_DELAY = true; // Set to false for instant responses
    private readonly DELAY_MS = 200; // Realistic delay simulation

    /**
     * Simulate network delay for realistic experience
     */
    private async delay(ms: number = this.DELAY_MS): Promise<void> {
        if (this.SIMULATE_DELAY) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    /**
     * Fetch all teams with offline data
     * Custom difficulty ratings are already built into the fixture data
     */
    async getTeams(): Promise<Team[]> {
        await this.delay(100);
        return [...OFFLINE_TEAMS];
    }

    /**
     * Fetch all fixtures with offline data
    * Custom difficulty ratings are already applied:
    * - Man City away fixtures: Grade 5 (hardest)
    * - Arsenal away fixtures: Grade 5 (hardest)
     */
    async getFixtures(): Promise<Fixture[]> {
        await this.delay(150);
        return [...OFFLINE_FIXTURES];
    }

    /**
     * Fetch all gameweeks with offline data
     */
    async getGameweeks(): Promise<Gameweek[]> {
        await this.delay(100);
        return [...OFFLINE_GAMEWEEKS];
    }

    /**
     * Clear cache (no-op for offline service)
     */
    clearCache(): void {
        console.log('OfflineFPLApiService: No cache to clear in offline mode');
    }

    /**
     * Get cache stats (returns offline-specific stats)
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

    /**
     * Get information about custom difficulty rules
     */
    getCustomDifficultyInfo() {
        return CUSTOM_DIFFICULTY_RULES;
    }

    /**
     * Check if service is running in offline mode
     */
    isOffline(): boolean {
        return true;
    }

    /**
     * Get service status
     */
    getStatus(): { mode: string; dataSource: string; customRules: boolean } {
        return {
            mode: 'offline',
            dataSource: 'local',
            customRules: true
        };
    }
}

// Export singleton instance
export const offlineFplApiService = new OfflineFPLApiService();
export default OfflineFPLApiService;