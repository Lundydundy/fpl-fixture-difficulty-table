import React, { useMemo } from 'react';
import { ProcessedFixture } from '../types';
import './FixtureCell.css';

export interface FixtureCellProps {
  fixture: ProcessedFixture;
}

/**
 * FixtureCell component displays individual fixture information with difficulty-based color coding
 * and home/away venue indicators for accessibility and visual clarity.
 * Optimized with useMemo for better performance.
 */
export const FixtureCell: React.FC<FixtureCellProps> = React.memo(({ fixture }) => {
  const { opponent, isHome, difficulty } = fixture;

  /**
   * Memoized calculations for better performance
   */
  const cellData = useMemo(() => {
    /**
     * Get difficulty class based on FPL difficulty rating (1-5)
     * Green: 1-2 (easy), Yellow: 3 (medium), Red: 4-5 (hard)
     */
    const getDifficultyClass = (difficultyRating: number): string => {
      if (difficultyRating <= 2) return 'difficulty-easy';
      if (difficultyRating === 3) return 'difficulty-medium';
      return 'difficulty-hard';
    };

    /**
     * Get venue indicator text for accessibility
     */
    const getVenueText = (isHomeFixture: boolean): string => {
      return isHomeFixture ? 'H' : 'A';
    };

    /**
     * Get full venue description for screen readers
     */
    const getVenueDescription = (isHomeFixture: boolean): string => {
      return isHomeFixture ? 'Home fixture' : 'Away fixture';
    };

    /**
     * Get difficulty description for screen readers
     */
    const getDifficultyDescription = (difficultyRating: number): string => {
      if (difficultyRating <= 2) return 'Easy fixture';
      if (difficultyRating === 3) return 'Medium difficulty fixture';
      return 'Hard fixture';
    };

    return {
      difficultyClass: getDifficultyClass(difficulty),
      venueText: getVenueText(isHome),
      venueDescription: getVenueDescription(isHome),
      difficultyDescription: getDifficultyDescription(difficulty)
    };
  }, [difficulty, isHome]);

  return (
    <div 
      className={`fixture-cell ${cellData.difficultyClass} ${isHome ? 'home-fixture' : 'away-fixture'}`}
      role="cell"
      aria-label={`${opponent.short_name} ${cellData.venueDescription}, ${cellData.difficultyDescription}, difficulty rating ${difficulty}`}
    >
      <div className="fixture-content">
        <span className="opponent-name" title={opponent.name}>
          {opponent.short_name}
        </span>
        <span 
          className={`venue-indicator ${isHome ? 'home' : 'away'}`}
          aria-label={cellData.venueDescription}
          title={cellData.venueDescription}
        >
          {cellData.venueText}
        </span>
      </div>
      <div className="difficulty-indicator" aria-hidden="true">
        {difficulty}
      </div>
    </div>
  );
});

FixtureCell.displayName = 'FixtureCell';

export default FixtureCell;