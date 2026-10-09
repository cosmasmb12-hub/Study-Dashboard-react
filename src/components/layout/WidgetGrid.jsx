import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudy } from '../../context/StudyContext';
import { SUBJECTS_DATA } from '../../data/initialData';
import { MarkLoggerWidget } from '../widgets/MarkLoggerWidget';
import { cn } from '../../lib/utils';
import {
  Play,
  Pause,
  RotateCcw,
  Brain,
  Shuffle,
  Clock,
  Scaling,
  GripHorizontal
} from 'lucide-react';

const SPRING = { type: 'spring', stiffness: 380, damping: 28, mass: 0.6 };

export function WidgetGrid({ onOpenStudyModal }) {
  const {
    widgets,
    isEditing,
    updateWidgetSize,
    toggleWidgetVisibility,
    reorderWidgets,
    todayStudyTime,
    totalTime,
    targetedStudyTime,
    subjectTimes,
    subjectGrades,
    quote,
    nextQuote,
    sessionLogs,
    studyHistory,
    sounds,
    spacedDeck,
    reviewSpacedCard,
  } = useStudy();

  const [draggedWidgetId, setDraggedWidgetId] = useState(null);
  const [isResizing, setIsResizing] = useState(false);

  // Pomodoro Focus Timer with Alarm
  const [pomoSecs, setPomoSecs] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [pomoMode, setPomoMode] = useState('work');

  useEffect(() => {
    let interval = null;
    if (pomoRunning && pomoSecs > 0) {
      interval = setInterval(() => setPomoSecs((prev) => prev - 1), 1000);
    } else if (pomoSecs === 0 && pomoRunning) {
      setPomoRunning(false);
      sounds.playAlarm();
    }
    return () => clearInterval(interval);
  }, [pomoRunning, pomoSecs, sounds]);

  // Infinite Interleaving Randomizer
  const [sprintPlan, setSprintPlan] = useState(() => getRandomSprintPlan());

  function getRandomSprintPlan() {
    const shuffled = [...SUBJECTS_DATA].sort(() => 0.5 - Math.random()).slice(0, 3);
    return shuffled.map((s) => ({
      sub: s.name,
      topic: s.topics[Math.floor(Math.random() * s.topics.length)],
      duration: 25,
    }));
  }

  const shuffleSprintPlan = () => {
    sounds.playShuffle();
    setSprintPlan(getRandomSprintPlan());
  };

  const formatMinSec = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const formatHrsMins = (m) => {
    const hrs = Math.floor(m / 60);
    const mins = m % 60;
    if (hrs === 0) return `${mins}mins`;
    if (mins === 0) return `${hrs}hrs`;
    return `${hrs}hrs ${mins}mins`;
  };

  const getColSpan = (col) => {
    if (col === 1) return 'col-span-1';
    if (col === 2) return 'col-span-1 md:col-span-2';
    if (col === 3) return 'col-span-1 md:col-span-3';
    return 'col-span-1 md:col-span-4';
  };

  const getRowSpan = (row) => (row === 2 ? 'row-span-2' : 'row-span-1');

  // Cycle Size on Tap/Click
  const cycleNextSize = (widget) => {
    sounds.playClick();
    if (widget.col === 1 && widget.row === 1) updateWidgetSize(widget.id, 2, 1);
    else if (widget.col === 2 && widget.row === 1) updateWidgetSize(widget.id, 2, 2);
    else if (widget.col === 2 && widget.row === 2) updateWidgetSize(widget.id, 4, 1);
    else updateWidgetSize(widget.id, 1, 1);
  };

  // Drag-to-Resize Handler
  const handleCornerResize = (e, widget) => {
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX || e.touches?.[0]?.clientX;
    const startY = e.clientY || e.touches?.[0]?.clientY;
    const startCol = widget.col;
    const startRow = widget.row;

    let targetCol = startCol;
    let targetRow = startRow;
    let hasMoved = false;

    const onMove = (moveEvent) => {
      hasMoved = true;
      const curX = moveEvent.clientX || moveEvent.touches?.[0]?.clientX;
      const curY = moveEvent.clientY || moveEvent.touches?.[0]?.clientY;
      const deltaX = curX - startX;
      const deltaY = curY - startY;

      if (deltaX > 220) targetCol = 4;
      else if (deltaX > 70) targetCol = 2;
      else if (deltaX < -100) targetCol = 1;

      if (deltaY > 90) targetRow = 2;
      else if (deltaY < -80) targetRow = 1;

      updateWidgetSize(widget.id, targetCol, targetRow);
    };

    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);

      // If user simply clicked without dragging, cycle size
      if (!hasMoved) {
        cycleNextSize(widget);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
  };

  // Reorder handlers (suppressed during resize)
  const handleDragStart = (e, id) => {
    if (isResizing) {
      e.preventDefault();
      return;
    }
    setDraggedWidgetId(id);
  };

  const handleDragOver = (e, targetId) => {
    e.preventDefault();
    if (isResizing || !draggedWidgetId || draggedWidgetId === targetId) return;
    const fromIdx = widgets.findIndex((w) => w.id === draggedWidgetId);
    const toIdx = widgets.findIndex((w) => w.id === targetId);
    if (fromIdx !== -1 && toIdx !== -1) reorderWidgets(fromIdx, toIdx);
  };

  const handleDragEnd = () => setDraggedWidgetId(null);

  const getLetterGrade = (p) => (p >= 70 ? 'A' : p >= 60 ? 'B' : p >= 50 ? 'C' : p >= 40 ? 'D' : 'NA');
  const subjectList = ['Maths', 'Physics', 'Computing', 'English', 'PE'];
  const currentGrades = subjectList
    .map((s) => {
      const arr = subjectGrades[s] || [];
      return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;
    })
    .filter((g) => g !== null)
    .map(getLetterGrade)
    .sort()
    .join('');

  const todayIso = new Date().toISOString().split('T')[0];
  const dueCards = spacedDeck.filter((c) => c.dueDate <= todayIso);
  const currentCard = dueCards[0];

  return (
    <motion.div
      layout
      transition={SPRING}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[205px] gap-3 md:gap-4 max-w-[1400px] mx-auto pt-4 md:pt-20 pb-24 md:pb-16 px-3 md:px-4"
    >
      <AnimatePresence mode="popLayout">
        {widgets
          .filter((w) => w.visible)
          .map((widget) => (
            <motion.article
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={SPRING}
              key={widget.id}
              draggable={isEditing && !isResizing}
              onDragStart={(e) => handleDragStart(e, widget.id)}
              onDragOver={(e) => handleDragOver(e, widget.id)}
              onDragEnd={handleDragEnd}
              className={cn(
                'relative bg-zinc-950/40 border border-white/10 backdrop-blur-xl rounded-[28px] p-4.5 md:p-5 flex flex-col justify-between overflow-hidden select-none transition-all shadow-xl',
                getColSpan(widget.col),
                getRowSpan(widget.row),
                isEditing && 'jiggle-card border-[var(--color-accent)]/50 cursor-grab active:cursor-grabbing',
                draggedWidgetId === widget.id && 'opacity-30'
              )}
            >
              {/* Edit Controls */}
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => toggleWidgetVisibility(widget.id, false)}
                    className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center text-xs z-30 cursor-pointer shadow-lg hover:scale-110 active:scale-95"
                  >
                    &minus;
                  </button>

                  <div className="absolute top-2.5 right-3 text-zinc-500 flex items-center gap-1 z-20 pointer-events-none">
                    <GripHorizontal size={14} />
                  </div>

                  {/* ISOLATED CORNER RESIZE HANDLE (Drag or Tap to cycle) */}
                  <div
                    draggable={false}
                    onDragStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onMouseDown={(e) => handleCornerResize(e, widget)}
                    onTouchStart={(e) => handleCornerResize(e, widget)}
                    className="absolute bottom-1.5 right-1.5 p-2.5 text-zinc-400 hover:text-[var(--color-accent)] active:scale-125 cursor-nwse-resize z-30 touch-none select-none transition-transform"
                    title="Drag or tap to resize"
                  >
                    <Scaling size={16} />
                  </div>
                </>
              )}

              {/* 1. Task Widget */}
              {widget.id === 'widget-task' && (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400 mb-1">Current Task</p>
                    <h2 className="text-xl font-semibold tracking-tight text-white">Welcome back, Cosmas</h2>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenStudyModal}
                    className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold py-3 px-4 rounded-2xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-accent)]/20 active:scale-[0.98]"
                  >
                    Log Study Session
                  </button>
                </div>
              )}

              {/* 2. Mark Logger Widget */}
              {widget.id === 'widget-mark-logger' && <MarkLoggerWidget />}

              {/* 3. Grade Trajectory */}
              {widget.id === 'widget-grade-tracker' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400">Exam Trajectory</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.68rem] text-zinc-400">Target: <strong className="text-white">AAABB</strong></span>
                      <span className="text-[0.68rem] bg-[var(--color-accent-muted)] text-[var(--color-accent)] px-2 py-0.5 rounded-full font-mono font-bold">
                        {currentGrades || '---'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                    {subjectList.map((s) => {
                      const arr = subjectGrades[s] || [];
                      const avg = arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;
                      const grade = avg !== null ? getLetterGrade(avg) : 'NA';
                      return (
                        <div key={s} className="flex justify-between items-center bg-zinc-900/60 border border-white/5 px-3 py-1.5 rounded-2xl text-xs">
                          <span className="text-zinc-200 font-medium"><strong>{s}</strong> ({avg !== null ? `${avg}%` : 'No papers'})</span>
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-lg text-[0.68rem] font-mono font-bold',
                              grade === 'A' ? 'bg-emerald-500/15 text-emerald-400' :
                              grade === 'B' ? 'bg-amber-500/15 text-amber-400' :
                              grade === 'C' ? 'bg-red-500/15 text-red-400' : 'bg-zinc-800 text-zinc-400'
                            )}
                          >
                            {grade}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Pomodoro Timer with Alarm */}
              {widget.id === 'widget-pomodoro' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex justify-between items-center">
                    <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400">Focus Timer</p>
                    <div className="flex bg-zinc-900/90 border border-white/5 p-1 rounded-2xl">
                      {[
                        { mode: 'work', label: '25m', secs: 25 * 60 },
                        { mode: 'short', label: '5m', secs: 5 * 60 },
                        { mode: 'long', label: '15m', secs: 15 * 60 },
                      ].map((p) => (
                        <button
                          key={p.mode}
                          type="button"
                          onClick={() => {
                            setPomoMode(p.mode);
                            setPomoSecs(p.secs);
                            setPomoRunning(false);
                          }}
                          className={cn(
                            'text-[0.68rem] font-medium px-2.5 py-0.5 rounded-xl cursor-pointer transition-colors',
                            pomoMode === p.mode ? 'bg-[var(--color-accent)] text-white font-semibold' : 'text-zinc-400 hover:text-white'
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-center my-auto">
                    <h1 className="text-4xl font-semibold tracking-tight font-mono text-white">
                      {formatMinSec(pomoSecs)}
                    </h1>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPomoRunning(!pomoRunning);
                        sounds.playClick();
                      }}
                      className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold px-4 py-2 rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-[var(--color-accent)]/20"
                    >
                      {pomoRunning ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Start</>}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPomoRunning(false);
                        setPomoSecs(pomoMode === 'work' ? 25 * 60 : pomoMode === 'short' ? 5 * 60 : 15 * 60);
                        sounds.playClick();
                      }}
                      className="border border-white/10 hover:border-white/20 bg-zinc-900 text-zinc-300 text-xs font-medium px-3.5 py-2 rounded-2xl cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw size={13} /> Reset
                    </button>
                  </div>
                </div>
              )}

              {/* 5. Daily Progress */}
              {widget.id === 'widget-progress' && (
                <div className="flex flex-col h-full justify-between">
                  <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400">Today's Progress</p>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-white">
                      {formatHrsMins(todayStudyTime)} <span className="text-zinc-500 text-xs font-normal">/ {targetedStudyTime}hrs</span>
                    </h2>
                    <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden my-2.5">
                      <div
                        className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.floor((todayStudyTime / (targetedStudyTime * 60)) * 100))}%` }}
                      />
                    </div>
                  </div>
                  <h1 className="text-4xl font-semibold font-mono text-white/5 text-right pointer-events-none -mb-2">
                    {Math.min(100, Math.floor((todayStudyTime / (targetedStudyTime * 60)) * 100))}%
                  </h1>
                </div>
              )}

              {/* 6. Spaced Repetition */}
              {widget.id === 'widget-spaced-rep' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex justify-between items-center">
                    <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400">Spaced Repetition</p>
                    <span className="text-[0.68rem] bg-[var(--color-accent-muted)] text-[var(--color-accent)] px-2 py-0.5 rounded-full font-medium">
                      {dueCards.length} Due
                    </span>
                  </div>
                  {currentCard ? (
                    <div className="flex flex-col justify-between flex-1 py-1">
                      <div>
                        <span className="text-[0.68rem] text-[var(--color-accent)] font-semibold">[{currentCard.subject}]</span>
                        <h4 className="text-sm font-semibold mt-0.5 mb-1 text-white leading-snug">{currentCard.topic}</h4>
                        <p className="text-[0.68rem] text-zinc-500 font-mono">Interval: {currentCard.interval}d | Reps: {currentCard.repetition}</p>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 mt-2">
                        <button onClick={() => reviewSpacedCard(currentCard.id, 1)} className="bg-zinc-900 border border-white/5 hover:border-white/15 text-[0.68rem] py-1.5 rounded-xl text-red-400 font-medium cursor-pointer">Again</button>
                        <button onClick={() => reviewSpacedCard(currentCard.id, 2)} className="bg-zinc-900 border border-white/5 hover:border-white/15 text-[0.68rem] py-1.5 rounded-xl text-amber-400 font-medium cursor-pointer">Hard</button>
                        <button onClick={() => reviewSpacedCard(currentCard.id, 3)} className="bg-zinc-900 border border-white/5 hover:border-white/15 text-[0.68rem] py-1.5 rounded-xl text-[var(--color-accent)] font-medium cursor-pointer">Good</button>
                        <button onClick={() => reviewSpacedCard(currentCard.id, 4)} className="bg-zinc-900 border border-white/5 hover:border-white/15 text-[0.68rem] py-1.5 rounded-xl text-emerald-400 font-medium cursor-pointer">Easy</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center flex-1 text-zinc-500">
                      <Brain size={22} className="mb-1 text-zinc-400" />
                      <p className="text-xs">Memory curve optimal.</p>
                    </div>
                  )}
                </div>
              )}

              {/* 7. Infinite Interleaving Engine */}
              {widget.id === 'widget-interleaving' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex justify-between items-center">
                    <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400">Interleaving Engine</p>
                    <button
                      type="button"
                      onClick={shuffleSprintPlan}
                      className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Shuffle new random sprint"
                    >
                      <Shuffle size={13} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5 my-auto">
                    {sprintPlan.map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-zinc-900/60 border border-white/5 px-3 py-1.5 rounded-2xl text-xs">
                        <span className="truncate text-zinc-300"><strong>{s.sub}</strong>: {s.topic}</span>
                        <span className="text-[var(--color-accent)] flex items-center gap-1 font-mono text-[0.7rem] shrink-0 ml-2 font-bold">
                          <Clock size={11} /> {s.duration}m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. 28-Day Heatmap */}
              {widget.id === 'widget-heatmap' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400">28-Day Consistency</p>
                    <span className="text-[0.68rem] text-zinc-400 font-mono">
                      {Math.round(Object.values(studyHistory).reduce((a, b) => a + b, 0) / 60)}h total
                    </span>
                  </div>
                  <div className="grid grid-cols-7 grid-rows-4 gap-1.5 w-full flex-1 max-h-[95px] my-auto">
                    {Array.from({ length: 28 }).map((_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() - (27 - i));
                      const dateKey = d.toISOString().split('T')[0];
                      const mins = studyHistory[dateKey] || 0;
                      return (
                        <div
                          key={i}
                          title={`${dateKey}: ${mins} mins`}
                          className={cn(
                            'w-full h-full rounded-[6px] border transition-transform hover:scale-110 cursor-pointer',
                            mins > 120 ? 'bg-[#38bdf8] border-[#38bdf8]' :
                            mins > 60 ? 'bg-[var(--color-accent)] border-[var(--color-accent)]' :
                            mins > 30 ? 'bg-[var(--color-accent)]/60 border-[var(--color-accent)]/70' :
                            mins > 0 ? 'bg-[var(--color-accent)]/30 border-[var(--color-accent)]/40' :
                            'bg-zinc-900 border-white/5'
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 9. Study ROI */}
              {widget.id === 'widget-roi-balancer' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400">Study ROI Diagnostic</p>
                    <span className="text-[0.68rem] text-zinc-400">Balanced</span>
                  </div>
                  <div className="space-y-1.5 my-auto">
                    {Object.entries(subjectTimes).map(([sub, mins]) => {
                      const share = totalTime > 0 ? Math.round((mins / totalTime) * 100) : 0;
                      return (
                        <div key={sub} className="flex items-center gap-2 text-xs">
                          <span className="w-16 text-zinc-400 truncate">{sub.charAt(0) + sub.slice(1).toLowerCase()}</span>
                          <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300" style={{ width: `${share}%` }} />
                          </div>
                          <span className="w-8 text-right font-mono text-[0.68rem] text-zinc-400">{share}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 10. Daily Quote */}
              {widget.id === 'widget-quote' && (
                <div onClick={nextQuote} className="flex flex-col h-full justify-between cursor-pointer group">
                  <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400 group-hover:text-white transition-colors">Daily Quote</p>
                  <blockquote className="text-base md:text-lg font-serif font-light leading-relaxed my-auto text-zinc-100">
                    <em>"{quote}"</em>
                  </blockquote>
                </div>
              )}

              {/* 11. Total Time */}
              {widget.id === 'widget-total-time' && (
                <div className="flex flex-col h-full justify-between">
                  <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400">Total Studied</p>
                  <h2 className="text-2xl font-semibold text-[var(--color-accent)] font-mono my-auto">{formatHrsMins(totalTime)}</h2>
                </div>
              )}

              {/* 12. Recent Logs */}
              {widget.id === 'widget-logs' && (
                <div className="flex flex-col h-full justify-between">
                  <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">Recent Sessions</p>
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                    {sessionLogs.map((log) => (
                      <p key={log.id} className="text-xs text-zinc-300 bg-zinc-900/60 border border-white/5 px-2.5 py-1.5 rounded-xl">
                        {log.text}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* 13. Subject Breakdown */}
              {widget.id === 'widget-breakdown' && (
                <div className="flex flex-col h-full justify-between">
                  <p className="text-[0.7rem] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">Subject Breakdown</p>
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                    {Object.entries(subjectTimes).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center text-xs bg-zinc-900/60 border border-white/5 px-3 py-2 rounded-xl">
                        <span className="text-zinc-300 font-medium">{key.charAt(0) + key.slice(1).toLowerCase()}</span>
                        <span className="font-mono text-[var(--color-accent)] font-bold">{formatHrsMins(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.article>
          ))}
      </AnimatePresence>
    </motion.div>
  );
}