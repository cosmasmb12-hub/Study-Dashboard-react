import React, { useState, useEffect } from 'react';
import { useStudy } from '../../context/StudyContext';
import { Play, Pause, X, Flag } from 'lucide-react';

export function ExamSimulatorModal({ onClose }) {
  const { logStudySession, addGrade, addMistake, sounds } = useStudy();
  const [subject, setSubject] = useState('Maths');
  const [examMins] = useState(90);
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [splitPercent, setSplitPercent] = useState(50);

  const [qpUrl, setQpUrl] = useState('');
  const [msUrl, setMsUrl] = useState('');
  const [scoreGot, setScoreGot] = useState('');
  const [scoreTotal, setScoreTotal] = useState('60');
  const [flagText, setFlagText] = useState('');

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleFinish = () => {
    const elapsed = Math.max(1, Math.round((examMins * 60 - timeLeft) / 60));
    logStudySession({ subject, topic: 'Past Paper', minutes: elapsed });

    const got = parseFloat(scoreGot);
    const tot = parseFloat(scoreTotal);
    if (!isNaN(got) && !isNaN(tot) && tot > 0) {
      addGrade(subject, Math.round((got / tot) * 100));
    }
    onClose();
  };

  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#09090b] z-50 flex flex-col overflow-hidden">
      <div className="h-14 bg-zinc-900 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="text-[0.7rem] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-medium tracking-wide">
            EXAM CONDITIONS
          </span>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg text-xs px-2.5 py-1 text-white outline-none cursor-pointer"
          >
            <option value="Maths" className="bg-zinc-900">Higher Maths</option>
            <option value="Physics" className="bg-zinc-900">Higher Physics</option>
            <option value="Computing" className="bg-zinc-900">Higher Computing</option>
            <option value="English" className="bg-zinc-900">Higher English</option>
            <option value="PE" className="bg-zinc-900">Higher PE</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xl font-bold font-mono text-[var(--color-accent)]">{formatTimer(timeLeft)}</span>
          <button
            onClick={() => { setIsRunning(!isRunning); sounds.playClick(); }}
            className="glass-pill bg-[var(--color-accent)] text-black font-semibold px-3 py-1 rounded-full text-xs flex items-center gap-1 cursor-pointer"
          >
            {isRunning ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Start</>}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <label>Marks:</label>
            <input
              type="number"
              value={scoreGot}
              onChange={e => setScoreGot(e.target.value)}
              placeholder="52"
              className="w-12 bg-white/5 border border-white/10 rounded-lg px-1.5 py-1 text-center text-white text-xs outline-none"
            />
            <span>/</span>
            <input
              type="number"
              value={scoreTotal}
              onChange={e => setScoreTotal(e.target.value)}
              placeholder="60"
              className="w-12 bg-white/5 border border-white/10 rounded-lg px-1.5 py-1 text-center text-white text-xs outline-none"
            />
          </div>
          <button
            onClick={handleFinish}
            className="bg-[var(--color-accent)] text-black font-semibold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer shadow-[var(--shadow-glow)]"
          >
            Finish & Log
          </button>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer"><X size={18} /></button>
        </div>
      </div>

      <div className="flex flex-1 h-[calc(100vh-56px)]">
        {/* Left Pane */}
        <div className="flex flex-col h-full" style={{ width: `${splitPercent}%` }}>
          <div className="h-10 bg-zinc-900/60 border-b border-white/10 flex items-center justify-between px-3 text-xs text-zinc-400">
            <span>Question Paper</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={e => { if (e.target.files[0]) setQpUrl(URL.createObjectURL(e.target.files[0])); }}
              className="text-[0.68rem]"
            />
          </div>
          <div className="flex-1 relative bg-zinc-950">
            {qpUrl ? (
              <object data={qpUrl} type="application/pdf" className="absolute inset-0 w-full h-full border-none" />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-600 text-xs">Upload Question Paper PDF</div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-2 bg-zinc-800 hover:bg-[var(--color-accent)] cursor-col-resize transition-colors"
          onMouseDown={() => {
            const move = (e) => setSplitPercent((e.clientX / window.innerWidth) * 100);
            const up = () => {
              window.removeEventListener('mousemove', move);
              window.removeEventListener('mouseup', up);
            };
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
          }}
        />

        {/* Right Pane */}
        <div className="flex flex-col h-full" style={{ width: `${100 - splitPercent}%` }}>
          <div className="h-10 bg-zinc-900/60 border-b border-white/10 flex items-center justify-between px-3 text-xs text-zinc-400">
            <span>Marking Scheme</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={e => { if (e.target.files[0]) setMsUrl(URL.createObjectURL(e.target.files[0])); }}
              className="text-[0.68rem]"
            />
          </div>
          <div className="flex-1 relative bg-zinc-950">
            {msUrl ? (
              <object data={msUrl} type="application/pdf" className="absolute inset-0 w-full h-full border-none" />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-600 text-xs">Upload Marking Scheme PDF</div>
            )}
          </div>
          <div className="h-11 bg-zinc-900 border-t border-white/10 flex items-center px-3 gap-2">
            <input
              type="text"
              placeholder="Lost marks? Flag question for redo queue..."
              value={flagText}
              onChange={e => setFlagText(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs text-white outline-none"
            />
            <button
              onClick={() => {
                if (flagText) {
                  addMistake(subject, flagText);
                  setFlagText('');
                  sounds.playSuccess();
                }
              }}
              className="glass-pill px-3 py-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer text-zinc-300 hover:text-white"
            >
              <Flag size={12} /> Flag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}