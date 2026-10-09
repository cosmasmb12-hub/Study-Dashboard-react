import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export function CustomSelect({ options = [], value, onChange, placeholder = 'Select...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((o) => (o.value ?? o) === value);
  const selectedLabel = selectedOption ? (selectedOption.label ?? selectedOption.name ?? selectedOption) : placeholder;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-zinc-900/90 border border-white/10 hover:border-white/20 rounded-2xl px-3.5 py-2.5 text-xs text-white font-medium transition-colors cursor-pointer"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          size={14}
          className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 bg-[#121217] border border-white/15 rounded-2xl shadow-2xl p-1.5 overflow-hidden max-h-52 overflow-y-auto"
          >
            {options.map((opt) => {
              const val = opt.value ?? opt.name ?? opt;
              const label = opt.label ?? opt.name ?? opt;
              const isSelected = val === value;

              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onChange(val);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                    isSelected ? 'bg-[var(--color-accent)] text-white font-semibold' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="truncate">{label}</span>
                  {isSelected && <Check size={13} className="shrink-0 ml-2" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}