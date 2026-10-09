import React from 'react';
import { JellyRadio } from '../ui/JellyRadio';
import { LayoutGrid, Brain, BookOpen, BarChart3 } from 'lucide-react';

export function BottomNav({ activeTab, onSelectTab }) {
  const mobileNavItems = [
    { value: 'home', label: 'Home', icon: <LayoutGrid size={15} /> },
    { value: 'recall', label: 'Recall', icon: <Brain size={15} /> },
    { value: 'exam', label: 'Exam', icon: <BookOpen size={15} /> },
    { value: 'stats', label: 'Stats', icon: <BarChart3 size={15} /> }
  ];

  return (
    <nav className="fixed bottom-3 left-0 right-0 flex justify-center items-center z-40 md:hidden px-4 pointer-events-none">
      <div className="pointer-events-auto">
        <JellyRadio
          items={mobileNavItems}
          value={activeTab}
          onChange={(val) => {
            if (navigator.vibrate) navigator.vibrate(30);
            onSelectTab(val);
          }}
          activeColor="#008fd2"
          chipColor="#141417"
          textColor="#71717a"
          activeTextColor="#000000"
          size="sm"
          gap={4}
          radius={14}
        />
      </div>
    </nav>
  );
}