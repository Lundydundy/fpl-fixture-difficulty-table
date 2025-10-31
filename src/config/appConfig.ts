/**
 * Application Configuration
 * 
 * This file contains configuration options for the FPL Fixture Difficulty Table app.
 * Modify these settings to customize the app behavior.
 */

export const APP_CONFIG = {
    /**
     * Data Source Configuration
     */
    dataSource: {
        // Default mode when the app starts
        defaultMode: 'offline' as const,
        
        // Available modes for users to switch between
        // Set to ['offline'] to make the app purely offline
        availableModes: ['offline'] as const,
        
        // Whether to show the service mode selector component
        showModeSelector: false,
        
        // Whether to allow mode switching (if false, app will always use defaultMode)
        allowModeSwitching: false
    },

    /**
     * Custom Difficulty Rules Configuration
     */
    customDifficulty: {
        // Whether custom difficulty rules are enabled
        enabled: true,
        
        // Custom difficulty rules
        rules: {
            // Teams where away fixtures are always grade 5 (hardest)
            hardestAway: ['Man City', 'Arsenal'],
            

        }
    },

    /**
     * UI Configuration
     */
    ui: {
        // Whether to show custom difficulty indicators in the UI
        showCustomDifficultyIndicators: true,
        
        // Default number of gameweeks to display
        defaultGameweeks: 5,
        
        // Maximum number of gameweeks that can be selected
        maxGameweeks: 15
    },

    /**
     * Performance Configuration
     */
    performance: {
        // Simulated network delay for offline mode (in ms)
        offlineDelay: 100,
        
        // Cache duration for online mode (in ms)
        cacheTimeout: 5 * 60 * 1000 // 5 minutes
    }
} as const;

/**
 * Helper function to check if a specific mode is available
 */
export function isModeAvailable(mode: string): boolean {
    return APP_CONFIG.dataSource.availableModes.includes(mode as any);
}

/**
 * Helper function to get the effective default mode
 * (falls back to first available mode if default is not available)
 */
export function getEffectiveDefaultMode(): string {
    const { defaultMode, availableModes } = APP_CONFIG.dataSource;
    
    if (availableModes.includes(defaultMode)) {
        return defaultMode;
    }
    
    return availableModes[0];
}

export default APP_CONFIG;