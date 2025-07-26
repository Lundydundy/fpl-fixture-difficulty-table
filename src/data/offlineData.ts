import { Team, Fixture, Gameweek } from '../types';

/**
 * Offline FPL Data for 2024/25 Season - REAL DATA FROM FPL API
 * 
 * This file contains real FPL data fetched from the official API.
 * Custom difficulty ratings are applied:
 * 
 * - Man City away fixtures: Grade 5 (hardest)
 * - Arsenal away fixtures: Grade 5 (hardest) 
 * - Sunderland home/away fixtures: Grade 1 (easiest)
 */

// Real Premier League Teams 2024/25 Season from FPL API
export const OFFLINE_TEAMS: Team[] = [
  {
    "id": 1,
    "name": "Arsenal",
    "short_name": "ARS",
    "code": 3,
    "strength": 4,
    "strength_overall_home": 1320,
    "strength_overall_away": 1325,
    "strength_attack_home": 1350,
    "strength_attack_away": 1350,
    "strength_defence_home": 1290,
    "strength_defence_away": 1300
  },
  {
    "id": 2,
    "name": "Aston Villa",
    "short_name": "AVL",
    "code": 7,
    "strength": 3,
    "strength_overall_home": 1125,
    "strength_overall_away": 1250,
    "strength_attack_home": 1110,
    "strength_attack_away": 1200,
    "strength_defence_home": 1140,
    "strength_defence_away": 1300
  },
  {
    "id": 3,
    "name": "Burnley",
    "short_name": "BUR",
    "code": 90,
    "strength": 2,
    "strength_overall_home": 1050,
    "strength_overall_away": 1050,
    "strength_attack_home": 1050,
    "strength_attack_away": 1050,
    "strength_defence_home": 1050,
    "strength_defence_away": 1050
  },
  {
    "id": 4,
    "name": "Bournemouth",
    "short_name": "BOU",
    "code": 91,
    "strength": 3,
    "strength_overall_home": 1150,
    "strength_overall_away": 1180,
    "strength_attack_home": 1100,
    "strength_attack_away": 1160,
    "strength_defence_home": 1200,
    "strength_defence_away": 1200
  },
  {
    "id": 5,
    "name": "Brentford",
    "short_name": "BRE",
    "code": 94,
    "strength": 3,
    "strength_overall_home": 1120,
    "strength_overall_away": 1185,
    "strength_attack_home": 1080,
    "strength_attack_away": 1080,
    "strength_defence_home": 1160,
    "strength_defence_away": 1290
  },
  {
    "id": 6,
    "name": "Brighton",
    "short_name": "BHA",
    "code": 36,
    "strength": 3,
    "strength_overall_home": 1150,
    "strength_overall_away": 1175,
    "strength_attack_home": 1090,
    "strength_attack_away": 1140,
    "strength_defence_home": 1210,
    "strength_defence_away": 1210
  },
  {
    "id": 7,
    "name": "Chelsea",
    "short_name": "CHE",
    "code": 8,
    "strength": 4,
    "strength_overall_home": 1185,
    "strength_overall_away": 1245,
    "strength_attack_home": 1150,
    "strength_attack_away": 1190,
    "strength_defence_home": 1220,
    "strength_defence_away": 1300
  },
  {
    "id": 8,
    "name": "Crystal Palace",
    "short_name": "CRY",
    "code": 31,
    "strength": 3,
    "strength_overall_home": 1140,
    "strength_overall_away": 1160,
    "strength_attack_home": 1120,
    "strength_attack_away": 1130,
    "strength_defence_home": 1160,
    "strength_defence_away": 1190
  },
  {
    "id": 9,
    "name": "Everton",
    "short_name": "EVE",
    "code": 11,
    "strength": 3,
    "strength_overall_home": 1100,
    "strength_overall_away": 1115,
    "strength_attack_home": 1140,
    "strength_attack_away": 1140,
    "strength_defence_home": 1060,
    "strength_defence_away": 1090
  },
  {
    "id": 10,
    "name": "Fulham",
    "short_name": "FUL",
    "code": 54,
    "strength": 3,
    "strength_overall_home": 1125,
    "strength_overall_away": 1125,
    "strength_attack_home": 1130,
    "strength_attack_away": 1130,
    "strength_defence_home": 1120,
    "strength_defence_away": 1120
  },
  {
    "id": 11,
    "name": "Leeds",
    "short_name": "LEE",
    "code": 2,
    "strength": 2,
    "strength_overall_home": 1050,
    "strength_overall_away": 1075,
    "strength_attack_home": 1050,
    "strength_attack_away": 1050,
    "strength_defence_home": 1050,
    "strength_defence_away": 1100
  },
  {
    "id": 12,
    "name": "Liverpool",
    "short_name": "LIV",
    "code": 14,
    "strength": 5,
    "strength_overall_home": 1335,
    "strength_overall_away": 1355,
    "strength_attack_home": 1290,
    "strength_attack_away": 1330,
    "strength_defence_home": 1380,
    "strength_defence_away": 1380
  },
  {
    "id": 13,
    "name": "Man City",
    "short_name": "MCI",
    "code": 43,
    "strength": 4,
    "strength_overall_home": 1275,
    "strength_overall_away": 1315,
    "strength_attack_home": 1250,
    "strength_attack_away": 1250,
    "strength_defence_home": 1300,
    "strength_defence_away": 1380
  },
  {
    "id": 14,
    "name": "Man Utd",
    "short_name": "MUN",
    "code": 1,
    "strength": 3,
    "strength_overall_home": 1105,
    "strength_overall_away": 1125,
    "strength_attack_home": 1110,
    "strength_attack_away": 1110,
    "strength_defence_home": 1100,
    "strength_defence_away": 1140
  },
  {
    "id": 15,
    "name": "Newcastle",
    "short_name": "NEW",
    "code": 4,
    "strength": 4,
    "strength_overall_home": 1185,
    "strength_overall_away": 1245,
    "strength_attack_home": 1130,
    "strength_attack_away": 1170,
    "strength_defence_home": 1240,
    "strength_defence_away": 1320
  },
  {
    "id": 16,
    "name": "Nott'm Forest",
    "short_name": "NFO",
    "code": 17,
    "strength": 3,
    "strength_overall_home": 1165,
    "strength_overall_away": 1205,
    "strength_attack_home": 1150,
    "strength_attack_away": 1230,
    "strength_defence_home": 1180,
    "strength_defence_away": 1180
  },
  {
    "id": 17,
    "name": "Sunderland",
    "short_name": "SUN",
    "code": 56,
    "strength": 2,
    "strength_overall_home": 1050,
    "strength_overall_away": 1050,
    "strength_attack_home": 1050,
    "strength_attack_away": 1050,
    "strength_defence_home": 1050,
    "strength_defence_away": 1050
  },
  {
    "id": 18,
    "name": "Spurs",
    "short_name": "TOT",
    "code": 6,
    "strength": 3,
    "strength_overall_home": 1130,
    "strength_overall_away": 1175,
    "strength_attack_home": 1100,
    "strength_attack_away": 1100,
    "strength_defence_home": 1160,
    "strength_defence_away": 1250
  },
  {
    "id": 19,
    "name": "West Ham",
    "short_name": "WHU",
    "code": 21,
    "strength": 3,
    "strength_overall_home": 1100,
    "strength_overall_away": 1100,
    "strength_attack_home": 1100,
    "strength_attack_away": 1100,
    "strength_defence_home": 1100,
    "strength_defence_away": 1100
  },
  {
    "id": 20,
    "name": "Wolves",
    "short_name": "WOL",
    "code": 39,
    "strength": 3,
    "strength_overall_home": 1100,
    "strength_overall_away": 1125,
    "strength_attack_home": 1080,
    "strength_attack_away": 1100,
    "strength_defence_home": 1120,
    "strength_defence_away": 1150
  }
];

