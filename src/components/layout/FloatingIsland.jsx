import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { Flame, Check, Plus, PlusCircle, Download, RefreshCw } from 'lucide-react';

export function FloatingIsland({ onOpenStudyModal, onOpenAddWidget }) {
  const { currentStreak, isEditing, setIsEditing, importLegacyData, sounds, syncStatus, testConnection } = useStudy();
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');

  return (
    <>
      {/* 
        IPHONE: Floats gracefully above the bottom home indicator (rounded-full capsule bar)
        DESKTOP: Floats centered at the top
      */}
      <div className="fixed z-40 left-1/2 -translate-x-1/2
        bottom-5 md:bottom-auto md:top-5
        w-[calc(100%-1.5rem)] max-w-md md:w-auto
        flex items-center justify-between gap-1.5 md:gap-2.5
        bg-zinc-950/80 backdrop-blur-2xl border border-white/10
        shadow-[0_12px_40px_-5px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.15)]
        px-3.5 py-2 md:px-4 md:py-2
        rounded-full select-none transition-all duration-300"
      >
        {/* Left: SQA Aim & Streak */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/10 shrink-0">
          <span className="text-[0.7rem] md:text-xs text-zinc-400 font-medium whitespace-nowrap">
            Aim: <strong className="text-white font-semibold">AAABB</strong>
          </span>
          {currentStreak > 0 && (
            <span className="flex items-center gap-1 text-[0.68rem] bg-[var(--color-accent-muted)] text-[var(--color-accent)] px-2 py-0.5 rounded-full font-mono font-bold whitespace-nowrap">
              <Flame size={11} className="fill-[var(--color-accent)]" /> {currentStreak}d
            </span>
          )}
        </div>

        {/* Center / Right: Live Sync Dot & Actions */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Cloud Sync Status Indicator */}
          <button
            type="button"
            onClick={() => { sounds.playClick(); testConnection(); }}
            className="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 flex items-center justify-center active:scale-90"
            title="Cloud Sync Status"
          >
            {syncStatus === 'synced' && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />}
            {syncStatus === 'saving' && <RefreshCw size={13} className="animate-spin text-amber-400" />}
            {syncStatus === 'offline' && <span className="w-2 h-2 rounded-full bg-zinc-600" />}
          </button>

          {/* Quick Log Session Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenStudyModal();
            }}
            className="flex items-center gap-1 text-xs font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-3.5 py-1.5 rounded-full transition-all cursor-pointer shrink-0 shadow-md active:scale-95"
          >
            <PlusCircle size={14} /> Log
          </button>

          {/* Add Widget (Edit Mode only) */}
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenAddWidget();
              }}
              className="flex items-center gap-1 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white px-2.5 py-1.5 rounded-full transition-all cursor-pointer shrink-0 active:scale-95"
            >
              <Plus size={13} /> Add
            </button>
          )}

          {/* Edit Layout Toggle */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsEditing(!isEditing);
            }}
            className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer shrink-0 active:scale-95 ${
              isEditing
                ? 'bg-white text-black border-white font-bold'
                : 'border-white/10 hover:border-white/20 text-zinc-300'
            }`}
          >
            {isEditing ? <><Check size={13} /> Done</> : 'Edit'}
          </button>

          {/* Manual Import/Export */}
          <button
            type="button"
            onClick={() => setShowImport(true)}
            className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-full cursor-pointer transition-colors active:scale-90 shrink-0"
            title="Import/Export Backup"
          >
            <Download size={13} />
          </button>
        </div>
      </div>

      {/* Manual Import/Export Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/15 rounded-[28px] max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-2">Import / Export Backup</h3>
            <p className="text-xs text-zinc-400 mb-3">
              Paste or copy your data JSON:
            </p>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='Paste JSON here'
              className="w-full h-28 shadcn-input p-3 text-xs font-mono resize-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImport(false)}
                className="text-xs text-zinc-400 hover:text-white px-3.5 py-2 rounded-xl border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { importLegacyData(importJson); setShowImport(false); }}
                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}