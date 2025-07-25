import React, { useState, useCallback, useEffect } from 'react';
import { GameweekSliderProps } from '../types';
import './GameweekRangeInput.css';

const GameweekRangeInput: React.FC<GameweekSliderProps> = React.memo(({
  value,
  min,
  max,
  onChange
}) => {
  const [startInput, setStartInput] = useState(value.start.toString());
  const [endInput, setEndInput] = useState(value.end.toString());
  const [errors, setErrors] = useState({ start: '', end: '' });

  // Sync local state with prop changes
  useEffect(() => {
    setStartInput(value.start.toString());
    setEndInput(value.end.toString());
  }, [value.start, value.end]);

  const validateAndUpdate = useCallback((newStart: string, newEnd: string) => {
    const startNum = parseInt(newStart, 10);
    const endNum = parseInt(newEnd, 10);
    const newErrors = { start: '', end: '' };

    // Validate start value
    if (isNaN(startNum)) {
      newErrors.start = 'Please enter a valid number';
    } else if (startNum < min) {
      newErrors.start = `Minimum gameweek is ${min}`;
    } else if (startNum > max) {
      newErrors.start = `Maximum gameweek is ${max}`;
    }

    // Validate end value
    if (isNaN(endNum)) {
      newErrors.end = 'Please enter a valid number';
    } else if (endNum < min) {
      newErrors.end = `Minimum gameweek is ${min}`;
    } else if (endNum > max) {
      newErrors.end = `Maximum gameweek is ${max}`;
    }

    // Validate range
    if (!isNaN(startNum) && !isNaN(endNum) && startNum > endNum) {
      newErrors.end = 'End gameweek must be greater than or equal to start gameweek';
    }

    setErrors(newErrors);

    // Update parent component if no errors
    if (!newErrors.start && !newErrors.end && !isNaN(startNum) && !isNaN(endNum)) {
      onChange({ start: startNum, end: endNum });
    }
  }, [min, max, onChange]);

  const handleStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setStartInput(newValue);
    validateAndUpdate(newValue, endInput);
  };

  const handleEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setEndInput(newValue);
    validateAndUpdate(startInput, newValue);
  };

  const handleStartBlur = () => {
    // Reset to valid value if input is invalid
    if (errors.start || isNaN(parseInt(startInput, 10))) {
      setStartInput(value.start.toString());
      setErrors(prev => ({ ...prev, start: '' }));
    }
  };

  const handleEndBlur = () => {
    // Reset to valid value if input is invalid
    if (errors.end || isNaN(parseInt(endInput, 10))) {
      setEndInput(value.end.toString());
      setErrors(prev => ({ ...prev, end: '' }));
    }
  };

  // Update local state when props change
  React.useEffect(() => {
    setStartInput(value.start.toString());
    setEndInput(value.end.toString());
    setErrors({ start: '', end: '' });
  }, [value.start, value.end]);

  const gameweekCount = Math.abs(value.end - value.start) + 1;

  return (
    <div className="gameweek-range-input">
      <label className="gameweek-range-input__label">
        Select gameweek range:
      </label>

      <div className="gameweek-range-input__container">
        <div className="gameweek-range-input__inputs">
          <div className="gameweek-range-input__field">
            <label htmlFor="start-gameweek" className="gameweek-range-input__field-label">
              Start GW
            </label>
            <input
              id="start-gameweek"
              type="number"
              min={min}
              max={max}
              value={startInput}
              onChange={handleStartChange}
              onBlur={handleStartBlur}
              className={`gameweek-range-input__input ${errors.start ? 'gameweek-range-input__input--error' : ''}`}
              aria-label={`Start gameweek, current value: ${value.start}`}
              aria-describedby={errors.start ? 'start-error' : undefined}
            />
            {errors.start && (
              <div id="start-error" className="gameweek-range-input__error">
                {errors.start}
              </div>
            )}
          </div>

          <div className="gameweek-range-input__separator">to</div>

          <div className="gameweek-range-input__field">
            <label htmlFor="end-gameweek" className="gameweek-range-input__field-label">
              End GW
            </label>
            <input
              id="end-gameweek"
              type="number"
              min={min}
              max={max}
              value={endInput}
              onChange={handleEndChange}
              onBlur={handleEndBlur}
              className={`gameweek-range-input__input ${errors.end ? 'gameweek-range-input__input--error' : ''}`}
              aria-label={`End gameweek, current value: ${value.end}`}
              aria-describedby={errors.end ? 'end-error' : undefined}
            />
            {errors.end && (
              <div id="end-error" className="gameweek-range-input__error">
                {errors.end}
              </div>
            )}
          </div>
        </div>

        <div className="gameweek-range-input__summary">
          <div className="gameweek-range-input__range-display">
            <span className="gameweek-range-input__range-label">
              GW {value.start} - GW {value.end}
            </span>
            <span className="gameweek-range-input__count">
              {gameweekCount} gameweek{gameweekCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

GameweekRangeInput.displayName = 'GameweekRangeInput';

export default GameweekRangeInput;