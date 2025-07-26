/**
 * RealFPLApiService - Fetches real data from the FPL API using CORS proxy
 */

import { Team, Fixture, Gameweek } from '../types';
import { ProxyService } from './ProxyService';
import { errorHandlingService } from './ErrorHandlingService';

// FPL API response types
interface FPLBootstrapResponse {
  teams: FPLTeam[];
  events: FPLGameweek[];
  elements: FPLPlayer[];
}

interface FPLTeam {
  id: number;
  name: string;
  short_name: string;
  code: number;
  strength: number;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
}

interface FPLGameweek {
  id: number;
  name: string;
  deadline_time: string;
  finished: boolean;
  is_current: boolean;
  is_next: boolean;
}

interface FPLPlayer {
  id: number;
  web_name: string;
  team: number;
  element_type: number;
}

interface FPLFixture {
  id: number;
  code: number;
  event: number;
  finished: boolean;
  kickoff_time: string;
  team_a: number;
  team_h: number;
  team_a_score: number | null;
  team_h_score: number | null;
  team_a_difficulty: number;
  team_h_difficulty: number;
}

class RealFPLApiService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get data from cache if still valid
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T;
    }
    return null;
  }

  /**
   * Store data in cache
   */
  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Transform FPL team data to our format
   */
  private transformTeam(fplTeam: FPLTeam): Team {
    return {
      id: fplTeam.id,
      name: fplTeam.name,
      short_name: fplTeam.short_name,
      code: fplTeam.code,
      strength: fplTeam.strength,
      strength_overall_home: fplTeam.strength_overall_home,
      strength_overall_away: fplTeam.strength_overall_away,
      strength_attack_home: fplTeam.strength_attack_home,
      strength_attack_away: fplTeam.strength_attack_away,
      strength_defence_home: fplTeam.strength_defence_home,
      strength_defence_away: fplTeam.strength_defence_away,
    };
  }

  /**
   * Transform FPL gameweek data to our format
   */
  private transformGameweek(fplGameweek: FPLGameweek): Gameweek {
    return {
      id: fplGameweek.id,
      name: fplGameweek.name,
      deadline_time: fplGameweek.deadline_time,
      finished: fplGameweek.finished,
      is_current: fplGameweek.is_current,
      is_next: fplGameweek.is_next,
    };
  }

  /**
   * Transform FPL fixture data to our format
   */
  private transformFixture(fplFixture: FPLFixture): Fixture {
    return {
      id: fplFixture.id,
      code: fplFixture.code,
      event: fplFixture.event,
      finished: fplFixture.finished,
      kickoff_time: fplFixture.kickoff_time,
      team_a: fplFixture.team_a,
      team_h: fplFixture.team_h,
      team_a_score: fplFixture.team_a_score ?? undefined,
      team_h_score: fplFixture.team_h_score ?? undefined,
      team_a_difficulty: fplFixture.team_a_difficulty,
      team_h_difficulty: fplFixture.team_h_difficulty,
    };
  }

  /**
   * Fetch bootstrap data (teams and gameweeks)
   */
  private async fetchBootstrapData(): Promise<FPLBootstrapResponse> {
    const cacheKey = 'bootstrap-static';
    const cached = this.getFromCache<FPLBootstrapResponse>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const data = await ProxyService.fetchJson<FPLBootstrapResponse>('/bootstrap-static/');
      
      this.setCache(cacheKey, data);
      
      return data;
    } catch (error) {
      throw errorHandlingService.createErrorInfo(error, 1);
    }
  }

  /**
   * Get all teams
   */
  async getTeams(): Promise<Team[]> {
    try {
      const bootstrap = await this.fetchBootstrapData();
      return bootstrap.teams.map(team => this.transformTeam(team));
    } catch (error) {
      throw new Error('Failed to fetch teams from FPL API');
    }
  }

  /**
   * Get all gameweeks
   */
  async getGameweeks(): Promise<Gameweek[]> {
    try {
      const bootstrap = await this.fetchBootstrapData();
      return bootstrap.events.map(gameweek => this.transformGameweek(gameweek));
    } catch (error) {
      throw new Error('Failed to fetch gameweeks from FPL API');
    }
  }

  /**
   * Get all fixtures
   */
  async getFixtures(): Promise<Fixture[]> {
    const cacheKey = 'fixtures';
    const cached = this.getFromCache<Fixture[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const fplFixtures = await ProxyService.fetchJson<FPLFixture[]>('/fixtures/');
      
      const fixtures = fplFixtures.map(fixture => this.transformFixture(fixture));
      this.setCache(cacheKey, fixtures);
      
      return fixtures;
    } catch (error) {
      throw new Error('Failed to fetch fixtures from FPL API');
    }
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const bootstrap = await this.fetchBootstrapData();
      return bootstrap.teams.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get API status information
   */
  async getApiStatus(): Promise<{
    connected: boolean;
    proxy: string;
    teamsCount: number;
    gameweeksCount: number;
    fixturesCount: number;
  }> {
    try {
      const [teams, gameweeks, fixtures] = await Promise.all([
        this.getTeams(),
        this.getGameweeks(),
        this.getFixtures(),
      ]);

      return {
        connected: true,
        proxy: ProxyService.getProxyStatus().current,
        teamsCount: teams.length,
        gameweeksCount: gameweeks.length,
        fixturesCount: fixtures.length,
      };
    } catch (error) {
      return {
        connected: false,
        proxy: ProxyService.getProxyStatus().current,
        teamsCount: 0,
        gameweeksCount: 0,
        fixturesCount: 0,
      };
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[]; hitRate: number; totalRequests: number; hits: number } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      hitRate: 1, // Simplified for now
      totalRequests: 0,
      hits: 0
    };
  }
}

// Export singleton instance
export const realFplApiService = new RealFPLApiService();
export default realFplApiService;