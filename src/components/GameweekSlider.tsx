import React, { useEffect, useRef, useMemo } from 'react';
import { GameweekSliderProps } from '../types';
import './GameweekSlider.css';

const GameweekSlider: React.FC<GameweekSliderProps> = ({
  value,
  min,
  max,
  onChange
}) => {
  const fromSliderRef = useRef<HTMLInputElement>(null);
  const toSliderRef = useRef<HTMLInputElement>(null);
  
  // Track the last onChange call to prevent infinite loops
  const lastChangeRef = useRef<{start: number, end: number} | null>(null);
  const isUpdatingRef = useRef(false);

  // Calculate gradient using React state instead of direct DOM manipulation
  const sliderGradient = useMemo(() => {
    const rangeDistance = max - min;
    const fromPosition = value.start - min;
    const toPosition = value.end - min;

    const gradient = `linear-gradient(
      to right,
      #C6C6C6 0%,
      #C6C6C6 ${(fromPosition / rangeDistance) * 100}%,
      #04AA6D ${(fromPosition / rangeDistance) * 100}%,
      #04AA6D ${(toPosition / rangeDistance) * 100}%, 
      #C6C6C6 ${(toPosition / rangeDistance) * 100}%, 
      #C6C6C6 100%)`;



    return gradient;
  }, [value.start, value.end, min, max]);

  // Dynamic z-index management - using actual values instead of DOM values
  const setToggleAccessible = (fromVal: number, toVal: number, currentTargetId: string) => {
    if (!fromSliderRef.current || !toSliderRef.current) return;

    if (fromVal <= toVal) {
      fromSliderRef.current.style.zIndex = '2';
      toSliderRef.current.style.zIndex = '1';
    } else {
      fromSliderRef.current.style.zIndex = '1';
      toSliderRef.current.style.zIndex = '2';
    }
  };

  // Handle from slider change - with infinite loop prevention
  const handleFromSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdatingRef.current) {
      return;
    }

    const fromValue = parseInt(event.target.value, 10);
    let toValue = value.end;

    // Check if this is the same change we just made
    const newChange = { start: fromValue, end: toValue };
    if (lastChangeRef.current && 
        lastChangeRef.current.start === newChange.start && 
        lastChangeRef.current.end === newChange.end) {
      return;
    }

    // Apply constraint logic - if from goes beyond to, move to
    if (fromValue > toValue) {
      toValue = fromValue;
      newChange.end = toValue;
    }

    // Prevent rapid-fire calls
    isUpdatingRef.current = true;
    lastChangeRef.current = newChange;

    // Update state - let useEffect handle z-index management
    onChange(newChange);

    // Reset the updating flag after a short delay
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  };

  // Handle to slider change - with infinite loop prevention
  const handleToSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdatingRef.current) {
      return;
    }

    // Use current React state for constraint logic
    let fromValue = value.start;
    const toValue = parseInt(event.target.value, 10);

    // Check if this is the same change we just made
    const newChange = { start: fromValue, end: toValue };
    if (lastChangeRef.current && 
        lastChangeRef.current.start === newChange.start && 
        lastChangeRef.current.end === newChange.end) {
      return;
    }

    // Apply constraint logic - if to goes below from, move from
    if (fromValue > toValue) {
      fromValue = toValue;
      newChange.start = fromValue;
    }

    // Prevent rapid-fire calls
    isUpdatingRef.current = true;
    lastChangeRef.current = newChange;

    // Update state - let useEffect handle z-index management
    onChange(newChange);

    // Reset the updating flag after a short delay
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  };

  // Initialize z-index on mount and update when values change
  useEffect(() => {
    if (fromSliderRef.current && toSliderRef.current) {
      // Initialize with proper z-index based on current values
      setToggleAccessible(value.start, value.end, 'fromSlider');
    }
  }, [value.start, value.end]);

  const gameweekCount = Math.abs(value.end - value.start) + 1;

  return (
    <div className="gameweek-slider">
      <label className="gameweek-slider__label">
        Select gameweek range:
      </label>

      <div className="gameweek-slider__container">
        <div className="gameweek-slider__sliders-control">
          <input
            ref={fromSliderRef}
            id="fromSlider"
            type="range"
            min={min}
            max={max}
            value={value.start}
            onChange={handleFromSliderChange}
            className="gameweek-slider__input gameweek-slider__input--from"
            style={{ background: sliderGradient }}
            aria-label={`Select start gameweek, current value: ${value.start}`}
          />
          <input
            ref={toSliderRef}
            id="toSlider"
            type="range"
            min={min}
            max={max}
            value={value.end}
            onChange={handleToSliderChange}
            className="gameweek-slider__input gameweek-slider__input--to"
            style={{ background: sliderGradient }}
            aria-label={`Select end gameweek, current value: ${value.end}`}
          />
        </div>

        <div className="gameweek-slider__form-control">
          <div className="gameweek-slider__form-control-container">
            <div className="gameweek-slider__form-control-container__time">
              GW {value.start}
            </div>
            <div className="gameweek-slider__form-control-container__time">
              GW {value.end}
            </div>
          </div>
        </div>

        <div className="gameweek-slider__value-display">
          <div className="gameweek-slider__range-values">
            <span className="gameweek-slider__range-label">GW {value.start} - GW {value.end}</span>
            <span className="gameweek-slider__count">
              {gameweekCount} gameweek{gameweekCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameweekSlider;