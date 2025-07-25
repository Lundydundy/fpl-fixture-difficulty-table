import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// Mock the axios module first
vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
    isAxiosError: vi.fn((error) => error.isAxiosError === true)
  }
}));

import FPLApiService from '../FPLApiService';

const mockedAxios = vi.mocked(axios);

// Create a mock axios instance
const createMockAxiosInstance = () => ({
  get: vi.fn(),
  interceptors: {
    response: {
      use: vi.fn()
    }
  }
});

// Mock data
const mockTeams = [
  {
    id: 1,
    name: 'Arsenal',
    short_name: 'ARS',
    code: 3,
    strength: 4,
    strength_overall_home: 1340,
    strength_overall_away: 1340,
    strength_attack_home: 1340,
    strength_attack_away: 1340,
    strength_defence_home: 1340,
    strength_defence_away: 1340
  }
];

const mockFixtures = [
  {
    id: 1,
    code: 12345,
    event: 1,
    finished: false,
    kickoff_time: '2024-08-17T14:00:00Z',
    team_a: 2,
    team_h: 1,
    team_a_difficulty: 4,
    team_h_difficulty: 3
  }
];

const mockGameweeks = [
  {
    id: 1,
    name: 'Gameweek 1',
    deadline_time: '2024-08-17T10:30:00Z',
    finished: false,
    is_current: true,
    is_next: false
  }
];

describe('FPLApiService', () => {
  let service: FPLApiService;
  let mockAxiosInstance: ReturnType<typeof createMockAxiosInstance>;

  beforeEach(() => {
    mockAxiosInstance = createMockAxiosInstance();
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    service = new FPLApiService();
  });

  afterEach(() => {
    vi.clearAllMocks();
    service.clearCache();
  });

  describe('constructor', () => {
    it('should create axios instance with correct configuration', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://fantasy.premierleague.com/api',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'FPL-Fixture-Difficulty-Table/1.0.0'
        }
      });
    });

    it('should set up response interceptor', () => {
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('getTeams', () => {
    it('should fetch teams successfully', async () => {
      const mockResponse = {
        data: {
          teams: mockTeams,
          events: mockGameweeks
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getTeams();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/bootstrap-static/');
      expect(result).toEqual(mockTeams);
    });

    it('should return cached teams on subsequent calls', async () => {
      const mockResponse = {
        data: {
          teams: mockTeams,
          events: mockGameweeks
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // First call
      await service.getTeams();
      // Second call
      const result = await service.getTeams();

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTeams);
    });

    it('should handle API errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      await expect(service.getTeams()).rejects.toThrow('Failed to fetch teams data');
    });
  });

  describe('getFixtures', () => {
    it('should fetch fixtures successfully', async () => {
      const mockResponse = { data: mockFixtures };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getFixtures();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/fixtures/');
      expect(result).toEqual(mockFixtures);
    });

    it('should return cached fixtures on subsequent calls', async () => {
      const mockResponse = { data: mockFixtures };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // First call
      await service.getFixtures();
      // Second call
      const result = await service.getFixtures();

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockFixtures);
    });

    it('should handle API errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      await expect(service.getFixtures()).rejects.toThrow('Failed to fetch fixtures data');
    });
  });

  describe('getGameweeks', () => {
    it('should fetch gameweeks successfully', async () => {
      const mockResponse = {
        data: {
          teams: mockTeams,
          events: mockGameweeks
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getGameweeks();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/bootstrap-static/');
      expect(result).toEqual(mockGameweeks);
    });

    it('should return cached gameweeks on subsequent calls', async () => {
      const mockResponse = {
        data: {
          teams: mockTeams,
          events: mockGameweeks
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // First call
      await service.getGameweeks();
      // Second call
      const result = await service.getGameweeks();

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGameweeks);
    });

    it('should handle API errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      await expect(service.getGameweeks()).rejects.toThrow('Failed to fetch gameweeks data');
    });
  });

  describe('caching mechanism', () => {
    it('should clear cache when clearCache is called', async () => {
      const mockResponse = {
        data: {
          teams: mockTeams,
          events: mockGameweeks
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // Make initial call to populate cache
      await service.getTeams();
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);

      // Clear cache
      service.clearCache();

      // Make another call - should hit API again
      await service.getTeams();
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });

    it('should provide cache statistics', async () => {
      const mockResponse = {
        data: {
          teams: mockTeams,
          events: mockGameweeks
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // Initially empty cache
      let stats = service.getCacheStats();
      expect(stats.size).toBe(0);
      expect(stats.keys).toEqual([]);

      // After fetching teams
      await service.getTeams();
      stats = service.getCacheStats();
      expect(stats.size).toBe(1);
      expect(stats.keys).toContain('teams');
    });
  });

  describe('retry mechanism', () => {
    it('should retry failed requests', async () => {
      const mockResponse = {
        data: {
          teams: mockTeams,
          events: mockGameweeks
        }
      };

      mockAxiosInstance.get
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue(mockResponse);

      const result = await service.getTeams();

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockTeams);
    });

    it('should fail after max retries', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Persistent network error'));

      await expect(service.getTeams()).rejects.toThrow('Failed to fetch teams data');
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });
  });
});