import React, { useState } from 'react';
import GameweekRangeInput from '../GameweekRangeInput';
import { GameweekRange } from '../../types';

/**
 * Demo component to test GameweekRangeInput functionality
 * This is not a test file but a demo for manual testing
 */
const GameweekRangeInputDemo: React.FC = () => {
  const [gameweekRange, setGameweekRange] = useState<GameweekRange>({ start: 1, end: 5 });

  const gameweekCount = gameweekRange.end - gameweekRange.start + 1;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>GameweekRangeInput Demo</h1>

      <GameweekRangeInput
        value={gameweekRange}
        min={1}
        max={38}
        onChange={setGameweekRange}
      />

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
        <h3>Current Selection:</h3>
        <p>Analyzing gameweeks <strong>{gameweekRange.start}</strong> to <strong>{gameweekRange.end}</strong></p>
        <p>Total: <strong>{gameweekCount}</strong> gameweek{gameweekCount === 1 ? '' : 's'}</p>
        
        <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          <p><strong>JSON Output:</strong></p>
          <pre style={{ backgroundColor: '#e5e7eb', padding: '0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>
            {JSON.stringify(gameweekRange, null, 2)}
          </pre>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        <p>Test the following features:</p>
        <ul>
          <li>Type numbers directly into the start and end fields</li>
          <li>Try entering invalid values (negative, too high, non-numbers)</li>
          <li>Try making start greater than end (should show error)</li>
          <li>Use Tab key to navigate between fields</li>
          <li>Click outside fields to see validation on blur</li>
          <li>Test with keyboard navigation and screen readers</li>
          <li>Try copy/paste operations</li>
          <li>Test on mobile devices (responsive design)</li>
        </ul>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>Validation Rules:</h4>
        <ul style={{ margin: 0, fontSize: '0.875rem', color: '#92400e' }}>
          <li>Values must be between 1 and 38</li>
          <li>Start gameweek must be ≤ end gameweek</li>
          <li>Only whole numbers are allowed</li>
          <li>Invalid inputs reset to last valid value on blur</li>
        </ul>
      </div>
    </div>
  );
};

export default GameweekRangeInputDemo;