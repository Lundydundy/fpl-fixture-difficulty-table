import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.resolve(__dirname, '../src/data/offlineData.ts');
const API_BASE = 'https://fantasy.premierleague.com/api';

const HARDEST_HOME_FIXTURES = new Set(['Man City', 'Arsenal']);

async function fetchJson(endpoint) {
  const response = await fetch(`${API_BASE}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function mapTeam(rawTeam) {
  return {
    id: rawTeam.id,
    name: rawTeam.name,
    short_name: rawTeam.short_name,
    code: rawTeam.code,
    strength: rawTeam.strength,
    strength_overall_home: rawTeam.strength_overall_home,
    strength_overall_away: rawTeam.strength_overall_away,
    strength_attack_home: rawTeam.strength_attack_home,
    strength_attack_away: rawTeam.strength_attack_away,
    strength_defence_home: rawTeam.strength_defence_home,
    strength_defence_away: rawTeam.strength_defence_away
  };
}

function mapGameweek(rawEvent) {
  return {
    id: rawEvent.id,
    name: rawEvent.name,
    deadline_time: rawEvent.deadline_time,
    finished: rawEvent.finished,
    is_current: rawEvent.is_current,
    is_next: rawEvent.is_next
  };
}

function applyCustomDifficulty(fixture, teamsById) {
  const homeTeam = teamsById.get(fixture.team_h);

  if (homeTeam && HARDEST_HOME_FIXTURES.has(homeTeam.name)) {
    fixture.team_a_difficulty = 5;
  }
}

function mapFixture(rawFixture, teamsById) {
  const fixture = {
    id: rawFixture.id,
    code: rawFixture.code,
    event: rawFixture.event,
    finished: Boolean(rawFixture.finished),
    kickoff_time: rawFixture.kickoff_time,
    team_a: rawFixture.team_a,
    team_h: rawFixture.team_h,
    team_a_difficulty: rawFixture.team_a_difficulty,
    team_h_difficulty: rawFixture.team_h_difficulty
  };

  if (typeof rawFixture.team_a_score === 'number') {
    fixture.team_a_score = rawFixture.team_a_score;
  }

  if (typeof rawFixture.team_h_score === 'number') {
    fixture.team_h_score = rawFixture.team_h_score;
  }

  applyCustomDifficulty(fixture, teamsById);

  return fixture;
}

function formatExport(name, type, data) {
  return `export const ${name}: ${type} = ${JSON.stringify(data, null, 4)};`;
}

function buildFileContent(teams, fixtures, gameweeks) {
  const header = `import { Team, Fixture, Gameweek } from '../types';\n\n/**\n * Offline FPL Data - auto-generated on ${new Date().toISOString()}\n *\n * Data sourced from the official FPL API with custom difficulty rules applied:\n * - Man City home fixtures set away difficulty to 5\n * - Arsenal home fixtures set away difficulty to 5\n */\n\n`;

  const teamsExport = `${formatExport('OFFLINE_TEAMS', 'Team[]', teams)}\n\n`;
  const fixturesExport = `${formatExport('OFFLINE_FIXTURES', 'Fixture[]', fixtures)}\n\n`;
  const gameweeksExport = `${formatExport('OFFLINE_GAMEWEEKS', 'Gameweek[]', gameweeks)}\n\n`;

  const serviceClass = `export class OfflineFPLApiService {\n    async getTeams(): Promise<Team[]> {\n        await new Promise(resolve => setTimeout(resolve, 100));\n        return [...OFFLINE_TEAMS];\n    }\n\n    async getFixtures(): Promise<Fixture[]> {\n        await new Promise(resolve => setTimeout(resolve, 150));\n        return [...OFFLINE_FIXTURES];\n    }\n\n    async getGameweeks(): Promise<Gameweek[]> {\n        await new Promise(resolve => setTimeout(resolve, 100));\n        return [...OFFLINE_GAMEWEEKS];\n    }\n\n    clearCache(): void {\n        // No cache to clear in offline mode\n    }\n\n    getCacheStats(): { size: number; keys: string[]; hitRate: number; totalRequests: number; hits: number } {\n        return {\n            size: OFFLINE_TEAMS.length + OFFLINE_FIXTURES.length + OFFLINE_GAMEWEEKS.length,\n            keys: ['teams', 'fixtures', 'gameweeks'],\n            hitRate: 1,\n            totalRequests: 0,\n            hits: 0\n        };\n    }\n}\n\nexport const offlineFplApiService = new OfflineFPLApiService();\n\nexport const CUSTOM_DIFFICULTY_RULES = {\n    description: 'Custom difficulty ratings applied to specific teams',\n    rules: [\n        {\n            team: 'Man City',\n            condition: 'Home fixtures only',\n            difficulty: 5,\n            reason: 'Playing away to Man City is always the hardest'\n        },\n        {\n            team: 'Arsenal',\n            condition: 'Home fixtures only',\n            difficulty: 5,\n            reason: 'Playing away to Arsenal is always the hardest'\n        }\n    ],\n    note: 'These custom ratings override the standard FPL difficulty ratings for strategic analysis'\n} as const;\n`;

  return `${header}${teamsExport}${fixturesExport}${gameweeksExport}${serviceClass}`;
}

async function main() {
  console.log('Fetching latest FPL teams, fixtures, and gameweeks...');
  const [bootstrap, fixturesResponse] = await Promise.all([
    fetchJson('bootstrap-static/'),
    fetchJson('fixtures/')
  ]);

  const teams = bootstrap.teams.map(mapTeam).sort((a, b) => a.id - b.id);
  const teamsById = new Map(teams.map(team => [team.id, team]));

  const gameweeks = bootstrap.events
    .filter(event => typeof event.id === 'number')
    .map(mapGameweek)
    .sort((a, b) => a.id - b.id);

  const fixtures = fixturesResponse
    .filter(fixture => typeof fixture.event === 'number')
    .map(fixture => mapFixture(fixture, teamsById))
    .sort((a, b) => {
      if (a.event !== b.event) {
        return a.event - b.event;
      }
      if (a.kickoff_time && b.kickoff_time && a.kickoff_time !== b.kickoff_time) {
        return a.kickoff_time.localeCompare(b.kickoff_time);
      }
      return a.id - b.id;
    });

  const fileContent = buildFileContent(teams, fixtures, gameweeks);

  await writeFile(OUTPUT_PATH, `${fileContent}\n`);

  console.log(`Offline data updated successfully: ${OUTPUT_PATH}`);
  console.log(`Teams: ${teams.length}, Fixtures: ${fixtures.length}, Gameweeks: ${gameweeks.length}`);
}

main().catch(error => {
  console.error('Failed to update offline data:', error);
  process.exitCode = 1;
});