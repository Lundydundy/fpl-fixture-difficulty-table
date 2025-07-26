// Core TypeScript interfaces for FPL Fixture Difficulty Table

export interface Team {
  id: number;
  name: string;
  short_name: string;
  code: number;
  strength: number;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
}

export interface Fixture {
  id: number;
  code: number;
  event: number; // gameweek
  finished: boolean;
  kickoff_time: string;
  team_a: number; // away team id
  team_h: number; // home team id
  team_a_score?: number;
  team_h_score?: number;
  team_a_difficulty: number; // 1-5 difficulty rating
  team_h_difficulty: number; // 1-5 difficulty rating
}

export interface Gameweek {
  id: number;
  name: string;
  deadline_time: string;
  finished: boolean;
  is_current: boolean;
  is_next: boolean;
}

export interface ProcessedFixture {
  opponent: Team;
  isHome: boolean;
  difficulty: number;
  gameweek: number;
  kickoffTime: string;
}

export interface TeamFixture {
  team: Team;
  fixtures: ProcessedFixture[];
  averageDifficulty: number;
}

export interface GameweekRange {
  start: number;
  end: number;
}

// State Management Types
export type SortOption = 'team' | 'difficulty' | 'alphabetical';

export type TeamNameDisplay = 'full' | 'short';

export interface AppState {
  teams: Team[];
  fixtures: Fixture[];
  gameweeks: Gameweek[];
  filteredTeams: TeamFixture[];
  selectedGameweeks: number;
  gameweekRange: GameweekRange;
  searchTerm: string;
  selectedTeamIds: number[];
  sortBy: SortOption;
  sortDirection: 'asc' | 'desc';
  teamNameDisplay: TeamNameDisplay;
  loading: boolean;
  error: string | null;
}

// API Response Types
export interface FixtureResponse {
  fixtures: Fixture[];
}

export interface TeamResponse {
  teams: Team[];
}

export interface GameweekResponse {
  events: Gameweek[];
}

// Component Props Types
export interface FixtureDifficultyTableProps {
  initialGameweeks?: number;
  defaultSortBy?: SortOption;
}

export interface GameweekSliderProps {
  value: GameweekRange;
  min: number;
  max: number;
  onChange: (value: GameweekRange) => void;
}

export interface TeamSearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

export interface FixtureTableProps {
  teams: TeamFixture[];
  gameweeks: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export interface FixtureCellProps {
  fixture: ProcessedFixture;
  isHome: boolean;
  difficulty: number;
}

export interface DifficultyLegendProps {
  showLegend: boolean;
}