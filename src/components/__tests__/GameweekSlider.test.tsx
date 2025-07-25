import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GameweekSlider from '../GameweekSlider';
import { GameweekRange } from '../../types';

describe('GameweekSlider', () => {
  const defaultProps = {
    value: { start: 1, end: 5 } as GameweekRange,
    min: 1,
    max: 15,
    onChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with correct initial range values', () => {
      render(<GameweekSlider {...defaultProps} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      
      expect(startSlider).toHaveValue('1');
      expect(endSlider).toHaveValue('5');
    });

    it('displays the current range in the value display', () => {
      render(<GameweekSlider {...defaultProps} />);
      
      expect(screen.getByText('GW 1 - GW 5')).toBeInTheDocument();
      expect(screen.getByText('5 gameweeks')).toBeInTheDocument();
    });

    it('displays singular "gameweek" when range is single gameweek', () => {
      render(<GameweekSlider {...defaultProps} value={{ start: 3, end: 3 }} />);
      
      expect(screen.getByText('GW 3 - GW 3')).toBeInTheDocument();
      expect(screen.getByText('1 gameweek')).toBeInTheDocument();
    });

    it('displays min and max values as limits', () => {
      render(<GameweekSlider {...defaultProps} />);
      
      expect(screen.getByText('GW 1')).toBeInTheDocument();
      expect(screen.getByText('GW 15')).toBeInTheDocument();
    });

    it('shows range highlight between start and end', () => {
      render(<GameweekSlider {...defaultProps} value={{ start: 2, end: 8 }} />);
      
      const range = document.querySelector('.gameweek-slider__range');
      expect(range).toBeInTheDocument();
      // Range should start at (2-1)/(15-1) * 100 = 7.14% and have width of (8-2)/(15-1) * 100 = 42.86%
      expect(range).toHaveStyle('left: 7.142857142857142%');
      expect(range).toHaveStyle('width: 42.85714285714286%');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for start slider', () => {
      render(<GameweekSlider {...defaultProps} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      expect(startSlider).toHaveAttribute('aria-valuemin', '1');
      expect(startSlider).toHaveAttribute('aria-valuemax', '15'); // Full range, constrained by JS
      expect(startSlider).toHaveAttribute('aria-valuenow', '1');
      expect(startSlider).toHaveAttribute('aria-valuetext', 'Start: Gameweek 1');
    });

    it('has proper ARIA attributes for end slider', () => {
      render(<GameweekSlider {...defaultProps} />);
      
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      expect(endSlider).toHaveAttribute('aria-valuemin', '1'); // Min is constrained by start value
      expect(endSlider).toHaveAttribute('aria-valuemax', '15');
      expect(endSlider).toHaveAttribute('aria-valuenow', '5');
      expect(endSlider).toHaveAttribute('aria-valuetext', 'End: Gameweek 5');
    });

    it('updates ARIA attributes when range changes', () => {
      const { rerender } = render(<GameweekSlider {...defaultProps} />);
      
      rerender(<GameweekSlider {...defaultProps} value={{ start: 3, end: 8 }} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      
      expect(startSlider).toHaveAttribute('aria-valuemax', '15'); // Full range, constrained by JS
      expect(endSlider).toHaveAttribute('aria-valuemin', '1'); // Full range, constrained by JS
      expect(startSlider).toHaveAttribute('aria-valuenow', '3');
      expect(endSlider).toHaveAttribute('aria-valuenow', '8');
    });
  });

  describe('Start Slider Interactions', () => {
    it('calls onChange when start slider value changes', async () => {
      render(<GameweekSlider {...defaultProps} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      fireEvent.change(startSlider, { target: { value: '3' } });
      
      expect(defaultProps.onChange).toHaveBeenCalledWith({ start: 3, end: 5 });
    });

    it('prevents start from going beyond end due to JavaScript constraints', async () => {
      render(<GameweekSlider {...defaultProps} value={{ start: 1, end: 3 }} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      
      // The slider uses full range but constrains via JavaScript
      expect(startSlider).toHaveAttribute('max', '15');
      
      // Try to set it to 5, but it should be constrained to 3 (the current end value)
      fireEvent.change(startSlider, { target: { value: '5' } });
      
      // The component should call onChange with the constrained value
      expect(defaultProps.onChange).toHaveBeenCalledWith({ start: 3, end: 3 });
    });

    it('adds dragging class on start slider mouse down', () => {
      render(<GameweekSlider {...defaultProps} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      
      fireEvent.mouseDown(startSlider);
      expect(startSlider).toHaveClass('gameweek-slider__input--dragging');
      
      fireEvent.mouseUp(startSlider);
      expect(startSlider).not.toHaveClass('gameweek-slider__input--dragging');
    });
  });

  describe('End Slider Interactions', () => {
    it('calls onChange when end slider value changes', async () => {
      render(<GameweekSlider {...defaultProps} />);
      
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      fireEvent.change(endSlider, { target: { value: '8' } });
      
      expect(defaultProps.onChange).toHaveBeenCalledWith({ start: 1, end: 8 });
    });

    it('prevents end from going before start due to JavaScript constraints', async () => {
      render(<GameweekSlider {...defaultProps} value={{ start: 5, end: 8 }} />);
      
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      
      // The slider uses full range but constrains via JavaScript
      expect(endSlider).toHaveAttribute('min', '1');
      
      // Try to set it to 3, but it should be constrained to 5 (the current start value)
      fireEvent.change(endSlider, { target: { value: '3' } });
      
      // The component should call onChange with the constrained value
      expect(defaultProps.onChange).toHaveBeenCalledWith({ start: 5, end: 5 });
    });

    it('adds dragging class on end slider mouse down', () => {
      render(<GameweekSlider {...defaultProps} />);
      
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      
      fireEvent.mouseDown(endSlider);
      expect(endSlider).toHaveClass('gameweek-slider__input--dragging');
      
      fireEvent.mouseUp(endSlider);
      expect(endSlider).not.toHaveClass('gameweek-slider__input--dragging');
    });
  });

  describe('Keyboard Navigation - Start Slider', () => {
    it('increases start value on ArrowRight key', async () => {
      const user = userEvent.setup();
      render(<GameweekSlider {...defaultProps} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      startSlider.focus();
      
      await user.keyboard('{ArrowRight}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith({ start: 2, end: 5 });
    });

    it('decreases start value on ArrowLeft key', async () => {
      const user = userEvent.setup();
      render(<GameweekSlider {...defaultProps} value={{ start: 3, end: 5 }} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      startSlider.focus();
      
      await user.keyboard('{ArrowLeft}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith({ start: 2, end: 5 });
    });

    it('sets start to minimum on Home key', async () => {
      const user = userEvent.setup();
      render(<GameweekSlider {...defaultProps} value={{ start: 3, end: 5 }} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      startSlider.focus();
      
      await user.keyboard('{Home}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith({ start: 1, end: 5 });
    });

    it('sets start to end value on End key', async () => {
      const user = userEvent.setup();
      render(<GameweekSlider {...defaultProps} value={{ start: 1, end: 8 }} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      startSlider.focus();
      
      await user.keyboard('{End}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith({ start: 8, end: 8 });
    });

    it('respects end constraint when increasing start', async () => {
      const user = userEvent.setup();
      render(<GameweekSlider {...defaultProps} value={{ start: 5, end: 5 }} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      startSlider.focus();
      
      await user.keyboard('{ArrowRight}');
      
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation - End Slider', () => {
    it('increases end value on ArrowRight key', async () => {
      const user = userEvent.setup();
      render(<GameweekSlider {...defaultProps} />);
      
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      endSlider.focus();
      
      await user.keyboard('{ArrowRight}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith({ start: 1, end: 6 });
    });

    it('decreases end value on ArrowLeft key', async () => {
      const user = userEvent.setup();
      render(<GameweekSlider {...defaultProps} value={{ start: 1, end: 8 }} />);
      
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      endSlider.focus();
      
      await user.keyboard('{ArrowLeft}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith({ start: 1, end: 7 });
    });

    it('sets end to start value on Home key', async () => {
      const user = userEvent.setup();
      render(<GameweekSlider {...defaultProps} value={{ start: 3, end: 8 }} />);
      
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      endSlider.focus();
      
      await user.keyboard('{Home}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith({ start: 3, end: 3 });
    });

    it('sets end to maximum on End key', async () => {
      const user = userEvent.setup();
      render(<GameweekSlider {...defaultProps} />);
      
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      endSlider.focus();
      
      await user.keyboard('{End}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith({ start: 1, end: 15 });
    });

    it('respects start constraint when decreasing end', async () => {
      const user = userEvent.setup();
      render(<GameweekSlider {...defaultProps} value={{ start: 5, end: 5 }} />);
      
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      endSlider.focus();
      
      await user.keyboard('{ArrowLeft}');
      
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });
  });

  describe('Visual Feedback', () => {
    it('calculates correct range position and width', () => {
      render(<GameweekSlider {...defaultProps} value={{ start: 3, end: 9 }} />);
      
      const range = document.querySelector('.gameweek-slider__range');
      // Start: (3-1)/(15-1) * 100 = 14.29%
      // Width: (9-3)/(15-1) * 100 = 42.86%
      expect(range).toHaveStyle('left: 14.285714285714285%');
      expect(range).toHaveStyle('width: 42.857142857142854%');
    });

    it('shows zero width range when start equals end', () => {
      render(<GameweekSlider {...defaultProps} value={{ start: 5, end: 5 }} />);
      
      const range = document.querySelector('.gameweek-slider__range');
      expect(range).toHaveStyle('width: 0%');
    });

    it('shows full width range when spanning entire range', () => {
      render(<GameweekSlider {...defaultProps} value={{ start: 1, end: 15 }} />);
      
      const range = document.querySelector('.gameweek-slider__range');
      expect(range).toHaveStyle('left: 0%');
      expect(range).toHaveStyle('width: 100%');
    });
  });

  describe('Edge Cases', () => {
    it('handles single gameweek range (start equals end)', () => {
      render(<GameweekSlider {...defaultProps} value={{ start: 5, end: 5 }} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      
      expect(startSlider).toHaveValue('5');
      expect(endSlider).toHaveValue('5');
      expect(screen.getByText('1 gameweek')).toBeInTheDocument();
    });

    it('handles custom min/max values', () => {
      render(<GameweekSlider {...defaultProps} min={3} max={10} value={{ start: 4, end: 7 }} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      
      expect(startSlider).toHaveAttribute('aria-valuemin', '3');
      expect(endSlider).toHaveAttribute('aria-valuemax', '10');
      expect(screen.getByText('GW 3')).toBeInTheDocument();
      expect(screen.getByText('GW 10')).toBeInTheDocument();
    });

    it('handles prop changes correctly', () => {
      const { rerender } = render(<GameweekSlider {...defaultProps} value={{ start: 1, end: 5 }} />);
      
      // Change to a different valid range
      rerender(<GameweekSlider {...defaultProps} value={{ start: 3, end: 8 }} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      
      expect(startSlider).toHaveValue('3');
      expect(endSlider).toHaveValue('8');
      expect(screen.getByText('GW 3 - GW 8')).toBeInTheDocument();
      expect(screen.getByText('6 gameweeks')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not call onChange when constrained moves are attempted', async () => {
      const user = userEvent.setup();
      render(<GameweekSlider {...defaultProps} value={{ start: 1, end: 15 }} />);
      
      const startSlider = screen.getByLabelText(/Select start gameweek/);
      const endSlider = screen.getByLabelText(/Select end gameweek/);
      
      startSlider.focus();
      await user.keyboard('{ArrowLeft}'); // Try to go below min
      
      endSlider.focus();
      await user.keyboard('{ArrowRight}'); // Try to go above max
      
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    it('maintains callback reference stability', () => {
      const onChange = vi.fn();
      const { rerender } = render(<GameweekSlider {...defaultProps} onChange={onChange} />);
      
      rerender(<GameweekSlider {...defaultProps} onChange={onChange} value={{ start: 2, end: 6 }} />);
      
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});