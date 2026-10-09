import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { JellyRadio } from '../ui/JellyRadio';
import { LayoutGrid, Brain, BookOpen, BarChart3, Check, Plus, Download, Flame, Sparkles } from 'lucide-react';

export function Header({ activeTab, onSelectTab, onOpenAddWidget }) {
  const { currentStreak, isEditing, setIsEditing, importLegacyData, sounds } = useStudy();
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');

  const desktopNavItems = [
    { value: 'home', label: 'Home', icon: <LayoutGrid size={13} /> },
    { value: 'recall', label: 'Active Recall', icon: <Brain size={13} /> },
    { value: 'exam', label: 'Exam / Past Paper', icon: <BookOpen size={13} /> },
    { value: 'stats', label: 'Stats', icon: <BarChart3 size={13} /> }
  ];

  return (
    <header className="border-b border-zinc-800/60 pb-4 mb-6 pt-1 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 px-1">
        {/* Left: Aim & Streak Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <h4 className="text-zinc-400 font-normal text-sm md:text-base flex items-center gap-2 tracking-tight">
              Current aim: <span className="text-zinc-100 font-semibold tracking-normal">AAABB</span>
            </h4>
          </div>
          {currentStreak > 0 && (
            <span className="flex items-center gap-1 text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-mono">
              <Flame size={12} className="text-[var(--color-accent)] fill-[var(--color-accent)]" />
              {currentStreak}d streak
            </span>
          )}
        </div>

        {/* Center: DESKTOP JELLY RADIO NAVBAR */}
        <div className="hidden md:flex items-center justify-center">
          <JellyRadio
            items={desktopNavItems}
            value={activeTab}
            onChange={(val) => {
              sounds.playClick();
              onSelectTab(val);
            }}
            activeColor="#008fd2"
            chipColor="#121215"
            textColor="#71717a"
            activeTextColor="#ffffff"
            size="sm"
            gap={4}
            radius={10}
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 h-8 px-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Import Data"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Import</span>
          </button>

          {isEditing && (
            <button
              onClick={() => { sounds.playClick(); onOpenAddWidget(); }}
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-medium h-8 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus size={14} /> Add Widget
            </button>
          )}

          <button
            onClick={() => { sounds.playClick(); setIsEditing(!isEditing); }}
            className={`text-xs font-medium h-8 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              isEditing 
                ? 'bg-[var(--color-accent)] text-white' 
                : 'bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200'
            }`}
          >
            {isEditing ? <><Check size={14} /> Done</> : <><LayoutGrid size={14} /> Edit</>}
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="shadcn-card max-w-md w-full p-5 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl">
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">Import Legacy Data</h3>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
              Paste the string copied using <code className="text-[var(--color-accent)] bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800">copy(JSON.stringify(localStorage))</code>:
            </p>
            <textarea
              value={importJson}
              onChange={e => setImportJson(e.target.value)}
              placeholder='Paste JSON here'
              className="w-full h-28 shadcn-input p-2.5 text-xs font-mono resize-none mb-3"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowImport(false)} className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => { importLegacyData(importJson); setShowImport(false); }}
                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}