import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { Shuffle, Clock } from 'lucide-react';

export function InterleavingWidget() {
  const { sounds } = useStudy();
  const [sprintPlan, setSprintPlan] = useState([
    { sub: 'Maths', topic: 'Calculus', duration: 25 },
    { sub: 'Computing', topic: 'Python Structs', duration: 25 },
    { sub: 'Physics', topic: 'Forces', duration: 25 }
  ]);

  const generateNewSprint = () => {
    sounds.playShuffle();
    setSprintPlan([
      { sub: 'Physics', topic: 'Doppler Effect', duration: 25 },
      { sub: 'Maths', topic: 'Vectors', duration: 25 },
      { sub: 'English', topic: 'RUAE Analysis', duration: 25 }
    ]);
  };

  return (
    <div className="widget-content">
      <div className="card-top-row">
        <p className="widget-label">Interleaving Engine</p>
        <button onClick={generateNewSprint} className="mini-add-btn" title="Shuffle Anti-Blocking Plan">
          <Shuffle size={12} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: '100%', justifyContent: 'center' }}>
        {sprintPlan.map((s, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: '10px', fontSize: '0.8rem' }}>
            <span><strong>{s.sub}</strong>: {s.topic}</span>
            <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={11} /> {s.duration}m
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}