import React, { useState, useEffect } from 'react';
import { fplApiService, FPLApiMode } from '../services/FPLApiServiceSwitcher';
import { APP_CONFIG } from '../config/appConfig';
import './ServiceModeSelector.css';

interface ServiceModeSelectorProps {
    className?: string;
    showDescription?: boolean;
}

/**
 * Service Mode Selector Component
 * 
 * Allows users to switch between different data sources:
 * - Offline: Pre-loaded data with custom difficulty ratings
 * - Mock: Simulated data with network delays
 * - Online: Real FPL API (when available)
 */
const ServiceModeSelector: React.FC<ServiceModeSelectorProps> = ({ 
    className = '', 
    showDescription = true 
}) => {
    // Don't render if mode selector is disabled in config
    if (!APP_CONFIG.dataSource.showModeSelector) {
        return null;
    }
    const [currentMode, setCurrentMode] = useState<FPLApiMode>(fplApiService.getCurrentMode());
    const [status, setStatus] = useState(fplApiService.getStatus());

    useEffect(() => {
        setStatus(fplApiService.getStatus());
    }, [currentMode]);

    const handleModeChange = (mode: FPLApiMode) => {
        if (!APP_CONFIG.dataSource.allowModeSwitching) {
            return;
        }
        
        fplApiService.switchMode(mode);
        setCurrentMode(mode);
        
        // Trigger a page reload to refresh all data with the new service
        window.location.reload();
    };

    const getModeIcon = (mode: FPLApiMode): string => {
        switch (mode) {
            case 'offline': return '📱';
            case 'mock': return '🧪';
            case 'online': return '🌐';
            default: return '❓';
        }
    };

    const getModeLabel = (mode: FPLApiMode): string => {
        switch (mode) {
            case 'offline': return 'Offline Mode (Default)';
            case 'mock': return 'Mock Mode';
            case 'online': return 'Online Mode';
            default: return 'Unknown';
        }
    };

    const getModeDescription = (mode: FPLApiMode): string => {
        switch (mode) {
            case 'offline': return 'Real FPL data stored locally - fast, reliable, with custom difficulty ratings (Recommended)';
            case 'mock': return 'Simulated data with network delays for testing';
            case 'online': return 'Live FPL API data with custom difficulty ratings (requires internet)';
            default: return '';
        }
    };

    const modes: FPLApiMode[] = [...APP_CONFIG.dataSource.availableModes] as FPLApiMode[];

    return (
        <div className={`service-mode-selector ${className}`}>
            <div className="service-mode-selector__header">
                <h3>Data Source</h3>
                {status.hasCustomRules && (
                    <span className="custom-rules-badge">
                        ⚙️ Custom Rules Active
                    </span>
                )}
            </div>

            <div className="service-mode-selector__options">
                {modes.map((mode) => (
                    <button
                        key={mode}
                        className={`mode-option ${currentMode === mode ? 'active' : ''} ${mode === 'online' ? 'disabled' : ''}`}
                        onClick={() => handleModeChange(mode)}
                        disabled={mode === 'online'}
                        title={mode === 'online' ? 'Online mode not yet implemented' : getModeDescription(mode)}
                    >
                        <span className="mode-icon">{getModeIcon(mode)}</span>
                        <span className="mode-label">{getModeLabel(mode)}</span>
                        {currentMode === mode && <span className="active-indicator">✓</span>}
                    </button>
                ))}
            </div>

            {showDescription && (
                <div className="service-mode-selector__description">
                    <p>
                        <strong>Current:</strong> {status.description}
                    </p>
                    {status.hasCustomRules && (
                        <div className="custom-rules-info">
                            <strong>Custom Difficulty Rules:</strong>
                            <ul>
                                <li>Man City away = Grade 5 (hardest)</li>
                                <li>Arsenal away = Grade 5 (hardest)</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ServiceModeSelector;