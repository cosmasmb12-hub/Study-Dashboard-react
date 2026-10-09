import React, { useState } from 'react';
import { StudyProvider } from './context/StudyContext';
import { FloatingIsland } from './components/layout/FloatingIsland';
import { WidgetGrid } from './components/layout/WidgetGrid';
import { PixelBlast } from './components/ui/PixelBlast';
import { StudySessionModal } from './components/modals/StudySessionModal';
import { AddWidgetModal } from './components/modals/AddWidgetModal';

function StudyApp() {
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);

  return (
    <div className="min-h-screen text-white relative flex flex-col justify-between overflow-x-hidden">
      {/* REACT-BITS PIXELBLAST CANVAS SHADER */}
      <PixelBlast
        variant="square"
        pixelSize={3}
        color="#3B82F6"
        patternScale={2}
        patternDensity={1}
        enableRipples={true}
        rippleSpeed={0.3}
        rippleThickness={0.1}
        rippleIntensityScale={1}
        speed={0.5}
        transparent={false}
        edgeFade={0.5}
      />

      {/* COMPACT FLOATING DYNAMIC ISLAND */}
      <FloatingIsland
        onOpenStudyModal={() => setIsStudyModalOpen(true)}
        onOpenAddWidget={() => setIsAddWidgetOpen(true)}
      />

      {/* APPLE DYNAMIC GRID */}
      <main className="flex-1 w-full">
        <WidgetGrid onOpenStudyModal={() => setIsStudyModalOpen(true)} />
      </main>

      {/* OVERLAYS & MODALS */}
      {isStudyModalOpen && (
        <StudySessionModal onClose={() => setIsStudyModalOpen(false)} />
      )}

      {isAddWidgetOpen && (
        <AddWidgetModal onClose={() => setIsAddWidgetOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StudyProvider>
      <StudyApp />
    </StudyProvider>
  );
}