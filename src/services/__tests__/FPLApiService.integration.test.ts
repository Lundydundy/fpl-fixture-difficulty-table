import { describe, it, expect } from 'vitest';
import FPLApiService from '../FPLApiService';

// Integration tests - these would normally hit real endpoints
// For now, we'll test the service structure and error handling
describe('FPLApiService Integration', () => {
  let service: FPLApiService;

  beforeEach(() => {
    service = new FPLApiService();
  });

  it('should have all required methods', () => {
    expect(typeof service.getTeams).toBe('function');
    expect(typeof service.getFixtures).toBe('function');
    expect(typeof service.getGameweeks).toBe('function');
    expect(typeof service.clearCache).toBe('function');
    expect(typeof service.getCacheStats).toBe('function');
  });

  it('should initialize with empty cache', () => {
    const stats = service.getCacheStats();
    expect(stats.size).toBe(0);
    expect(stats.keys).toEqual([]);
  });

  it('should clear cache properly', () => {
    service.clearCache();
    const stats = service.getCacheStats();
    expect(stats.size).toBe(0);
  });
});