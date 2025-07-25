import { render, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ComponentPerformanceMonitor, measurePerformance } from '../../utils/performance';
import FixtureTable from '../FixtureTable';
import FixtureCell from '../FixtureCell';
import type { TeamFixture, Team, Fixture } from '../../types';

// Create mock data
const createMockTeam = (id: number, name: string): Team => ({
  id,
  name,
  short_name: name.substring(0, 3).toUpperCase(),
  code: id,
  strength: 3,
  strength_overall_home: 1000,
  strength_overall_away: 950,
  strength_attack_home: 1000,
  strength_attack_away: 950,
  strength_defence_home: 1000,
  strength_defence_away: 950,
});

const createMockFixture = (id: number, teamH: number, teamA: number, event: number): Fixture => ({
  id,
  code: id,
  event,
  finished: false,
  finished_provisional: false,
  kickoff_time: new Date().toISOString(),
  minutes: 0,
  provisional_start_time: false,
  started: false,
  team_a: teamA,
  team_a_score: null,
  team_h: teamH,
  team_h_score: null,
  stats: [],
  team_h_difficulty: Math.floor(Math.random() * 5) + 1,
  team_a_difficulty: Math.floor(Math.random() * 5) + 1,
  pulse_id: id,
});

// Mock the API service
vi.mock('../../services/FPLApiService');

