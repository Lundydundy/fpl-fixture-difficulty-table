import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppProvider } from '../../context/AppContext';
import type { Team, Fixture, Gameweek } from '../../types';

// Mock data generators for consistent testing
export const createMockTeam = (overrides: Partial<Team> = {}): Team => ({
  id: 1,
  name: 'Arsenal',
  short_name: 'ARS',
  code: 3,
  strength: 4,
  strength_overall_home: 1200,
  strength_overall_away: 1150,
  strength_attack_home: 1250,
  strength_attack_away: 1200,
  strength_defence_home: 1180,
  strength_defence_away: 1120,
  ...overrides,
});

export const createMockFixture = (overrides: Partial<Fixture> = {}): Fixture => ({
  id: 1,
  code: 1,
  event: 1,
  finished: false,
  finished_provisional: false,
  kickoff_time: '2024-08-17T14:00:00Z',
  minutes: 0,
  provisional_start_time: false,
  started: false,
  team_a: 2,
  team_a_score: undefined,
  team_h: 1,
  team_h_score: undefined,
  stats: [],
  team_h_difficulty: 3,
  team_a_difficulty: 4,
  pulse_id: 1,
  ...overrides,
});

export const createMockGameweek = (overrides: Partial<Gameweek> = {}): Gameweek => ({
  id: 1,
  name: 'Gameweek 1',
  deadline_time: '2024-08-16T17:30:00Z',
  finished: false,
  is_current: true,
  is_next: false,
  is_previous: false,
  ...overrides,
});

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withProvider?: boolean;
}

export function renderWithProvider(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { withProvider = true, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (withProvider) {
      return <AppProvider>{children}</AppProvider>;
    }
    return <>{children}</>;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Performance testing utilities
export class TestPerformanceTimer {
  private startTime: number;

  constructor() {
    this.startTime = performance.now();
  }

  stop(): number {
    return performance.now() - this.startTime;
  }
}

export async function measureTestExecutionTime<T>(
  fn: () => T | Promise<T>
): Promise<{ result: T; duration: number }> {
  const timer = new TestPerformanceTimer();
  const result = await fn();
  const duration = timer.stop();
  return { result, duration };
}

// Mock viewport utilities
export function mockViewport(width: number, height: number = 768) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
}

// Mock media query utilities
export function mockMatchMedia(query: string, matches: boolean = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((q) => ({
      matches: q === query ? matches : false,
      media: q,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Accessibility testing utilities
export function expectElementToHaveAccessibleName(element: HTMLElement, name: string) {
  const accessibleName = element.getAttribute('aria-label') || 
                         element.getAttribute('aria-labelledby') ||
                         element.textContent;
  expect(accessibleName).toContain(name);
}

export function expectElementToBeKeyboardAccessible(element: HTMLElement) {
  expect(element).toHaveAttribute('tabindex');
  expect(element.getAttribute('tabindex')).not.toBe('-1');
}

// Data generation utilities for load testing
export function generateLargeTeamDataset(count: number): Team[] {
  return Array.from({ length: count }, (_, i) => createMockTeam({
    id: i + 1,
    name: `Team ${i + 1}`,
    short_name: `T${i + 1}`,
    code: i + 1,
    strength: Math.floor(Math.random() * 5) + 1,
  }));
}

export function generateLargeFixtureDataset(teamCount: number, gameweekCount: number): Fixture[] {
  const fixtures: Fixture[] = [];
  let fixtureId = 1;

  for (let gw = 1; gw <= gameweekCount; gw++) {
    for (let i = 1; i <= teamCount; i += 2) {
      if (i + 1 <= teamCount) {
        fixtures.push(createMockFixture({
          id: fixtureId++,
          event: gw,
          team_h: i,
          team_a: i + 1,
          team_h_difficulty: Math.floor(Math.random() * 5) + 1,
          team_a_difficulty: Math.floor(Math.random() * 5) + 1,
        }));
      }
    }
  }

  return fixtures;
}

// Test data validation utilities
export function validateTestDataIntegrity(teams: Team[], fixtures: Fixture[]) {
  const teamIds = new Set(teams.map(t => t.id));
  
  fixtures.forEach(fixture => {
    expect(teamIds.has(fixture.team_h)).toBe(true);
    expect(teamIds.has(fixture.team_a)).toBe(true);
    expect(fixture.team_h_difficulty).toBeGreaterThanOrEqual(1);
    expect(fixture.team_h_difficulty).toBeLessThanOrEqual(5);
    expect(fixture.team_a_difficulty).toBeGreaterThanOrEqual(1);
    expect(fixture.team_a_difficulty).toBeLessThanOrEqual(5);
  });
}

// Re-export common testing utilities
export * from '@testing-library/react';
export * from '@testing-library/user-event';