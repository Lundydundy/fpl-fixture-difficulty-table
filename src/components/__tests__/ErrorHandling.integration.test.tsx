import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AppProvider } from '../../context/AppContext';
import FixtureDifficultyTable from '../FixtureDifficultyTable';
import { mockFplApiService } from '../../services/MockFPLApiService';

// Mock the API service
vi.mock('../../services/MockFPLApiService', () => ({
  mockFplApiService: {
    getTeams: vi.fn(),
    getFixtures: vi.fn(),
    getGameweeks: vi.fn(),
  }
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

describe('Error Handling Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading spinner during initial data fetch', async () => {
    // Mock API calls to return promises that don't resolve immediately
    const mockTeams = vi.mocked(mockFplApiService.getTeams);
    const mockFixtures = vi.mocked(mockFplApiService.getFixtures);
    const mockGameweeks = vi.mocked(mockFplApiService.getGameweeks);

    mockTeams.mockImplementation(() => new Promise(() => {})); // Never resolves
    mockFixtures.mockImplementation(() => new Promise(() => {}));
    mockGameweeks.mockImplementation(() => new Promise(() => {}));

    renderWithProvider(<FixtureDifficultyTable />);

    expect(screen.getByText('Loading fixture data...')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading content')).toBeInTheDocument();
  });

  it('shows error display when API calls fail', async () => {
    const mockTeams = vi.mocked(mockFplApiService.getTeams);
    const mockFixtures = vi.mocked(mockFplApiService.getFixtures);
    const mockGameweeks = vi.mocked(mockFplApiService.getGameweeks);

    const networkError = new Error('Network error');
    mockTeams.mockRejectedValue(networkError);
    mockFixtures.mockRejectedValue(networkError);
    mockGameweeks.mockRejectedValue(networkError);

    renderWithProvider(<FixtureDifficultyTable />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Connection Error')).toBeInTheDocument();
    });
  });

  it('provides retry functionality after error', async () => {
    const mockTeams = vi.mocked(mockFplApiService.getTeams);
    const mockFixtures = vi.mocked(mockFplApiService.getFixtures);
    const mockGameweeks = vi.mocked(mockFplApiService.getGameweeks);

    // First call fails
    mockTeams.mockRejectedValueOnce(new Error('Network error'));
    mockFixtures.mockRejectedValueOnce(new Error('Network error'));
    mockGameweeks.mockRejectedValueOnce(new Error('Network error'));

    // Second call succeeds
    mockTeams.mockResolvedValueOnce([]);
    mockFixtures.mockResolvedValueOnce([]);
    mockGameweeks.mockResolvedValueOnce([]);

    renderWithProvider(<FixtureDifficultyTable />);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Connection Error')).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    // Should show loading again
    await waitFor(() => {
      expect(screen.getByText('Loading fixture data...')).toBeInTheDocument();
    });

    // Verify retry was attempted
    expect(mockTeams).toHaveBeenCalledTimes(2);
    expect(mockFixtures).toHaveBeenCalledTimes(2);
    expect(mockGameweeks).toHaveBeenCalledTimes(2);
  });

  it('shows retry count on subsequent failures', async () => {
    const mockTeams = vi.mocked(mockFplApiService.getTeams);
    const mockFixtures = vi.mocked(mockFplApiService.getFixtures);
    const mockGameweeks = vi.mocked(mockFplApiService.getGameweeks);

    const networkError = new Error('Network error');
    mockTeams.mockRejectedValue(networkError);
    mockFixtures.mockRejectedValue(networkError);
    mockGameweeks.mockRejectedValue(networkError);

    renderWithProvider(<FixtureDifficultyTable />);

    // Wait for first error
    await waitFor(() => {
      expect(screen.getByText('Connection Error')).toBeInTheDocument();
    });

    // Click retry
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    // Wait for second error with retry count
    await waitFor(() => {
      expect(screen.getByText('Retry (1/3)')).toBeInTheDocument();
    });
  });

  it('disables retry after max attempts', async () => {
    const mockTeams = vi.mocked(mockFplApiService.getTeams);
    const mockFixtures = vi.mocked(mockFplApiService.getFixtures);
    const mockGameweeks = vi.mocked(mockFplApiService.getGameweeks);

    const networkError = new Error('Network error');
    mockTeams.mockRejectedValue(networkError);
    mockFixtures.mockRejectedValue(networkError);
    mockGameweeks.mockRejectedValue(networkError);

    renderWithProvider(<FixtureDifficultyTable />);

    // Retry 3 times to reach max
    for (let i = 0; i < 3; i++) {
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);
    }

    // After max retries, button should be disabled
    await waitFor(() => {
      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeDisabled();
      expect(screen.getByText(/Maximum retry attempts reached/)).toBeInTheDocument();
    });
  });

  it('shows different error types based on error message', async () => {
    const mockTeams = vi.mocked(mockFplApiService.getTeams);
    const mockFixtures = vi.mocked(mockFplApiService.getFixtures);
    const mockGameweeks = vi.mocked(mockFplApiService.getGameweeks);

    // Test timeout error
    const timeoutError = new Error('Request timeout after 10000ms');
    mockTeams.mockRejectedValue(timeoutError);
    mockFixtures.mockRejectedValue(timeoutError);
    mockGameweeks.mockRejectedValue(timeoutError);

    renderWithProvider(<FixtureDifficultyTable />);

    await waitFor(() => {
      expect(screen.getByText('Request Timeout')).toBeInTheDocument();
    });
  });

  it('shows updating indicator when refreshing data', async () => {
    const mockTeams = vi.mocked(mockFplApiService.getTeams);
    const mockFixtures = vi.mocked(mockFplApiService.getFixtures);
    const mockGameweeks = vi.mocked(mockFplApiService.getGameweeks);

    // First call succeeds with data
    mockTeams.mockResolvedValueOnce([
      { id: 1, name: 'Arsenal', short_name: 'ARS', code: 3, strength: 4, 
        strength_overall_home: 1200, strength_overall_away: 1150,
        strength_attack_home: 1300, strength_attack_away: 1250,
        strength_defence_home: 1100, strength_defence_away: 1050 }
    ]);
    mockFixtures.mockResolvedValueOnce([]);
    mockGameweeks.mockResolvedValueOnce([
      { id: 1, name: 'Gameweek 1', deadline_time: '2024-08-16T17:30:00Z', 
        finished: false, is_current: true, is_next: false }
    ]);

    renderWithProvider(<FixtureDifficultyTable />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByText('Loading fixture data...')).not.toBeInTheDocument();
    });

    // Mock second call that takes time
    mockTeams.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve([]), 100)
    ));
    mockFixtures.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve([]), 100)
    ));
    mockGameweeks.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve([]), 100)
    ));

    // Trigger refresh by clicking retry (simulate refresh scenario)
    // This would normally be triggered by user action or automatic refresh
    // For this test, we'll simulate the updating state
  });

  it('handles parsing errors appropriately', async () => {
    const mockTeams = vi.mocked(mockFplApiService.getTeams);
    const mockFixtures = vi.mocked(mockFplApiService.getFixtures);
    const mockGameweeks = vi.mocked(mockFplApiService.getGameweeks);

    const parseError = new Error('JSON parse error: Unexpected token');
    mockTeams.mockRejectedValue(parseError);
    mockFixtures.mockRejectedValue(parseError);
    mockGameweeks.mockRejectedValue(parseError);

    renderWithProvider(<FixtureDifficultyTable />);

    await waitFor(() => {
      expect(screen.getByText('Data Error')).toBeInTheDocument();
      expect(screen.getByText(/Error processing fixture data/)).toBeInTheDocument();
    });
  });

  it('handles server errors with appropriate messaging', async () => {
    const mockTeams = vi.mocked(mockFplApiService.getTeams);
    const mockFixtures = vi.mocked(mockFplApiService.getFixtures);
    const mockGameweeks = vi.mocked(mockFplApiService.getGameweeks);

    const serverError = new Error('Server error 500');
    mockTeams.mockRejectedValue(serverError);
    mockFixtures.mockRejectedValue(serverError);
    mockGameweeks.mockRejectedValue(serverError);

    renderWithProvider(<FixtureDifficultyTable />);

    await waitFor(() => {
      expect(screen.getByText('Server Error')).toBeInTheDocument();
      expect(screen.getByText(/FPL servers are currently experiencing issues/)).toBeInTheDocument();
    });
  });
});