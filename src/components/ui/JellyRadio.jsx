import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function JellyRadio({
  items = [],
  defaultValue,
  value: controlledValue,
  onChange,
  chipColor = '#121215',
  activeColor = '#008fd2',
  textColor = '#71717a',
  activeTextColor = '#ffffff',
  size = 'sm',
  gap = 3,
  radius = 8,
  disabled = false,
  className = ''
}) {
  const [internalValue, setInternalValue] = useState(defaultValue || (items[0]?.value ?? items[0]));
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  const normalizedItems = items.map(item => {
    if (typeof item === 'string') return { value: item, label: item };
    return item;
  });

  const handleSelect = (val, idx) => {
    if (disabled) return;
    if (controlledValue === undefined) setInternalValue(val);
    onChange?.(val, idx);
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  }[size] || 'px-2.5 py-1 text-xs';

  return (
    <div
      style={{
        gap: `${gap}px`,
        backgroundColor: chipColor,
        borderRadius: `${radius + 2}px`
      }}
      className={`inline-flex items-center p-1 border border-zinc-800/80 select-none ${className}`}
    >
      {normalizedItems.map((item, idx) => {
        const isSelected = currentValue === item.value;
        const isDisabled = disabled || item.disabled;

        return (
          <button
            key={item.value}
            type="button"
            disabled={isDisabled}
            onClick={() => handleSelect(item.value, idx)}
            style={{ borderRadius: `${radius}px` }}
            className={`relative flex items-center justify-center gap-1.5 font-medium cursor-pointer transition-colors ${sizeClasses} ${
              isDisabled ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="shadcn-tab-indicator"
                style={{
                  backgroundColor: activeColor,
                  borderRadius: `${radius}px`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 32,
                  mass: 0.6
                }}
                className="absolute inset-0 z-0 shadow-sm"
              />
            )}

            <span
              style={{ color: isSelected ? activeTextColor : textColor }}
              className="relative z-10 flex items-center gap-1.5 transition-colors"
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default JellyRadio;