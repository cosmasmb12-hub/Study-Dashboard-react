import React, { useState, useRef, useCallback } from 'react';

export function WakeSlider({
  defaultValue = 45,
  value: controlledValue,
  min = 10,
  max = 180,
  step = 5,
  bars = 32,
  height = 42,
  restHeight = 10,
  gap = 3,
  fillColor = '#008fd2',
  trackColor = '#27272a',
  sensitivity = 1,
  reach = 6,
  showValue = true,
  onChange,
  disabled = false,
  className = ''
}) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? defaultValue);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const containerRef = useRef(null);

  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  const getRatioFromValue = useCallback((val) => {
    return Math.min(1, Math.max(0, (val - min) / (max - min)));
  }, [min, max]);

  const getValueFromRatio = useCallback((ratio) => {
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    return Math.min(max, Math.max(min, stepped));
  }, [min, max, step]);

  const currentRatio = getRatioFromValue(currentValue);
  const activeBarIndex = Math.round(currentRatio * (bars - 1));

  const handlePointer = (clientX) => {
    if (disabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawRatio = (clientX - rect.left) / rect.width;
    const clampedRatio = Math.min(1, Math.max(0, rawRatio));
    const newVal = getValueFromRatio(clampedRatio);

    if (newVal !== currentValue) {
      if (controlledValue === undefined) setInternalValue(newVal);
      onChange?.(newVal);
    }

    const approxIndex = Math.round(clampedRatio * (bars - 1));
    setHoverIndex(approxIndex);
  };

  const handleMouseDown = (e) => {
    if (disabled) return;
    setIsInteracting(true);
    handlePointer(e.clientX);

    const onMove = (moveEvent) => handlePointer(moveEvent.clientX);
    const onUp = () => {
      setIsInteracting(false);
      setHoverIndex(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleTouchStart = (e) => {
    if (disabled) return;
    setIsInteracting(true);
    handlePointer(e.touches[0].clientX);

    const onMove = (moveEvent) => handlePointer(moveEvent.touches[0].clientX);
    const onEnd = () => {
      setIsInteracting(false);
      setHoverIndex(null);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);
  };

  const handleMouseMove = (e) => {
    if (disabled || isInteracting || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawRatio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHoverIndex(Math.round(rawRatio * (bars - 1)));
  };

  const handleMouseLeave = () => {
    if (!isInteracting) setHoverIndex(null);
  };

  return (
    <div className={`w-full select-none py-2 ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`}>
      {showValue && (
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400">Duration</span>
          <span className="text-lg font-semibold font-mono text-[var(--color-accent)]">
            {currentValue} <span className="text-xs font-normal text-zinc-400">mins</span>
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ height: `${height}px`, gap: `${gap}px` }}
        className="relative flex items-center justify-between w-full cursor-pointer touch-none"
      >
        {Array.from({ length: bars }).map((_, i) => {
          const isFilled = i <= activeBarIndex;
          const center = hoverIndex !== null ? hoverIndex : activeBarIndex;
          const dist = Math.abs(i - center);

          const wakeFactor = Math.exp(-Math.pow(dist, 2) / (2 * Math.pow(reach * sensitivity, 2)));
          const barHeight = isInteracting || hoverIndex !== null
            ? restHeight + (height - restHeight) * wakeFactor
            : restHeight;

          return (
            <div
              key={i}
              style={{
                height: `${barHeight}px`,
                backgroundColor: isFilled ? fillColor : trackColor,
                borderRadius: '9999px',
                transition: 'height 0.1s cubic-bezier(0.2, 0, 0, 1), background-color 0.15s ease'
              }}
              className="flex-1 min-w-[2px] pointer-events-none"
            />
          );
        })}
      </div>

      <div className="flex justify-between text-[0.68rem] font-medium font-mono text-zinc-500 mt-1 px-0.5">
        <span>{min}m</span>
        <span>{max}m</span>
      </div>
    </div>
  );
}

export default WakeSlider;