import React, { useState } from 'react';
import GameweekSlider from '../GameweekSlider';
import { GameweekRange } from '../../types';

/**
 * Demo component to test GameweekSlider functionality
 * This is not a test file but a demo for manual testing
 */
const GameweekSliderDemo: React.FC = () => {
  const [gameweekRange, setGameweekRange] = useState<GameweekRange>({ start: 1, end: 5 });

  const gameweekCount = gameweekRange.end - gameweekRange.start + 1;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>GameweekSlider Demo</h1>

      <GameweekSlider
        value={gameweekRange}
        min={1}
        max={15}
        onChange={setGameweekRange}
      />

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
        <h3>Current Selection:</h3>
        <p>Analyzing gameweeks <strong>{gameweekRange.start}</strong> to <strong>{gameweekRange.end}</strong></p>
        <p>Total: <strong>{gameweekCount}</strong> gameweek{gameweekCount === 1 ? '' : 's'}</p>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        <p>Test the following features:</p>
        <ul>
          <li>Drag the start slider to change the beginning gameweek</li>
          <li>Drag the end slider to change the ending gameweek</li>
          <li>Use keyboard navigation on both sliders (Arrow keys, Home, End)</li>
          <li>Notice how sliders constrain each other (start can't go past end)</li>
          <li>Observe the range highlight between the two values</li>
          <li>Check accessibility with screen readers</li>
        </ul>
      </div>
    </div>
  );
};

export default GameweekSliderDemo;