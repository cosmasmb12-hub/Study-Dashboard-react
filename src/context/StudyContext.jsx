import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_WIDGETS, QUOTES } from '../data/initialData';
import { useSound } from '../hooks/useSound';

const StudyContext = createContext(null);

function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function safeLoad(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (_) {
    return fallback;
  }
}

export function StudyProvider({ children }) {
  const sounds = useSound();
  const todayStr = useMemo(() => getLocalDateString(), []);

  // 1. Stats State
  const [todayStudyTime, setTodayStudyTime] = useState(() => Number(localStorage.getItem('StudyTime')) || 0);
  const [totalTime, setTotalTime] = useState(() => Number(localStorage.getItem('StudyTimeTotal')) || 0);
  const [currentStreak, setCurrentStreak] = useState(() => Number(localStorage.getItem('currentStreak')) || 0);

  // 2. Safe Midnight Reset
  useEffect(() => {
    const lastActive = localStorage.getItem('study_lastActiveDate');
    if (lastActive && lastActive !== todayStr) {
      const last = new Date(lastActive);
      const cur = new Date(todayStr);
      const diffDays = Math.round((cur - last) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        setCurrentStreak(0);
        localStorage.setItem('currentStreak', '0');
      }
      setTodayStudyTime(0);
      localStorage.setItem('StudyTime', '0');
      localStorage.setItem('studiedTodayFlag', 'N');
    }
    localStorage.setItem('study_lastActiveDate', todayStr);
  }, [todayStr]);

  // 3. Subject Times
  const [subjectTimes, setSubjectTimes] = useState(() => ({
    MATHS: Number(localStorage.getItem('MATHS')) || 0,
    ENGLISH: Number(localStorage.getItem('ENGLISH')) || 0,
    PHYSICS: Number(localStorage.getItem('PHYSICS')) || 0,
    COMPUTING: Number(localStorage.getItem('COMPUTING')) || 0,
    PE: Number(localStorage.getItem('PE')) || 0
  }));

  // 4. Analytics, Logs & Assessment Marks
  const [studyHistory, setStudyHistory] = useState(() => safeLoad('studyHistoryMap', {}));
  const [sessionLogs, setSessionLogs] = useState(() => safeLoad('study_session_logs', []));
  const [undoStack, setUndoStack] = useState([]);

  // Subject Grades: { Maths: [80, 85], ... }
  const [subjectGrades, setSubjectGrades] = useState(() =>
    safeLoad('subjectGradesMap', { Maths: [82], Physics: [64], Computing: [76], English: [68], PE: [55] })
  );

  // Assessment Log Entries: [{ id, subject, title, got, total, percent, date }]
  const [loggedMarks, setLoggedMarks] = useState(() =>
    safeLoad('logged_assessment_marks', [
      { id: 'm-1', subject: 'Maths', title: 'Calculus Prelim', got: 72, total: 90, percent: 80, date: todayStr },
      { id: 'm-2', subject: 'Physics', title: 'Doppler Test', got: 32, total: 50, percent: 64, date: todayStr }
    ])
  );

  // 5. SM-2 Spaced Repetition Deck
  const [spacedDeck, setSpacedDeck] = useState(() =>
    safeLoad('spacedRepetitionDeck', [
      { id: 'sr-1', subject: 'Physics', topic: 'Doppler Effect Equation', interval: 1, repetition: 0, easeFactor: 2.5, dueDate: todayStr },
      { id: 'sr-2', subject: 'Maths', topic: 'Wave Function Expansion', interval: 3, repetition: 1, easeFactor: 2.5, dueDate: todayStr },
      { id: 'sr-3', subject: 'Computing', topic: 'Binary Search Tree Traversal', interval: 6, repetition: 2, easeFactor: 2.6, dueDate: todayStr }
    ])
  );

  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [widgets, setWidgets] = useState(() => safeLoad('react_study_widgets_apple_v1', INITIAL_WIDGETS));
  const [isEditing, setIsEditing] = useState(false);

  // LocalStorage Sync
  useEffect(() => localStorage.setItem('StudyTime', todayStudyTime), [todayStudyTime]);
  useEffect(() => localStorage.setItem('StudyTimeTotal', totalTime), [totalTime]);
  useEffect(() => localStorage.setItem('currentStreak', currentStreak), [currentStreak]);
  useEffect(() => localStorage.setItem('studyHistoryMap', JSON.stringify(studyHistory)), [studyHistory]);
  useEffect(() => localStorage.setItem('study_session_logs', JSON.stringify(sessionLogs)), [sessionLogs]);
  useEffect(() => localStorage.setItem('subjectGradesMap', JSON.stringify(subjectGrades)), [subjectGrades]);
  useEffect(() => localStorage.setItem('logged_assessment_marks', JSON.stringify(loggedMarks)), [loggedMarks]);
  useEffect(() => localStorage.setItem('spacedRepetitionDeck', JSON.stringify(spacedDeck)), [spacedDeck]);
  useEffect(() => localStorage.setItem('react_study_widgets_apple_v1', JSON.stringify(widgets)), [widgets]);

  const dayOfWeek = new Date().getDay();
  const targetedStudyTime = dayOfWeek === 5 || dayOfWeek === 6 ? 2 : 3;

  // Study Logging
  const logStudySession = useCallback(({ subject, topic, minutes }) => {
    sounds.playSuccess();
    try { confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } }); } catch (_) {}

    const numMins = Number(minutes);
    setTodayStudyTime((prev) => prev + numMins);
    setTotalTime((prev) => prev + numMins);

    const subKey = subject.toUpperCase();
    setSubjectTimes((prev) => {
      const updated = { ...prev, [subKey]: (prev[subKey] || 0) + numMins };
      localStorage.setItem(subKey, updated[subKey]);
      return updated;
    });

    setStudyHistory((prev) => ({ ...prev, [todayStr]: (prev[todayStr] || 0) + numMins }));

    if (localStorage.getItem('studiedTodayFlag') !== 'Y') {
      setCurrentStreak((prev) => prev + 1);
      localStorage.setItem('studiedTodayFlag', 'Y');
    }

    const logEntry = {
      id: Date.now(),
      text: `${subject} - ${topic || 'General'} (${numMins}m)`,
      minutes: numMins,
      subKey,
    };

    setSessionLogs((prev) => [logEntry, ...prev]);
    setUndoStack((prev) => [logEntry, ...prev]);
  }, [sounds, todayStr]);

  const undoLastSession = useCallback(() => {
    if (undoStack.length === 0) return;
    const last = undoStack[0];
    setUndoStack((prev) => prev.slice(1));

    setTodayStudyTime((prev) => Math.max(0, prev - last.minutes));
    setTotalTime((prev) => Math.max(0, prev - last.minutes));

    setSubjectTimes((prev) => {
      const updated = { ...prev, [last.subKey]: Math.max(0, (prev[last.subKey] || 0) - last.minutes) };
      localStorage.setItem(last.subKey, updated[last.subKey]);
      return updated;
    });

    setSessionLogs((prev) => prev.filter((log) => log.id !== last.id));
    sounds.playClick();
  }, [undoStack, sounds]);

  // Log Marks Functionality
  const addMarkEntry = useCallback(({ subject, title, got, total }) => {
    sounds.playSuccess();
    try { confetti({ particleCount: 50, spread: 50 }); } catch (_) {}

    const pct = Math.round((Number(got) / Number(total)) * 100);
    const newEntry = {
      id: `mark-${Date.now()}`,
      subject,
      title: title.trim() || 'Class Test',
      got: Number(got),
      total: Number(total),
      percent: pct,
      date: todayStr
    };

    setLoggedMarks((prev) => [newEntry, ...prev]);

    // Feed directly to Grade Trajectory
    setSubjectGrades((prev) => ({
      ...prev,
      [subject]: [...(prev[subject] || []), pct]
    }));
  }, [sounds, todayStr]);

  const deleteMarkEntry = useCallback((id) => {
    sounds.playClick();
    setLoggedMarks((prev) => prev.filter((m) => m.id !== id));
  }, [sounds]);

  // SM-2 Review
  const reviewSpacedCard = useCallback((cardId, rating) => {
    sounds.playSuccess();
    setSpacedDeck((prev) => prev.map((card) => {
      if (card.id !== cardId) return card;
      let { repetition, interval, easeFactor } = card;

      if (rating < 3) {
        repetition = 0;
        interval = 1;
      } else {
        if (repetition === 0) interval = 1;
        else if (repetition === 1) interval = 6;
        else interval = Math.round(interval * easeFactor);
        repetition += 1;
      }

      easeFactor = Math.max(1.3, easeFactor + (0.1 - (4 - rating) * (0.08 + (4 - rating) * 0.02)));
      const nextDue = new Date();
      nextDue.setDate(nextDue.getDate() + interval);

      return {
        ...card,
        repetition,
        interval,
        easeFactor,
        dueDate: getLocalDateString(nextDue)
      };
    }));
  }, [sounds]);

  const updateWidgetSize = useCallback((id, col, row) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, col, row } : w)));
  }, []);

  const toggleWidgetVisibility = useCallback((id, visible) => {
    sounds.playClick();
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, visible } : w)));
  }, [sounds]);

  const reorderWidgets = useCallback((fromIndex, toIndex) => {
    setWidgets((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  }, []);

  const nextQuote = useCallback(() => {
    sounds.playClick();
    setQuoteIndex((prev) => {
      let next;
      do { next = Math.floor(Math.random() * QUOTES.length); } while (next === prev);
      return next;
    });
  }, [sounds]);

  const importLegacyData = useCallback((jsonString) => {
    try {
      const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
      window.location.reload();
    } catch (_) {
      alert('Invalid JSON data format');
    }
  }, []);

  return (
    <StudyContext.Provider value={{
      todayStudyTime,
      totalTime,
      currentStreak,
      targetedStudyTime,
      subjectTimes,
      studyHistory,
      sessionLogs,
      subjectGrades,
      loggedMarks,
      addMarkEntry,
      deleteMarkEntry,
      spacedDeck,
      quote: QUOTES[quoteIndex],
      nextQuote,
      widgets,
      isEditing,
      setIsEditing,
      updateWidgetSize,
      toggleWidgetVisibility,
      reorderWidgets,
      logStudySession,
      undoLastSession,
      reviewSpacedCard,
      importLegacyData,
      sounds
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used within a StudyProvider');
  return context;
}