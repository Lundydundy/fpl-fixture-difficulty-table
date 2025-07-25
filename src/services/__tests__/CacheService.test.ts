import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cacheService } from '../CacheService';
import { Team, Fixture, Gameweek } from '../../types';

describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockTeam: Team = {
    id: 1,
    name: 'Arsenal',
    short_name: 'ARS',
    code: 3,
    strength: 4,
    strength_overall_home: 1200,
    strength_overall_away: 1150,
    strength_attack_home: 1250,
    strength_attack_away: 1200,
    strength_defence_home: 1180,
    strength_defence_away: 1120
  };

  const mockFixture: Fixture = {
    id: 1,
    code: 12345,
    event: 1,
    finished: false,
    kickoff_time: '2024-08-16T14:00:00Z',
    team_a: 2,
    team_h: 1,
    team_a_difficulty: 3,
    team_h_difficulty: 2
  };

  const mockGameweek: Gameweek = {
    id: 1,
    name: 'Gameweek 1',
    deadline_time: '2024-08-16T18:30:00Z',
    finished: false,
    is_current: true,
    is_next: false
  };

  describe('basic cache operations', () => {
    it('should set and get data', () => {
      cacheService.set('test', 'value');
      expect(cacheService.get('test')).toBe('value');
    });

    it('should return null for non-existent keys', () => {
      expect(cacheService.get('nonexistent')).toBeNull();
    });

    it('should check if key exists', () => {
      cacheService.set('test', 'value');
      expect(cacheService.has('test')).toBe(true);
      expect(cacheService.has('nonexistent')).toBe(false);
    });

    it('should delete keys', () => {
      cacheService.set('test', 'value');
      expect(cacheService.delete('test')).toBe(true);
      expect(cacheService.get('test')).toBeNull();
      expect(cacheService.delete('nonexistent')).toBe(false);
    });

    it('should clear all cache', () => {
      cacheService.set('test1', 'value1');
      cacheService.set('test2', 'value2');
      
      cacheService.clear();
      
      expect(cacheService.get('test1')).toBeNull();
      expect(cacheService.get('test2')).toBeNull();
    });
  });

  describe('TTL and expiration', () => {
    it('should expire data after TTL', () => {
      cacheService.set('test', 'value', 1000); // 1 second TTL
      
      expect(cacheService.get('test')).toBe('value');
      
      // Fast-forward past TTL
      vi.advanceTimersByTime(1001);
      
      expect(cacheService.get('test')).toBeNull();
      expect(cacheService.has('test')).toBe(false);
    });

    it('should use default TTL when not specified', () => {
      cacheService.set('test', 'value');
      
      // Fast-forward to just before default TTL (5 minutes)
      vi.advanceTimersByTime(4 * 60 * 1000 + 59 * 1000);
      expect(cacheService.get('test')).toBe('value');
      
      // Fast-forward past default TTL
      vi.advanceTimersByTime(2000);
      expect(cacheService.get('test')).toBeNull();
    });
  });

  describe('stale data handling', () => {
    it('should return fresh data when not expired', () => {
      cacheService.set('test', 'value', 1000);
      
      const result = cacheService.getStale('test');
      
      expect(result).toEqual({
        data: 'value',
        isStale: false
      });
    });

    it('should return stale data when expired but within stale window', () => {
      cacheService.set('test', 'value', 1000); // 1 second TTL
      
      // Fast-forward past TTL but within stale window
      vi.advanceTimersByTime(5 * 60 * 1000); // 5 minutes
      
      const result = cacheService.getStale('test');
      
      expect(result).toEqual({
        data: 'value',
        isStale: true
      });
    });

    it('should return null when data is too old', () => {
      cacheService.set('test', 'value', 1000);
      
      // Fast-forward past stale window (30 minutes)
      vi.advanceTimersByTime(31 * 60 * 1000);
      
      const result = cacheService.getStale('test');
      
      expect(result).toBeNull();
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries during cleanup', () => {
      cacheService.set('fresh', 'value1', 10000); // 10 seconds
      cacheService.set('expired', 'value2', 1000); // 1 second
      
      // Fast-forward past expired TTL but not fresh TTL
      vi.advanceTimersByTime(2000);
      
      cacheService.cleanup();
      
      expect(cacheService.get('fresh')).toBe('value1');
      expect(cacheService.get('expired')).toBeNull();
    });
  });

  describe('statistics', () => {
    it('should track cache statistics', () => {
      // Initial stats
      let stats = cacheService.getStats();
      expect(stats.totalRequests).toBe(0);
      expect(stats.hits).toBe(0);
      expect(stats.hitRate).toBe(0);
      
      // Set data and access it (hit)
      cacheService.set('test', 'value');
      cacheService.get('test');
      
      stats = cacheService.getStats();
      expect(stats.totalRequests).toBe(1);
      expect(stats.hits).toBe(1);
      expect(stats.hitRate).toBe(1);
      
      // Access non-existent data (miss)
      cacheService.get('nonexistent');
      
      stats = cacheService.getStats();
      expect(stats.totalRequests).toBe(2);
      expect(stats.hits).toBe(1);
      expect(stats.hitRate).toBe(0.5);
    });

    it('should include cache size and keys in stats', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');
      
      const stats = cacheService.getStats();
      
      expect(stats.size).toBe(2);
      expect(stats.keys).toEqual(['key1', 'key2']);
    });
  });

  describe('typed cache methods', () => {
    describe('teams cache', () => {
      it('should cache and retrieve teams', () => {
        const teams = [mockTeam];
        
        cacheService.setTeams(teams);
        const retrieved = cacheService.getTeams();
        
        expect(retrieved).toEqual(teams);
      });

      it('should get stale teams data', () => {
        const teams = [mockTeam];
        cacheService.setTeams(teams);
        
        // Fast-forward past TTL
        vi.advanceTimersByTime(11 * 60 * 1000); // 11 minutes
        
        const result = cacheService.getStaleTeams();
        
        expect(result).toEqual({
          data: teams,
          isStale: true
        });
      });
    });

    describe('fixtures cache', () => {
      it('should cache and retrieve fixtures', () => {
        const fixtures = [mockFixture];
        
        cacheService.setFixtures(fixtures);
        const retrieved = cacheService.getFixtures();
        
        expect(retrieved).toEqual(fixtures);
      });

      it('should get stale fixtures data', () => {
        const fixtures = [mockFixture];
        cacheService.setFixtures(fixtures);
        
        // Fast-forward past TTL
        vi.advanceTimersByTime(6 * 60 * 1000); // 6 minutes
        
        const result = cacheService.getStaleFixtures();
        
        expect(result).toEqual({
          data: fixtures,
          isStale: true
        });
      });
    });

    describe('gameweeks cache', () => {
      it('should cache and retrieve gameweeks', () => {
        const gameweeks = [mockGameweek];
        
        cacheService.setGameweeks(gameweeks);
        const retrieved = cacheService.getGameweeks();
        
        expect(retrieved).toEqual(gameweeks);
      });

      it('should get stale gameweeks data', () => {
        const gameweeks = [mockGameweek];
        cacheService.setGameweeks(gameweeks);
        
        // Fast-forward past TTL
        vi.advanceTimersByTime(16 * 60 * 1000); // 16 minutes
        
        const result = cacheService.getStaleGameweeks();
        
        expect(result).toEqual({
          data: gameweeks,
          isStale: true
        });
      });
    });
  });
});