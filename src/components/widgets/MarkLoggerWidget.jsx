import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { CustomSelect } from '../ui/CustomSelect';
import { Plus, Percent, Trash2 } from 'lucide-react';

export function MarkLoggerWidget() {
  const { addMarkEntry, loggedMarks, deleteMarkEntry, sounds } = useStudy();
  const [subject, setSubject] = useState('Maths');
  const [title, setTitle] = useState('');
  const [got, setGot] = useState('');
  const [total, setTotal] = useState('');

  const numGot = parseFloat(got);
  const numTot = parseFloat(total);
  const livePercent = !isNaN(numGot) && !isNaN(numTot) && numTot > 0 ? Math.round((numGot / numTot) * 100) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNaN(numGot) || isNaN(numTot) || numTot <= 0) return;

    addMarkEntry({ subject, title, got: numGot, total: numTot });
    setTitle('');
    setGot('');
    setTotal('');
  };

  const getBadgeColor = (p) => {
    if (p >= 70) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (p >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex justify-between items-center mb-2">
        <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400">Log Marks</p>
        {livePercent !== null && (
          <span className={`text-[0.68rem] px-2 py-0.5 rounded-full font-mono font-bold border ${getBadgeColor(livePercent)}`}>
            {livePercent}% ({livePercent >= 70 ? 'Grade A' : livePercent >= 60 ? 'Grade B' : 'Grade C'})
          </span>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-2 mb-2">
        <div className="flex gap-1.5">
          <div className="w-28 shrink-0">
            <CustomSelect
              options={['Maths', 'Physics', 'Computing', 'English', 'PE']}
              value={subject}
              onChange={setSubject}
            />
          </div>
          <input
            type="text"
            placeholder="Test (e.g. Unit 2 Prelim)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 shadcn-input text-xs px-2.5 py-1.5"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <input
            type="number"
            placeholder="Got"
            value={got}
            onChange={(e) => setGot(e.target.value)}
            className="w-16 shadcn-input text-xs px-2 py-1.5 text-center font-mono"
          />
          <span className="text-zinc-500 text-xs font-mono">/</span>
          <input
            type="number"
            placeholder="Total"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="w-16 shadcn-input text-xs px-2 py-1.5 text-center font-mono"
          />
          <button
            type="submit"
            disabled={livePercent === null}
            className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold py-1.5 rounded-2xl flex items-center justify-center gap-1 cursor-pointer transition-colors disabled:opacity-40"
          >
            <Plus size={13} /> Save to Trajectory
          </button>
        </div>
      </form>

      {/* Recent Marks List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {loggedMarks.map((m) => (
          <div key={m.id} className="flex justify-between items-center bg-zinc-900/60 border border-white/5 px-2.5 py-1.5 rounded-xl text-xs">
            <div className="truncate pr-2">
              <span className="text-[var(--color-accent)] font-semibold">[{m.subject}]</span> {m.title}
              <span className="text-zinc-500 font-mono text-[0.68rem] ml-1.5">({m.got}/{m.total})</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-1.5 py-0.5 rounded text-[0.68rem] font-mono font-bold border ${getBadgeColor(m.percent)}`}>
                {m.percent}%
              </span>
              <button
                type="button"
                onClick={() => deleteMarkEntry(m.id)}
                className="text-zinc-600 hover:text-red-400 cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}