'use client';

import type { WindowId } from "@/data/portfolio";
import { windowRegistry } from "@/data/window-registry";
import { useWindowStore } from '@/store/useWindowStore';
import { WindowFrame } from './WindowFrame';
import { AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

export function WindowManager({ constraintsRef }: { constraintsRef: React.RefObject<Element | null> }) {
  const windows = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);

  const visibleWindows = useMemo(
    () => Object.values(windows).filter((windowState) => !windowState.isMinimized).sort((left, right) => left.zIndex - right.zIndex),
    [windows],
  );

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <AnimatePresence initial={false}>
        {visibleWindows.map((w) => {
          const definition = windowRegistry[w.id as WindowId];
          if (!definition) return null;

          return (
            <WindowFrame
              key={w.id}
              id={w.id}
              title={w.title}
              isActive={activeWindowId === w.id}
              isMaximized={w.isMaximized}
              constraintsRef={constraintsRef}
              position={w.position}
              size={w.size}
              contentClassName={definition.contentClassName}
              showTitle={definition.showTitle}
              zIndex={w.zIndex}
            >
              {definition.content}
            </WindowFrame>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
