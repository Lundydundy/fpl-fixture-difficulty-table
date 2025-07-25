import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../AppContext';
import { actions } from '../actions';
import { Team, Fixture, Gameweek } from '../../types';

// Test component to access context
function TestComponent() {
  const { state, dispatch } = useAppContext();
  
  return (
    <div>
      <div data-testid="loading">{state.loading.toString()}</div>
      <div data-testid="error">{state.error || 'null'}</div>
      <div data-testid="teams-count">{state.teams.length}</div>
      <div data-testid="search-term">{state.searchTerm}</div>
      <div data-testid="selected-gameweeks">{state.selectedGameweeks}</div>
      <div data-testid="sort-by">{state.sortBy}</div>
      <div data-testid="sort-direction">{state.sortDirection}</div>
      
      <button 
        data-testid="set-loading" 
        onClick={() => dispatch(actions.setLoading(true))}
      >
        Set Loading
      </button>
      
      <button 
        data-testid="set-error" 
        onClick={() => dispatch(actions.setError('Test error'))}
      >
        Set Error
      </button>
      
      <button 
        data-testid="set-search" 
        onClick={() => dispatch(actions.setSearchTerm('Arsenal'))}
      >
        Set Search
      </button>
      
      <button 
        data-testid="set-gameweeks" 
        onClick={() => dispatch(actions.setSelectedGameweeks(10))}
      >
        Set Gameweeks
      </button>
      
      <button 
        data-testid="reset-state" 
        onClick={() => dispatch(actions.resetState())}
      >
        Reset State
      </button>
    </div>
  );
}

describe('AppContext', () => {
  it('provides initial state correctly', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('null');
    expect(screen.getByTestId('teams-count')).toHaveTextContent('0');
    expect(screen.getByTestId('search-term')).toHaveTextContent('');
    expect(screen.getByTestId('selected-gameweeks')).toHaveTextContent('5');
    expect(screen.getByTestId('sort-by')).toHaveTextContent('team');
    expect(screen.getByTestId('sort-direction')).toHaveTextContent('asc');
  });

  it('handles loading state changes', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const setLoadingButton = screen.getByTestId('set-loading');
    
    await act(async () => {
      setLoadingButton.click();
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('handles error state changes', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const setErrorButton = screen.getByTestId('set-error');
    
    await act(async () => {
      setErrorButton.click();
    });

    expect(screen.getByTestId('error')).toHaveTextContent('Test error');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('handles search term changes', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const setSearchButton = screen.getByTestId('set-search');
    
    await act(async () => {
      setSearchButton.click();
    });

    expect(screen.getByTestId('search-term')).toHaveTextContent('Arsenal');
  });

  it('enforces gameweek range constraints', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const setGameweeksButton = screen.getByTestId('set-gameweeks');
    
    await act(async () => {
      setGameweeksButton.click();
    });

    expect(screen.getByTestId('selected-gameweeks')).toHaveTextContent('10');
  });

  it('resets state correctly', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // First set some state
    await act(async () => {
      screen.getByTestId('set-loading').click();
      screen.getByTestId('set-error').click();
      screen.getByTestId('set-search').click();
    });

    // Verify state was changed
    expect(screen.getByTestId('error')).toHaveTextContent('Test error');
    expect(screen.getByTestId('search-term')).toHaveTextContent('Arsenal');

    // Reset state
    await act(async () => {
      screen.getByTestId('reset-state').click();
    });

    // Verify state was reset
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('null');
    expect(screen.getByTestId('search-term')).toHaveTextContent('');
    expect(screen.getByTestId('selected-gameweeks')).toHaveTextContent('5');
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAppContext must be used within an AppProvider');

    console.error = originalError;
  });
});