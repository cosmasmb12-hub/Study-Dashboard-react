import { useEffect } from 'react';

export function useKeyboardShortcut({ onUndo }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isUndo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey;
      if (isUndo) {
        // Prevent undo if focused in an editable textarea or input
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;

        e.preventDefault();
        onUndo?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo]);
}