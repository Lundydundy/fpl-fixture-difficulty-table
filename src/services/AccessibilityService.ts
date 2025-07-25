/**
 * AccessibilityService - Manages accessibility features and ARIA announcements
 */

export interface AccessibilityOptions {
  polite?: boolean;
  delay?: number;
  clearPrevious?: boolean;
}

class AccessibilityService {
  private liveRegion: HTMLElement | null = null;
  private announceTimeout: number | null = null;

  /**
   * Initialize the accessibility service
   */
  init(): void {
    this.liveRegion = document.getElementById('live-region');
    
    if (!this.liveRegion) {
      // Create live region if it doesn't exist
      this.liveRegion = document.createElement('div');
      this.liveRegion.id = 'live-region';
      this.liveRegion.className = 'live-region';
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.liveRegion);
    }
  }

  /**
   * Announce a message to screen readers
   */
  announce(message: string, options: AccessibilityOptions = {}): void {
    if (!this.liveRegion) {
      this.init();
    }

    const {
      polite = true,
      delay = 100,
      clearPrevious = true
    } = options;

    // Clear any pending announcements
    if (this.announceTimeout) {
      clearTimeout(this.announceTimeout);
    }

    // Clear previous message if requested
    if (clearPrevious && this.liveRegion) {
      this.liveRegion.textContent = '';
    }

    // Set the appropriate aria-live attribute
    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', polite ? 'polite' : 'assertive');
    }

    // Announce the message after a brief delay
    this.announceTimeout = setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = message;
      }
    }, delay) as unknown as number;
  }

  /**
   * Announce loading state changes
   */
  announceLoading(isLoading: boolean, context?: string): void {
    const baseMessage = context ? `${context} ` : '';
    const message = isLoading 
      ? `${baseMessage}Loading...` 
      : `${baseMessage}Loading complete`;
    
    this.announce(message, { polite: true });
  }

  /**
   * Announce error states
   */
  announceError(error: string): void {
    this.announce(`Error: ${error}`, { polite: false });
  }

  /**
   * Announce data updates
   */
  announceDataUpdate(message: string): void {
    this.announce(message, { polite: true, delay: 500 });
  }

  /**
   * Announce search results
   */
  announceSearchResults(count: number, searchTerm?: string): void {
    const baseMessage = searchTerm 
      ? `Search for "${searchTerm}" returned ` 
      : 'Search returned ';
    
    const resultText = count === 1 ? '1 result' : `${count} results`;
    this.announce(`${baseMessage}${resultText}`, { polite: true });
  }

  /**
   * Announce sort changes
   */
  announceSortChange(sortBy: string, direction: 'asc' | 'desc'): void {
    const directionText = direction === 'asc' ? 'ascending' : 'descending';
    this.announce(`Table sorted by ${sortBy} in ${directionText} order`, { polite: true });
  }

  /**
   * Announce gameweek range changes
   */
  announceGameweekChange(start: number, end: number): void {
    const gameweekText = start === end 
      ? `gameweek ${start}` 
      : `gameweeks ${start} to ${end}`;
    
    this.announce(`Showing fixtures for ${gameweekText}`, { polite: true });
  }

  /**
   * Focus management utilities
   */
  focusElement(selector: string): boolean {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && typeof element.focus === 'function') {
      element.focus();
      return true;
    }
    return false;
  }

  /**
   * Trap focus within a container
   */
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check if user prefers high contrast
   */
  prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }

  /**
   * Get appropriate animation duration based on user preferences
   */
  getAnimationDuration(defaultDuration: number): number {
    return this.prefersReducedMotion() ? 0 : defaultDuration;
  }

  /**
   * Cleanup method
   */
  cleanup(): void {
    if (this.announceTimeout) {
      clearTimeout(this.announceTimeout);
      this.announceTimeout = null;
    }
  }
}

// Export singleton instance
export const accessibilityService = new AccessibilityService();
export default accessibilityService;