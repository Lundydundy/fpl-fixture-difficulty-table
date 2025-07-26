import { Team, Fixture, Gameweek } from '../types';
import { mockFplApiService } from './MockFPLApiService';
import { offlineFplApiService } from './OfflineFPLApiService';
import { realFplApiService } from './RealFPLApiService';
import { APP_CONFIG, getEffectiveDefaultMode } from '../config/appConfig';

/**
 * FPL API Service Mode
 */
export type FPLApiMode = 'online' | 'offline' | 'mock';

/**
 * FPL API Service Interface
 */
interface IFPLApiService {
    getTeams(): Promise<Team[]>;
    getFixtures(): Promise<Fixture[]>;
    getGameweeks(): Promise<Gameweek[]>;
    clearCache(): void;
    getCacheStats(): { size: number; keys: string[]; hitRate: number; totalRequests: number; hits: number };
}

/**
 * FPL API Service Switcher
 * 
 * This service allows easy switching between different data sources:
 * - 'offline': Uses pre-loaded offline data with custom difficulty ratings
 * - 'mock': Uses mock data with simulated network delays and errors
 * - 'online': Uses real FPL API (when implemented)
 * 
 * Perfect for:
 * - Development and testing
 * - Offline usage
 * - Performance comparison
 * - Custom difficulty rating testing
 */
class FPLApiServiceSwitcher implements IFPLApiService {
    private currentMode: FPLApiMode = getEffectiveDefaultMode() as FPLApiMode;
    private currentService: IFPLApiService;

    constructor() {
        this.currentService = this.getServiceForMode(this.currentMode);
    }

    /**
     * Get the appropriate service instance for the given mode
     */
    private getServiceForMode(mode: FPLApiMode): IFPLApiService {
        switch (mode) {
            case 'offline':
                return offlineFplApiService;
            case 'online':
                return realFplApiService;
            case 'mock':
                return mockFplApiService;
            default:
                return offlineFplApiService; // Default to offline mode
        }
    }

    /**
     * Switch to a different API mode
     */
    switchMode(mode: FPLApiMode): void {
        // Check if mode switching is allowed and if the mode is available
        if (!APP_CONFIG.dataSource.allowModeSwitching) {
            console.warn('Mode switching is disabled in app configuration');
            return;
        }
        
        if (!APP_CONFIG.dataSource.availableModes.includes(mode)) {
            console.warn(`Mode '${mode}' is not available in current configuration`);
            return;
        }
        
        console.log(`FPLApiServiceSwitcher: Switching from ${this.currentMode} to ${mode} mode`);
        this.currentMode = mode;
        this.currentService = this.getServiceForMode(mode);
    }

    /**
     * Get current mode
     */
    getCurrentMode(): FPLApiMode {
        return this.currentMode;
    }

    /**
     * Get current service status
     */
    getStatus(): { mode: FPLApiMode; hasCustomRules: boolean; description: string } {
        const descriptions = {
            offline: 'Using real FPL data stored locally with custom difficulty ratings applied',
            mock: 'Using mock data with simulated network conditions',
            online: 'Using live FPL API data with custom difficulty ratings'
        };

        return {
            mode: this.currentMode,
            hasCustomRules: this.currentMode === 'offline' || this.currentMode === 'mock',
            description: descriptions[this.currentMode]
        };
    }

    /**
     * Check if custom difficulty rules are active
     */
    hasCustomDifficultyRules(): boolean {
        return this.currentMode === 'offline' || this.currentMode === 'mock';
    }

    // Implement IFPLApiService interface
    async getTeams(): Promise<Team[]> {
        return this.currentService.getTeams();
    }

    async getFixtures(): Promise<Fixture[]> {
        return this.currentService.getFixtures();
    }

    async getGameweeks(): Promise<Gameweek[]> {
        return this.currentService.getGameweeks();
    }

    clearCache(): void {
        this.currentService.clearCache();
    }

    getCacheStats(): { size: number; keys: string[]; hitRate: number; totalRequests: number; hits: number } {
        return this.currentService.getCacheStats();
    }
}

// Export singleton instance
export const fplApiService = new FPLApiServiceSwitcher();

// Export types and utilities
export type { IFPLApiService };
export { FPLApiServiceSwitcher };