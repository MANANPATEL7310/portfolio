'use client';

import { motion } from 'framer-motion';
import Image from "next/image";

import type { StaticImageData } from "next/image";

import { useWindowStore } from '@/store/useWindowStore';
import type { WindowId } from "@/data/portfolio";

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

  return (
    <motion.button
      drag
      dragConstraints={constraintsRef}
      dragElastic={0}
      dragMomentum={false}
      whileDrag={{ scale: 1.05, zIndex: 200 }}
      onDoubleClick={() => openWindow(id, title)}
      className="absolute z-[8] flex w-44 cursor-default flex-col items-center gap-3 rounded-2xl px-3 py-2 text-center select-none"
      style={side === "left" ? { left: 30, top } : { right: 36, top }}
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
          className="text-[18px] font-medium leading-[1.12] text-white drop-shadow-md"
          style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}
        >
          {label}
        </span>
      </div>
    </motion.button>
  );
}
