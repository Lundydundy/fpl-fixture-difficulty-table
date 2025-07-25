import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Team } from '../types';
import './TeamSelector.css';

export interface TeamSelectorProps {
  teams: Team[];
  selectedTeams: number[];
  onSelectionChange: (selectedTeamIds: number[]) => void;
  placeholder?: string;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
  teams,
  selectedTeams,
  onSelectionChange,
  placeholder = "Select teams to display..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter teams based on search term
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.short_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleDropdown = useCallback(() => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleTeamToggle = useCallback((teamId: number) => {
    const newSelection = selectedTeams.includes(teamId)
      ? selectedTeams.filter(id => id !== teamId)
      : [...selectedTeams, teamId];
    
    onSelectionChange(newSelection);
  }, [selectedTeams, onSelectionChange]);

  const handleSelectAll = useCallback(() => {
    const allTeamIds = filteredTeams.map(team => team.id);
    const newSelection = [...new Set([...selectedTeams, ...allTeamIds])];
    onSelectionChange(newSelection);
  }, [filteredTeams, selectedTeams, onSelectionChange]);

  const handleDeselectAll = useCallback(() => {
    const filteredTeamIds = filteredTeams.map(team => team.id);
    const newSelection = selectedTeams.filter(id => !filteredTeamIds.includes(id));
    onSelectionChange(newSelection);
  }, [filteredTeams, selectedTeams, onSelectionChange]);

  const handleClearAll = useCallback(() => {
    onSelectionChange([]);
  }, [onSelectionChange]);

  const getSelectedTeamNames = () => {
    if (selectedTeams.length === 0) return 'All teams';
    if (selectedTeams.length === teams.length) return 'All teams';
    if (selectedTeams.length === 1) {
      const team = teams.find(t => t.id === selectedTeams[0]);
      return team ? team.name : '1 team';
    }
    return `${selectedTeams.length} teams selected`;
  };

  const isAllFilteredSelected = filteredTeams.length > 0 && 
    filteredTeams.every(team => selectedTeams.includes(team.id));

  return (
    <div className="team-selector" ref={dropdownRef}>
      <label className="team-selector__label">
        Team Selection:
      </label>
      
      <div className="team-selector__container">
        <button
          type="button"
          className={`team-selector__trigger ${isOpen ? 'open' : ''}`}
          onClick={handleToggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Select teams to display"
        >
          <span className="team-selector__value">
            {getSelectedTeamNames()}
          </span>
          <svg 
            className={`team-selector__arrow ${isOpen ? 'rotated' : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </button>

        {isOpen && (
          <div className="team-selector__dropdown" role="listbox" aria-multiselectable="true">
            <div className="team-selector__search">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search teams..."
                className="team-selector__search-input"
                aria-label="Search teams"
              />
            </div>

            <div className="team-selector__actions">
              <button
                type="button"
                onClick={handleSelectAll}
                disabled={isAllFilteredSelected}
                className="team-selector__action-btn"
              >
                Select All {searchTerm && `(${filteredTeams.length})`}
              </button>
              <button
                type="button"
                onClick={handleDeselectAll}
                disabled={!filteredTeams.some(team => selectedTeams.includes(team.id))}
                className="team-selector__action-btn"
              >
                Deselect All
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={selectedTeams.length === 0}
                className="team-selector__action-btn clear"
              >
                Clear All
              </button>
            </div>

            <div className="team-selector__options">
              {filteredTeams.length === 0 ? (
                <div className="team-selector__no-results">
                  No teams found matching "{searchTerm}"
                </div>
              ) : (
                filteredTeams.map((team) => {
                  const isSelected = selectedTeams.includes(team.id);
                  return (
                    <div
                      key={team.id}
                      className={`team-selector__option ${isSelected ? 'selected' : ''}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleTeamToggle(team.id)}
                    >
                      <div className="team-selector__checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleTeamToggle(team.id)}
                          aria-label={`${isSelected ? 'Deselect' : 'Select'} ${team.name}`}
                        />
                      </div>
                      <div className="team-selector__team-info">
                        <span className="team-selector__team-name">{team.name}</span>
                        <span className="team-selector__team-short">{team.short_name}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {selectedTeams.length > 0 && (
              <div className="team-selector__footer">
                <span className="team-selector__count">
                  {selectedTeams.length} of {teams.length} teams selected
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamSelector;