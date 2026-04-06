'use client';

import { motion } from 'framer-motion';
import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from 'react';

import { snapDesktopPosition } from '@/lib/desktopGrid';
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
  const isFolderIcon = typeof icon === 'string' && icon.includes('folder');
  
  const [iconSize, setIconSize] = useState(76);
  const [containerWidth, setContainerWidth] = useState(148);
  const [textSize, setTextSize] = useState('15px');
  const [imageSize, setImageSize] = useState(92);
  
  useEffect(() => {
    const updateSizes = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        setIconSize(58);
        setContainerWidth(118);
        setTextSize('13px');
        setImageSize(74);
      } else if (screenWidth < 1024) {
        setIconSize(68);
        setContainerWidth(132);
        setTextSize('14px');
        setImageSize(82);
      } else {
        setIconSize(76);
        setContainerWidth(148);
        setTextSize('15px');
        setImageSize(92);
      }
    };
    
    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent) => {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const snappedPosition = snapDesktopPosition({
      x: Math.round(rect.left),
      y: Math.round(rect.top),
    });

    setDesktopIconPosition(id, {
      x: snappedPosition.x,
      y: snappedPosition.y,
    });
  };

  const positionStyle = savedPosition
    ? { left: savedPosition.x, top: savedPosition.y }
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
      className={`absolute z-[8] flex cursor-default flex-col items-center gap-1.5 rounded-[18px] px-2 py-1.5 text-center select-none transition ${
        selectedDesktopItemId === id ? "bg-white/16 ring-1 ring-white/28 backdrop-blur-md" : ""
      }`}
      style={{
        ...positionStyle,
        width: `${containerWidth}px`
      }}
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="transition-all group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.18)]"
      >
        <Image
          src={icon}
          alt={label}
          width={isFolderIcon ? imageSize : iconSize}
          height={iconSize}
          className="object-contain drop-shadow-[0_12px_22px_rgba(7,20,56,0.24)]"
          sizes={`${isFolderIcon ? imageSize : iconSize}px`}
          style={{
            width: `${isFolderIcon ? imageSize : iconSize}px`,
            height: `${iconSize}px`,
            imageRendering: 'auto',
          }}
        />
      </motion.div>

      <div className="px-1 text-center">
        <span
          className={`font-medium leading-[1.22] drop-shadow-md ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
          style={{
            fontSize: textSize,
            textShadow:
              theme === 'dark'
                ? '0 2px 10px rgba(0,0,0,0.68)'
                : '0 2px 6px rgba(255,255,255,0.3)',
          }}
        >
          {label}
        </span>
      </div>
    </motion.button>
  );
}
