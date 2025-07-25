import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FixtureCell from '../FixtureCell';
import { ProcessedFixture, Team } from '../../types';

// Mock team data for testing
const mockTeam: Team = {
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

// Helper function to create mock fixture
const createMockFixture = (difficulty: number, isHome: boolean): ProcessedFixture => ({
  opponent: mockTeam,
  isHome,
  difficulty,
  gameweek: 1,
  kickoffTime: '2024-08-17T14:00:00Z',
});

describe('FixtureCell', () => {
  describe('Basic Rendering', () => {
    it('renders opponent name correctly', () => {
      const fixture = createMockFixture(3, true);
      render(<FixtureCell fixture={fixture} />);
      
      expect(screen.getByText('ARS')).toBeInTheDocument();
      expect(screen.getByTitle('Arsenal')).toBeInTheDocument();
    });

    it('displays difficulty rating', () => {
      const fixture = createMockFixture(4, true);
      render(<FixtureCell fixture={fixture} />);
      
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('has proper ARIA labels for accessibility', () => {
      const fixture = createMockFixture(2, true);
      render(<FixtureCell fixture={fixture} />);
      
      const cell = screen.getByRole('cell');
      expect(cell).toHaveAttribute('aria-label', 'ARS Home fixture, Easy fixture, difficulty rating 2');
    });
  });

  describe('Home/Away Venue Indicators', () => {
    it('displays "H" for home fixtures', () => {
      const fixture = createMockFixture(3, true);
      render(<FixtureCell fixture={fixture} />);
      
      const venueIndicator = screen.getByText('H');
      expect(venueIndicator).toBeInTheDocument();
      expect(venueIndicator).toHaveAttribute('aria-label', 'Home fixture');
      expect(venueIndicator).toHaveAttribute('title', 'Home fixture');
    });

    it('displays "A" for away fixtures', () => {
      const fixture = createMockFixture(3, false);
      render(<FixtureCell fixture={fixture} />);
      
      const venueIndicator = screen.getByText('A');
      expect(venueIndicator).toBeInTheDocument();
      expect(venueIndicator).toHaveAttribute('aria-label', 'Away fixture');
      expect(venueIndicator).toHaveAttribute('title', 'Away fixture');
    });

    it('applies correct CSS classes for home fixtures', () => {
      const fixture = createMockFixture(3, true);
      render(<FixtureCell fixture={fixture} />);
      
      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass('home-fixture');
      
      const venueIndicator = screen.getByText('H');
      expect(venueIndicator).toHaveClass('venue-indicator', 'home');
    });

    it('applies correct CSS classes for away fixtures', () => {
      const fixture = createMockFixture(3, false);
      render(<FixtureCell fixture={fixture} />);
      
      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass('away-fixture');
      
      const venueIndicator = screen.getByText('A');
      expect(venueIndicator).toHaveClass('venue-indicator', 'away');
    });
  });

  describe('Difficulty Color Coding', () => {
    describe('Easy fixtures (difficulty 1-2)', () => {
      it('applies easy difficulty class for difficulty 1', () => {
        const fixture = createMockFixture(1, true);
        render(<FixtureCell fixture={fixture} />);
        
        const cell = screen.getByRole('cell');
        expect(cell).toHaveClass('difficulty-easy');
        expect(cell).toHaveAttribute('aria-label', expect.stringContaining('Easy fixture'));
      });

      it('applies easy difficulty class for difficulty 2', () => {
        const fixture = createMockFixture(2, false);
        render(<FixtureCell fixture={fixture} />);
        
        const cell = screen.getByRole('cell');
        expect(cell).toHaveClass('difficulty-easy');
        expect(cell).toHaveAttribute('aria-label', expect.stringContaining('Easy fixture'));
      });
    });

    describe('Medium fixtures (difficulty 3)', () => {
      it('applies medium difficulty class for difficulty 3', () => {
        const fixture = createMockFixture(3, true);
        render(<FixtureCell fixture={fixture} />);
        
        const cell = screen.getByRole('cell');
        expect(cell).toHaveClass('difficulty-medium');
        expect(cell).toHaveAttribute('aria-label', expect.stringContaining('Medium difficulty fixture'));
      });
    });

    describe('Hard fixtures (difficulty 4-5)', () => {
      it('applies hard difficulty class for difficulty 4', () => {
        const fixture = createMockFixture(4, true);
        render(<FixtureCell fixture={fixture} />);
        
        const cell = screen.getByRole('cell');
        expect(cell).toHaveClass('difficulty-hard');
        expect(cell).toHaveAttribute('aria-label', expect.stringContaining('Hard fixture'));
      });

      it('applies hard difficulty class for difficulty 5', () => {
        const fixture = createMockFixture(5, false);
        render(<FixtureCell fixture={fixture} />);
        
        const cell = screen.getByRole('cell');
        expect(cell).toHaveClass('difficulty-hard');
        expect(cell).toHaveAttribute('aria-label', expect.stringContaining('Hard fixture'));
      });
    });
  });

  describe('Combined Classes', () => {
    it('applies both difficulty and venue classes correctly', () => {
      const fixture = createMockFixture(1, true);
      render(<FixtureCell fixture={fixture} />);
      
      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass('fixture-cell', 'difficulty-easy', 'home-fixture');
    });

    it('handles away hard fixtures correctly', () => {
      const fixture = createMockFixture(5, false);
      render(<FixtureCell fixture={fixture} />);
      
      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass('fixture-cell', 'difficulty-hard', 'away-fixture');
    });
  });

  describe('Accessibility Features', () => {
    it('has proper role attribute', () => {
      const fixture = createMockFixture(3, true);
      render(<FixtureCell fixture={fixture} />);
      
      expect(screen.getByRole('cell')).toBeInTheDocument();
    });

    it('has aria-hidden on difficulty indicator', () => {
      const fixture = createMockFixture(3, true);
      render(<FixtureCell fixture={fixture} />);
      
      const difficultyIndicator = screen.getByText('3');
      expect(difficultyIndicator.closest('.difficulty-indicator')).toHaveAttribute('aria-hidden', 'true');
    });

    it('provides comprehensive aria-label with all fixture information', () => {
      const fixture = createMockFixture(4, false);
      render(<FixtureCell fixture={fixture} />);
      
      const cell = screen.getByRole('cell');
      expect(cell).toHaveAttribute('aria-label', 'ARS Away fixture, Hard fixture, difficulty rating 4');
    });
  });

  describe('Edge Cases', () => {
    it('handles team with long name correctly', () => {
      const longNameTeam: Team = {
        ...mockTeam,
        name: 'Very Long Team Name That Might Overflow',
        short_name: 'VLTN',
      };
      
      const fixture: ProcessedFixture = {
        opponent: longNameTeam,
        isHome: true,
        difficulty: 3,
        gameweek: 1,
        kickoffTime: '2024-08-17T14:00:00Z',
      };
      
      render(<FixtureCell fixture={fixture} />);
      
      expect(screen.getByText('VLTN')).toBeInTheDocument();
      expect(screen.getByTitle('Very Long Team Name That Might Overflow')).toBeInTheDocument();
    });

    it('handles boundary difficulty values correctly', () => {
      // Test difficulty 2 (should be easy)
      const easyFixture = createMockFixture(2, true);
      const { rerender } = render(<FixtureCell fixture={easyFixture} />);
      expect(screen.getByRole('cell')).toHaveClass('difficulty-easy');
      
      // Test difficulty 3 (should be medium)
      const mediumFixture = createMockFixture(3, true);
      rerender(<FixtureCell fixture={mediumFixture} />);
      expect(screen.getByRole('cell')).toHaveClass('difficulty-medium');
      
      // Test difficulty 4 (should be hard)
      const hardFixture = createMockFixture(4, true);
      rerender(<FixtureCell fixture={hardFixture} />);
      expect(screen.getByRole('cell')).toHaveClass('difficulty-hard');
    });
  });

  describe('Component Structure', () => {
    it('has correct DOM structure', () => {
      const fixture = createMockFixture(3, true);
      render(<FixtureCell fixture={fixture} />);
      
      const cell = screen.getByRole('cell');
      expect(cell.querySelector('.fixture-content')).toBeInTheDocument();
      expect(cell.querySelector('.opponent-name')).toBeInTheDocument();
      expect(cell.querySelector('.venue-indicator')).toBeInTheDocument();
      expect(cell.querySelector('.difficulty-indicator')).toBeInTheDocument();
    });

    it('maintains proper element hierarchy', () => {
      const fixture = createMockFixture(2, false);
      render(<FixtureCell fixture={fixture} />);
      
      const cell = screen.getByRole('cell');
      const fixtureContent = cell.querySelector('.fixture-content');
      const difficultyIndicator = cell.querySelector('.difficulty-indicator');
      
      expect(fixtureContent).toBeInTheDocument();
      expect(difficultyIndicator).toBeInTheDocument();
      expect(fixtureContent?.querySelector('.opponent-name')).toBeInTheDocument();
      expect(fixtureContent?.querySelector('.venue-indicator')).toBeInTheDocument();
    });
  });
});