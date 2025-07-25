import { render, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ComponentPerformanceMonitor, measurePerformance } from '../../utils/performance';
import FixtureTable from '../FixtureTable';
import type { TeamFixture } from '../../types';

// Create simplified mock data for performance testing
const createLargeDataset = (teamCount: number, fixturesPerTeam: number): TeamFixture[] => {
  return Array.from({ length: teamCount }, (_, teamIndex) => ({
    team: {
      id: teamIndex + 1,
      name: `Team ${teamIndex + 1}`,
      short_name: `T${teamIndex + 1}`,
      code: teamIndex + 1,
      strength: 3,
      strength_overall_home: 1000,
      strength_overall_away: 950,
      strength_attack_home: 1000,
      strength_attack_away: 950,
      strength_defence_home: 1000,
      strength_defence_away: 950,
    },
    fixtures: Array.from({ length: fixturesPerTeam }, (_, fixtureIndex) => ({
      id: teamIndex * fixturesPerTeam + fixtureIndex + 1,
      code: teamIndex * fixturesPerTeam + fixtureIndex + 1,
      event: fixtureIndex + 1,
      finished: false,
      finished_provisional: false,
      kickoff_time: new Date().toISOString(),
      minutes: 0,
      provisional_start_time: false,
      started: false,
      team_a: ((teamIndex + fixtureIndex + 1) % teamCount) + 1,
      team_a_score: undefined,
      team_h: teamIndex + 1,
      team_h_score: undefined,
      stats: [],
      team_h_difficulty: Math.floor(Math.random() * 5) + 1,
      team_a_difficulty: Math.floor(Math.random() * 5) + 1,
      pulse_id: teamIndex * fixturesPerTeam + fixtureIndex + 1,
    })),
    averageDifficulty: Math.round((Math.random() * 4 + 1) * 10) / 10,
  }));
};

