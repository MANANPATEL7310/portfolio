'use client';

import { motion } from 'framer-motion';
import { GlassWrapper } from '../ui/GlassWrapper';
import { TrafficLights } from '../ui/TrafficLights';
import { ReactNode } from 'react';
import { useWindowStore } from '@/store/useWindowStore';

interface WindowFrameProps {
  id: string;
  title: string;
  isActive: boolean;
  isMinimized?: boolean;
  isMaximized?: boolean;
  children?: ReactNode;
  constraintsRef: React.RefObject<Element | null>;
  initialPosition?: { x: number; y: number };
}

export function WindowFrame({ id, title, isActive, isMinimized, isMaximized, children, constraintsRef, initialPosition = { x: 50, y: 50 } }: WindowFrameProps) {
  const bringToFront = useWindowStore((state) => state.bringToFront);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const toggleMinimizeWindow = useWindowStore((state) => state.toggleMinimizeWindow);
  const toggleMaximizeWindow = useWindowStore((state) => state.toggleMaximizeWindow);
  
  return (
    <motion.div
      drag={!isMaximized}
      dragConstraints={constraintsRef}
      dragElastic={0}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.95, x: initialPosition.x, y: initialPosition.y }}
      animate={{ 
        opacity: isMinimized ? 0 : 1, 
        scale: isMinimized ? 0.8 : 1, 
        y: isMinimized ? initialPosition.y + 200 : undefined 
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      onPointerDown={() => bringToFront(id)}
      style={{ 
        zIndex: isActive ? 50 : 10,
        pointerEvents: isMinimized ? 'none' : 'auto' 
      }}
      className={`absolute shadow-2xl rounded-xl overflow-hidden flex flex-col pointer-events-auto transition-[border-radius,width,height] duration-300 ease-in-out ${
        isActive ? 'ring-1 ring-black/5 dark:ring-white/10 shadow-2xl drop-shadow-2xl' : 'opacity-95 blur-[0.5px] grayscale-[20%]'
      } ${
        isMaximized 
          ? 'fixed inset-0 !top-7 !bottom-[70px] !w-auto !h-auto !transform-none rounded-none z-[60]' 
          : 'w-[95vw] md:w-[600px] h-[500px] md:h-[400px]'
      }`}
    >
      {/* We strip standard mac-glass border here since ring wraps it */}
      <GlassWrapper className={`flex-[1_1_0%] flex flex-col w-full h-full border-none ${isMaximized ? 'rounded-none' : 'rounded-xl'}`}>
        
        {/* Title Bar (Draggable Area) */}
        <div className={`h-10 w-full flex items-center justify-center relative transition-colors ${isMaximized ? 'cursor-default' : 'cursor-default active:cursor-grabbing hover:bg-white/5'}`}>
          <div className="absolute left-4 z-20">
            <TrafficLights 
              onClose={() => closeWindow(id)} 
              onMinimize={() => toggleMinimizeWindow(id)}
              onMaximize={() => toggleMaximizeWindow(id)}
            />
          </div>
          <span className="text-xs font-semibold text-center select-none pointer-events-none drop-shadow-sm opacity-80">{title}</span>
        </div>
        
        {/* Window Content */}
        <div className="flex-[1_1_0%] w-full overflow-hidden relative cursor-default border-t border-white/20 dark:border-white/10 rounded-b-xl pointer-events-auto bg-white/50 dark:bg-black/50">
            {children || (
              <div className="h-full w-full text-sm opacity-50 flex flex-col items-center justify-center">
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Content for &quot;{title}&quot; arriving in Phase 4!
              </div>
            )}
        </div>
      </GlassWrapper>
    </motion.div>
  );
}
