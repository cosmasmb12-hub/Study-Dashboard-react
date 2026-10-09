import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { Maximize2, Minimize2, Pin } from 'lucide-react';

export function StickyNoteWidget({ isFullscreen, onToggleFullscreen }) {
  const { stickyNote, setStickyNote, sounds } = useStudy();

  const themes = {
    yellow: { bg: 'bg-[#292209]/90 border-amber-500/30 text-amber-100', dot: 'bg-amber-400' },
    blue: { bg: 'bg-[#0a1f3d]/90 border-blue-500/30 text-blue-100', dot: 'bg-blue-400' },
    green: { bg: 'bg-[#092918]/90 border-emerald-500/30 text-emerald-100', dot: 'bg-emerald-400' },
    purple: { bg: 'bg-[#251033]/90 border-purple-500/30 text-purple-100', dot: 'bg-purple-400' },
  };

  const activeTheme = themes[stickyNote.color] || themes.yellow;

  return (
    <div className={`flex flex-col h-full justify-between transition-colors p-1 ${activeTheme.bg} rounded-[24px]`}>
      {/* Top Memo Header */}
      <div className="flex justify-between items-center px-1 pt-1 mb-2">
        <div className="flex items-center gap-1.5">
          <Pin size={13} className="text-zinc-400" />
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-zinc-400">Desk Memo</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Palette */}
          <div className="flex gap-1.5 bg-black/40 px-2 py-1 rounded-full border border-white/5">
            {Object.keys(themes).map((c) => (
              <span
                key={c}
                onClick={() => {
                  setStickyNote((prev) => ({ ...prev, color: c }));
                  sounds.playClick();
                }}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-transform ${themes[c].dot} ${
                  stickyNote.color === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Post-It'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Textarea Area */}
      <textarea
        value={stickyNote.text}
        onChange={(e) => setStickyNote((prev) => ({ ...prev, text: e.target.value }))}
        placeholder="Jot down quick homework, formulas, or reminders..."
        className={`w-full flex-1 bg-transparent border-none resize-none outline-none leading-relaxed px-2 py-1 text-xs font-medium placeholder:text-zinc-500/70 ${
          isFullscreen ? 'text-base p-4' : ''
        }`}
      />

      {/* Footer Info */}
      <div className="flex justify-between items-center px-2 pt-1 text-[0.68rem] text-zinc-400 font-mono">
        <span>Auto-saved</span>
        <span>{stickyNote.text.length} chars</span>
      </div>
    </div>
  );
}