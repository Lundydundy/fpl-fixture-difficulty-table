import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * Custom hook for debouncing values
 * Delays updating the debounced value until after the specified delay
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing callbacks
 * Returns a debounced version of the callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<number>();

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay) as unknown as number;
    }) as T,
    [delay]
  );
}

/**
 * Custom hook for throttling callbacks
 * Limits the execution of a callback to at most once per specified interval
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const callbackRef = useRef(callback);
  const throttleRef = useRef<boolean>(false);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (!throttleRef.current) {
        callbackRef.current(...args);
        throttleRef.current = true;
        setTimeout(() => {
          throttleRef.current = false;
        }, limit);
      }
    }) as T,
    [limit]
  );
}

/**
 * Custom hook for measuring component performance
 * Returns timing information for renders and effects
 */
export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>();
  const renderCount = useRef<number>(0);
  const mountTime = useRef<number>();

  // Track mount time
  useEffect(() => {
    mountTime.current = performance.now();
    
    return () => {
      const unmountTime = performance.now();
      const totalLifetime = unmountTime - (mountTime.current || 0);
      // Component lifetime tracking could be sent to monitoring service
    };
  }, [componentName]);

  // Track render performance
  useMemo(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  }, []);

  useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      // Render time tracking could be sent to monitoring service
    }
  });

  return {
    renderCount: renderCount.current,
    mountTime: mountTime.current
  };
}

/**
 * Custom hook for intersection observer
 * Useful for implementing virtual scrolling or lazy loading
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return { isIntersecting, entry };
}