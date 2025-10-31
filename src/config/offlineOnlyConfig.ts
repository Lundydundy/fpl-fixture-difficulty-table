/**
 * Offline-Only Configuration
 * 
 * This configuration makes the app purely offline with no mode switching options.
 * To use this configuration, replace the import in appConfig.ts
 */

export const OFFLINE_ONLY_CONFIG = {
    dataSource: {
        defaultMode: 'offline' as const,
        availableModes: ['offline'] as const, // Only offline mode available
        showModeSelector: false, // Hide the mode selector completely
        allowModeSwitching: false // Disable mode switching
    },

    customDifficulty: {
        enabled: true,
        rules: {
            hardestAway: ['Man City', 'Arsenal'],
            easiestAll: [] as const
        }
    },

    ui: {
        showCustomDifficultyIndicators: true,
        defaultGameweeks: 5,
        maxGameweeks: 15
    },

    performance: {
        offlineDelay: 50, // Faster for pure offline mode
        cacheTimeout: 0 // No caching needed for offline
    }
} as const;

export default OFFLINE_ONLY_CONFIG;