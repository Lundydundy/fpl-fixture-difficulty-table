import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { AppProvider } from '../AppContext';
import { useAppState, useLoadingState, useSearchState, useSortState, useGameweekState } from '../useAppState';

// Wrapper component for tests
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AppProvider>{children}</AppProvider>;
  };
}

describe('useAppState', () => {
  it('provides initial state and actions', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: createWrapper(),
    });

    // Check initial state
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.teams).toEqual([]);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.selectedGameweeks).toBe(5);
    expect(result.current.sortBy).toBe('team');
    expect(result.current.sortDirection).toBe('asc');

    // Check actions are available
    expect(typeof result.current.actions.setLoading).toBe('function');
    expect(typeof result.current.actions.setError).toBe('function');
    expect(typeof result.current.actions.setSearchTerm).toBe('function');
  });

  it('updates loading state', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.actions.setLoading(true);
    });

    expect(result.current.loading).toBe(true);
  });

  it('updates error state', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.actions.setError('Test error');
    });

    expect(result.current.error).toBe('Test error');
    expect(result.current.hasError).toBe(true);
  });

  it('updates search term', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.actions.setSearchTerm('Arsenal');
    });

    expect(result.current.searchTerm).toBe('Arsenal');
  });

  it('updates selected gameweeks', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.actions.setSelectedGameweeks(8);
    });

    expect(result.current.selectedGameweeks).toBe(8);
  });

  it('handles sort changes correctly', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: createWrapper(),
    });

    // First change to difficulty sort
    act(() => {
      result.current.actions.handleSortChange('difficulty');
    });

    expect(result.current.sortBy).toBe('difficulty');
    expect(result.current.sortDirection).toBe('asc');

    // Click same sort option to toggle direction
    act(() => {
      result.current.actions.handleSortChange('difficulty');
    });

    expect(result.current.sortBy).toBe('difficulty');
    expect(result.current.sortDirection).toBe('desc');
  });

  it('clears search correctly', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: createWrapper(),
    });

    // Set search term first
    act(() => {
      result.current.actions.setSearchTerm('Arsenal');
    });

    expect(result.current.searchTerm).toBe('Arsenal');

    // Clear search
    act(() => {
      result.current.actions.clearSearch();
    });

    expect(result.current.searchTerm).toBe('');
  });

  it('handles complex loading operations', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: createWrapper(),
    });

    // Test individual loading actions
    act(() => {
      result.current.actions.setLoading(true);
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.actions.setLoading(false);
    });

    expect(result.current.loading).toBe(false);

    // Handle error
    act(() => {
      result.current.actions.handleError('API Error');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('API Error');
  });

  it('resets state correctly', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: createWrapper(),
    });

    // Set some state
    act(() => {
      result.current.actions.setLoading(true);
      result.current.actions.setError('Test error');
      result.current.actions.setSearchTerm('Arsenal');
      result.current.actions.setSelectedGameweeks(10);
    });

    // Verify state was set
    expect(result.current.error).toBe('Test error');
    expect(result.current.searchTerm).toBe('Arsenal');
    expect(result.current.selectedGameweeks).toBe(10);

    // Reset state
    act(() => {
      result.current.actions.resetState();
    });

    // Verify state was reset
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.selectedGameweeks).toBe(5);
  });
});

describe('useLoadingState', () => {
  it('provides loading-specific state and computed values', () => {
    const { result } = renderHook(() => useLoadingState(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasError).toBe(false);
    expect(result.current.shouldShowLoadingSpinner).toBe(false);
    expect(result.current.shouldShowErrorMessage).toBe(false);
  });
});

describe('useSearchState', () => {
  it('provides search-specific state and actions', () => {
    const { result } = renderHook(() => useSearchState(), {
      wrapper: createWrapper(),
    });

    expect(result.current.searchTerm).toBe('');
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.searchResultsCount).toBe(0);
    expect(result.current.hasSearchResults).toBe(false);
    expect(result.current.shouldShowNoResults).toBe(false);
    expect(typeof result.current.setSearchTerm).toBe('function');
    expect(typeof result.current.clearSearch).toBe('function');
  });

  it('updates search term through search hook', () => {
    const { result } = renderHook(() => useSearchState(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSearchTerm('Chelsea');
    });

    expect(result.current.searchTerm).toBe('Chelsea');
  });
});

describe('useSortState', () => {
  it('provides sort-specific state and actions', () => {
    const { result } = renderHook(() => useSortState(), {
      wrapper: createWrapper(),
    });

    expect(result.current.sortBy).toBe('team');
    expect(result.current.sortDirection).toBe('asc');
    expect(result.current.sortedTeams).toEqual([]);
    expect(typeof result.current.handleSortChange).toBe('function');
  });

  it('handles sort changes through sort hook', () => {
    const { result } = renderHook(() => useSortState(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleSortChange('difficulty');
    });

    expect(result.current.sortBy).toBe('difficulty');
    expect(result.current.sortDirection).toBe('asc');
  });
});

describe('useGameweekState', () => {
  it('provides gameweek-specific state and actions', () => {
    const { result } = renderHook(() => useGameweekState(), {
      wrapper: createWrapper(),
    });

    expect(result.current.selectedGameweeks).toBe(5);
    expect(result.current.gameweekRange).toEqual({ min: 1, max: 15 });
    expect(result.current.isValidGameweekSelection).toBe(true);
    expect(result.current.currentGameweek).toBe(null);
    expect(result.current.nextGameweek).toBe(null);
    expect(result.current.upcomingGameweeks).toEqual([]);
    expect(typeof result.current.setSelectedGameweeks).toBe('function');
  });

  it('updates selected gameweeks through gameweek hook', () => {
    const { result } = renderHook(() => useGameweekState(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSelectedGameweeks(12);
    });

    expect(result.current.selectedGameweeks).toBe(12);
  });
});