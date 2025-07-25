import React, { useState } from 'react';
import TeamSearchFilter from '../TeamSearchFilter';

/**
 * Demo component to showcase TeamSearchFilter functionality
 * This demonstrates the component in isolation with different states
 */
export default function TeamSearchFilterDemo() {
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('Arsenal');
  const [searchTerm3, setSearchTerm3] = useState('');

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>TeamSearchFilter Component Demo</h1>
      
      <div style={{ marginBottom: '3rem' }}>
        <h2>Basic Usage</h2>
        <p>Default search filter with empty initial state:</p>
        <TeamSearchFilter
          searchTerm={searchTerm1}
          onSearchChange={setSearchTerm1}
        />
        <p><strong>Current search term:</strong> "{searchTerm1}"</p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2>Pre-filled Search</h2>
        <p>Search filter with initial value and clear button visible:</p>
        <TeamSearchFilter
          searchTerm={searchTerm2}
          onSearchChange={setSearchTerm2}
        />
        <p><strong>Current search term:</strong> "{searchTerm2}"</p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2>Custom Placeholder</h2>
        <p>Search filter with custom placeholder text:</p>
        <TeamSearchFilter
          searchTerm={searchTerm3}
          onSearchChange={setSearchTerm3}
          placeholder="Find your favorite team..."
        />
        <p><strong>Current search term:</strong> "{searchTerm3}"</p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2>Usage Instructions</h2>
        <ul>
          <li>Type in the search box to filter teams</li>
          <li>Search works with both full team names and abbreviations</li>
          <li>Search is case-insensitive and supports partial matching</li>
          <li>Click the X button to clear the search</li>
          <li>Press Escape key to clear the search</li>
          <li>The search input is automatically focused when the component mounts</li>
        </ul>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2>Example Search Terms</h2>
        <p>Try these example searches to see how the filtering would work:</p>
        <ul>
          <li><strong>"Arsenal"</strong> - Exact team name match</li>
          <li><strong>"man"</strong> - Partial match (would find Manchester City, Manchester United)</li>
          <li><strong>"ARS"</strong> - Short name match</li>
          <li><strong>"united"</strong> - Case-insensitive partial match</li>
          <li><strong>"&"</strong> - Special character match (Brighton & Hove Albion)</li>
        </ul>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2>Accessibility Features</h2>
        <ul>
          <li>Proper label association with the input field</li>
          <li>ARIA attributes for screen readers</li>
          <li>Keyboard navigation support (Tab, Escape)</li>
          <li>Focus management (auto-focus on mount, focus after clear)</li>
          <li>High contrast mode support</li>
          <li>Reduced motion support for animations</li>
        </ul>
      </div>
    </div>
  );
}