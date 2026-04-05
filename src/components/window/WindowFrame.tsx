'use client';

import clsx from "clsx";
import { motion, useDragControls } from 'framer-motion';
import { memo, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { twMerge } from "tailwind-merge";

import { TrafficLights } from '../ui/TrafficLights';
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH, useWindowStore } from '@/store/useWindowStore';
import type { WindowPosition, WindowSize } from '@/store/useWindowStore';

interface WindowFrameProps {
  id: string;
  title: string;
  isActive: boolean;
  isMinimized?: boolean;
  isMaximized?: boolean;
  children?: ReactNode;
  constraintsRef: React.RefObject<Element | null>;
  position: WindowPosition;
  size: WindowSize;
  contentClassName?: string;
  showTitle?: boolean;
  zIndex: number;
}

export const WindowFrame = memo(function WindowFrame({
  id,
  title,
  isActive,
  isMinimized,
  isMaximized,
  children,
  constraintsRef,
  position,
  size,
  contentClassName,
  showTitle = true,
  zIndex,
}: WindowFrameProps) {
  const bringToFront = useWindowStore((state) => state.bringToFront);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const toggleMinimizeWindow = useWindowStore((state) => state.toggleMinimizeWindow);
  const toggleMaximizeWindow = useWindowStore((state) => state.toggleMaximizeWindow);
  const updateWindowPosition = useWindowStore((state) => state.updateWindowPosition);
  const updateWindowSize = useWindowStore((state) => state.updateWindowSize);
  const dragControls = useDragControls();
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const start = resizeStartRef.current;
      if (!start || isMaximized) {
        return;
      }

      updateWindowSize(id, {
        width: Math.max(MIN_WINDOW_WIDTH, start.width + (event.clientX - start.pointerX)),
        height: Math.max(MIN_WINDOW_HEIGHT, start.height + (event.clientY - start.pointerY)),
      });
    };

    const handlePointerUp = () => {
      resizeStartRef.current = null;
      setIsResizing(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [id, isMaximized, isResizing, updateWindowSize]);

  const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isMaximized) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    bringToFront(id);
    resizeStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      width: size.width,
      height: size.height,
    };
    setIsResizing(true);
  };

  return (
    <motion.div
      layout
      drag={!isMaximized && !isResizing}
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={constraintsRef}
      dragElastic={0}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        opacity: isMinimized ? 0 : 1,
        scale: isMinimized ? 0.88 : 1,
        y: isMinimized ? 180 : 0,
      }}
      exit={{ opacity: 0, scale: 0.85, y: 28 }}
      onDragEnd={(event) => {
        const target = event.currentTarget as HTMLElement | null;
        if (!target || isMaximized || isResizing) {
          return;
        }

        const rect = target.getBoundingClientRect();
        updateWindowPosition(id, {
          x: Math.round(rect.left),
          y: Math.round(rect.top),
        });
      }}
      onPointerDown={() => bringToFront(id)}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
        pointerEvents: isMinimized ? 'none' : 'auto',
      }}
      className={twMerge(
        clsx(
          "window-surface desktop-shadow absolute flex flex-col overflow-hidden rounded-[1.55rem] pointer-events-auto transition-[border-radius,width,height] duration-300 ease-out min-w-[400px] min-h-[300px]",
          isActive ? "opacity-100" : "opacity-95 saturate-[0.82]",
          isMaximized ? "rounded-[1.2rem]" : "",
        ),
      )}
    >
      <div className="window-toolbar flex h-12 w-full items-center justify-center border-b border-white/10 px-4">
        <div className="absolute left-4 z-20">
          <TrafficLights
            onClose={() => closeWindow(id)}
            onMinimize={() => toggleMinimizeWindow(id)}
            onMaximize={() => toggleMaximizeWindow(id)}
          />
        </div>
        <div
          onPointerDown={(event) => {
            bringToFront(id);
            if (!isMaximized) {
              dragControls.start(event);
            }
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        />
        {showTitle ? (
          <span className="pointer-events-none text-[15px] font-semibold text-slate-700 dark:text-white/78">
            {title}
          </span>
        ) : null}
      </div>

      <div
        className={twMerge(
          clsx(
            "min-h-0 min-w-0 flex-1 overflow-auto rounded-b-[1.4rem] bg-[rgba(15,15,18,0.18)]",
            contentClassName,
          ),
        )}
      >
        <div className="h-full w-full min-w-0 min-h-0 overflow-auto">
          {children || (
            <div className="flex h-full items-center justify-center text-sm text-white/45">
              Content for &quot;{title}&quot; is on the way.
            </div>
          )}
        </div>
      </div>
      {!isMaximized ? (
        <div
          onPointerDown={startResize}
          className="absolute bottom-0 right-0 z-20 h-5 w-5 cursor-se-resize rounded-br-[1.4rem] bg-transparent"
          aria-hidden="true"
        />
      ) : null}
    </motion.div>
  );
});
