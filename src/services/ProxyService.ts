/**
 * ProxyService - Handles CORS bypass for FPL API calls
 */

export class ProxyService {
  private static readonly CORS_PROXY_URLS = [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://cors.sh/',
  ];

  private static currentProxyIndex = 0;

  /**
   * Get the current CORS proxy URL
   */
  private static getCurrentProxy(): string {
    return this.CORS_PROXY_URLS[this.currentProxyIndex];
  }

  /**
   * Switch to the next available proxy
   */
  private static switchToNextProxy(): void {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.CORS_PROXY_URLS.length;
  }

  /**
   * Build a proxied URL for the FPL API
   */
  static buildProxiedUrl(fplEndpoint: string): string {
    const baseUrl = 'https://fantasy.premierleague.com/api';
    const fullUrl = `${baseUrl}${fplEndpoint}`;
    const proxy = this.getCurrentProxy();
    
    // Different proxies have different URL formats
    if (proxy.includes('allorigins.win')) {
      return `${proxy}${encodeURIComponent(fullUrl)}`;
    } else if (proxy.includes('corsproxy.io')) {
      return `${proxy}${encodeURIComponent(fullUrl)}`;
    } else {
      return `${proxy}${fullUrl}`;
    }
  }

  /**
   * Fetch data with automatic proxy fallback
   */
  static async fetchWithProxy(fplEndpoint: string, options: RequestInit = {}): Promise<Response> {
    let lastError: Error | null = null;
    
    // Try each proxy in sequence
    for (let attempt = 0; attempt < this.CORS_PROXY_URLS.length; attempt++) {
      try {
        const proxiedUrl = this.buildProxiedUrl(fplEndpoint);
        
        const response = await fetch(proxiedUrl, {
          ...options,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (response.ok) {
          return response;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        lastError = error as Error;
        this.switchToNextProxy();
      }
    }

    // If all proxies failed, try direct request as last resort
    try {
      const directUrl = `https://fantasy.premierleague.com/api${fplEndpoint}`;
      const response = await fetch(directUrl, options);
      
      if (response.ok) {
        return response;
      }
    } catch (error) {
      // Direct request failed, will throw error below
    }

    throw new Error(`All proxy attempts failed. Last error: ${lastError?.message}`);
  }

  /**
   * Fetch JSON data with automatic retry and proxy fallback
   */
  static async fetchJson<T>(fplEndpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await this.fetchWithProxy(fplEndpoint, options);
    
    try {
      const data = await response.json();
      return data as T;
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${error}`);
    }
  }

  /**
   * Test all available proxies and return working ones
   */
  static async testProxies(): Promise<string[]> {
    const workingProxies: string[] = [];
    const testEndpoint = '/bootstrap-static/';
    
    for (const proxy of this.CORS_PROXY_URLS) {
      try {
        const originalIndex = this.currentProxyIndex;
        this.currentProxyIndex = this.CORS_PROXY_URLS.indexOf(proxy);
        
        const response = await this.fetchWithProxy(testEndpoint);
        if (response.ok) {
          workingProxies.push(proxy);
        }
        
        this.currentProxyIndex = originalIndex;
      } catch (error) {
        // Proxy failed, continue to next
      }
    }
    
    return workingProxies;
  }

  /**
   * Get proxy status information
   */
  static getProxyStatus(): { current: string; available: string[]; index: number } {
    return {
      current: this.getCurrentProxy(),
      available: [...this.CORS_PROXY_URLS],
      index: this.currentProxyIndex,
    };
  }
}

export default ProxyService;