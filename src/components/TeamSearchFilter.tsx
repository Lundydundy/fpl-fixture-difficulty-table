import React, { useCallback, useRef, useEffect } from 'react';
import { TeamSearchFilterProps } from '../types';
import './TeamSearchFilter.css';

const TeamSearchFilter: React.FC<TeamSearchFilterProps> = React.memo(({
  searchTerm,
  onSearchChange,
  placeholder = "Search teams..."
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onSearchChange(value);
  }, [onSearchChange]);

  const handleClearSearch = useCallback(() => {
    onSearchChange('');
    // Focus back to input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onSearchChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    // Clear search on Escape key
    if (event.key === 'Escape') {
      event.preventDefault();
      handleClearSearch();
    }
  }, [handleClearSearch]);

  // Focus input when component mounts (optional UX enhancement)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const hasSearchTerm = searchTerm.length > 0;

  return (
    <div className="team-search-filter">
      <label 
        htmlFor="team-search-input" 
        className="team-search-filter__label"
      >
        Search teams:
      </label>
      
      <div className="team-search-filter__input-container">
        <div className="team-search-filter__input-wrapper">
          {/* Search icon */}
          <svg 
            className="team-search-filter__search-icon"
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          
          <input
            id="team-search-input"
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="team-search-filter__input"
            aria-label="Search for teams by name"
            aria-describedby="team-search-help"
            autoComplete="off"
            spellCheck="false"
          />
          
          {/* Clear button - only show when there's text */}
          {hasSearchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="team-search-filter__clear-button"
              aria-label="Clear search"
              title="Clear search"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        
        {/* Help text */}
        <div 
          id="team-search-help" 
          className="team-search-filter__help-text"
        >
          Search by team name or abbreviation. Press Escape to clear.
        </div>
      </div>
    </div>
  );
});

TeamSearchFilter.displayName = 'TeamSearchFilter';

export default TeamSearchFilter;