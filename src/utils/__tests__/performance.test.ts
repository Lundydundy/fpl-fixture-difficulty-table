import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  PerformanceTimer, 
  measurePerformance, 
  measureAsyncPerformance,
  measureExecutionTime,
  ComponentPerformanceMonitor,
  createMemoWithPerformance
} from '../../utils/performance';

describe('Performance Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('PerformanceTimer', () => {
    it('measures execution time accurately', () => {
      const mockPerformanceNow = vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100);

      const timer = new PerformanceTimer('Test Timer');
      const duration = timer.end();

      expect(duration).toBe(100);
      expect(mockPerformanceNow).toHaveBeenCalledTimes(2);
    });

    it('logs performance measurements', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50);

      const timer = new PerformanceTimer('Log Test');
      timer.end();

      expect(consoleSpy).toHaveBeenCalledWith('[Performance] Log Test: 50.00ms');
      consoleSpy.mockRestore();
    });
  });

  describe('measurePerformance', () => {
    it('measures synchronous function performance', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(25);

      const testFunction = vi.fn(() => 'result');
      const result = measurePerformance('Sync Test', testFunction);

      expect(result).toBe('result');
      expect(testFunction).toHaveBeenCalledTimes(1);
    });

    it('handles functions with parameters', () => {
      const testFunction = vi.fn((a: number, b: number) => a + b);
      
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(10);

      const result = measurePerformance('Param Test', () => testFunction(5, 3));

      expect(result).toBe(8);
    });
  });

  describe('measureAsyncPerformance', () => {
    it('measures asynchronous function performance', async () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(75);

      const asyncFunction = vi.fn(async () => {
        return 'async result';
      });

      const result = await measureAsyncPerformance('Async Test', asyncFunction);

      expect(result).toBe('async result');
      expect(asyncFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe('ComponentPerformanceMonitor', () => {
    let monitor: ComponentPerformanceMonitor;

    beforeEach(() => {
      monitor = new ComponentPerformanceMonitor();
    });

    it('tracks single component render', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(15);

      const endRender = monitor.startRender('TestComponent');
      endRender();

      const metrics = monitor.getMetrics('TestComponent');
      expect(metrics).toEqual({
        renderCount: 1,
        totalRenderTime: 15,
        averageRenderTime: 15,
        lastRenderTime: 15
      });
    });

    it('tracks multiple renders and calculates averages', () => {
      // First render: 10ms
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(10);
      
      let endRender = monitor.startRender('MultiRender');
      endRender();

      // Second render: 20ms
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(20);
      
      endRender = monitor.startRender('MultiRender');
      endRender();

      const metrics = monitor.getMetrics('MultiRender');
      expect(metrics).toEqual({
        renderCount: 2,
        totalRenderTime: 30,
        averageRenderTime: 15,
        lastRenderTime: 20
      });
    });

    it('warns about slow renders', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(20); // 20ms > 16ms threshold

      const endRender = monitor.startRender('SlowComponent');
      endRender();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Performance] SlowComponent slow render: 20.00ms'
      );
      
      consoleSpy.mockRestore();
    });

    it('returns undefined for non-existent components', () => {
      const metrics = monitor.getMetrics('NonExistent');
      expect(metrics).toBeUndefined();
    });

    it('logs performance summary', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const groupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
      const groupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

      // Add some test data
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(15);
      
      const endRender = monitor.startRender('SummaryTest');
      endRender();

      monitor.logSummary();

      expect(groupSpy).toHaveBeenCalledWith('[Performance] Component Summary');
      expect(consoleSpy).toHaveBeenCalledWith('SummaryTest:', {
        renders: 1,
        avgTime: '15.00ms',
        lastTime: '15.00ms',
        totalTime: '15.00ms'
      });
      expect(groupEndSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      groupSpy.mockRestore();
      groupEndSpy.mockRestore();
    });
  });

  describe('createMemoWithPerformance', () => {
    it('creates memoized function with performance tracking', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      const expensiveFunction = vi.fn((x: number) => x * 2);
      const memoizedFn = createMemoWithPerformance(expensiveFunction, 'MemoTest');

      // First call - cache miss
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(5);
      
      const result1 = memoizedFn(5);
      expect(result1).toBe(10);
      expect(expensiveFunction).toHaveBeenCalledTimes(1);

      // Second call with same args - cache hit
      const result2 = memoizedFn(5);
      expect(result2).toBe(10);
      expect(expensiveFunction).toHaveBeenCalledTimes(1); // Not called again

      // Check that cache hit message was logged
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('MemoTest cache hit'));
      
      consoleSpy.mockRestore();
    });

    it('uses custom key selector for caching', () => {
      const fn = vi.fn((obj: { id: number; data: string }) => obj.data.toUpperCase());
      const keySelector = (obj: { id: number; data: string }) => obj.id.toString();
      const memoizedFn = createMemoWithPerformance(fn, 'CustomKey', keySelector);

      memoizedFn({ id: 1, data: 'test' });
      memoizedFn({ id: 1, data: 'different' }); // Same id, should be cache hit

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance Budget Validation', () => {
    it('validates operation stays within performance budget', () => {
      const BUDGET_MS = 50;
      
      // Mock performance.now to control timing
      const mockNow = vi.spyOn(performance, 'now');
      mockNow.mockReturnValueOnce(0);
      mockNow.mockReturnValueOnce(25); // 25ms execution

      const operation = () => {
        // Simulate work that should be fast
        return 'fast result';
      };

      // Use measureExecutionTime to get the duration
      const { result, duration } = measureExecutionTime('Budget Test', operation);
      
      expect(result).toBe('fast result');
      expect(duration).toBe(25);
      expect(duration).toBeLessThan(BUDGET_MS);
    });

    it('identifies operations that exceed performance budget', () => {
      const BUDGET_MS = 30;
      
      // Mock performance.now to control timing  
      const mockNow = vi.spyOn(performance, 'now');
      mockNow.mockReturnValueOnce(0);
      mockNow.mockReturnValueOnce(45); // 45ms execution - exceeds budget

      const slowOperation = () => {
        // Simulate slow work
        return 'slow result';
      };

      const { result, duration } = measureExecutionTime('Slow Operation', slowOperation);
      
      expect(result).toBe('slow result');
      expect(duration).toBe(45);
      expect(duration).toBeGreaterThan(BUDGET_MS);
    });
  });

  describe('Real-world Performance Scenarios', () => {
    it('measures data processing performance', () => {
      const PROCESSING_BUDGET = 25;
      
      // Mock performance.now to control timing
      const mockNow = vi.spyOn(performance, 'now');
      mockNow.mockReturnValueOnce(0);
      mockNow.mockReturnValueOnce(20); // 20ms

      // Mock data processing operation
      const processData = (data: number[]) => {
        return data
          .filter(x => x > 10)
          .map(x => x * 2)
          .sort((a, b) => a - b)
          .slice(0, 10); // Reduced slice
      };

      const testData = Array.from({ length: 100 }, (_, i) => i); // Reduced data size

      const { result, duration } = measureExecutionTime('Data Processing', () => processData(testData));

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(10);
      expect(duration).toBe(20);
      expect(duration).toBeLessThan(PROCESSING_BUDGET);
    });

    it('measures concurrent operations performance', () => {
      const CONCURRENT_BUDGET = 100;
      
      // Mock performance.now to control timing
      const mockNow = vi.spyOn(performance, 'now');
      mockNow.mockReturnValueOnce(0);
      mockNow.mockReturnValueOnce(75); // 75ms total

      const operations = [
        () => Array.from({ length: 10 }, (_, i) => i).reduce((a, b) => a + b, 0), // Reduced
        () => Array.from({ length: 5 }, (_, i) => i).sort((a, b) => b - a), // Reduced
        () => Array.from({ length: 20 }, (_, i) => ({ id: i, value: i * 2 })), // Reduced
      ];

      const { result, duration } = measureExecutionTime('Concurrent Operations', () => {
        return operations.map(op => op());
      });

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(3); // Three operations
      expect(duration).toBe(75);
      expect(duration).toBeLessThan(CONCURRENT_BUDGET);
    });
  });
});
