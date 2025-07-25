import { ErrorType } from '../components/ErrorDisplay';

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  originalError?: Error;
  timestamp: number;
  retryCount: number;
}

class ErrorHandlingService {
  private readonly defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  };

  /**
   * Classify error type based on error details
   */
  classifyError(error: unknown): ErrorType {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      // Network errors
      if (message.includes('network') || message.includes('fetch') || message.includes('cors')) {
        return 'network';
      }
      
      // Timeout errors
      if (message.includes('timeout') || message.includes('aborted')) {
        return 'timeout';
      }
      
      // Parsing errors
      if (message.includes('json') || message.includes('parse') || message.includes('syntax')) {
        return 'parsing';
      }
      
      // Server errors
      if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('server')) {
        return 'server';
      }
      
      // Not found errors
      if (message.includes('404') || message.includes('not found')) {
        return 'not_found';
      }
    }
    
    return 'unknown';
  }

  /**
   * Create error info object
   */
  createErrorInfo(error: unknown, retryCount: number = 0): ErrorInfo {
    const type = this.classifyError(error);
    const message = error instanceof Error ? error.message : String(error);
    
    return {
      type,
      message,
      originalError: error instanceof Error ? error : undefined,
      timestamp: Date.now(),
      retryCount
    };
  }

  /**
   * Calculate delay for retry attempt using exponential backoff
   */
  calculateRetryDelay(retryCount: number, config: Partial<RetryConfig> = {}): number {
    const finalConfig = { ...this.defaultRetryConfig, ...config };
    const delay = finalConfig.baseDelay * Math.pow(finalConfig.backoffMultiplier, retryCount);
    return Math.min(delay, finalConfig.maxDelay);
  }

  /**
   * Execute function with retry logic
   */
  async withRetry<T>(
    fn: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const finalConfig = { ...this.defaultRetryConfig, ...config };
    let lastError: unknown;
    
    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on final attempt
        if (attempt === finalConfig.maxRetries) {
          break;
        }
        
        // Don't retry certain error types
        const errorType = this.classifyError(error);
        if (errorType === 'not_found' || errorType === 'parsing') {
          break;
        }
        
        // Wait before retrying
        const delay = this.calculateRetryDelay(attempt, finalConfig);
        await this.delay(delay);
      }
    }
    
    throw lastError;
  }

  /**
   * Create timeout wrapper for promises
   */
  withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      })
    ]);
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if error is retryable
   */
  isRetryable(errorType: ErrorType): boolean {
    const nonRetryableTypes: ErrorType[] = ['not_found', 'parsing'];
    return !nonRetryableTypes.includes(errorType);
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(errorType: ErrorType, _originalMessage?: string): string {
    const messages = {
      network: 'Unable to connect to FPL servers. Please check your internet connection and try again.',
      timeout: 'The request took too long to complete. Please try again.',
      parsing: 'Error processing fixture data. Some information may be incomplete.',
      not_found: 'The requested fixture data could not be found.',
      server: 'FPL servers are currently experiencing issues. Please try again later.',
      unknown: 'An unexpected error occurred. Please try again.'
    };

    return messages[errorType];
  }

  /**
   * Log error for debugging/monitoring
   */
  logError(errorInfo: ErrorInfo): void {
    // Error logging can be implemented here for production monitoring
    // For now, we'll silently handle errors without console output
    // In production, this could send errors to a monitoring service
  }
}

// Export singleton instance
export const errorHandlingService = new ErrorHandlingService();
export default ErrorHandlingService;