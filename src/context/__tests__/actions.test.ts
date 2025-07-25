import { describe, it, expect } from 'vitest';
import { actions, asyncActions } from '../actions';
import { Team, Fixture, Gameweek } from '../../types';

describe('actions', () => {
  describe('basic actions', () => {
    it('creates setLoading action', () => {
      const action = actions.setLoading(true);
      expect(action).toEqual({
        type: 'SET_LOADING',
        payload: true,
      });
    });

    it('creates setError action', () => {
      const action = actions.setError('Test error');
      expect(action).toEqual({
        type: 'SET_ERROR',
        payload: 'Test error',
      });
    });

    it('creates setSearchTerm action', () => {
      const action = actions.setSearchTerm('Arsenal');
      expect(action).toEqual({
        type: 'SET_SEARCH_TERM',
        payload: 'Arsenal',
      });
    });

    it('creates setSelectedGameweeks action', () => {
      const action = actions.setSelectedGameweeks(8);
      expect(action).toEqual({
        type: 'SET_SELECTED_GAMEWEEKS',
        payload: 8,
      });
    });

    it('creates setSortBy action', () => {
      const action = actions.setSortBy('difficulty');
      expect(action).toEqual({
        type: 'SET_SORT_BY',
        payload: 'difficulty',
      });
    });

    it('creates setSortDirection action', () => {
      const action = actions.setSortDirection('desc');
      expect(action).toEqual({
        type: 'SET_SORT_DIRECTION',
        payload: 'desc',
      });
    });

    it('creates resetState action', () => {
      const action = actions.resetState();
      expect(action).toEqual({
        type: 'RESET_STATE',
      });
    });

    it('creates clearSearch action', () => {
      const action = actions.clearSearch();
      expect(action).toEqual({
        type: 'SET_SEARCH_TERM',
        payload: '',
      });
    });
  });

  describe('data actions', () => {
    it('creates setTeams action', () => {
      const teams: Team[] = [
        {
          id: 1,
          name: 'Arsenal',
          short_name: 'ARS',
          code: 3,
          strength: 4,
          strength_overall_home: 1200,
          strength_overall_away: 1150,
          strength_attack_home: 1250,
          strength_attack_away: 1200,
          strength_defence_home: 1150,
          strength_defence_away: 1100,
        },
      ];

      const action = actions.setTeams(teams);
      expect(action).toEqual({
        type: 'SET_TEAMS',
        payload: teams,
      });
    });

    it('creates setFixtures action', () => {
      const fixtures: Fixture[] = [
        {
          id: 1,
          code: 12345,
          event: 1,
          finished: false,
          kickoff_time: '2024-08-17T14:00:00Z',
          team_a: 2,
          team_h: 1,
          team_a_difficulty: 3,
          team_h_difficulty: 2,
        },
      ];

      const action = actions.setFixtures(fixtures);
      expect(action).toEqual({
        type: 'SET_FIXTURES',
        payload: fixtures,
      });
    });

    it('creates setGameweeks action', () => {
      const gameweeks: Gameweek[] = [
        {
          id: 1,
          name: 'Gameweek 1',
          deadline_time: '2024-08-17T10:30:00Z',
          finished: false,
          is_current: true,
          is_next: false,
        },
      ];

      const action = actions.setGameweeks(gameweeks);
      expect(action).toEqual({
        type: 'SET_GAMEWEEKS',
        payload: gameweeks,
      });
    });
  });

  describe('utility actions', () => {
    it('creates toggleSortDirection action', () => {
      const action = actions.toggleSortDirection('asc');
      expect(action).toEqual({
        type: 'SET_SORT_DIRECTION',
        payload: 'desc',
      });

      const action2 = actions.toggleSortDirection('desc');
      expect(action2).toEqual({
        type: 'SET_SORT_DIRECTION',
        payload: 'asc',
      });
    });
  });
});

describe('asyncActions', () => {
  describe('handleSortChange', () => {
    it('toggles direction when same sort option is selected', () => {
      const actions = asyncActions.handleSortChange('team', 'team', 'asc');
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        type: 'SET_SORT_DIRECTION',
        payload: 'desc',
      });
    });

    it('changes sort option and resets direction when different option is selected', () => {
      const actions = asyncActions.handleSortChange('difficulty', 'team', 'desc');
      expect(actions).toHaveLength(2);
      expect(actions[0]).toEqual({
        type: 'SET_SORT_BY',
        payload: 'difficulty',
      });
      expect(actions[1]).toEqual({
        type: 'SET_SORT_DIRECTION',
        payload: 'asc',
      });
    });
  });

  describe('handleError', () => {
    it('creates actions to handle error state', () => {
      const actions = asyncActions.handleError('API Error');
      expect(actions).toHaveLength(2);
      expect(actions[0]).toEqual({
        type: 'SET_LOADING',
        payload: false,
      });
      expect(actions[1]).toEqual({
        type: 'SET_ERROR',
        payload: 'API Error',
      });
    });
  });

  describe('startLoading', () => {
    it('creates actions to start loading state', () => {
      const actions = asyncActions.startLoading();
      expect(actions).toHaveLength(2);
      expect(actions[0]).toEqual({
        type: 'SET_LOADING',
        payload: true,
      });
      expect(actions[1]).toEqual({
        type: 'SET_ERROR',
        payload: null,
      });
    });
  });

  describe('completeLoading', () => {
    it('creates actions to complete loading state', () => {
      const actions = asyncActions.completeLoading();
      expect(actions).toHaveLength(2);
      expect(actions[0]).toEqual({
        type: 'SET_LOADING',
        payload: false,
      });
      expect(actions[1]).toEqual({
        type: 'SET_ERROR',
        payload: null,
      });
    });
  });
});