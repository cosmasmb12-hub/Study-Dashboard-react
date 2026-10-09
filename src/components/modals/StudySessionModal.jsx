import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStudy } from '../../context/StudyContext';
import { SUBJECTS_DATA } from '../../data/initialData';
import { CustomSelect } from '../ui/CustomSelect';
import { WakeSlider } from '../ui/WakeSlider';
import { Dices, X, CheckCircle2 } from 'lucide-react';

export function StudySessionModal({ onClose }) {
  const { logStudySession, sounds } = useStudy();
  const [subject, setSubject] = useState('Maths');
  const [topic, setTopic] = useState('');
  const [minutes, setMinutes] = useState(45);
  const [isLogged, setIsLogged] = useState(false);

  const handleRandomize = () => {
    sounds.playShuffle();
    const randomSub = SUBJECTS_DATA[Math.floor(Math.random() * SUBJECTS_DATA.length)];
    const randomTopic = randomSub.topics[Math.floor(Math.random() * randomSub.topics.length)];
    setSubject(randomSub.name);
    setTopic(randomTopic);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    logStudySession({
      subject,
      topic: topic.trim() || 'General Study',
      minutes
    });

    setIsLogged(true);
    setTimeout(() => {
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="w-full max-w-md bg-[#111116] border border-white/15 rounded-[28px] p-6 shadow-2xl relative"
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-semibold tracking-tight text-white">Log Study Session</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[0.7rem] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
              Subject
            </label>
            <CustomSelect
              options={SUBJECTS_DATA.map((s) => ({ value: s.name, label: s.name }))}
              value={subject}
              onChange={setSubject}
            />
          </div>

          <div>
            <label className="text-[0.7rem] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
              Topic / Key Area
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Calculus Chain Rule, 1984..."
              className="w-full shadcn-input px-3.5 py-2.5 text-xs placeholder:text-zinc-600"
            />
          </div>

          <div className="bg-zinc-950/70 border border-white/10 rounded-2xl p-3">
            <WakeSlider
              value={minutes}
              min={10}
              max={180}
              step={5}
              bars={32}
              height={44}
              restHeight={10}
              gap={3}
              fillColor="#008fd2"
              trackColor="#232329"
              sensitivity={1}
              reach={6}
              showValue={true}
              onChange={(val) => {
                setMinutes(val);
                sounds.playSlider(val);
              }}
            />
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleRandomize}
              className="px-4 py-2.5 bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white rounded-2xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
            >
              <Dices size={14} /> Random
            </button>

            <button
              type="submit"
              disabled={isLogged}
              className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[var(--color-accent)]/20"
            >
              {isLogged ? <><CheckCircle2 size={16} /> Logged</> : 'Confirm & Save'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}