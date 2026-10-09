import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { Flame, Check, Plus, PlusCircle, Download, Cloud, CloudCheck, RefreshCw } from 'lucide-react';

export function FloatingIsland({ onOpenStudyModal, onOpenAddWidget }) {
  const { currentStreak, isEditing, setIsEditing, importLegacyData, sounds, syncStatus } = useStudy();
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');

  return (
    <>
      <div className="fixed z-40 left-1/2 -translate-x-1/2 bottom-4 md:bottom-auto md:top-4 flex items-center gap-1.5 md:gap-2 bg-zinc-950/90 border border-white/10 backdrop-blur-2xl px-3.5 py-1.5 md:px-4 md:py-2 rounded-full shadow-2xl max-w-[94vw]">
        {/* SQA Aim & Streak */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/10 shrink-0">
          <span className="text-[0.68rem] md:text-xs text-zinc-400 font-medium">
            Aim: <strong className="text-white">AAABB</strong>
          </span>
          {currentStreak > 0 && (
            <span className="flex items-center gap-1 text-[0.65rem] md:text-[0.7rem] bg-[var(--color-accent-muted)] text-[var(--color-accent)] px-1.5 py-0.5 rounded-full font-mono font-bold">
              <Flame size={11} className="fill-[var(--color-accent)]" /> {currentStreak}d
            </span>
          )}
        </div>

        {/* Live Cloud Status Dot */}
        <div className="flex items-center pr-1 text-zinc-500" title={`Cloud Sync: ${syncStatus}`}>
          {syncStatus === 'synced' && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          {syncStatus === 'saving' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
          {syncStatus === 'offline' && <span className="w-2 h-2 rounded-full bg-zinc-600" />}
        </div>

        {/* Quick Log Session Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenStudyModal();
          }}
          className="flex items-center gap-1 text-[0.7rem] md:text-xs font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-2.5 md:px-3 py-1 md:py-1.5 rounded-full transition-colors cursor-pointer shrink-0"
        >
          <PlusCircle size={13} /> Log
        </button>

        {/* Add Widget Button */}
        {isEditing && (
          <button
            onClick={() => {
              sounds.playClick();
              onOpenAddWidget();
            }}
            className="flex items-center gap-1 text-[0.68rem] md:text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white px-2 py-1 md:py-1.5 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <Plus size={12} /> Add
          </button>
        )}

        {/* Edit Layout Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            setIsEditing(!isEditing);
          }}
          className={`flex items-center gap-1 text-[0.68rem] md:text-xs font-medium px-2.5 md:px-3 py-1 md:py-1.5 rounded-full border transition-colors cursor-pointer shrink-0 ${
            isEditing
              ? 'bg-white text-black border-white font-bold'
              : 'border-white/10 hover:border-white/20 text-zinc-300'
          }`}
        >
          {isEditing ? <><Check size={12} /> Done</> : 'Edit'}
        </button>

        {/* Manual Data Import */}
        <button
          onClick={() => setShowImport(true)}
          className="text-zinc-500 hover:text-zinc-300 p-1 rounded-full cursor-pointer transition-colors shrink-0"
          title="Manual Backup/Restore"
        >
          <Download size={12} />
        </button>
      </div>

      {showImport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/15 rounded-[28px] max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-2">Import / Export Data</h3>
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
              <button onClick={() => setShowImport(false)} className="text-xs text-zinc-400 hover:text-white px-3.5 py-2 rounded-xl border border-white/10">
                Cancel
              </button>
              <button
                onClick={() => { importLegacyData(importJson); setShowImport(false); }}
                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold px-4 py-2 rounded-xl"
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