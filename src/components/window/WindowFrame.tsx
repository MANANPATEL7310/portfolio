'use client';

import clsx from "clsx";
import { motion, useDragControls } from 'framer-motion';
import { twMerge } from "tailwind-merge";

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
  sizeClassName: string;
  contentClassName?: string;
  showTitle?: boolean;
  zIndex: number;
}

export function WindowFrame({
  id,
  title,
  isActive,
  isMinimized,
  isMaximized,
  children,
  constraintsRef,
  initialPosition = { x: 50, y: 50 },
  sizeClassName,
  contentClassName,
  showTitle = true,
  zIndex,
}: WindowFrameProps) {
  const bringToFront = useWindowStore((state) => state.bringToFront);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const toggleMinimizeWindow = useWindowStore((state) => state.toggleMinimizeWindow);
  const toggleMaximizeWindow = useWindowStore((state) => state.toggleMaximizeWindow);
  const dragControls = useDragControls();

  return (
    <motion.div
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={constraintsRef}
      dragElastic={0}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.95, x: initialPosition.x, y: initialPosition.y }}
      animate={{
        opacity: isMinimized ? 0 : 1,
        scale: isMinimized ? 0.92 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      onPointerDown={() => bringToFront(id)}
      style={{
        zIndex,
        pointerEvents: isMinimized ? 'none' : 'auto'
      }}
      className={twMerge(
        clsx(
          "window-surface desktop-shadow absolute flex flex-col overflow-hidden rounded-[1.55rem] pointer-events-auto transition-[border-radius,width,height] duration-300 ease-out",
          isActive ? "opacity-100" : "opacity-95 saturate-[0.82]",
          isMaximized
            ? "fixed inset-x-5 bottom-[7.3rem] top-14 !h-auto !w-auto rounded-[1.2rem]"
            : sizeClassName,
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
            "min-h-0 flex-1 overflow-hidden rounded-b-[1.4rem] bg-[rgba(15,15,18,0.18)]",
            contentClassName,
          ),
        )}
      >
        {children || (
          <div className="flex h-full items-center justify-center text-sm text-white/45">
            Content for &quot;{title}&quot; is on the way.
          </div>
        )}
      </div>
    </motion.div>
  );
}
