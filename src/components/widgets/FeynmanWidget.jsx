import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { SUBJECTS_DATA, JARGON_BAN_LIST } from '../../data/initialData';
import { Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

export function FeynmanWidget() {
  const { addMistake, sounds } = useStudy();
  const [selectedSub, setSelectedSub] = useState('Physics');
  const [concept, setConcept] = useState('');
  const [explanation, setExplanation] = useState('');
  const [flaggedJargon, setFlaggedJargon] = useState([]);

  const checkJargon = (text) => {
    setExplanation(text);
    const banned = JARGON_BAN_LIST[selectedSub] || [];
    const found = banned.filter(word => new RegExp(`\\b${word}\\b`, 'i').test(text));
    setFlaggedJargon(found);
  };

  const handleExportGap = () => {
    if (!concept) return;
    addMistake(selectedSub, `Feynman Gap: ${concept}`);
    sounds.playSuccess();
    setConcept('');
    setExplanation('');
    setFlaggedJargon([]);
  };

  return (
    <div className="widget-content">
      <div className="card-top-row">
        <p className="widget-label">Feynman Studio</p>
        <span className="badge-pill live-badge">ELI5 Challenge</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <select
          value={selectedSub}
          onChange={e => setSelectedSub(e.target.value)}
          className="mini-select"
        >
          {SUBJECTS_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
        </select>
        <input
          type="text"
          placeholder="Concept (e.g. Doppler Effect)"
          value={concept}
          onChange={e => setConcept(e.target.value)}
          className="mini-text-input"
        />
      </div>

      <textarea
        placeholder="Explain this concept in plain English without technical jargon, as if to a 10-year-old..."
        value={explanation}
        onChange={e => checkJargon(e.target.value)}
        className="feynman-textarea"
        style={{ flex: 1, resize: 'none', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '0.85rem' }}
      />

      {flaggedJargon.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffd60a', fontSize: '0.75rem', marginTop: '6px' }}>
          <AlertTriangle size={14} />
          <span>Jargon detected: <strong>{flaggedJargon.join(', ')}</strong>. Try a physical analogy instead!</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
          {explanation.split(/\s+/).filter(Boolean).length} words
        </span>
        <button
          onClick={handleExportGap}
          disabled={!concept}
          className="ios-pill-btn secondary"
          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
        >
          Export Gap to Mistakes <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}