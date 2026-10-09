import { useRef, useCallback } from 'react';

export function useSound() {
  const ctxRef = useRef(null);

  const getContext = useCallback(() => {
    try {
      if (!ctxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) ctxRef.current = new AudioCtx();
      }
      if (ctxRef.current && ctxRef.current.state === 'suspended') {
        ctxRef.current.resume();
      }
      return ctxRef.current;
    } catch (_) {
      return null;
    }
  }, []);

  const playClick = useCallback(() => {
    try {
      const c = getContext();
      if (!c) return;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, c.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, c.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, c.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.05);
    } catch (_) {}
  }, [getContext]);

  const playSuccess = useCallback(() => {
    try {
      const c = getContext();
      if (!c) return;
      const now = c.currentTime;
      [523.25, 783.99].forEach((freq, idx) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch (_) {}
  }, [getContext]);

  const playShuffle = useCallback(() => {
    try {
      const c = getContext();
      if (!c) return;
      const now = c.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400 + i * 150, now + i * 0.03);
        gain.gain.setValueAtTime(0.08, now + i * 0.03);
        gain.gain.linearRampToValueAtTime(0.01, now + i * 0.03 + 0.03);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.03);
      }
    } catch (_) {}
  }, [getContext]);

  const playSlider = useCallback((val) => {
    try {
      const c = getContext();
      if (!c) return;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      const freq = 200 + (val / 180) * 600;
      osc.frequency.setValueAtTime(freq, c.currentTime);
      gain.gain.setValueAtTime(0.04, c.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, c.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.03);
    } catch (_) {}
  }, [getContext]);

  // POMODORO ALARM (Pulsing 3-burst chime)
  const playAlarm = useCallback(() => {
    try {
      const c = getContext();
      if (!c) return;
      const now = c.currentTime;
      [0, 0.22, 0.44].forEach((delay) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now + delay);
        gain.gain.setValueAtTime(0.25, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.18);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.18);
      });
    } catch (_) {}
  }, [getContext]);

  return { playClick, playSuccess, playShuffle, playSlider, playAlarm };
}