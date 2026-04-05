'use client';

import { motion } from 'framer-motion';
import Image, { type StaticImageData } from "next/image";

import { getResolvedTheme, useSystemStore } from '@/store/useSystemStore';
import { useWindowStore } from '@/store/useWindowStore';

interface DesktopIconProps {
  id: string;
  label: string;
  title: string;
  icon: string | StaticImageData;
  desktopPosition: { x: number; y: number };
  constraintsRef: React.RefObject<Element | null>;
}

export function DesktopIcon({
  id,
  label,
  title,
  icon,
  desktopPosition,
  constraintsRef,
}: DesktopIconProps) {
  const openWindow = useWindowStore((state) => state.openWindow);
  const savedPosition = useWindowStore((state) => state.desktopIconPositions[id]);
  const setDesktopIconPosition = useWindowStore((state) => state.setDesktopIconPosition);
  const theme = useSystemStore((state) => getResolvedTheme(state.theme, state.systemTheme));
  const selectedDesktopItemId = useSystemStore((state) => state.selectedDesktopItemId);
  const selectDesktopItem = useSystemStore((state) => state.selectDesktopItem);

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
    : desktopPosition.x < 0
      ? { right: Math.abs(desktopPosition.x), top: desktopPosition.y }
      : { left: desktopPosition.x, top: desktopPosition.y };

  return (
    <motion.button
      drag
      dragConstraints={constraintsRef}
      dragElastic={0}
      dragMomentum={false}
      onClick={(event) => {
        event.stopPropagation();
        selectDesktopItem(id);
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        selectDesktopItem(id);
        openWindow(id, title);
      }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, zIndex: 200 }}
      className={`absolute z-[8] flex w-44 cursor-default flex-col items-center gap-3 rounded-2xl px-3 py-2 text-center select-none transition ${
        selectedDesktopItemId === id ? "bg-white/16 ring-1 ring-white/28 backdrop-blur-md" : ""
      }`}
      style={positionStyle}
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.22)] transition-all"
      >
        <Image src={icon} alt={label} width={80} height={80} className="w-20 drop-shadow-2xl" sizes="80px" />
      </motion.div>

      <div className="px-2 py-0.5 text-center">
        <span
          className={`text-[18px] font-medium leading-[1.12] drop-shadow-md ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
          style={{
            textShadow:
              theme === 'dark'
                ? '0 2px 6px rgba(0,0,0,0.8)'
                : '0 2px 6px rgba(255,255,255,0.35)',
          }}
        >
          {label}
        </span>
      </div>
    </motion.button>
  );
}
