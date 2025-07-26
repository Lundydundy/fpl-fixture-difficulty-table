import React from 'react';
import { TeamNameDisplay } from '../types';
import './TeamNameToggle.css';

interface TeamNameToggleProps {
  value: TeamNameDisplay;
  onChange: (value: TeamNameDisplay) => void;
  className?: string;
}

/**
 * TeamNameToggle Component
 * 
 * Allows users to switch between full team names and abbreviations
 */
const TeamNameToggle: React.FC<TeamNameToggleProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const handleToggle = () => {
    onChange(value === 'full' ? 'short' : 'full');
  };

  return (
    <div className={`team-name-toggle ${className}`}>
      <label className="team-name-toggle__label">
        Team Names:
      </label>
      <button
        type="button"
        className={`team-name-toggle__button ${value}`}
        onClick={handleToggle}
        aria-label={`Switch to ${value === 'full' ? 'abbreviated' : 'full'} team names`}
        title={`Currently showing ${value === 'full' ? 'full' : 'abbreviated'} team names. Click to toggle.`}
      >
        <span className={`toggle-option ${value === 'full' ? 'active' : ''}`}>
          Full
        </span>
        <span className="toggle-separator">|</span>
        <span className={`toggle-option ${value === 'short' ? 'active' : ''}`}>
          Short
        </span>
      </button>
    </div>
  );
};

export default TeamNameToggle;