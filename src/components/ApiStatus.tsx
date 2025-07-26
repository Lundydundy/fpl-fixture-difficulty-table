import React, { useState, useEffect } from 'react';
import { fplApiService } from '../services/FPLApiService';
import { ProxyService } from '../services/ProxyService';
import './ApiStatus.css';

interface ApiStatusInfo {
  connected: boolean;
  proxy: string;
  teamsCount: number;
  gameweeksCount: number;
  fixturesCount: number;
}

const ApiStatus: React.FC = () => {
  const [status, setStatus] = useState<ApiStatusInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [workingProxies, setWorkingProxies] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const checkApiStatus = async () => {
    setLoading(true);
    try {
      // For offline mode, get the actual data counts
      const [teams, fixtures, gameweeks] = await Promise.all([
        fplApiService.getTeams(),
        fplApiService.getFixtures(),
        fplApiService.getGameweeks()
      ]);
      
      setStatus({
        connected: true,
        proxy: 'Offline Mode',
        teamsCount: teams.length,
        gameweeksCount: gameweeks.length,
        fixturesCount: fixtures.length
      });
    } catch (error) {
      setStatus({
        connected: false,
        proxy: 'Offline Mode',
        teamsCount: 0,
        gameweeksCount: 0,
        fixturesCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const testAllProxies = async () => {
    setTesting(true);
    try {
      const working = await ProxyService.testProxies();
      setWorkingProxies(working);
    } catch (error) {
      // Silently handle proxy testing errors
    } finally {
      setTesting(false);
    }
  };

  const clearCache = () => {
    fplApiService.clearCache();
    checkApiStatus();
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  // Only show the API status when there are connection issues or when loading
  if (!status && !loading) {
    return null;
  }

  // Hide the component when successfully connected (only show when there are issues)
  if (status?.connected && !loading && !showDetails) {
    return null;
  }

  return (
    <div className="api-status">
      <div className="api-status-header">
        <div className="api-status-indicator">
          <span 
            className={`status-dot ${status?.connected ? 'connected' : 'disconnected'}`}
            aria-label={status?.connected ? 'Connected' : 'Disconnected'}
          />
          <span className="status-text">
            {loading ? 'Checking connection...' : status?.connected ? 'Connected to FPL API' : 'Connection Failed'}
          </span>
        </div>
        
        <div className="api-status-actions">
          <button 
            onClick={checkApiStatus} 
            disabled={loading}
            className="status-button refresh-button"
            title="Refresh status"
          >
            {loading ? '⟳' : '↻'}
          </button>
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="status-button details-button"
            title="Show details"
          >
            {showDetails ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="api-status-details">
          {status && (
            <div className="status-info">
              <div className="status-row">
                <span className="status-label">Current Proxy:</span>
                <span className="status-value">{status.proxy}</span>
              </div>
              
              {status.connected && (
                <>
                  <div className="status-row">
                    <span className="status-label">Teams:</span>
                    <span className="status-value">{status.teamsCount}</span>
                  </div>
                  <div className="status-row">
                    <span className="status-label">Gameweeks:</span>
                    <span className="status-value">{status.gameweeksCount}</span>
                  </div>
                  <div className="status-row">
                    <span className="status-label">Fixtures:</span>
                    <span className="status-value">{status.fixturesCount}</span>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="status-actions">
            <button 
              onClick={testAllProxies} 
              disabled={testing}
              className="action-button test-button"
            >
              {testing ? 'Testing Proxies...' : 'Test All Proxies'}
            </button>
            
            <button 
              onClick={clearCache}
              className="action-button clear-button"
            >
              Clear Cache
            </button>
          </div>

          {workingProxies.length > 0 && (
            <div className="working-proxies">
              <h4>Working Proxies:</h4>
              <ul>
                {workingProxies.map((proxy, index) => (
                  <li key={index} className="proxy-item">
                    {proxy}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!status?.connected && (
            <div className="connection-help">
              <h4>Connection Issues?</h4>
              <p>If you're having trouble connecting to the FPL API:</p>
              <ul>
                <li>Try testing different proxies above</li>
                <li>Check your internet connection</li>
                <li>The FPL API might be temporarily unavailable</li>
                <li>Some proxies may be rate-limited</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiStatus;