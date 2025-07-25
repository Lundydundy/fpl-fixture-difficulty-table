import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { errorHandlingService } from '../ErrorHandlingService';

describe('ErrorHandlingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('classifyError', () => {
    it('should classify network errors correctly', () => {
      const networkError = new Error('Network error: Failed to fetch');
      expect(errorHandlingService.classifyError(networkError)).toBe('network');

      const corsError = new Error('CORS error: Access blocked');
      expect(errorHandlingService.classifyError(corsError)).toBe('network');
    });

    it('should classify timeout errors correctly', () => {
      const timeoutError = new Error('Request timeout after 10000ms');
      expect(errorHandlingService.classifyError(timeoutError)).toBe('timeout');

      const abortedError = new Error('Request aborted');
      expect(errorHandlingService.classifyError(abortedError)).toBe('timeout');
    });

    it('should classify parsing errors correctly', () => {
      const jsonError = new Error('JSON parse error: Unexpected token');
      expect(errorHandlingService.classifyError(jsonError)).toBe('parsing');

      const syntaxError = new Error('Syntax error in response');
      expect(errorHandlingService.classifyError(syntaxError)).toBe('parsing');
    });

    it('should classify server errors correctly', () => {
      const serverError = new Error('Server error: 500 Internal Server Error');
      expect(errorHandlingService.classifyError(serverError)).toBe('server');

      const badGatewayError = new Error('502 Bad Gateway');
      expect(errorHandlingService.classifyError(badGatewayError)).toBe('server');
    });

    it('should classify not found errors correctly', () => {
      const notFoundError = new Error('404 Not Found');
      expect(errorHandlingService.classifyError(notFoundError)).toBe('not_found');

      const resourceNotFoundError = new Error('Resource not found');
      expect(errorHandlingService.classifyError(resourceNotFoundError)).toBe('not_found');
    });

    it('should classify unknown errors as unknown', () => {
      const unknownError = new Error('Something went wrong');
      expect(errorHandlingService.classifyError(unknownError)).toBe('unknown');

      const stringError = 'String error';
      expect(errorHandlingService.classifyError(stringError)).toBe('unknown');
    });
  });

  describe('createErrorInfo', () => {
    it('should create error info with correct properties', () => {
      const error = new Error('Test error');
      const retryCount = 2;
      
      const errorInfo = errorHandlingService.createErrorInfo(error, retryCount);
      
      expect(errorInfo).toMatchObject({
        type: 'unknown',
        message: 'Test error',
        originalError: error,
        retryCount: 2
      });
      expect(errorInfo.timestamp).toBeTypeOf('number');
    });

    it('should handle non-Error objects', () => {
      const stringError = 'String error';
      const errorInfo = errorHandlingService.createErrorInfo(stringError);
      
      expect(errorInfo).toMatchObject({
        type: 'unknown',
        message: 'String error',
        originalError: undefined,
        retryCount: 0
      });
    });
  });

  describe('calculateRetryDelay', () => {
    it('should calculate exponential backoff correctly', () => {
      expect(errorHandlingService.calculateRetryDelay(0)).toBe(1000);
      expect(errorHandlingService.calculateRetryDelay(1)).toBe(2000);
      expect(errorHandlingService.calculateRetryDelay(2)).toBe(4000);
    });

    it('should respect max delay', () => {
      const delay = errorHandlingService.calculateRetryDelay(10, { maxDelay: 5000 });
      expect(delay).toBe(5000);
    });

    it('should use custom config', () => {
      const delay = errorHandlingService.calculateRetryDelay(1, {
        baseDelay: 500,
        backoffMultiplier: 3
      });
      expect(delay).toBe(1500);
    });
  });

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      
      const result = await errorHandlingService.withRetry(mockFn);
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success');
      
      const promise = errorHandlingService.withRetry(mockFn, { maxRetries: 3 });
      
      // Fast-forward through delays
      await vi.runAllTimersAsync();
      
      const result = await promise;
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should not retry non-retryable errors', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('404 Not Found'));
      
      await expect(errorHandlingService.withRetry(mockFn)).rejects.toThrow('404 Not Found');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should not retry parsing errors', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('JSON parse error'));
      
      await expect(errorHandlingService.withRetry(mockFn)).rejects.toThrow('JSON parse error');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should throw after max retries', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Network error'));
      
      const promise = errorHandlingService.withRetry(mockFn, { maxRetries: 2 });
      
      // Fast-forward through delays
      await vi.runAllTimersAsync();
      
      await expect(promise).rejects.toThrow('Network error');
      expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe('withTimeout', () => {
    it('should resolve if promise completes within timeout', async () => {
      const promise = Promise.resolve('success');
      
      const result = await errorHandlingService.withTimeout(promise, 1000);
      
      expect(result).toBe('success');
    });

    it('should reject if promise takes too long', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('success'), 2000));
      
      const timeoutPromise = errorHandlingService.withTimeout(promise, 1000);
      
      // Fast-forward past timeout
      vi.advanceTimersByTime(1001);
      
      await expect(timeoutPromise).rejects.toThrow('Request timeout after 1000ms');
    });
  });

  describe('isRetryable', () => {
    it('should return true for retryable error types', () => {
      expect(errorHandlingService.isRetryable('network')).toBe(true);
      expect(errorHandlingService.isRetryable('timeout')).toBe(true);
      expect(errorHandlingService.isRetryable('server')).toBe(true);
      expect(errorHandlingService.isRetryable('unknown')).toBe(true);
    });

    it('should return false for non-retryable error types', () => {
      expect(errorHandlingService.isRetryable('not_found')).toBe(false);
      expect(errorHandlingService.isRetryable('parsing')).toBe(false);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return appropriate messages for each error type', () => {
      expect(errorHandlingService.getUserFriendlyMessage('network'))
        .toContain('Unable to connect to FPL servers');
      
      expect(errorHandlingService.getUserFriendlyMessage('timeout'))
        .toContain('took too long to complete');
      
      expect(errorHandlingService.getUserFriendlyMessage('server'))
        .toContain('servers are currently experiencing issues');
      
      expect(errorHandlingService.getUserFriendlyMessage('not_found'))
        .toContain('could not be found');
      
      expect(errorHandlingService.getUserFriendlyMessage('parsing'))
        .toContain('Error processing fixture data');
      
      expect(errorHandlingService.getUserFriendlyMessage('unknown'))
        .toContain('unexpected error occurred');
    });
  });

  describe('logError', () => {
    it('should log error information', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const errorInfo = errorHandlingService.createErrorInfo(new Error('Test error'), 1);
      errorHandlingService.logError(errorInfo);
      
      expect(consoleSpy).toHaveBeenCalledWith('Error occurred:', expect.objectContaining({
        type: 'unknown',
        message: 'Test error',
        retryCount: 1
      }));
      
      consoleSpy.mockRestore();
    });
  });
});