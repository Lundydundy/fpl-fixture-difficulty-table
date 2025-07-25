import React from 'react';
import FixtureCell from '../FixtureCell';
import { ProcessedFixture, Team } from '../../types';

// Demo component to showcase FixtureCell functionality
export const FixtureCellDemo: React.FC = () => {
  // Mock teams for demonstration
  const arsenal: Team = {
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
  };

  const manchester: Team = {
    id: 2,
    name: 'Manchester City',
    short_name: 'MCI',
    code: 43,
    strength: 5,
    strength_overall_home: 1400,
    strength_overall_away: 1350,
    strength_attack_home: 1450,
    strength_attack_away: 1400,
    strength_defence_home: 1380,
    strength_defence_away: 1320,
  };

  const brighton: Team = {
    id: 3,
    name: 'Brighton & Hove Albion',
    short_name: 'BHA',
    code: 36,
    strength: 3,
    strength_overall_home: 1000,
    strength_overall_away: 950,
    strength_attack_home: 1050,
    strength_attack_away: 1000,
    strength_defence_home: 980,
    strength_defence_away: 920,
  };

  // Sample fixtures with different difficulty levels
  const easyHomeFixture: ProcessedFixture = {
    opponent: brighton,
    isHome: true,
    difficulty: 2,
    gameweek: 1,
    kickoffTime: '2024-08-17T14:00:00Z',
  };

  const mediumAwayFixture: ProcessedFixture = {
    opponent: arsenal,
    isHome: false,
    difficulty: 3,
    gameweek: 2,
    kickoffTime: '2024-08-24T16:30:00Z',
  };

  const hardHomeFixture: ProcessedFixture = {
    opponent: manchester,
    isHome: true,
    difficulty: 5,
    gameweek: 3,
    kickoffTime: '2024-08-31T17:30:00Z',
  };

  const hardAwayFixture: ProcessedFixture = {
    opponent: manchester,
    isHome: false,
    difficulty: 4,
    gameweek: 4,
    kickoffTime: '2024-09-07T14:00:00Z',
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>FixtureCell Component Demo</h2>
      <p>This demo shows the FixtureCell component with different difficulty levels and venue types:</p>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div>
          <h3>Easy Home Fixture (Difficulty 2)</h3>
          <FixtureCell fixture={easyHomeFixture} />
        </div>
        
        <div>
          <h3>Medium Away Fixture (Difficulty 3)</h3>
          <FixtureCell fixture={mediumAwayFixture} />
        </div>
        
        <div>
          <h3>Hard Home Fixture (Difficulty 5)</h3>
          <FixtureCell fixture={hardHomeFixture} />
        </div>
        
        <div>
          <h3>Hard Away Fixture (Difficulty 4)</h3>
          <FixtureCell fixture={hardAwayFixture} />
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Color Coding Legend</h3>
        <ul>
          <li><strong>Green (1-2):</strong> Easy fixtures</li>
          <li><strong>Yellow (3):</strong> Medium difficulty fixtures</li>
          <li><strong>Red (4-5):</strong> Hard fixtures</li>
        </ul>
        
        <h3>Venue Indicators</h3>
        <ul>
          <li><strong>H:</strong> Home fixture (left border indicator)</li>
          <li><strong>A:</strong> Away fixture (right border indicator)</li>
        </ul>
        
        <h3>Accessibility Features</h3>
        <ul>
          <li>ARIA labels provide complete fixture information for screen readers</li>
          <li>High contrast mode support</li>
          <li>Keyboard navigation support</li>
          <li>Proper semantic HTML structure</li>
        </ul>
      </div>
    </div>
  );
};

export default FixtureCellDemo;