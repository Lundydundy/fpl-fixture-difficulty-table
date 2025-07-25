import { Team, Fixture, Gameweek } from '../types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheStats {
  size: number;
  keys: string[];
  hitRate: number;
  totalRequests: number;
  hits: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private stats = {
    totalRequests: 0,
    hits: 0
  };

  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly STALE_WHILE_REVALIDATE_TTL = 30 * 60 * 1000; // 30 minutes

  /**
   * Set data in cache with TTL
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl
    };
    
    this.cache.set(key, entry);
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    this.stats.totalRequests++;
    
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    
    // Return data if not expired
    if (now < entry.expiresAt) {
      this.stats.hits++;
      return entry.data as T;
    }

    // Remove expired entry
    this.cache.delete(key);
    return null;
  }

  /**
   * Get stale data (for graceful degradation)
   */
  getStale<T>(key: string): { data: T; isStale: boolean } | null {
    this.stats.totalRequests++;
    
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const isStale = now >= entry.expiresAt;
    
    // Return data even if stale, but within stale-while-revalidate window
    if (now < entry.timestamp + this.STALE_WHILE_REVALIDATE_TTL) {
      if (!isStale) {
        this.stats.hits++;
      }
      return {
        data: entry.data as T,
        isStale
      };
    }

    // Remove very old entry
    this.cache.delete(key);
    return null;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    const now = Date.now();
    if (now >= entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete specific key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.stats = {
      totalRequests: 0,
      hits: 0
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      hitRate: this.stats.totalRequests > 0 ? this.stats.hits / this.stats.totalRequests : 0,
      totalRequests: this.stats.totalRequests,
      hits: this.stats.hits
    };
  }

  /**
   * Cache teams data
   */
  setTeams(teams: Team[]): void {
    this.set('teams', teams, 10 * 60 * 1000); // 10 minutes TTL for teams
  }

  /**
   * Get cached teams data
   */
  getTeams(): Team[] | null {
    return this.get<Team[]>('teams');
  }

  /**
   * Get stale teams data for graceful degradation
   */
  getStaleTeams(): { data: Team[]; isStale: boolean } | null {
    return this.getStale<Team[]>('teams');
  }

  /**
   * Cache fixtures data
   */
  setFixtures(fixtures: Fixture[]): void {
    this.set('fixtures', fixtures, 5 * 60 * 1000); // 5 minutes TTL for fixtures
  }

  /**
   * Get cached fixtures data
   */
  getFixtures(): Fixture[] | null {
    return this.get<Fixture[]>('fixtures');
  }

  /**
   * Get stale fixtures data for graceful degradation
   */
  getStaleFixtures(): { data: Fixture[]; isStale: boolean } | null {
    return this.getStale<Fixture[]>('fixtures');
  }

  /**
   * Cache gameweeks data
   */
  setGameweeks(gameweeks: Gameweek[]): void {
    this.set('gameweeks', gameweeks, 15 * 60 * 1000); // 15 minutes TTL for gameweeks
  }

  /**
   * Get cached gameweeks data
   */
  getGameweeks(): Gameweek[] | null {
    return this.get<Gameweek[]>('gameweeks');
  }

  /**
   * Get stale gameweeks data for graceful degradation
   */
  getStaleGameweeks(): { data: Gameweek[]; isStale: boolean } | null {
    return this.getStale<Gameweek[]>('gameweeks');
  }

  /**
   * Initialize cleanup interval
   */
  startCleanupInterval(intervalMs: number = 5 * 60 * 1000): void {
    setInterval(() => {
      this.cleanup();
    }, intervalMs);
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// Start cleanup interval
cacheService.startCleanupInterval();

export default CacheService;