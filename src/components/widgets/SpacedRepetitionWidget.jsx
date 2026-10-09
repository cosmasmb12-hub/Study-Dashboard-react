import React from 'react';
import { useStudy } from '../../context/StudyContext';
import { Brain, RotateCcw } from 'lucide-react';

export function SpacedRepetitionWidget() {
  const { spacedDeck, reviewSpacedCard } = useStudy();
  const today = new Date().toISOString().split('T')[0];
  const dueCards = spacedDeck.filter(c => c.dueDate <= today);
  const currentCard = dueCards[0];

  return (
    <div className="widget-content">
      <div className="card-top-row">
        <p className="widget-label">Spaced Repetition</p>
        <span className="badge-pill live-badge">{dueCards.length} Due Today</span>
      </div>

      {currentCard ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>[{currentCard.subject}]</span>
            <h4 style={{ margin: '4px 0', fontSize: '0.95rem' }}>{currentCard.topic}</h4>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Interval: {currentCard.interval}d | Reps: {currentCard.repetition}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
            <button onClick={() => reviewSpacedCard(currentCard.id, 1)} className="pomo-pill" style={{ color: '#ff3b30' }}>Again</button>
            <button onClick={() => reviewSpacedCard(currentCard.id, 2)} className="pomo-pill" style={{ color: '#ffd60a' }}>Hard</button>
            <button onClick={() => reviewSpacedCard(currentCard.id, 3)} className="pomo-pill" style={{ color: '#38bdf8' }}>Good</button>
            <button onClick={() => reviewSpacedCard(currentCard.id, 4)} className="pomo-pill" style={{ color: '#34c759' }}>Easy</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.4)' }}>
          <Brain size={28} />
          <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0' }}>All caught up! Memory curve stable.</p>
        </div>
      )}
    </div>
  );
}