// Real Gameweeks for 2024/25 Season from FPL API
export const OFFLINE_GAMEWEEKS: Gameweek[] = [
  {
    "id": 1,
    "name": "Gameweek 1",
    "deadline_time": "2025-08-15T17:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": true
  },
  {
    "id": 2,
    "name": "Gameweek 2",
    "deadline_time": "2025-08-22T17:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 3,
    "name": "Gameweek 3",
    "deadline_time": "2025-08-29T17:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 4,
    "name": "Gameweek 4",
    "deadline_time": "2025-09-13T10:00:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 5,
    "name": "Gameweek 5",
    "deadline_time": "2025-09-20T10:00:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 6,
    "name": "Gameweek 6",
    "deadline_time": "2025-09-27T10:00:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 7,
    "name": "Gameweek 7",
    "deadline_time": "2025-10-04T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 8,
    "name": "Gameweek 8",
    "deadline_time": "2025-10-18T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 9,
    "name": "Gameweek 9",
    "deadline_time": "2025-10-25T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 10,
    "name": "Gameweek 10",
    "deadline_time": "2025-11-01T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 11,
    "name": "Gameweek 11",
    "deadline_time": "2025-11-08T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 12,
    "name": "Gameweek 12",
    "deadline_time": "2025-11-22T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 13,
    "name": "Gameweek 13",
    "deadline_time": "2025-11-29T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 14,
    "name": "Gameweek 14",
    "deadline_time": "2025-12-03T18:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 15,
    "name": "Gameweek 15",
    "deadline_time": "2025-12-06T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 16,
    "name": "Gameweek 16",
    "deadline_time": "2025-12-13T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 17,
    "name": "Gameweek 17",
    "deadline_time": "2025-12-20T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 18,
    "name": "Gameweek 18",
    "deadline_time": "2025-12-27T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 19,
    "name": "Gameweek 19",
    "deadline_time": "2025-12-30T18:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 20,
    "name": "Gameweek 20",
    "deadline_time": "2026-01-03T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 21,
    "name": "Gameweek 21",
    "deadline_time": "2026-01-07T18:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 22,
    "name": "Gameweek 22",
    "deadline_time": "2026-01-17T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 23,
    "name": "Gameweek 23",
    "deadline_time": "2026-01-24T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 24,
    "name": "Gameweek 24",
    "deadline_time": "2026-01-31T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 25,
    "name": "Gameweek 25",
    "deadline_time": "2026-02-07T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 26,
    "name": "Gameweek 26",
    "deadline_time": "2026-02-11T18:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 27,
    "name": "Gameweek 27",
    "deadline_time": "2026-02-21T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 28,
    "name": "Gameweek 28",
    "deadline_time": "2026-02-28T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 29,
    "name": "Gameweek 29",
    "deadline_time": "2026-03-04T18:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 30,
    "name": "Gameweek 30",
    "deadline_time": "2026-03-14T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 31,
    "name": "Gameweek 31",
    "deadline_time": "2026-03-21T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 32,
    "name": "Gameweek 32",
    "deadline_time": "2026-04-11T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 33,
    "name": "Gameweek 33",
    "deadline_time": "2026-04-18T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 34,
    "name": "Gameweek 34",
    "deadline_time": "2026-04-25T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 35,
    "name": "Gameweek 35",
    "deadline_time": "2026-05-02T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 36,
    "name": "Gameweek 36",
    "deadline_time": "2026-05-09T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 37,
    "name": "Gameweek 37",
    "deadline_time": "2026-05-17T12:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  },
  {
    "id": 38,
    "name": "Gameweek 38",
    "deadline_time": "2026-05-24T13:30:00Z",
    "finished": false,
    "is_current": false,
    "is_next": false
  }
];

// Real Fixtures with Custom Difficulty Ratings Applied - ALL 380 FIXTURES
export const OFFLINE_FIXTURES: Fixture[] = [
  {
    id: 1,
    code: 2561895,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-15T19:00:00Z",
    team_h: 12,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 2,
    code: 2561896,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-16T11:30:00Z",
    team_h: 2,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 3,
    code: 2561897,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-16T14:00:00Z",
    team_h: 6,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 6,
    code: 2561900,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-16T14:00:00Z",
    team_h: 18,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 5,
    code: 2561899,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-16T14:00:00Z",
    team_h: 17,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 1
  },
  {
    id: 7,
    code: 2561901,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-16T16:30:00Z",
    team_h: 20,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 8,
    code: 2561902,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-17T13:00:00Z",
    team_h: 7,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 4,
    code: 2561898,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-17T13:00:00Z",
    team_h: 16,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 9,
    code: 2561903,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-17T15:30:00Z",
    team_h: 14,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 10,
    code: 2561904,
    event: 1,
    finished: false,
    kickoff_time: "2025-08-18T19:00:00Z",
    team_h: 11,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 2
  },
  {
    id: 20,
    code: 2561914,
    event: 2,
    finished: false,
    kickoff_time: "2025-08-22T19:00:00Z",
    team_h: 19,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 18,
    code: 2561912,
    event: 2,
    finished: false,
    kickoff_time: "2025-08-23T11:30:00Z",
    team_h: 13,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 12,
    code: 2561905,
    event: 2,
    finished: false,
    kickoff_time: "2025-08-23T14:00:00Z",
    team_h: 4,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 13,
    code: 2561907,
    event: 2,
    finished: false,
    kickoff_time: "2025-08-23T14:00:00Z",
    team_h: 5,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 14,
    code: 2561908,
    event: 2,
    finished: false,
    kickoff_time: "2025-08-23T14:00:00Z",
    team_h: 3,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 2
  },
  {
    id: 11,
    code: 2561906,
    event: 2,
    finished: false,
    kickoff_time: "2025-08-23T16:30:00Z",
    team_h: 1,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 15,
    code: 2561909,
    event: 2,
    finished: false,
    kickoff_time: "2025-08-24T13:00:00Z",
    team_h: 8,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 16,
    code: 2561910,
    event: 2,
    finished: false,
    kickoff_time: "2025-08-24T13:00:00Z",
    team_h: 9,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 17,
    code: 2561911,
    event: 2,
    finished: false,
    kickoff_time: "2025-08-24T15:30:00Z",
    team_h: 10,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 19,
    code: 2561913,
    event: 2,
    finished: false,
    kickoff_time: "2025-08-25T19:00:00Z",
    team_h: 15,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 4
  },
  {
    id: 21,
    code: 2561915,
    event: 3,
    finished: false,
    kickoff_time: "2025-08-29T19:00:00Z",
    team_h: 2,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 23,
    code: 2561917,
    event: 3,
    finished: false,
    kickoff_time: "2025-08-30T11:30:00Z",
    team_h: 7,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 26,
    code: 2561920,
    event: 3,
    finished: false,
    kickoff_time: "2025-08-30T14:00:00Z",
    team_h: 14,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 29,
    code: 2561923,
    event: 3,
    finished: false,
    kickoff_time: "2025-08-30T14:00:00Z",
    team_h: 18,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 28,
    code: 2561922,
    event: 3,
    finished: false,
    kickoff_time: "2025-08-30T14:00:00Z",
    team_h: 17,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 1
  },
  {
    id: 30,
    code: 2561924,
    event: 3,
    finished: false,
    kickoff_time: "2025-08-30T14:00:00Z",
    team_h: 20,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 24,
    code: 2561918,
    event: 3,
    finished: false,
    kickoff_time: "2025-08-30T16:30:00Z",
    team_h: 11,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 22,
    code: 2561916,
    event: 3,
    finished: false,
    kickoff_time: "2025-08-31T13:00:00Z",
    team_h: 6,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 27,
    code: 2561921,
    event: 3,
    finished: false,
    kickoff_time: "2025-08-31T13:00:00Z",
    team_h: 16,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 25,
    code: 2561919,
    event: 3,
    finished: false,
    kickoff_time: "2025-08-31T15:30:00Z",
    team_h: 12,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 5
  },
  {
    id: 31,
    code: 2561926,
    event: 4,
    finished: false,
    kickoff_time: "2025-09-13T11:30:00Z",
    team_h: 1,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 32,
    code: 2561925,
    event: 4,
    finished: false,
    kickoff_time: "2025-09-13T14:00:00Z",
    team_h: 4,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 35,
    code: 2561929,
    event: 4,
    finished: false,
    kickoff_time: "2025-09-13T14:00:00Z",
    team_h: 8,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 3
  },
  {
    id: 36,
    code: 2561930,
    event: 4,
    finished: false,
    kickoff_time: "2025-09-13T14:00:00Z",
    team_h: 9,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 37,
    code: 2561931,
    event: 4,
    finished: false,
    kickoff_time: "2025-09-13T14:00:00Z",
    team_h: 10,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 39,
    code: 2561933,
    event: 4,
    finished: false,
    kickoff_time: "2025-09-13T14:00:00Z",
    team_h: 15,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 40,
    code: 2561934,
    event: 4,
    finished: false,
    kickoff_time: "2025-09-13T16:30:00Z",
    team_h: 19,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 33,
    code: 2561927,
    event: 4,
    finished: false,
    kickoff_time: "2025-09-13T19:00:00Z",
    team_h: 5,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 34,
    code: 2561928,
    event: 4,
    finished: false,
    kickoff_time: "2025-09-14T13:00:00Z",
    team_h: 3,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 2
  },
  {
    id: 38,
    code: 2561932,
    event: 4,
    finished: false,
    kickoff_time: "2025-09-14T15:30:00Z",
    team_h: 13,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 46,
    code: 2561940,
    event: 5,
    finished: false,
    kickoff_time: "2025-09-20T11:30:00Z",
    team_h: 12,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 42,
    code: 2561935,
    event: 5,
    finished: false,
    kickoff_time: "2025-09-20T14:00:00Z",
    team_h: 4,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 43,
    code: 2561937,
    event: 5,
    finished: false,
    kickoff_time: "2025-09-20T14:00:00Z",
    team_h: 6,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 44,
    code: 2561938,
    event: 5,
    finished: false,
    kickoff_time: "2025-09-20T14:00:00Z",
    team_h: 3,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 49,
    code: 2561943,
    event: 5,
    finished: false,
    kickoff_time: "2025-09-20T14:00:00Z",
    team_h: 19,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 50,
    code: 2561944,
    event: 5,
    finished: false,
    kickoff_time: "2025-09-20T14:00:00Z",
    team_h: 20,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 47,
    code: 2561941,
    event: 5,
    finished: false,
    kickoff_time: "2025-09-20T16:30:00Z",
    team_h: 14,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 45,
    code: 2561939,
    event: 5,
    finished: false,
    kickoff_time: "2025-09-20T19:00:00Z",
    team_h: 10,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 48,
    code: 2561942,
    event: 5,
    finished: false,
    kickoff_time: "2025-09-21T13:00:00Z",
    team_h: 17,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 1
  },
  {
    id: 41,
    code: 2561936,
    event: 5,
    finished: false,
    kickoff_time: "2025-09-21T15:30:00Z",
    team_h: 1,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 5
  },
  {
    id: 52,
    code: 2561946,
    event: 6,
    finished: false,
    kickoff_time: "2025-09-27T11:30:00Z",
    team_h: 5,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 51,
    code: 2561945,
    event: 6,
    finished: false,
    kickoff_time: "2025-09-27T14:00:00Z",
    team_h: 2,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 53,
    code: 2561947,
    event: 6,
    finished: false,
    kickoff_time: "2025-09-27T14:00:00Z",
    team_h: 7,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 54,
    code: 2561948,
    event: 6,
    finished: false,
    kickoff_time: "2025-09-27T14:00:00Z",
    team_h: 8,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 56,
    code: 2561950,
    event: 6,
    finished: false,
    kickoff_time: "2025-09-27T14:00:00Z",
    team_h: 11,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 57,
    code: 2561951,
    event: 6,
    finished: false,
    kickoff_time: "2025-09-27T14:00:00Z",
    team_h: 13,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 59,
    code: 2561953,
    event: 6,
    finished: false,
    kickoff_time: "2025-09-27T16:30:00Z",
    team_h: 16,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 3
  },
  {
    id: 60,
    code: 2561954,
    event: 6,
    finished: false,
    kickoff_time: "2025-09-28T13:00:00Z",
    team_h: 18,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 58,
    code: 2561952,
    event: 6,
    finished: false,
    kickoff_time: "2025-09-28T15:30:00Z",
    team_h: 15,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 4
  },
  {
    id: 55,
    code: 2561949,
    event: 6,
    finished: false,
    kickoff_time: "2025-09-29T19:00:00Z",
    team_h: 9,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 61,
    code: 2561956,
    event: 7,
    finished: false,
    kickoff_time: "2025-10-04T14:00:00Z",
    team_h: 1,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 62,
    code: 2561957,
    event: 7,
    finished: false,
    kickoff_time: "2025-10-04T14:00:00Z",
    team_h: 2,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 63,
    code: 2561955,
    event: 7,
    finished: false,
    kickoff_time: "2025-10-04T14:00:00Z",
    team_h: 4,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 64,
    code: 2561958,
    event: 7,
    finished: false,
    kickoff_time: "2025-10-04T14:00:00Z",
    team_h: 5,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 65,
    code: 2561959,
    event: 7,
    finished: false,
    kickoff_time: "2025-10-04T14:00:00Z",
    team_h: 7,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 4
  },
  {
    id: 66,
    code: 2561960,
    event: 7,
    finished: false,
    kickoff_time: "2025-10-04T14:00:00Z",
    team_h: 9,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 67,
    code: 2561961,
    event: 7,
    finished: false,
    kickoff_time: "2025-10-04T14:00:00Z",
    team_h: 11,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 68,
    code: 2561962,
    event: 7,
    finished: false,
    kickoff_time: "2025-10-04T14:00:00Z",
    team_h: 14,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 3
  },
  {
    id: 69,
    code: 2561963,
    event: 7,
    finished: false,
    kickoff_time: "2025-10-04T14:00:00Z",
    team_h: 15,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 70,
    code: 2561964,
    event: 7,
    finished: false,
    kickoff_time: "2025-10-04T14:00:00Z",
    team_h: 20,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 71,
    code: 2561965,
    event: 8,
    finished: false,
    kickoff_time: "2025-10-18T14:00:00Z",
    team_h: 6,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 72,
    code: 2561966,
    event: 8,
    finished: false,
    kickoff_time: "2025-10-18T14:00:00Z",
    team_h: 3,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 2
  },
  {
    id: 73,
    code: 2561967,
    event: 8,
    finished: false,
    kickoff_time: "2025-10-18T14:00:00Z",
    team_h: 8,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 74,
    code: 2561968,
    event: 8,
    finished: false,
    kickoff_time: "2025-10-18T14:00:00Z",
    team_h: 10,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 75,
    code: 2561969,
    event: 8,
    finished: false,
    kickoff_time: "2025-10-18T14:00:00Z",
    team_h: 12,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 76,
    code: 2561970,
    event: 8,
    finished: false,
    kickoff_time: "2025-10-18T14:00:00Z",
    team_h: 13,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 77,
    code: 2561971,
    event: 8,
    finished: false,
    kickoff_time: "2025-10-18T14:00:00Z",
    team_h: 16,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 79,
    code: 2561973,
    event: 8,
    finished: false,
    kickoff_time: "2025-10-18T14:00:00Z",
    team_h: 18,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 78,
    code: 2561972,
    event: 8,
    finished: false,
    kickoff_time: "2025-10-18T14:00:00Z",
    team_h: 17,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 1
  },
  {
    id: 80,
    code: 2561974,
    event: 8,
    finished: false,
    kickoff_time: "2025-10-18T14:00:00Z",
    team_h: 19,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 81,
    code: 2561976,
    event: 9,
    finished: false,
    kickoff_time: "2025-10-25T14:00:00Z",
    team_h: 1,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 82,
    code: 2561977,
    event: 9,
    finished: false,
    kickoff_time: "2025-10-25T14:00:00Z",
    team_h: 2,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 4
  },
  {
    id: 83,
    code: 2561975,
    event: 9,
    finished: false,
    kickoff_time: "2025-10-25T14:00:00Z",
    team_h: 4,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 84,
    code: 2561978,
    event: 9,
    finished: false,
    kickoff_time: "2025-10-25T14:00:00Z",
    team_h: 5,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 85,
    code: 2561979,
    event: 9,
    finished: false,
    kickoff_time: "2025-10-25T14:00:00Z",
    team_h: 7,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 4
  },
  {
    id: 86,
    code: 2561980,
    event: 9,
    finished: false,
    kickoff_time: "2025-10-25T14:00:00Z",
    team_h: 9,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 87,
    code: 2561981,
    event: 9,
    finished: false,
    kickoff_time: "2025-10-25T14:00:00Z",
    team_h: 11,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 2
  },
  {
    id: 88,
    code: 2561982,
    event: 9,
    finished: false,
    kickoff_time: "2025-10-25T14:00:00Z",
    team_h: 14,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 89,
    code: 2561983,
    event: 9,
    finished: false,
    kickoff_time: "2025-10-25T14:00:00Z",
    team_h: 15,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 90,
    code: 2561984,
    event: 9,
    finished: false,
    kickoff_time: "2025-10-25T14:00:00Z",
    team_h: 20,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 91,
    code: 2561985,
    event: 10,
    finished: false,
    kickoff_time: "2025-11-01T15:00:00Z",
    team_h: 6,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 92,
    code: 2561986,
    event: 10,
    finished: false,
    kickoff_time: "2025-11-01T15:00:00Z",
    team_h: 3,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 2
  },
  {
    id: 93,
    code: 2561987,
    event: 10,
    finished: false,
    kickoff_time: "2025-11-01T15:00:00Z",
    team_h: 8,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 94,
    code: 2561988,
    event: 10,
    finished: false,
    kickoff_time: "2025-11-01T15:00:00Z",
    team_h: 10,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 95,
    code: 2561989,
    event: 10,
    finished: false,
    kickoff_time: "2025-11-01T15:00:00Z",
    team_h: 12,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 96,
    code: 2561990,
    event: 10,
    finished: false,
    kickoff_time: "2025-11-01T15:00:00Z",
    team_h: 13,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 97,
    code: 2561991,
    event: 10,
    finished: false,
    kickoff_time: "2025-11-01T15:00:00Z",
    team_h: 16,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 99,
    code: 2561993,
    event: 10,
    finished: false,
    kickoff_time: "2025-11-01T15:00:00Z",
    team_h: 18,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 98,
    code: 2561992,
    event: 10,
    finished: false,
    kickoff_time: "2025-11-01T15:00:00Z",
    team_h: 17,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 1
  },
  {
    id: 100,
    code: 2561994,
    event: 10,
    finished: false,
    kickoff_time: "2025-11-01T15:00:00Z",
    team_h: 19,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 101,
    code: 2561995,
    event: 11,
    finished: false,
    kickoff_time: "2025-11-08T15:00:00Z",
    team_h: 2,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 102,
    code: 2561996,
    event: 11,
    finished: false,
    kickoff_time: "2025-11-08T15:00:00Z",
    team_h: 5,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 103,
    code: 2561997,
    event: 11,
    finished: false,
    kickoff_time: "2025-11-08T15:00:00Z",
    team_h: 7,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 104,
    code: 2561998,
    event: 11,
    finished: false,
    kickoff_time: "2025-11-08T15:00:00Z",
    team_h: 8,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 105,
    code: 2561999,
    event: 11,
    finished: false,
    kickoff_time: "2025-11-08T15:00:00Z",
    team_h: 9,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 106,
    code: 2562000,
    event: 11,
    finished: false,
    kickoff_time: "2025-11-08T15:00:00Z",
    team_h: 13,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 5
  },
  {
    id: 107,
    code: 2562001,
    event: 11,
    finished: false,
    kickoff_time: "2025-11-08T15:00:00Z",
    team_h: 16,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 109,
    code: 2562003,
    event: 11,
    finished: false,
    kickoff_time: "2025-11-08T15:00:00Z",
    team_h: 18,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 108,
    code: 2562002,
    event: 11,
    finished: false,
    kickoff_time: "2025-11-08T15:00:00Z",
    team_h: 17,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 1
  },
  {
    id: 110,
    code: 2562004,
    event: 11,
    finished: false,
    kickoff_time: "2025-11-08T15:00:00Z",
    team_h: 19,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 2
  },
  {
    id: 111,
    code: 2562006,
    event: 12,
    finished: false,
    kickoff_time: "2025-11-22T15:00:00Z",
    team_h: 1,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 112,
    code: 2562005,
    event: 12,
    finished: false,
    kickoff_time: "2025-11-22T15:00:00Z",
    team_h: 4,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 113,
    code: 2562007,
    event: 12,
    finished: false,
    kickoff_time: "2025-11-22T15:00:00Z",
    team_h: 6,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 114,
    code: 2562008,
    event: 12,
    finished: false,
    kickoff_time: "2025-11-22T15:00:00Z",
    team_h: 3,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 115,
    code: 2562009,
    event: 12,
    finished: false,
    kickoff_time: "2025-11-22T15:00:00Z",
    team_h: 10,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 3
  },
  {
    id: 116,
    code: 2562010,
    event: 12,
    finished: false,
    kickoff_time: "2025-11-22T15:00:00Z",
    team_h: 11,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 117,
    code: 2562011,
    event: 12,
    finished: false,
    kickoff_time: "2025-11-22T15:00:00Z",
    team_h: 12,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 118,
    code: 2562012,
    event: 12,
    finished: false,
    kickoff_time: "2025-11-22T15:00:00Z",
    team_h: 14,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 119,
    code: 2562013,
    event: 12,
    finished: false,
    kickoff_time: "2025-11-22T15:00:00Z",
    team_h: 15,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 4
  },
  {
    id: 120,
    code: 2562014,
    event: 12,
    finished: false,
    kickoff_time: "2025-11-22T15:00:00Z",
    team_h: 20,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 121,
    code: 2562015,
    event: 13,
    finished: false,
    kickoff_time: "2025-11-29T15:00:00Z",
    team_h: 2,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 122,
    code: 2562016,
    event: 13,
    finished: false,
    kickoff_time: "2025-11-29T15:00:00Z",
    team_h: 5,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 123,
    code: 2562017,
    event: 13,
    finished: false,
    kickoff_time: "2025-11-29T15:00:00Z",
    team_h: 7,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 4
  },
  {
    id: 124,
    code: 2562018,
    event: 13,
    finished: false,
    kickoff_time: "2025-11-29T15:00:00Z",
    team_h: 8,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 125,
    code: 2562019,
    event: 13,
    finished: false,
    kickoff_time: "2025-11-29T15:00:00Z",
    team_h: 9,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 126,
    code: 2562020,
    event: 13,
    finished: false,
    kickoff_time: "2025-11-29T15:00:00Z",
    team_h: 13,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 127,
    code: 2562021,
    event: 13,
    finished: false,
    kickoff_time: "2025-11-29T15:00:00Z",
    team_h: 16,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 129,
    code: 2562023,
    event: 13,
    finished: false,
    kickoff_time: "2025-11-29T15:00:00Z",
    team_h: 18,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 128,
    code: 2562022,
    event: 13,
    finished: false,
    kickoff_time: "2025-11-29T15:00:00Z",
    team_h: 17,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 1
  },
  {
    id: 130,
    code: 2562024,
    event: 13,
    finished: false,
    kickoff_time: "2025-11-29T15:00:00Z",
    team_h: 19,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 2
  },
  {
    id: 131,
    code: 2562026,
    event: 14,
    finished: false,
    kickoff_time: "2025-12-03T20:00:00Z",
    team_h: 1,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 132,
    code: 2562025,
    event: 14,
    finished: false,
    kickoff_time: "2025-12-03T20:00:00Z",
    team_h: 4,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 133,
    code: 2562027,
    event: 14,
    finished: false,
    kickoff_time: "2025-12-03T20:00:00Z",
    team_h: 6,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 134,
    code: 2562028,
    event: 14,
    finished: false,
    kickoff_time: "2025-12-03T20:00:00Z",
    team_h: 3,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 135,
    code: 2562029,
    event: 14,
    finished: false,
    kickoff_time: "2025-12-03T20:00:00Z",
    team_h: 10,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 136,
    code: 2562030,
    event: 14,
    finished: false,
    kickoff_time: "2025-12-03T20:00:00Z",
    team_h: 11,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 137,
    code: 2562031,
    event: 14,
    finished: false,
    kickoff_time: "2025-12-03T20:00:00Z",
    team_h: 12,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 5
  },
  {
    id: 138,
    code: 2562032,
    event: 14,
    finished: false,
    kickoff_time: "2025-12-03T20:00:00Z",
    team_h: 14,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 139,
    code: 2562033,
    event: 14,
    finished: false,
    kickoff_time: "2025-12-03T20:00:00Z",
    team_h: 15,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 140,
    code: 2562034,
    event: 14,
    finished: false,
    kickoff_time: "2025-12-03T20:00:00Z",
    team_h: 20,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 141,
    code: 2562036,
    event: 15,
    finished: false,
    kickoff_time: "2025-12-06T15:00:00Z",
    team_h: 2,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 4
  },
  {
    id: 142,
    code: 2562035,
    event: 15,
    finished: false,
    kickoff_time: "2025-12-06T15:00:00Z",
    team_h: 4,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 143,
    code: 2562037,
    event: 15,
    finished: false,
    kickoff_time: "2025-12-06T15:00:00Z",
    team_h: 6,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 144,
    code: 2562038,
    event: 15,
    finished: false,
    kickoff_time: "2025-12-06T15:00:00Z",
    team_h: 9,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 145,
    code: 2562039,
    event: 15,
    finished: false,
    kickoff_time: "2025-12-06T15:00:00Z",
    team_h: 10,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 146,
    code: 2562040,
    event: 15,
    finished: false,
    kickoff_time: "2025-12-06T15:00:00Z",
    team_h: 11,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 2
  },
  {
    id: 147,
    code: 2562041,
    event: 15,
    finished: false,
    kickoff_time: "2025-12-06T15:00:00Z",
    team_h: 13,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 5
  },
  {
    id: 148,
    code: 2562042,
    event: 15,
    finished: false,
    kickoff_time: "2025-12-06T15:00:00Z",
    team_h: 15,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 149,
    code: 2562043,
    event: 15,
    finished: false,
    kickoff_time: "2025-12-06T15:00:00Z",
    team_h: 18,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 150,
    code: 2562044,
    event: 15,
    finished: false,
    kickoff_time: "2025-12-06T15:00:00Z",
    team_h: 20,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 151,
    code: 2562045,
    event: 16,
    finished: false,
    kickoff_time: "2025-12-13T15:00:00Z",
    team_h: 1,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 152,
    code: 2562046,
    event: 16,
    finished: false,
    kickoff_time: "2025-12-13T15:00:00Z",
    team_h: 5,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 153,
    code: 2562047,
    event: 16,
    finished: false,
    kickoff_time: "2025-12-13T15:00:00Z",
    team_h: 3,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 154,
    code: 2562048,
    event: 16,
    finished: false,
    kickoff_time: "2025-12-13T15:00:00Z",
    team_h: 7,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 155,
    code: 2562049,
    event: 16,
    finished: false,
    kickoff_time: "2025-12-13T15:00:00Z",
    team_h: 8,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 156,
    code: 2562050,
    event: 16,
    finished: false,
    kickoff_time: "2025-12-13T15:00:00Z",
    team_h: 12,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 157,
    code: 2562051,
    event: 16,
    finished: false,
    kickoff_time: "2025-12-13T15:00:00Z",
    team_h: 14,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 158,
    code: 2562052,
    event: 16,
    finished: false,
    kickoff_time: "2025-12-13T15:00:00Z",
    team_h: 16,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 159,
    code: 2562053,
    event: 16,
    finished: false,
    kickoff_time: "2025-12-13T15:00:00Z",
    team_h: 17,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 1
  },
  {
    id: 160,
    code: 2562054,
    event: 16,
    finished: false,
    kickoff_time: "2025-12-13T15:00:00Z",
    team_h: 19,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 161,
    code: 2562056,
    event: 17,
    finished: false,
    kickoff_time: "2025-12-20T15:00:00Z",
    team_h: 2,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 162,
    code: 2562055,
    event: 17,
    finished: false,
    kickoff_time: "2025-12-20T15:00:00Z",
    team_h: 4,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 163,
    code: 2562057,
    event: 17,
    finished: false,
    kickoff_time: "2025-12-20T15:00:00Z",
    team_h: 6,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 3
  },
  {
    id: 164,
    code: 2562058,
    event: 17,
    finished: false,
    kickoff_time: "2025-12-20T15:00:00Z",
    team_h: 9,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 165,
    code: 2562059,
    event: 17,
    finished: false,
    kickoff_time: "2025-12-20T15:00:00Z",
    team_h: 10,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 166,
    code: 2562060,
    event: 17,
    finished: false,
    kickoff_time: "2025-12-20T15:00:00Z",
    team_h: 11,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 167,
    code: 2562061,
    event: 17,
    finished: false,
    kickoff_time: "2025-12-20T15:00:00Z",
    team_h: 13,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 168,
    code: 2562062,
    event: 17,
    finished: false,
    kickoff_time: "2025-12-20T15:00:00Z",
    team_h: 15,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 169,
    code: 2562063,
    event: 17,
    finished: false,
    kickoff_time: "2025-12-20T15:00:00Z",
    team_h: 18,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 170,
    code: 2562064,
    event: 17,
    finished: false,
    kickoff_time: "2025-12-20T15:00:00Z",
    team_h: 20,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 171,
    code: 2562065,
    event: 18,
    finished: false,
    kickoff_time: "2025-12-27T15:00:00Z",
    team_h: 1,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 172,
    code: 2562066,
    event: 18,
    finished: false,
    kickoff_time: "2025-12-27T15:00:00Z",
    team_h: 5,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 173,
    code: 2562067,
    event: 18,
    finished: false,
    kickoff_time: "2025-12-27T15:00:00Z",
    team_h: 3,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 2
  },
  {
    id: 174,
    code: 2562068,
    event: 18,
    finished: false,
    kickoff_time: "2025-12-27T15:00:00Z",
    team_h: 7,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 175,
    code: 2562069,
    event: 18,
    finished: false,
    kickoff_time: "2025-12-27T15:00:00Z",
    team_h: 8,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 176,
    code: 2562070,
    event: 18,
    finished: false,
    kickoff_time: "2025-12-27T15:00:00Z",
    team_h: 12,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 177,
    code: 2562071,
    event: 18,
    finished: false,
    kickoff_time: "2025-12-27T15:00:00Z",
    team_h: 14,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 178,
    code: 2562072,
    event: 18,
    finished: false,
    kickoff_time: "2025-12-27T15:00:00Z",
    team_h: 16,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 179,
    code: 2562073,
    event: 18,
    finished: false,
    kickoff_time: "2025-12-27T15:00:00Z",
    team_h: 17,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 1
  },
  {
    id: 180,
    code: 2562074,
    event: 18,
    finished: false,
    kickoff_time: "2025-12-27T15:00:00Z",
    team_h: 19,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 181,
    code: 2562075,
    event: 19,
    finished: false,
    kickoff_time: "2025-12-30T20:00:00Z",
    team_h: 1,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 182,
    code: 2562076,
    event: 19,
    finished: false,
    kickoff_time: "2025-12-30T20:00:00Z",
    team_h: 5,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 183,
    code: 2562077,
    event: 19,
    finished: false,
    kickoff_time: "2025-12-30T20:00:00Z",
    team_h: 3,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 184,
    code: 2562078,
    event: 19,
    finished: false,
    kickoff_time: "2025-12-30T20:00:00Z",
    team_h: 7,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 185,
    code: 2562079,
    event: 19,
    finished: false,
    kickoff_time: "2025-12-30T20:00:00Z",
    team_h: 8,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 186,
    code: 2562080,
    event: 19,
    finished: false,
    kickoff_time: "2025-12-30T20:00:00Z",
    team_h: 12,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 187,
    code: 2562081,
    event: 19,
    finished: false,
    kickoff_time: "2025-12-30T20:00:00Z",
    team_h: 14,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 188,
    code: 2562082,
    event: 19,
    finished: false,
    kickoff_time: "2025-12-30T20:00:00Z",
    team_h: 16,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 189,
    code: 2562083,
    event: 19,
    finished: false,
    kickoff_time: "2025-12-30T20:00:00Z",
    team_h: 17,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 1
  },
  {
    id: 190,
    code: 2562084,
    event: 19,
    finished: false,
    kickoff_time: "2025-12-30T20:00:00Z",
    team_h: 19,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 191,
    code: 2562086,
    event: 20,
    finished: false,
    kickoff_time: "2026-01-03T15:00:00Z",
    team_h: 2,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 192,
    code: 2562085,
    event: 20,
    finished: false,
    kickoff_time: "2026-01-03T15:00:00Z",
    team_h: 4,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 193,
    code: 2562087,
    event: 20,
    finished: false,
    kickoff_time: "2026-01-03T15:00:00Z",
    team_h: 6,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 194,
    code: 2562088,
    event: 20,
    finished: false,
    kickoff_time: "2026-01-03T15:00:00Z",
    team_h: 9,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 195,
    code: 2562089,
    event: 20,
    finished: false,
    kickoff_time: "2026-01-03T15:00:00Z",
    team_h: 10,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 196,
    code: 2562090,
    event: 20,
    finished: false,
    kickoff_time: "2026-01-03T15:00:00Z",
    team_h: 11,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 197,
    code: 2562091,
    event: 20,
    finished: false,
    kickoff_time: "2026-01-03T15:00:00Z",
    team_h: 13,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 198,
    code: 2562092,
    event: 20,
    finished: false,
    kickoff_time: "2026-01-03T15:00:00Z",
    team_h: 15,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 199,
    code: 2562093,
    event: 20,
    finished: false,
    kickoff_time: "2026-01-03T15:00:00Z",
    team_h: 18,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 3
  },
  {
    id: 200,
    code: 2562094,
    event: 20,
    finished: false,
    kickoff_time: "2026-01-03T15:00:00Z",
    team_h: 20,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 201,
    code: 2562096,
    event: 21,
    finished: false,
    kickoff_time: "2026-01-07T20:00:00Z",
    team_h: 1,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 5
  },
  {
    id: 202,
    code: 2562095,
    event: 21,
    finished: false,
    kickoff_time: "2026-01-07T20:00:00Z",
    team_h: 4,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 203,
    code: 2562097,
    event: 21,
    finished: false,
    kickoff_time: "2026-01-07T20:00:00Z",
    team_h: 5,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 3
  },
  {
    id: 204,
    code: 2562098,
    event: 21,
    finished: false,
    kickoff_time: "2026-01-07T20:00:00Z",
    team_h: 3,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 205,
    code: 2562099,
    event: 21,
    finished: false,
    kickoff_time: "2026-01-07T20:00:00Z",
    team_h: 8,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 206,
    code: 2562100,
    event: 21,
    finished: false,
    kickoff_time: "2026-01-07T20:00:00Z",
    team_h: 9,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 207,
    code: 2562101,
    event: 21,
    finished: false,
    kickoff_time: "2026-01-07T20:00:00Z",
    team_h: 10,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 208,
    code: 2562102,
    event: 21,
    finished: false,
    kickoff_time: "2026-01-07T20:00:00Z",
    team_h: 13,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 209,
    code: 2562103,
    event: 21,
    finished: false,
    kickoff_time: "2026-01-07T20:00:00Z",
    team_h: 15,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 210,
    code: 2562104,
    event: 21,
    finished: false,
    kickoff_time: "2026-01-07T20:00:00Z",
    team_h: 19,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 211,
    code: 2562105,
    event: 22,
    finished: false,
    kickoff_time: "2026-01-17T15:00:00Z",
    team_h: 2,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 212,
    code: 2562106,
    event: 22,
    finished: false,
    kickoff_time: "2026-01-17T15:00:00Z",
    team_h: 6,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 213,
    code: 2562107,
    event: 22,
    finished: false,
    kickoff_time: "2026-01-17T15:00:00Z",
    team_h: 7,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 214,
    code: 2562108,
    event: 22,
    finished: false,
    kickoff_time: "2026-01-17T15:00:00Z",
    team_h: 11,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 215,
    code: 2562109,
    event: 22,
    finished: false,
    kickoff_time: "2026-01-17T15:00:00Z",
    team_h: 12,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 216,
    code: 2562110,
    event: 22,
    finished: false,
    kickoff_time: "2026-01-17T15:00:00Z",
    team_h: 14,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 217,
    code: 2562111,
    event: 22,
    finished: false,
    kickoff_time: "2026-01-17T15:00:00Z",
    team_h: 16,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 219,
    code: 2562113,
    event: 22,
    finished: false,
    kickoff_time: "2026-01-17T15:00:00Z",
    team_h: 18,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 218,
    code: 2562112,
    event: 22,
    finished: false,
    kickoff_time: "2026-01-17T15:00:00Z",
    team_h: 17,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 1
  },
  {
    id: 220,
    code: 2562114,
    event: 22,
    finished: false,
    kickoff_time: "2026-01-17T15:00:00Z",
    team_h: 20,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 221,
    code: 2562116,
    event: 23,
    finished: false,
    kickoff_time: "2026-01-24T15:00:00Z",
    team_h: 1,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 222,
    code: 2562115,
    event: 23,
    finished: false,
    kickoff_time: "2026-01-24T15:00:00Z",
    team_h: 4,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 223,
    code: 2562117,
    event: 23,
    finished: false,
    kickoff_time: "2026-01-24T15:00:00Z",
    team_h: 5,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 224,
    code: 2562118,
    event: 23,
    finished: false,
    kickoff_time: "2026-01-24T15:00:00Z",
    team_h: 3,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 225,
    code: 2562119,
    event: 23,
    finished: false,
    kickoff_time: "2026-01-24T15:00:00Z",
    team_h: 8,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 226,
    code: 2562120,
    event: 23,
    finished: false,
    kickoff_time: "2026-01-24T15:00:00Z",
    team_h: 9,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 227,
    code: 2562121,
    event: 23,
    finished: false,
    kickoff_time: "2026-01-24T15:00:00Z",
    team_h: 10,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 228,
    code: 2562122,
    event: 23,
    finished: false,
    kickoff_time: "2026-01-24T15:00:00Z",
    team_h: 13,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 229,
    code: 2562123,
    event: 23,
    finished: false,
    kickoff_time: "2026-01-24T15:00:00Z",
    team_h: 15,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 230,
    code: 2562124,
    event: 23,
    finished: false,
    kickoff_time: "2026-01-24T15:00:00Z",
    team_h: 19,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 2
  },
  {
    id: 231,
    code: 2562125,
    event: 24,
    finished: false,
    kickoff_time: "2026-01-31T15:00:00Z",
    team_h: 2,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 232,
    code: 2562126,
    event: 24,
    finished: false,
    kickoff_time: "2026-01-31T15:00:00Z",
    team_h: 6,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 233,
    code: 2562127,
    event: 24,
    finished: false,
    kickoff_time: "2026-01-31T15:00:00Z",
    team_h: 7,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 234,
    code: 2562128,
    event: 24,
    finished: false,
    kickoff_time: "2026-01-31T15:00:00Z",
    team_h: 11,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 2
  },
  {
    id: 235,
    code: 2562129,
    event: 24,
    finished: false,
    kickoff_time: "2026-01-31T15:00:00Z",
    team_h: 12,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 236,
    code: 2562130,
    event: 24,
    finished: false,
    kickoff_time: "2026-01-31T15:00:00Z",
    team_h: 14,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 237,
    code: 2562131,
    event: 24,
    finished: false,
    kickoff_time: "2026-01-31T15:00:00Z",
    team_h: 16,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 239,
    code: 2562133,
    event: 24,
    finished: false,
    kickoff_time: "2026-01-31T15:00:00Z",
    team_h: 18,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 238,
    code: 2562132,
    event: 24,
    finished: false,
    kickoff_time: "2026-01-31T15:00:00Z",
    team_h: 17,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 1
  },
  {
    id: 240,
    code: 2562134,
    event: 24,
    finished: false,
    kickoff_time: "2026-01-31T15:00:00Z",
    team_h: 20,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 241,
    code: 2562136,
    event: 25,
    finished: false,
    kickoff_time: "2026-02-07T15:00:00Z",
    team_h: 1,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 5
  },
  {
    id: 242,
    code: 2562135,
    event: 25,
    finished: false,
    kickoff_time: "2026-02-07T15:00:00Z",
    team_h: 4,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 243,
    code: 2562137,
    event: 25,
    finished: false,
    kickoff_time: "2026-02-07T15:00:00Z",
    team_h: 6,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 244,
    code: 2562138,
    event: 25,
    finished: false,
    kickoff_time: "2026-02-07T15:00:00Z",
    team_h: 3,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 2
  },
  {
    id: 245,
    code: 2562139,
    event: 25,
    finished: false,
    kickoff_time: "2026-02-07T15:00:00Z",
    team_h: 10,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 246,
    code: 2562140,
    event: 25,
    finished: false,
    kickoff_time: "2026-02-07T15:00:00Z",
    team_h: 11,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 247,
    code: 2562141,
    event: 25,
    finished: false,
    kickoff_time: "2026-02-07T15:00:00Z",
    team_h: 12,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 5
  },
  {
    id: 248,
    code: 2562142,
    event: 25,
    finished: false,
    kickoff_time: "2026-02-07T15:00:00Z",
    team_h: 14,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 249,
    code: 2562143,
    event: 25,
    finished: false,
    kickoff_time: "2026-02-07T15:00:00Z",
    team_h: 15,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 250,
    code: 2562144,
    event: 25,
    finished: false,
    kickoff_time: "2026-02-07T15:00:00Z",
    team_h: 20,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 251,
    code: 2562145,
    event: 26,
    finished: false,
    kickoff_time: "2026-02-11T20:00:00Z",
    team_h: 2,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 252,
    code: 2562146,
    event: 26,
    finished: false,
    kickoff_time: "2026-02-11T20:00:00Z",
    team_h: 5,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 253,
    code: 2562147,
    event: 26,
    finished: false,
    kickoff_time: "2026-02-11T20:00:00Z",
    team_h: 7,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 254,
    code: 2562148,
    event: 26,
    finished: false,
    kickoff_time: "2026-02-11T20:00:00Z",
    team_h: 8,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 255,
    code: 2562149,
    event: 26,
    finished: false,
    kickoff_time: "2026-02-11T20:00:00Z",
    team_h: 9,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 256,
    code: 2562150,
    event: 26,
    finished: false,
    kickoff_time: "2026-02-11T20:00:00Z",
    team_h: 13,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 257,
    code: 2562151,
    event: 26,
    finished: false,
    kickoff_time: "2026-02-11T20:00:00Z",
    team_h: 16,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 259,
    code: 2562153,
    event: 26,
    finished: false,
    kickoff_time: "2026-02-11T20:00:00Z",
    team_h: 18,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 258,
    code: 2562152,
    event: 26,
    finished: false,
    kickoff_time: "2026-02-11T20:00:00Z",
    team_h: 17,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 1
  },
  {
    id: 260,
    code: 2562154,
    event: 26,
    finished: false,
    kickoff_time: "2026-02-11T20:00:00Z",
    team_h: 19,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 261,
    code: 2562155,
    event: 27,
    finished: false,
    kickoff_time: "2026-02-21T15:00:00Z",
    team_h: 2,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 262,
    code: 2562156,
    event: 27,
    finished: false,
    kickoff_time: "2026-02-21T15:00:00Z",
    team_h: 5,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 263,
    code: 2562157,
    event: 27,
    finished: false,
    kickoff_time: "2026-02-21T15:00:00Z",
    team_h: 7,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 264,
    code: 2562158,
    event: 27,
    finished: false,
    kickoff_time: "2026-02-21T15:00:00Z",
    team_h: 8,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 265,
    code: 2562159,
    event: 27,
    finished: false,
    kickoff_time: "2026-02-21T15:00:00Z",
    team_h: 9,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 266,
    code: 2562160,
    event: 27,
    finished: false,
    kickoff_time: "2026-02-21T15:00:00Z",
    team_h: 13,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 267,
    code: 2562161,
    event: 27,
    finished: false,
    kickoff_time: "2026-02-21T15:00:00Z",
    team_h: 16,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 269,
    code: 2562163,
    event: 27,
    finished: false,
    kickoff_time: "2026-02-21T15:00:00Z",
    team_h: 18,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 268,
    code: 2562162,
    event: 27,
    finished: false,
    kickoff_time: "2026-02-21T15:00:00Z",
    team_h: 17,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 1
  },
  {
    id: 270,
    code: 2562164,
    event: 27,
    finished: false,
    kickoff_time: "2026-02-21T15:00:00Z",
    team_h: 19,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 271,
    code: 2562166,
    event: 28,
    finished: false,
    kickoff_time: "2026-02-28T15:00:00Z",
    team_h: 1,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 272,
    code: 2562165,
    event: 28,
    finished: false,
    kickoff_time: "2026-02-28T15:00:00Z",
    team_h: 4,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 3
  },
  {
    id: 273,
    code: 2562167,
    event: 28,
    finished: false,
    kickoff_time: "2026-02-28T15:00:00Z",
    team_h: 6,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 274,
    code: 2562168,
    event: 28,
    finished: false,
    kickoff_time: "2026-02-28T15:00:00Z",
    team_h: 3,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 275,
    code: 2562169,
    event: 28,
    finished: false,
    kickoff_time: "2026-02-28T15:00:00Z",
    team_h: 10,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 276,
    code: 2562170,
    event: 28,
    finished: false,
    kickoff_time: "2026-02-28T15:00:00Z",
    team_h: 11,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 2
  },
  {
    id: 277,
    code: 2562171,
    event: 28,
    finished: false,
    kickoff_time: "2026-02-28T15:00:00Z",
    team_h: 12,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 278,
    code: 2562172,
    event: 28,
    finished: false,
    kickoff_time: "2026-02-28T15:00:00Z",
    team_h: 14,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 279,
    code: 2562173,
    event: 28,
    finished: false,
    kickoff_time: "2026-02-28T15:00:00Z",
    team_h: 15,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 280,
    code: 2562174,
    event: 28,
    finished: false,
    kickoff_time: "2026-02-28T15:00:00Z",
    team_h: 20,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 281,
    code: 2562176,
    event: 29,
    finished: false,
    kickoff_time: "2026-03-04T20:00:00Z",
    team_h: 2,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 282,
    code: 2562175,
    event: 29,
    finished: false,
    kickoff_time: "2026-03-04T20:00:00Z",
    team_h: 4,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 283,
    code: 2562177,
    event: 29,
    finished: false,
    kickoff_time: "2026-03-04T20:00:00Z",
    team_h: 6,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 284,
    code: 2562178,
    event: 29,
    finished: false,
    kickoff_time: "2026-03-04T20:00:00Z",
    team_h: 9,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 285,
    code: 2562179,
    event: 29,
    finished: false,
    kickoff_time: "2026-03-04T20:00:00Z",
    team_h: 10,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 286,
    code: 2562180,
    event: 29,
    finished: false,
    kickoff_time: "2026-03-04T20:00:00Z",
    team_h: 11,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 2
  },
  {
    id: 287,
    code: 2562181,
    event: 29,
    finished: false,
    kickoff_time: "2026-03-04T20:00:00Z",
    team_h: 13,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 288,
    code: 2562182,
    event: 29,
    finished: false,
    kickoff_time: "2026-03-04T20:00:00Z",
    team_h: 15,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 289,
    code: 2562183,
    event: 29,
    finished: false,
    kickoff_time: "2026-03-04T20:00:00Z",
    team_h: 18,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 290,
    code: 2562184,
    event: 29,
    finished: false,
    kickoff_time: "2026-03-04T20:00:00Z",
    team_h: 20,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 291,
    code: 2562185,
    event: 30,
    finished: false,
    kickoff_time: "2026-03-14T15:00:00Z",
    team_h: 1,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 292,
    code: 2562186,
    event: 30,
    finished: false,
    kickoff_time: "2026-03-14T15:00:00Z",
    team_h: 5,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 293,
    code: 2562187,
    event: 30,
    finished: false,
    kickoff_time: "2026-03-14T15:00:00Z",
    team_h: 3,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 294,
    code: 2562188,
    event: 30,
    finished: false,
    kickoff_time: "2026-03-14T15:00:00Z",
    team_h: 7,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 295,
    code: 2562189,
    event: 30,
    finished: false,
    kickoff_time: "2026-03-14T15:00:00Z",
    team_h: 8,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 296,
    code: 2562190,
    event: 30,
    finished: false,
    kickoff_time: "2026-03-14T15:00:00Z",
    team_h: 12,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 297,
    code: 2562191,
    event: 30,
    finished: false,
    kickoff_time: "2026-03-14T15:00:00Z",
    team_h: 14,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 298,
    code: 2562192,
    event: 30,
    finished: false,
    kickoff_time: "2026-03-14T15:00:00Z",
    team_h: 16,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 299,
    code: 2562193,
    event: 30,
    finished: false,
    kickoff_time: "2026-03-14T15:00:00Z",
    team_h: 17,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 1
  },
  {
    id: 300,
    code: 2562194,
    event: 30,
    finished: false,
    kickoff_time: "2026-03-14T15:00:00Z",
    team_h: 19,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 2
  },
  {
    id: 301,
    code: 2562196,
    event: 31,
    finished: false,
    kickoff_time: "2026-03-21T15:00:00Z",
    team_h: 2,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 302,
    code: 2562195,
    event: 31,
    finished: false,
    kickoff_time: "2026-03-21T15:00:00Z",
    team_h: 4,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 303,
    code: 2562197,
    event: 31,
    finished: false,
    kickoff_time: "2026-03-21T15:00:00Z",
    team_h: 6,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 304,
    code: 2562198,
    event: 31,
    finished: false,
    kickoff_time: "2026-03-21T15:00:00Z",
    team_h: 9,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 305,
    code: 2562199,
    event: 31,
    finished: false,
    kickoff_time: "2026-03-21T15:00:00Z",
    team_h: 10,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 306,
    code: 2562200,
    event: 31,
    finished: false,
    kickoff_time: "2026-03-21T15:00:00Z",
    team_h: 11,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 307,
    code: 2562201,
    event: 31,
    finished: false,
    kickoff_time: "2026-03-21T15:00:00Z",
    team_h: 13,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 308,
    code: 2562202,
    event: 31,
    finished: false,
    kickoff_time: "2026-03-21T15:00:00Z",
    team_h: 15,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 4
  },
  {
    id: 309,
    code: 2562203,
    event: 31,
    finished: false,
    kickoff_time: "2026-03-21T15:00:00Z",
    team_h: 18,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 310,
    code: 2562204,
    event: 31,
    finished: false,
    kickoff_time: "2026-03-21T15:00:00Z",
    team_h: 20,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 311,
    code: 2562205,
    event: 32,
    finished: false,
    kickoff_time: "2026-04-11T14:00:00Z",
    team_h: 1,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 312,
    code: 2562206,
    event: 32,
    finished: false,
    kickoff_time: "2026-04-11T14:00:00Z",
    team_h: 5,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 313,
    code: 2562207,
    event: 32,
    finished: false,
    kickoff_time: "2026-04-11T14:00:00Z",
    team_h: 3,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 314,
    code: 2562208,
    event: 32,
    finished: false,
    kickoff_time: "2026-04-11T14:00:00Z",
    team_h: 7,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 4
  },
  {
    id: 315,
    code: 2562209,
    event: 32,
    finished: false,
    kickoff_time: "2026-04-11T14:00:00Z",
    team_h: 8,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 316,
    code: 2562210,
    event: 32,
    finished: false,
    kickoff_time: "2026-04-11T14:00:00Z",
    team_h: 12,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 317,
    code: 2562211,
    event: 32,
    finished: false,
    kickoff_time: "2026-04-11T14:00:00Z",
    team_h: 14,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 318,
    code: 2562212,
    event: 32,
    finished: false,
    kickoff_time: "2026-04-11T14:00:00Z",
    team_h: 16,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 319,
    code: 2562213,
    event: 32,
    finished: false,
    kickoff_time: "2026-04-11T14:00:00Z",
    team_h: 17,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 1
  },
  {
    id: 320,
    code: 2562214,
    event: 32,
    finished: false,
    kickoff_time: "2026-04-11T14:00:00Z",
    team_h: 19,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 2
  },
  {
    id: 321,
    code: 2562215,
    event: 33,
    finished: false,
    kickoff_time: "2026-04-18T14:00:00Z",
    team_h: 2,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 4
  },
  {
    id: 322,
    code: 2562216,
    event: 33,
    finished: false,
    kickoff_time: "2026-04-18T14:00:00Z",
    team_h: 5,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 323,
    code: 2562217,
    event: 33,
    finished: false,
    kickoff_time: "2026-04-18T14:00:00Z",
    team_h: 7,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 324,
    code: 2562218,
    event: 33,
    finished: false,
    kickoff_time: "2026-04-18T14:00:00Z",
    team_h: 8,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 325,
    code: 2562219,
    event: 33,
    finished: false,
    kickoff_time: "2026-04-18T14:00:00Z",
    team_h: 9,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 326,
    code: 2562220,
    event: 33,
    finished: false,
    kickoff_time: "2026-04-18T14:00:00Z",
    team_h: 11,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 2
  },
  {
    id: 327,
    code: 2562221,
    event: 33,
    finished: false,
    kickoff_time: "2026-04-18T14:00:00Z",
    team_h: 13,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 5
  },
  {
    id: 328,
    code: 2562222,
    event: 33,
    finished: false,
    kickoff_time: "2026-04-18T14:00:00Z",
    team_h: 15,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 329,
    code: 2562223,
    event: 33,
    finished: false,
    kickoff_time: "2026-04-18T14:00:00Z",
    team_h: 16,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 330,
    code: 2562224,
    event: 33,
    finished: false,
    kickoff_time: "2026-04-18T14:00:00Z",
    team_h: 18,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 331,
    code: 2562226,
    event: 34,
    finished: false,
    kickoff_time: "2026-04-25T14:00:00Z",
    team_h: 1,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 332,
    code: 2562225,
    event: 34,
    finished: false,
    kickoff_time: "2026-04-25T14:00:00Z",
    team_h: 4,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 333,
    code: 2562227,
    event: 34,
    finished: false,
    kickoff_time: "2026-04-25T14:00:00Z",
    team_h: 6,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 334,
    code: 2562228,
    event: 34,
    finished: false,
    kickoff_time: "2026-04-25T14:00:00Z",
    team_h: 3,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 2
  },
  {
    id: 335,
    code: 2562229,
    event: 34,
    finished: false,
    kickoff_time: "2026-04-25T14:00:00Z",
    team_h: 10,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 336,
    code: 2562230,
    event: 34,
    finished: false,
    kickoff_time: "2026-04-25T14:00:00Z",
    team_h: 12,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 337,
    code: 2562231,
    event: 34,
    finished: false,
    kickoff_time: "2026-04-25T14:00:00Z",
    team_h: 14,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 338,
    code: 2562232,
    event: 34,
    finished: false,
    kickoff_time: "2026-04-25T14:00:00Z",
    team_h: 17,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 1
  },
  {
    id: 339,
    code: 2562233,
    event: 34,
    finished: false,
    kickoff_time: "2026-04-25T14:00:00Z",
    team_h: 19,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 2
  },
  {
    id: 340,
    code: 2562234,
    event: 34,
    finished: false,
    kickoff_time: "2026-04-25T14:00:00Z",
    team_h: 20,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 341,
    code: 2562236,
    event: 35,
    finished: false,
    kickoff_time: "2026-05-02T14:00:00Z",
    team_h: 1,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 342,
    code: 2562237,
    event: 35,
    finished: false,
    kickoff_time: "2026-05-02T14:00:00Z",
    team_h: 2,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 343,
    code: 2562235,
    event: 35,
    finished: false,
    kickoff_time: "2026-05-02T14:00:00Z",
    team_h: 4,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 344,
    code: 2562238,
    event: 35,
    finished: false,
    kickoff_time: "2026-05-02T14:00:00Z",
    team_h: 5,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 345,
    code: 2562239,
    event: 35,
    finished: false,
    kickoff_time: "2026-05-02T14:00:00Z",
    team_h: 7,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 346,
    code: 2562240,
    event: 35,
    finished: false,
    kickoff_time: "2026-05-02T14:00:00Z",
    team_h: 9,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 347,
    code: 2562241,
    event: 35,
    finished: false,
    kickoff_time: "2026-05-02T14:00:00Z",
    team_h: 11,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 2
  },
  {
    id: 348,
    code: 2562242,
    event: 35,
    finished: false,
    kickoff_time: "2026-05-02T14:00:00Z",
    team_h: 14,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 349,
    code: 2562243,
    event: 35,
    finished: false,
    kickoff_time: "2026-05-02T14:00:00Z",
    team_h: 15,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 350,
    code: 2562244,
    event: 35,
    finished: false,
    kickoff_time: "2026-05-02T14:00:00Z",
    team_h: 20,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 3
  },
  {
    id: 351,
    code: 2562245,
    event: 36,
    finished: false,
    kickoff_time: "2026-05-09T14:00:00Z",
    team_h: 6,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 352,
    code: 2562246,
    event: 36,
    finished: false,
    kickoff_time: "2026-05-09T14:00:00Z",
    team_h: 3,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 353,
    code: 2562247,
    event: 36,
    finished: false,
    kickoff_time: "2026-05-09T14:00:00Z",
    team_h: 8,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 354,
    code: 2562248,
    event: 36,
    finished: false,
    kickoff_time: "2026-05-09T14:00:00Z",
    team_h: 10,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 355,
    code: 2562249,
    event: 36,
    finished: false,
    kickoff_time: "2026-05-09T14:00:00Z",
    team_h: 12,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 356,
    code: 2562250,
    event: 36,
    finished: false,
    kickoff_time: "2026-05-09T14:00:00Z",
    team_h: 13,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 357,
    code: 2562251,
    event: 36,
    finished: false,
    kickoff_time: "2026-05-09T14:00:00Z",
    team_h: 16,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 359,
    code: 2562253,
    event: 36,
    finished: false,
    kickoff_time: "2026-05-09T14:00:00Z",
    team_h: 18,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 358,
    code: 2562252,
    event: 36,
    finished: false,
    kickoff_time: "2026-05-09T14:00:00Z",
    team_h: 17,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 1
  },
  {
    id: 360,
    code: 2562254,
    event: 36,
    finished: false,
    kickoff_time: "2026-05-09T14:00:00Z",
    team_h: 19,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 2
  },
  {
    id: 361,
    code: 2562256,
    event: 37,
    finished: false,
    kickoff_time: "2026-05-17T14:00:00Z",
    team_h: 1,
    team_a: 3,
    team_h_difficulty: 2,
    team_a_difficulty: 5
  },
  {
    id: 362,
    code: 2562257,
    event: 37,
    finished: false,
    kickoff_time: "2026-05-17T14:00:00Z",
    team_h: 2,
    team_a: 12,
    team_h_difficulty: 4,
    team_a_difficulty: 4
  },
  {
    id: 363,
    code: 2562255,
    event: 37,
    finished: false,
    kickoff_time: "2026-05-17T14:00:00Z",
    team_h: 4,
    team_a: 13,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 364,
    code: 2562258,
    event: 37,
    finished: false,
    kickoff_time: "2026-05-17T14:00:00Z",
    team_h: 5,
    team_a: 8,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 365,
    code: 2562259,
    event: 37,
    finished: false,
    kickoff_time: "2026-05-17T14:00:00Z",
    team_h: 7,
    team_a: 18,
    team_h_difficulty: 3,
    team_a_difficulty: 4
  },
  {
    id: 366,
    code: 2562260,
    event: 37,
    finished: false,
    kickoff_time: "2026-05-17T14:00:00Z",
    team_h: 9,
    team_a: 17,
    team_h_difficulty: 1,
    team_a_difficulty: 3
  },
  {
    id: 367,
    code: 2562261,
    event: 37,
    finished: false,
    kickoff_time: "2026-05-17T14:00:00Z",
    team_h: 11,
    team_a: 6,
    team_h_difficulty: 3,
    team_a_difficulty: 2
  },
  {
    id: 368,
    code: 2562262,
    event: 37,
    finished: false,
    kickoff_time: "2026-05-17T14:00:00Z",
    team_h: 14,
    team_a: 16,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 369,
    code: 2562263,
    event: 37,
    finished: false,
    kickoff_time: "2026-05-17T14:00:00Z",
    team_h: 15,
    team_a: 19,
    team_h_difficulty: 2,
    team_a_difficulty: 4
  },
  {
    id: 370,
    code: 2562264,
    event: 37,
    finished: false,
    kickoff_time: "2026-05-17T14:00:00Z",
    team_h: 20,
    team_a: 10,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 371,
    code: 2562265,
    event: 38,
    finished: false,
    kickoff_time: "2026-05-24T15:00:00Z",
    team_h: 6,
    team_a: 14,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 372,
    code: 2562266,
    event: 38,
    finished: false,
    kickoff_time: "2026-05-24T15:00:00Z",
    team_h: 3,
    team_a: 20,
    team_h_difficulty: 2,
    team_a_difficulty: 2
  },
  {
    id: 373,
    code: 2562267,
    event: 38,
    finished: false,
    kickoff_time: "2026-05-24T15:00:00Z",
    team_h: 8,
    team_a: 1,
    team_h_difficulty: 4,
    team_a_difficulty: 3
  },
  {
    id: 374,
    code: 2562268,
    event: 38,
    finished: false,
    kickoff_time: "2026-05-24T15:00:00Z",
    team_h: 10,
    team_a: 15,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 375,
    code: 2562269,
    event: 38,
    finished: false,
    kickoff_time: "2026-05-24T15:00:00Z",
    team_h: 12,
    team_a: 5,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 376,
    code: 2562270,
    event: 38,
    finished: false,
    kickoff_time: "2026-05-24T15:00:00Z",
    team_h: 13,
    team_a: 2,
    team_h_difficulty: 3,
    team_a_difficulty: 5
  },
  {
    id: 377,
    code: 2562271,
    event: 38,
    finished: false,
    kickoff_time: "2026-05-24T15:00:00Z",
    team_h: 16,
    team_a: 4,
    team_h_difficulty: 3,
    team_a_difficulty: 3
  },
  {
    id: 379,
    code: 2562273,
    event: 38,
    finished: false,
    kickoff_time: "2026-05-24T15:00:00Z",
    team_h: 18,
    team_a: 9,
    team_h_difficulty: 2,
    team_a_difficulty: 3
  },
  {
    id: 378,
    code: 2562272,
    event: 38,
    finished: false,
    kickoff_time: "2026-05-24T15:00:00Z",
    team_h: 17,
    team_a: 7,
    team_h_difficulty: 3,
    team_a_difficulty: 1
  },
  {
    id: 380,
    code: 2562274,
    event: 38,
    finished: false,
    kickoff_time: "2026-05-24T15:00:00Z",
    team_h: 19,
    team_a: 11,
    team_h_difficulty: 2,
    team_a_difficulty: 2
  }

];

/**
 * Offline FPL API Service
 * Provides the same interface as the regular API service but uses offline data
 */
export class OfflineFPLApiService {
    /**
     * Get all teams
     */
    async getTeams(): Promise<Team[]> {
        // Simulate network delay for realistic experience
        await new Promise(resolve => setTimeout(resolve, 100));
        return [...OFFLINE_TEAMS];
    }

    /**
     * Get all fixtures
     */
    async getFixtures(): Promise<Fixture[]> {
        // Simulate network delay for realistic experience
        await new Promise(resolve => setTimeout(resolve, 150));
        return [...OFFLINE_FIXTURES];
    }

    /**
     * Get all gameweeks
     */
    async getGameweeks(): Promise<Gameweek[]> {
        // Simulate network delay for realistic experience
        await new Promise(resolve => setTimeout(resolve, 100));
        return [...OFFLINE_GAMEWEEKS];
    }

    /**
     * Clear cache (no-op for offline service)
     */
    clearCache(): void {
        // No cache to clear in offline mode
    }

    /**
     * Get cache stats (returns empty stats for offline service)
     */
    getCacheStats(): { size: number; keys: string[]; hitRate: number; totalRequests: number; hits: number } {
        return {
            size: OFFLINE_TEAMS.length + OFFLINE_FIXTURES.length + OFFLINE_GAMEWEEKS.length,
            keys: ['teams', 'fixtures', 'gameweeks'],
            hitRate: 1, // 100% hit rate since it's all offline
            totalRequests: 0,
            hits: 0
        };
    }
}

// Export singleton instance
export const offlineFplApiService = new OfflineFPLApiService();

/**
 * Custom difficulty rules summary for reference
 */
export const CUSTOM_DIFFICULTY_RULES = {
    description: 'Custom difficulty ratings applied to specific teams',
    rules: [
        {
            team: 'Man City',
            condition: 'Away fixtures only',
            difficulty: 5,
            reason: 'Playing away to Man City is always the hardest'
        },
        {
            team: 'Arsenal', 
            condition: 'Away fixtures only',
            difficulty: 5,
            reason: 'Playing away to Arsenal is always the hardest'
        },
        {
            team: 'Sunderland',
            condition: 'Home and away fixtures',
            difficulty: 1,
            reason: 'All Sunderland fixtures are the easiest'
        }
    ],
    note: 'These custom ratings override the standard FPL difficulty ratings for strategic analysis'
} as const;