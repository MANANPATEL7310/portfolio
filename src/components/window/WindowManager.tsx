'use client';

import { useWindowStore } from '@/store/useWindowStore';
import { WindowFrame } from './WindowFrame';
import { AnimatePresence } from 'framer-motion';

// Import Specific Applications
import { AboutApp } from '@/features/about/AboutApp';
import { ProjectsApp } from '@/features/projects/ProjectsApp';
import { ResumeApp } from '@/features/resume/ResumeApp';

// Setup routing map identifying what React element belongs to what Window ID string
const AppRegistry: Record<string, React.ReactNode> = {
  'about': <AboutApp />,
  'projects': <ProjectsApp />,
  'resume': <ResumeApp />,
};

export function WindowManager({ constraintsRef }: { constraintsRef: React.RefObject<Element | null> }) {
  const windows = useWindowStore((state) => state.windows);
  
  // Mathematical staggering for identical offsets
  const getInitialPosition = (index: number) => {
    return {
      x: 100 + (index * 40),
      y: 80 + (index * 40)
    };
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <AnimatePresence>
        {windows.map((w, index) => {
          if (!w.isOpen) return null;
          
          const ContentPayload = AppRegistry[w.id] || null;

          return (
            <WindowFrame
              key={w.id}
              id={w.id}
              title={w.title}
              isActive={w.isActive}
              isMinimized={w.isMinimized}
              isMaximized={w.isMaximized}
              constraintsRef={constraintsRef}
              initialPosition={getInitialPosition(index)}
            >
              {ContentPayload}
            </WindowFrame>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
