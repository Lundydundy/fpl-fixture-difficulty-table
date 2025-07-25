/**
 * Performance utilities for measuring and optimizing component performance
 */

/**
 * Simple performance timer for measuring execution time
 */
export class PerformanceTimer {
  private startTime: number;
  private label?: string;

  constructor(label?: string) {
    this.label = label;
    this.startTime = performance.now();
  }

  stop(): number {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    return duration;
  }

  end(): number {
    return this.stop();
  }
}

/**
 * Measure the execution time of a function
 */
export function measurePerformance<T>(
  label: string,
  fn: () => T
): T {
  const timer = new PerformanceTimer(label);
  const result = fn();
  timer.end();
  return result;
}

/**
 * Measure the execution time of a function and return the duration
 */
export function measureExecutionTime<T>(
  fn: () => T | Promise<T>
): Promise<{ result: T; duration: number }> {
  return new Promise(async (resolve) => {
    const timer = new PerformanceTimer();
    const result = await fn();
    const duration = timer.stop();
    resolve({ result, duration });
  });
}

/**
 * Measure the execution time of an async function
 */
export async function measureAsyncPerformance<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const timer = new PerformanceTimer(label);
  const result = await fn();
  timer.end();
  return result;
}

/**
 * Create a performance-aware memoization function
 */
export function createMemoWithPerformance<T extends (...args: any[]) => any>(
  fn: T,
  label: string,
  keySelector?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  let hitCount = 0;
  let missCount = 0;

  return ((...args: Parameters<T>) => {
    const key = keySelector ? keySelector(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      hitCount++;
      return cache.get(key);
    }

    missCount++;
    const timer = new PerformanceTimer(`${label} computation`);
    const result = fn(...args);
    timer.end();
    
    cache.set(key, result);
    
    return result;
  }) as T;
}

/**
 * Performance monitoring for React components
 */
export interface PerformanceMetrics {
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  lastRenderTime: number;
}

export class ComponentPerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();

  startRender(componentName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      const existing = this.metrics.get(componentName) || {
        renderCount: 0,
        totalRenderTime: 0,
        averageRenderTime: 0,
        lastRenderTime: 0
      };

      const updated: PerformanceMetrics = {
        renderCount: existing.renderCount + 1,
        totalRenderTime: existing.totalRenderTime + renderTime,
        averageRenderTime: (existing.totalRenderTime + renderTime) / (existing.renderCount + 1),
        lastRenderTime: renderTime
      };

      this.metrics.set(componentName, updated);
      
      // Track slow renders (over 16ms)
      if (renderTime > 16) {
        // Could be used for monitoring in the future
      }
    };
  }

  getMetrics(componentName: string): PerformanceMetrics | undefined {
    return this.metrics.get(componentName);
  }

  getAllMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics);
  }

  logSummary(): void {
    // Performance summary could be logged to external monitoring service
    // Currently disabled for production
  }
}

// Global performance monitor instance
export const performanceMonitor = new ComponentPerformanceMonitor();

/**
 * Virtual scrolling utilities
 */
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function calculateVirtualScrollRange(
  scrollTop: number,
  totalItems: number,
  options: VirtualScrollOptions
): { startIndex: number; endIndex: number; offsetY: number } {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + overscan * 2);
  const offsetY = startIndex * itemHeight;

  return { startIndex, endIndex, offsetY };
}