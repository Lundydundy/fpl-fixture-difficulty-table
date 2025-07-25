import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, SortOption, Team, Fixture, Gameweek, TeamFixture, GameweekRange } from '../types';

// Action Types
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TEAMS'; payload: Team[] }
  | { type: 'SET_FIXTURES'; payload: Fixture[] }
  | { type: 'SET_GAMEWEEKS'; payload: Gameweek[] }
  | { type: 'SET_FILTERED_TEAMS'; payload: TeamFixture[] }
  | { type: 'SET_SELECTED_GAMEWEEKS'; payload: number }
  | { type: 'SET_GAMEWEEK_RANGE'; payload: GameweekRange }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_SELECTED_TEAM_IDS'; payload: number[] }
  | { type: 'SET_SORT_BY'; payload: SortOption }
  | { type: 'SET_SORT_DIRECTION'; payload: 'asc' | 'desc' }
  | { type: 'RESET_STATE' };

// Initial State
const initialState: AppState = {
  teams: [],
  fixtures: [],
  gameweeks: [],
  filteredTeams: [],
  selectedGameweeks: 5,
  gameweekRange: { start: 1, end: 5 },
  searchTerm: '',
  selectedTeamIds: [],
  sortBy: 'team',
  sortDirection: 'asc',
  loading: false,
  error: null,
};

// Reducer Function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error, // Clear error when loading starts
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'SET_TEAMS':
      return {
        ...state,
        teams: action.payload,
      };

    case 'SET_FIXTURES':
      return {
        ...state,
        fixtures: action.payload,
      };

    case 'SET_GAMEWEEKS':
      return {
        ...state,
        gameweeks: action.payload,
      };

    case 'SET_FILTERED_TEAMS':
      return {
        ...state,
        filteredTeams: action.payload,
      };

    case 'SET_SELECTED_GAMEWEEKS':
      return {
        ...state,
        selectedGameweeks: Math.max(1, Math.min(15, action.payload)), // Enforce 1-15 range
      };

    case 'SET_GAMEWEEK_RANGE':
      return {
        ...state,
        gameweekRange: {
          start: Math.max(1, Math.min(38, action.payload.start)),
          end: Math.max(1, Math.min(38, action.payload.end))
        }
      };

    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload,
      };

    case 'SET_SELECTED_TEAM_IDS':
      return {
        ...state,
        selectedTeamIds: action.payload,
      };

    case 'SET_SORT_BY':
      return {
        ...state,
        sortBy: action.payload,
      };

    case 'SET_SORT_DIRECTION':
      return {
        ...state,
        sortDirection: action.payload,
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Context Types
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom Hook to use Context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}