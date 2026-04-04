'use client';

import { motion } from 'framer-motion';
import { useWindowStore } from '@/store/useWindowStore';

interface DesktopIconProps {
  id: string;
  label: string;
  icon: string;
  windowTitle?: string;
  constraintsRef: React.RefObject<Element | null>;
  initialX?: number;
  initialY?: number;
}

export function DesktopIcon({
  id,
  label,
  icon,
  windowTitle,
  constraintsRef,
  initialX = 0,
  initialY = 0,
}: DesktopIconProps) {
  const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0}
      dragMomentum={false}
      initial={{ x: initialX, y: initialY }}
      whileDrag={{ scale: 1.05, zIndex: 200 }}
      onDoubleClick={() => openWindow(id, windowTitle ?? label)}
      className="absolute flex flex-col items-center gap-1.5 cursor-default group z-[8] select-none"
      style={{ top: 0, left: 0 }}
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="w-16 h-16 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-all"
      >
        <img src={icon} alt={label} className="w-full h-full object-contain drop-shadow-xl" />
      </motion.div>

      <div className="px-2 py-0.5 rounded-md text-center">
        <span className="text-white text-[11px] font-medium drop-shadow-md leading-tight" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}