describe('Performance Tests and Benchmarks', () => {
  let performanceMonitor: ComponentPerformanceMonitor;

  beforeEach(() => {
    performanceMonitor = new ComponentPerformanceMonitor();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Component Rendering Performance', () => {
    it('FixtureTable renders large dataset within performance budget', () => {
      const PERFORMANCE_BUDGET_MS = 100;
      const TEAM_COUNT = 20;
      const FIXTURES_PER_TEAM = 10;
      
      const largeDataset = createLargeDataset(TEAM_COUNT, FIXTURES_PER_TEAM);
      
      const renderTime = measurePerformance('FixtureTable Large Dataset', () => {
        render(
          <FixtureTable
            teams={largeDataset}
            gameweeks={FIXTURES_PER_TEAM}
            sortBy={{ field: 'name', direction: 'asc' }}
            onSortChange={vi.fn()}
          />
        );
      });

      expect(renderTime).toBeLessThan(PERFORMANCE_BUDGET_MS);
      expect(renderTime).toBeGreaterThan(0);
    });

    it('handles rapid re-renders efficiently', async () => {
      const dataset = createLargeDataset(10, 5);
      let renderCount = 0;
      
      const MockComponent = () => {
        renderCount++;
        return (
          <FixtureTable
            teams={dataset}
            gameweeks={5}
            sortBy={{ field: 'name', direction: 'asc' }}
            onSortChange={vi.fn()}
          />
        );
      };

      const { rerender } = render(<MockComponent />);
      
      // Simulate rapid re-renders
      const startTime = performance.now();
      for (let i = 0; i < 5; i++) {
        rerender(<MockComponent />);
      }
      const endTime = performance.now();

      // Should handle multiple re-renders efficiently
      expect(endTime - startTime).toBeLessThan(200); // 200ms budget for 5 re-renders
      expect(renderCount).toBeGreaterThan(0);
    });
  });

  describe('Data Processing Performance', () => {
    it('measures data filtering performance', () => {
      const FILTERING_BUDGET_MS = 50;
      const TEAM_COUNT = 100;
      const largeDataset = createLargeDataset(TEAM_COUNT, 5);
      
      const filterTime = measurePerformance('Data Filtering', () => {
        return largeDataset.filter(team => 
          team.team.name.toLowerCase().includes('team 5') ||
          team.averageDifficulty > 3
        );
      });

      expect(filterTime).toBeLessThan(FILTERING_BUDGET_MS);
    });

    it('measures sorting performance', () => {
      const SORT_BUDGET_MS = 30;
      const TEAM_COUNT = 100;
      const largeDataset = createLargeDataset(TEAM_COUNT, 5);
      
      const sortByNameTime = measurePerformance('Sort by Name', () => {
        return [...largeDataset].sort((a, b) => a.team.name.localeCompare(b.team.name));
      });

      const sortByDifficultyTime = measurePerformance('Sort by Difficulty', () => {
        return [...largeDataset].sort((a, b) => a.averageDifficulty - b.averageDifficulty);
      });

      expect(sortByNameTime).toBeLessThan(SORT_BUDGET_MS);
      expect(sortByDifficultyTime).toBeLessThan(SORT_BUDGET_MS);
    });

    it('measures aggregate calculations performance', () => {
      const CALCULATION_BUDGET_MS = 25;
      const TEAM_COUNT = 50;
      const largeDataset = createLargeDataset(TEAM_COUNT, 10);
      
      const calculationTime = measurePerformance('Aggregate Calculations', () => {
        return largeDataset.map(team => {
          const fixtureSum = team.fixtures.reduce((sum, fixture) => {
            const difficulty = team.team.id === fixture.team_h 
              ? fixture.team_h_difficulty 
              : fixture.team_a_difficulty;
            return sum + difficulty;
          }, 0);
          
          return {
            ...team,
            averageDifficulty: Math.round((fixtureSum / team.fixtures.length) * 10) / 10
          };
        });
      });

      expect(calculationTime).toBeLessThan(CALCULATION_BUDGET_MS);
    });
  });

  describe('Performance Monitoring', () => {
    it('tracks component render metrics', () => {
      const endRender = performanceMonitor.startRender('TestComponent');
      
      // Simulate some work
      render(<div>Test Component</div>);
      
      endRender();
      
      const metrics = performanceMonitor.getMetrics('TestComponent');
      expect(metrics).toBeDefined();
      expect(metrics!.renderCount).toBe(1);
      expect(metrics!.lastRenderTime).toBeGreaterThan(0);
      expect(metrics!.averageRenderTime).toEqual(metrics!.lastRenderTime);
    });

    it('identifies slow renders', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const endRender = performanceMonitor.startRender('SlowComponent');
      
      // Mock a slow render (>16ms)
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(20); // 20ms render time
      
      endRender();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Performance] SlowComponent slow render')
      );
      
      consoleSpy.mockRestore();
    });

    it('aggregates performance metrics across multiple renders', () => {
      for (let i = 0; i < 5; i++) {
        const endRender = performanceMonitor.startRender('MultipleRenders');
        render(<div>Render {i}</div>);
        cleanup();
        endRender();
      }
      
      const metrics = performanceMonitor.getMetrics('MultipleRenders');
      expect(metrics).toBeDefined();
      expect(metrics!.renderCount).toBe(5);
      expect(metrics!.averageRenderTime).toBeGreaterThan(0);
      expect(metrics!.totalRenderTime).toBeGreaterThan(0);
    });
  });

  describe('Performance Benchmarks and Budgets', () => {
    const PERFORMANCE_BUDGETS = {
      COMPONENT_RENDER: 100, // 100ms for component renders
      DATA_PROCESSING: 50, // 50ms for data operations
      SORT_OPERATION: 30, // 30ms for sorting
      FILTER_OPERATION: 25, // 25ms for filtering
    };

    it('validates performance budgets are met for typical usage', () => {
      const dataset = createLargeDataset(20, 8);
      
      // Test rendering performance
      const renderTime = measurePerformance('Benchmark Render', () => {
        render(
          <FixtureTable
            teams={dataset}
            gameweeks={8}
            sortBy={{ field: 'name', direction: 'asc' }}
            onSortChange={vi.fn()}
          />
        );
      });

      // Test data processing performance
      const processingTime = measurePerformance('Benchmark Processing', () => {
        return dataset
          .filter(team => team.team.name.includes('Team'))
          .sort((a, b) => a.averageDifficulty - b.averageDifficulty)
          .slice(0, 10);
      });

      expect(renderTime).toBeLessThan(PERFORMANCE_BUDGETS.COMPONENT_RENDER);
      expect(processingTime).toBeLessThan(PERFORMANCE_BUDGETS.DATA_PROCESSING);
    });

    it('measures performance under concurrent operations', () => {
      const CONCURRENT_BUDGET_MS = 150;
      const dataset = createLargeDataset(15, 6);
      
      const concurrentTime = measurePerformance('Concurrent Operations', () => {
        // Simulate multiple operations happening together
        const operations = [
          () => dataset.filter(t => t.averageDifficulty > 3),
          () => dataset.sort((a, b) => a.team.name.localeCompare(b.team.name)),
          () => dataset.map(t => ({ ...t, processed: true })),
          () => dataset.reduce((acc, t) => acc + t.averageDifficulty, 0),
        ];

        return operations.map(op => op());
      });

      expect(concurrentTime).toBeLessThan(CONCURRENT_BUDGET_MS);
    });

    it('maintains baseline performance for regression testing', () => {
      // This test serves as a performance regression guard
      const dataset = createLargeDataset(25, 6);
      
      const baselineTime = measurePerformance('Baseline Performance', () => {
        // Simulate typical user workflow
        const filtered = dataset.filter(t => t.team.name.toLowerCase().includes('team'));
        const sorted = filtered.sort((a, b) => a.averageDifficulty - b.averageDifficulty);
        const processed = sorted.map(t => ({
          ...t,
          displayName: t.team.name.toUpperCase(),
          isHighDifficulty: t.averageDifficulty > 3.5
        }));
        
        return processed.slice(0, 10);
      });

      // Baseline expectation - should complete typical operations in under 75ms
      expect(baselineTime).toBeLessThan(75);
      
      // Performance baseline completed
    });
  });
});
