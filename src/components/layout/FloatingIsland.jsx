import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { Flame, Check, Plus, PlusCircle, Download, Cloud, RefreshCw } from 'lucide-react';

export function FloatingIsland({ onOpenStudyModal, onOpenAddWidget }) {
const { currentStreak, isEditing, setIsEditing, importLegacyData, sounds, syncStatus, testConnection } = useStudy();
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');

  return (
    <>
      {/* 
        MOBILE: Fixed strictly at bottom edge (bottom-0, h-14, zero vertical stretch)
        DESKTOP: Centered floating rounded pill at top-4
      */}
      <div className="fixed z-40 
        bottom-0 left-0 right-0 w-full h-14 rounded-none border-t border-white/10
        md:bottom-auto md:top-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:right-auto md:h-auto md:rounded-full md:border
        bg-zinc-950/95 md:bg-zinc-950/85 backdrop-blur-2xl px-4 py-2 flex items-center justify-between gap-2 shadow-2xl select-none"
      >
        {/* Left: Aim & Streak */}
        <div className="flex items-center gap-1.5 md:gap-2 pr-2 border-r border-white/10 shrink-0">
          <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">
            Aim: <strong className="text-white">AAABB</strong>
          </span>
          {currentStreak > 0 && (
            <span className="flex items-center gap-1 text-[0.68rem] bg-[var(--color-accent-muted)] text-[var(--color-accent)] px-2 py-0.5 rounded-full font-mono font-bold whitespace-nowrap">
              <Flame size={12} className="fill-[var(--color-accent)]" /> {currentStreak}d
            </span>
          )}
        </div>

        {/* Center / Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Cloud Sync Status Indicator */}
<button
  onClick={() => { sounds.playClick(); testConnection(); }}
  className="flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer text-zinc-400"
  title="Click to test cloud connection"
>
  {syncStatus === 'synced' && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
  {syncStatus === 'saving' && <RefreshCw size={12} className="animate-spin text-amber-400" />}
  {syncStatus === 'offline' && <span className="w-2 h-2 rounded-full bg-zinc-600" />}
</button>

          {/* Quick Log Session */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenStudyModal();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <PlusCircle size={14} /> Log
          </button>

          {/* Add Widget Button (in Edit Mode) */}
          {isEditing && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenAddWidget();
              }}
              className="flex items-center gap-1 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white px-2.5 py-1.5 rounded-full transition-colors cursor-pointer shrink-0"
            >
              <Plus size={13} /> Add
            </button>
          )}

          {/* Edit Grid Layout Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsEditing(!isEditing);
            }}
            className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors cursor-pointer shrink-0 ${
              isEditing
                ? 'bg-white text-black border-white font-bold'
                : 'border-white/10 hover:border-white/20 text-zinc-300'
            }`}
          >
            {isEditing ? <><Check size={13} /> Done</> : 'Edit'}
          </button>

          {/* Data Import/Export */}
          <button
            onClick={() => setShowImport(true)}
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded-full cursor-pointer transition-colors shrink-0"
            title="Import/Export Data"
          >
            <Download size={13} />
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/15 rounded-[28px] max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-2">Import Session Data</h3>
            <p className="text-xs text-zinc-400 mb-3">
              Paste the string copied using <code className="text-[var(--color-accent)] bg-black px-1.5 py-0.5 rounded border border-zinc-800">copy(JSON.stringify(localStorage))</code>:
            </p>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='Paste JSON here'
              className="w-full h-28 shadcn-input p-3 text-xs font-mono resize-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowImport(false)} className="text-xs text-zinc-400 hover:text-white px-3.5 py-2 rounded-xl border border-white/10">
                Cancel
              </button>
              <button
                onClick={() => { importLegacyData(importJson); setShowImport(false); }}
                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Restore Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}