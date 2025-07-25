import React, { useState } from 'react';
import './DifficultyLegend.css';

export interface DifficultyLegendProps {
  showLegend?: boolean;
  onToggle?: (show: boolean) => void;
}

/**
 * DifficultyLegend component displays the color coding explanation for fixture difficulty ratings.
 * Provides a 1-5 scale with corresponding colors and descriptions for accessibility.
 */
export const DifficultyLegend: React.FC<DifficultyLegendProps> = ({ 
  showLegend: controlledShow, 
  onToggle 
}) => {
  const [internalShow, setInternalShow] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const isVisible = controlledShow !== undefined ? controlledShow : internalShow;
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle(!isVisible);
    } else {
      setInternalShow(!internalShow);
    }
  };

  const legendItems = [
    {
      difficulty: 1,
      label: 'Very Easy',
      description: 'Easiest fixtures - favorable matchups',
      className: 'difficulty-easy'
    },
    {
      difficulty: 2,
      label: 'Easy',
      description: 'Easy fixtures - good opportunities',
      className: 'difficulty-easy'
    },
    {
      difficulty: 3,
      label: 'Medium',
      description: 'Average difficulty - neutral matchups',
      className: 'difficulty-medium'
    },
    {
      difficulty: 4,
      label: 'Hard',
      description: 'Difficult fixtures - challenging matchups',
      className: 'difficulty-hard'
    },
    {
      difficulty: 5,
      label: 'Very Hard',
      description: 'Hardest fixtures - avoid if possible',
      className: 'difficulty-hard'
    }
  ];

  return (
    <div className="difficulty-legend-container">
      <button
        className="legend-toggle-button"
        onClick={handleToggle}
        aria-expanded={isVisible}
        aria-controls="difficulty-legend-content"
        type="button"
      >
        <span className="toggle-icon" aria-hidden="true">
          {isVisible ? '▼' : '▶'}
        </span>
        <span className="toggle-text">
          Difficulty Legend {isVisible ? '(Hide)' : '(Show)'}
        </span>
      </button>
      
      {isVisible && (
        <div 
          id="difficulty-legend-content"
          className="legend-content"
          role="region"
          aria-label="Fixture difficulty color coding explanation"
        >
          <div className="legend-header">
            <h3 className="legend-title">Fixture Difficulty Scale</h3>
            <p className="legend-description">
              Colors indicate the difficulty of fixtures based on FPL official ratings (1 = easiest, 5 = hardest)
            </p>
          </div>
          
          <div className="legend-items" role="list">
            {legendItems.map((item) => (
              <div 
                key={item.difficulty}
                className="legend-item"
                role="listitem"
                data-testid={`legend-level-${item.difficulty}`}
              >
                <div 
                  className={`legend-color-sample ${item.className}`}
                  aria-hidden="true"
                  data-testid={`legend-color-${item.difficulty}`}
                >
                  {item.difficulty}
                </div>
                <div className="legend-item-content">
                  <span className="legend-item-label">
                    {item.difficulty} - {item.label}
                  </span>
                  <span className="legend-item-description">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="legend-footer">
            <p className="legend-note">
              <strong>Home (H)</strong> and <strong>Away (A)</strong> indicators show fixture venue.
              Home fixtures may be slightly easier due to home advantage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DifficultyLegend;