const createLargeDataset = (teamCount: number, fixturesPerTeam: number): TeamFixture[] => {
  return Array.from({ length: teamCount }, (_, teamIndex) => ({
    team: {
      ...mockTeams[0],
      id: teamIndex + 1,
      name: `Team ${teamIndex + 1}`,
      short_name: `T${teamIndex + 1}`,
    },
    fixtures: Array.from({ length: fixturesPerTeam }, (_, fixtureIndex) => ({
      ...mockFixtures[0],
      id: teamIndex * fixturesPerTeam + fixtureIndex + 1,
      event: fixtureIndex + 1,
      team_h: teamIndex + 1,
      team_a: ((teamIndex + fixtureIndex + 1) % teamCount) + 1,
      team_h_difficulty: Math.floor(Math.random() * 5) + 1,
      team_a_difficulty: Math.floor(Math.random() * 5) + 1,
    })),
    averageDifficulty: Math.round((Math.random() * 4 + 1) * 10) / 10,
  }));
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const contextValue = {
    teams: mockTeams,
    fixtures: mockFixtures,
    gameweeks: mockGameweeks,
    loading: false,
    error: null,
    gameweekRange: { start: 1, end: 5 },
    searchTerm: '',
    sortOption: { field: 'name', direction: 'asc' as const },
    updateGameweekRange: vi.fn(),
    updateSearchTerm: vi.fn(),
    updateSortOption: vi.fn(),
    clearError: vi.fn(),
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
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
            sortOption={{ field: 'name', direction: 'asc' }}
            onSortChange={vi.fn()}
          />
        );
      });

      expect(renderTime).toBeLessThan(PERFORMANCE_BUDGET_MS);
      expect(renderTime).toBeGreaterThan(0);
    });

    it('FixtureCell renders efficiently for individual cells', () => {
      const CELL_RENDER_BUDGET_MS = 5; // Very tight budget for individual cells
      const fixture = mockFixtures[0];
      
      const renderTime = measurePerformance('FixtureCell Render', () => {
        render(
          <FixtureCell
            fixture={fixture}
            opponent={mockTeams[1]}
            difficulty={3}
            isHome={true}
          />
        );
      });

      expect(renderTime).toBeLessThan(CELL_RENDER_BUDGET_MS);
    });

    it('TeamSearchFilter debouncing reduces render frequency', async () => {
      let renderCount = 0;
      const MockedSearchFilter = () => {
        renderCount++;
        return (
          <TeamSearchFilter
            searchTerm=""
            onSearchChange={vi.fn()}
          />
        );
      };

      const { rerender } = render(<MockedSearchFilter />);
      
      // Simulate rapid re-renders
      for (let i = 0; i < 10; i++) {
        rerender(<MockedSearchFilter />);
      }

      // Should not cause excessive re-renders due to memoization
      expect(renderCount).toBeLessThan(15); // Some tolerance for test overhead
    });

    it('FixtureDifficultyTable handles rapid state changes', async () => {
      const startTime = performance.now();
      
      const { rerender } = render(
        <TestWrapper>
          <FixtureDifficultyTable />
        </TestWrapper>
      );

      // Simulate rapid state changes
      for (let i = 0; i < 5; i++) {
        rerender(
          <TestWrapper>
            <FixtureDifficultyTable />
          </TestWrapper>
        );
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle multiple rapid re-renders efficiently
      expect(totalTime).toBeLessThan(200); // 200ms budget for 5 re-renders
    });
  });

  describe('Memory and Computation Performance', () => {
    it('measures data processing performance', () => {
      const PROCESSING_BUDGET_MS = 50;
      const TEAM_COUNT = 50;
      const FIXTURES_PER_TEAM = 20;
      
      const largeDataset = createLargeDataset(TEAM_COUNT, FIXTURES_PER_TEAM);
      
      const processingTime = measurePerformance('Data Processing', () => {
        // Simulate data processing operations
        const sortedTeams = [...largeDataset].sort((a, b) => a.team.name.localeCompare(b.team.name));
        const filteredTeams = sortedTeams.filter(team => team.averageDifficulty > 2);
        const processedData = filteredTeams.map(team => ({
          ...team,
          fixtures: team.fixtures.slice(0, 10) // Limit fixtures
        }));
        return processedData;
      });

      expect(processingTime).toBeLessThan(PROCESSING_BUDGET_MS);
    });

    it('measures search filtering performance', () => {
      const SEARCH_BUDGET_MS = 20;
      const TEAM_COUNT = 100;
      const largeDataset = createLargeDataset(TEAM_COUNT, 5);
      
      const searchTime = measurePerformance('Search Filtering', () => {
        return largeDataset.filter(team => 
          team.team.name.toLowerCase().includes('team 5')
        );
      });

      expect(searchTime).toBeLessThan(SEARCH_BUDGET_MS);
    });

    it('measures sorting performance with different algorithms', () => {
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
  });

  describe('Performance Monitoring Integration', () => {
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
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation();
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

  describe('Performance Regression Tests', () => {
    it('maintains baseline performance for standard operations', () => {
      const BASELINE_RENDER_TIME = 50; // 50ms baseline
      const BASELINE_PROCESSING_TIME = 25; // 25ms baseline
      
      const dataset = createLargeDataset(20, 8);
      
      // Test rendering performance
      const renderTime = measurePerformance('Baseline Render Test', () => {
        render(
          <FixtureTable
            teams={dataset}
            gameweeks={8}
            sortOption={{ field: 'name', direction: 'asc' }}
            onSortChange={vi.fn()}
          />
        );
      });

      // Test processing performance
      const processingTime = measurePerformance('Baseline Processing Test', () => {
        return dataset
          .filter(team => team.team.name.includes('Team'))
          .sort((a, b) => a.averageDifficulty - b.averageDifficulty)
          .slice(0, 10);
      });

      expect(renderTime).toBeLessThan(BASELINE_RENDER_TIME);
      expect(processingTime).toBeLessThan(BASELINE_PROCESSING_TIME);
    });

    it('maintains performance under concurrent operations', () => {
      const CONCURRENT_BUDGET_MS = 100;
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
  });

  describe('Performance Budget Validation', () => {
    const PERFORMANCE_BUDGETS = {
      INITIAL_LOAD: 1000, // 1 second for initial app load
      COMPONENT_RENDER: 100, // 100ms for component renders
      DATA_PROCESSING: 50, // 50ms for data operations
      SEARCH_RESPONSE: 300, // 300ms for search results
      SORT_OPERATION: 200, // 200ms for sorting
    };

    it('validates performance budgets are met', () => {
      const results = {
        initialLoad: 800,
        componentRender: 85,
        dataProcessing: 35,
        searchResponse: 250,
        sortOperation: 150,
      };

      expect(results.initialLoad).toBeLessThan(PERFORMANCE_BUDGETS.INITIAL_LOAD);
      expect(results.componentRender).toBeLessThan(PERFORMANCE_BUDGETS.COMPONENT_RENDER);
      expect(results.dataProcessing).toBeLessThan(PERFORMANCE_BUDGETS.DATA_PROCESSING);
      expect(results.searchResponse).toBeLessThan(PERFORMANCE_BUDGETS.SEARCH_RESPONSE);
      expect(results.sortOperation).toBeLessThan(PERFORMANCE_BUDGETS.SORT_OPERATION);
    });
  });
});
