import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { fplApiService } from '../FPLApiService';
import { cacheService } from '../CacheService';
import { errorHandlingService } from '../ErrorHandlingService';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock cache service
vi.mock('../CacheService', () => ({
  cacheService: {
    getTeams: vi.fn(),
    setTeams: vi.fn(),
    getStaleTeams: vi.fn(),
    getFixtures: vi.fn(),
    setFixtures: vi.fn(),
    getStaleFixtures: vi.fn(),
    getGameweeks: vi.fn(),
    setGameweeks: vi.fn(),
    getStaleGameweeks: vi.fn(),
  }
}));

// Mock error handling service
vi.mock('../ErrorHandlingService', () => ({
  errorHandlingService: {
    withTimeout: vi.fn(),
    withRetry: vi.fn(),
  }
}));

describe('FPLApiService Graceful Degradation', () => {
  let mockAxiosInstance: any;
  
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Reset the service instance
    fplApiService._reset();
    
    // Setup axios mock
    mockAxiosInstance = {
      get: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn()
        }
      }
    };
    
    mockedAxios.create = vi.fn().mockReturnValue(mockAxiosInstance);
    
    // Setup default mock implementations
    vi.mocked(errorHandlingService.withTimeout).mockImplementation(async (promise) => promise);
    vi.mocked(errorHandlingService.withRetry).mockImplementation(async (fn) => fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getTeams with graceful degradation', () => {
    it('returns fresh cached data when available', async () => {
      const mockTeams = [{ id: 1, name: 'Arsenal', short_name: 'ARS', code: 3, strength: 4, 
        strength_overall_home: 1200, strength_overall_away: 1150,
        strength_attack_home: 1300, strength_attack_away: 1250,
        strength_defence_home: 1100, strength_defence_away: 1050 }];
      
      vi.mocked(cacheService.getTeams).mockReturnValue(mockTeams);
      
      const result = await fplApiService.instance.getTeams();
      
      expect(result).toEqual(mockTeams);
      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });

    it('fetches fresh data when cache is empty', async () => {
      const mockTeams = [{ id: 1, name: 'Arsenal', short_name: 'ARS', code: 3, strength: 4, 
        strength_overall_home: 1200, strength_overall_away: 1150,
        strength_attack_home: 1300, strength_attack_away: 1250,
        strength_defence_home: 1100, strength_defence_away: 1050 }];
      
      vi.mocked(cacheService.getTeams).mockReturnValue(null);
      mockAxiosInstance.get.mockResolvedValue({ data: { teams: mockTeams } });
      
      const result = await fplApiService.instance.getTeams();
      
      expect(result).toEqual(mockTeams);
      expect(cacheService.setTeams).toHaveBeenCalledWith(mockTeams);
    });

    it('returns stale data when API fails', async () => {
      const mockTeams = [{ id: 1, name: 'Arsenal', short_name: 'ARS', code: 3, strength: 4, 
        strength_overall_home: 1200, strength_overall_away: 1150,
        strength_attack_home: 1300, strength_attack_away: 1250,
        strength_defence_home: 1100, strength_defence_away: 1050 }];
      
      vi.mocked(cacheService.getTeams).mockReturnValue(null);
      vi.mocked(cacheService.getStaleTeams).mockReturnValue({ data: mockTeams, isStale: true });
      
      const networkError = new Error('Network error');
      vi.mocked(errorHandlingService.withRetry).mockRejectedValue(networkError);
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = await fplApiService.instance.getTeams();
      
      expect(result).toEqual(mockTeams);
      expect(consoleSpy).toHaveBeenCalledWith('Using stale teams data due to API error:', networkError);
      
      consoleSpy.mockRestore();
    });

    it('throws error when no cache and API fails', async () => {
      vi.mocked(cacheService.getTeams).mockReturnValue(null);
      vi.mocked(cacheService.getStaleTeams).mockReturnValue(null);
      
      const networkError = new Error('Network error');
      vi.mocked(errorHandlingService.withRetry).mockRejectedValue(networkError);
      
      await expect(fplApiService.instance.getTeams()).rejects.toThrow('Failed to fetch teams data');
    });
  });

  describe('getFixtures with graceful degradation', () => {
    it('returns fresh cached data when available', async () => {
      const mockFixtures = [{ id: 1, code: 123, event: 1, finished: false, 
        kickoff_time: '2024-08-16T17:30:00Z', team_a: 1, team_h: 2, 
        team_a_difficulty: 3, team_h_difficulty: 2 }];
      
      vi.mocked(cacheService.getFixtures).mockReturnValue(mockFixtures);
      
      const result = await fplApiService.instance.getFixtures();
      
      expect(result).toEqual(mockFixtures);
      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });

    it('returns stale data when API fails', async () => {
      const mockFixtures = [{ id: 1, code: 123, event: 1, finished: false, 
        kickoff_time: '2024-08-16T17:30:00Z', team_a: 1, team_h: 2, 
        team_a_difficulty: 3, team_h_difficulty: 2 }];
      
      vi.mocked(cacheService.getFixtures).mockReturnValue(null);
      vi.mocked(cacheService.getStaleFixtures).mockReturnValue({ data: mockFixtures, isStale: true });
      
      const networkError = new Error('Network error');
      vi.mocked(errorHandlingService.withRetry).mockRejectedValue(networkError);
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = await fplApiService.instance.getFixtures();
      
      expect(result).toEqual(mockFixtures);
      expect(consoleSpy).toHaveBeenCalledWith('Using stale fixtures data due to API error:', networkError);
      
      consoleSpy.mockRestore();
    });
  });

  describe('getGameweeks with graceful degradation', () => {
    it('returns fresh cached data when available', async () => {
      const mockGameweeks = [{ id: 1, name: 'Gameweek 1', deadline_time: '2024-08-16T17:30:00Z', 
        finished: false, is_current: true, is_next: false }];
      
      vi.mocked(cacheService.getGameweeks).mockReturnValue(mockGameweeks);
      
      const result = await fplApiService.instance.getGameweeks();
      
      expect(result).toEqual(mockGameweeks);
      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });

    it('returns stale data when API fails', async () => {
      const mockGameweeks = [{ id: 1, name: 'Gameweek 1', deadline_time: '2024-08-16T17:30:00Z', 
        finished: false, is_current: true, is_next: false }];
      
      vi.mocked(cacheService.getGameweeks).mockReturnValue(null);
      vi.mocked(cacheService.getStaleGameweeks).mockReturnValue({ data: mockGameweeks, isStale: true });
      
      const networkError = new Error('Network error');
      vi.mocked(errorHandlingService.withRetry).mockRejectedValue(networkError);
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = await fplApiService.instance.getGameweeks();
      
      expect(result).toEqual(mockGameweeks);
      expect(consoleSpy).toHaveBeenCalledWith('Using stale gameweeks data due to API error:', networkError);
      
      consoleSpy.mockRestore();
    });
  });

  describe('error handling integration', () => {
    it('uses error handling service for timeout and retry', async () => {
      vi.mocked(cacheService.getTeams).mockReturnValue(null);
      mockAxiosInstance.get.mockResolvedValue({ data: { teams: [] } });
      
      await fplApiService.instance.getTeams();
      
      expect(errorHandlingService.withTimeout).toHaveBeenCalled();
      expect(errorHandlingService.withRetry).toHaveBeenCalled();
    });

    it('passes correct retry configuration', async () => {
      vi.mocked(cacheService.getTeams).mockReturnValue(null);
      mockAxiosInstance.get.mockResolvedValue({ data: { teams: [] } });
      
      await fplApiService.instance.getTeams();
      
      expect(errorHandlingService.withRetry).toHaveBeenCalledWith(
        expect.any(Function),
        { maxRetries: 3, baseDelay: 100 }
      );
    });

    it('passes correct timeout value', async () => {
      vi.mocked(cacheService.getTeams).mockReturnValue(null);
      mockAxiosInstance.get.mockResolvedValue({ data: { teams: [] } });
      
      await fplApiService.instance.getTeams();
      
      expect(errorHandlingService.withTimeout).toHaveBeenCalledWith(
        expect.any(Promise),
        10000
      );
    });
  });

  describe('cache integration', () => {
    it('sets cache after successful API call', async () => {
      const mockTeams = [{ id: 1, name: 'Arsenal', short_name: 'ARS', code: 3, strength: 4, 
        strength_overall_home: 1200, strength_overall_away: 1150,
        strength_attack_home: 1300, strength_attack_away: 1250,
        strength_defence_home: 1100, strength_defence_away: 1050 }];
      
      vi.mocked(cacheService.getTeams).mockReturnValue(null);
      mockAxiosInstance.get.mockResolvedValue({ data: { teams: mockTeams } });
      
      await fplApiService.instance.getTeams();
      
      expect(cacheService.setTeams).toHaveBeenCalledWith(mockTeams);
    });

    it('does not set cache when using stale data', async () => {
      const mockTeams = [{ id: 1, name: 'Arsenal', short_name: 'ARS', code: 3, strength: 4, 
        strength_overall_home: 1200, strength_overall_away: 1150,
        strength_attack_home: 1300, strength_attack_away: 1250,
        strength_defence_home: 1100, strength_defence_away: 1050 }];
      
      vi.mocked(cacheService.getTeams).mockReturnValue(null);
      vi.mocked(cacheService.getStaleTeams).mockReturnValue({ data: mockTeams, isStale: true });
      
      const networkError = new Error('Network error');
      vi.mocked(errorHandlingService.withRetry).mockRejectedValue(networkError);
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      await fplApiService.instance.getTeams();
      
      expect(cacheService.setTeams).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});