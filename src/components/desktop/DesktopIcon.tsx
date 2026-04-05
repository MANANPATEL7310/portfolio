'use client';

import { motion } from 'framer-motion';
import Image from "next/image";

import type { StaticImageData } from "next/image";

import { useWindowStore } from '@/store/useWindowStore';
import type { WindowId } from "@/data/portfolio";
import { getResolvedTheme, useSystemStore } from '@/store/useSystemStore';

interface DesktopIconProps {
  id: WindowId;
  label: string;
  title: string;
  icon: StaticImageData;
  side: "left" | "right";
  top: number;
  constraintsRef: React.RefObject<Element | null>;
}

export function DesktopIcon({
  id,
  label,
  title,
  icon,
  side,
  top,
  constraintsRef,
}: DesktopIconProps) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const savedPosition = useWindowStore((s) => s.desktopIconPositions[id]);
  const setDesktopIconPosition = useWindowStore((s) => s.setDesktopIconPosition);
  const theme = useSystemStore((state) => state.theme);
  const systemTheme = useSystemStore((state) => state.systemTheme);
  const resolvedTheme = getResolvedTheme(theme, systemTheme);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent) => {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    setDesktopIconPosition(id, {
      x: Math.round(rect.left),
      y: Math.round(rect.top),
    });
  };

  const positionStyle = savedPosition
    ? { left: savedPosition.x, top: savedPosition.y }
    : side === "left"
      ? { left: 30, top }
      : { right: 36, top };

  return (
    <motion.button
      drag
      dragConstraints={constraintsRef}
      dragElastic={0}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, zIndex: 200 }}
      onDoubleClick={() => openWindow(id, title)}
      className="absolute z-[8] flex w-44 cursor-default flex-col items-center gap-3 rounded-2xl px-3 py-2 text-center select-none"
      style={positionStyle}
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.22)] transition-all"
      >
        <Image src={icon} alt={label} className="w-20 drop-shadow-2xl" sizes="80px" />
      </motion.div>

      <div className="px-2 py-0.5 text-center">
        <span
          className={`text-[18px] font-medium leading-[1.12] drop-shadow-md ${resolvedTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}
          style={{ textShadow: resolvedTheme === 'dark' ? '0 2px 6px rgba(0,0,0,0.8)' : '0 2px 6px rgba(255,255,255,0.35)' }}
        >
          {label}
        </span>
      </div>
    </motion.button>
  );
}
