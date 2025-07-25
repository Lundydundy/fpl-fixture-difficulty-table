import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Team, Fixture, Gameweek, FixtureResponse, TeamResponse, GameweekResponse } from '../types';
import { cacheService } from './CacheService';
import { errorHandlingService } from './ErrorHandlingService';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class FPLApiService {
  private axiosInstance: AxiosInstance;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  private readonly BASE_URL = 'https://fantasy.premierleague.com/api';
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 100; // 100ms base delay for faster testing

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.BASE_URL,
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FPL-Fixture-Difficulty-Table/1.0.0'
      }
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleApiError(error)
    );
  }

  /**
   * Fetch all teams from the FPL API with graceful degradation
   */
  async getTeams(): Promise<Team[]> {
    // Check fresh cache first
    const cachedTeams = cacheService.getTeams();
    if (cachedTeams) {
      return cachedTeams;
    }

    try {
      const response = await errorHandlingService.withTimeout(
        errorHandlingService.withRetry(
          () => this.axiosInstance.get('/bootstrap-static/'),
          { maxRetries: this.MAX_RETRIES, baseDelay: this.RETRY_DELAY }
        ),
        10000
      );
      
      const teams: Team[] = response.data.teams;
      cacheService.setTeams(teams);
      
      return teams;
    } catch (error) {
      // Try to get stale data for graceful degradation
      const staleTeams = cacheService.getStaleTeams();
      if (staleTeams) {
        return staleTeams.data;
      }
      
      throw this.createApiError('Failed to fetch teams data', error);
    }
  }

  /**
   * Fetch all fixtures from the FPL API with graceful degradation
   */
  async getFixtures(): Promise<Fixture[]> {
    // Check fresh cache first
    const cachedFixtures = cacheService.getFixtures();
    if (cachedFixtures) {
      return cachedFixtures;
    }

    try {
      const response = await errorHandlingService.withTimeout(
        errorHandlingService.withRetry(
          () => this.axiosInstance.get('/fixtures/'),
          { maxRetries: this.MAX_RETRIES, baseDelay: this.RETRY_DELAY }
        ),
        10000
      );
      
      const fixtures: Fixture[] = response.data;
      cacheService.setFixtures(fixtures);
      
      return fixtures;
    } catch (error) {
      // Try to get stale data for graceful degradation
      const staleFixtures = cacheService.getStaleFixtures();
      if (staleFixtures) {
        return staleFixtures.data;
      }
      
      throw this.createApiError('Failed to fetch fixtures data', error);
    }
  }

  /**
   * Fetch all gameweeks from the FPL API with graceful degradation
   */
  async getGameweeks(): Promise<Gameweek[]> {
    // Check fresh cache first
    const cachedGameweeks = cacheService.getGameweeks();
    if (cachedGameweeks) {
      return cachedGameweeks;
    }

    try {
      const response = await errorHandlingService.withTimeout(
        errorHandlingService.withRetry(
          () => this.axiosInstance.get('/bootstrap-static/'),
          { maxRetries: this.MAX_RETRIES, baseDelay: this.RETRY_DELAY }
        ),
        10000
      );
      
      const gameweeks: Gameweek[] = response.data.events;
      cacheService.setGameweeks(gameweeks);
      
      return gameweeks;
    } catch (error) {
      // Try to get stale data for graceful degradation
      const staleGameweeks = cacheService.getStaleGameweeks();
      if (staleGameweeks) {
        return staleGameweeks.data;
      }
      
      throw this.createApiError('Failed to fetch gameweeks data', error);
    }
  }

  /**
   * Get data from cache if it exists and hasn't expired
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set data in cache with expiration
   */
  private setCache<T>(key: string, data: T): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION
    };
    
    this.cache.set(key, entry);
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear expired cache entries
   */
  private clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Retry mechanism with exponential backoff
   */
  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retryCount = 0
  ): Promise<AxiosResponse<T>> {
    try {
      return await requestFn();
    } catch (error) {
      if (retryCount >= this.MAX_RETRIES) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = this.RETRY_DELAY * Math.pow(2, retryCount);
      
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.1 * delay;
      const totalDelay = delay + jitter;

      await this.sleep(totalDelay);
      
      return this.retryRequest(requestFn, retryCount + 1);
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Handle API errors and create standardized error objects
   */
  private handleApiError(error: any): Promise<never> {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        const apiError: ApiError = {
          message: `API request failed with status ${error.response.status}`,
          status: error.response.status,
          code: error.code
        };
        return Promise.reject(apiError);
      } else if (error.request) {
        // Request was made but no response received
        const apiError: ApiError = {
          message: 'No response received from FPL API',
          code: error.code
        };
        return Promise.reject(apiError);
      }
    }

    // Generic error
    const apiError: ApiError = {
      message: error.message || 'Unknown API error occurred',
      code: error.code
    };
    return Promise.reject(apiError);
  }

  /**
   * Create standardized API error
   */
  private createApiError(message: string, originalError: any): ApiError {
    return {
      message,
      status: originalError?.status,
      code: originalError?.code
    };
  }

  /**
   * Get cache statistics for debugging
   */
  getCacheStats(): { size: number; keys: string[] } {
    this.clearExpiredCache();
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance - lazy initialization to avoid issues with mocking
let _fplApiService: FPLApiService | null = null;

export const fplApiService = {
  get instance(): FPLApiService {
    if (!_fplApiService) {
      _fplApiService = new FPLApiService();
    }
    return _fplApiService;
  },
  
  // For testing purposes
  _reset() {
    _fplApiService = null;
  }
};

export default FPLApiService;