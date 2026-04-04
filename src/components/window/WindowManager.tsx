'use client';

import type { WindowId } from "@/data/portfolio";
import { windowRegistry } from "@/data/window-registry";
import { useWindowStore } from '@/store/useWindowStore';
import { WindowFrame } from './WindowFrame';
import { AnimatePresence } from 'framer-motion';

export function WindowManager({ constraintsRef }: { constraintsRef: React.RefObject<Element | null> }) {
  const windows = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <AnimatePresence>
        {windows.map((w, index) => {
          const definition = windowRegistry[w.id as WindowId];
          if (!definition) return null;

          return (
            <WindowFrame
              key={w.id}
              id={w.id}
              title={w.title}
              isActive={activeWindowId === w.id}
              isMinimized={w.isMinimized}
              isMaximized={w.isMaximized}
              constraintsRef={constraintsRef}
              initialPosition={definition.initialPosition}
              sizeClassName={definition.sizeClassName}
              contentClassName={definition.contentClassName}
              showTitle={definition.showTitle}
              zIndex={40 + index}
            >
              {definition.content}
            </WindowFrame>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
