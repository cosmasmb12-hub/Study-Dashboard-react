import React from 'react';
import { motion } from 'framer-motion';
import { useStudy } from '../../context/StudyContext';
import { X, Plus, Sparkles } from 'lucide-react';

export function AddWidgetModal({ onClose }) {
  const { widgets, toggleWidgetVisibility, sounds } = useStudy();
  const hiddenWidgets = widgets.filter(w => !w.visible);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-[#141417] border-2 border-zinc-700 shadow-[3px_3px_0px_0px_#000] rounded-3xl p-6 relative max-h-[85vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--color-accent)]" />
            <h3 className="text-base font-bold uppercase tracking-wider text-white">Add Widgets</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1e1e24] border-2 border-black flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer shadow-[1px_1px_0px_0px_#000]"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-4">
          Click <strong className="text-white">+ Add</strong> to place any widget back onto your dashboard grid.
        </p>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {hiddenWidgets.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              All widgets are currently placed on your dashboard!
            </div>
          ) : (
            hiddenWidgets.map(widget => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-3.5 bg-[#1a1a20] border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_#000]"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{widget.title || widget.id}</h4>
                  <span className="text-[0.68rem] text-zinc-500 font-mono">
                    Default size: {widget.col}×{widget.row}
                  </span>
                </div>
                <button
                  onClick={() => {
                    toggleWidgetVisibility(widget.id, true);
                    sounds.playSuccess();
                  }}
                  className="cartoon-btn-accent text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}