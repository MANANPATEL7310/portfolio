'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface DockItemProps {
  label: string;
  icon: string;
  iconSize?: 'standard' | 'compact';
  isOpen?: boolean;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export function DockItem({
  label,
  icon,
  iconSize = 'standard',
  isOpen = false,
  onClick,
  onContextMenu,
}: DockItemProps) {
  return (
    <div className="group relative flex cursor-pointer flex-col items-center px-2" onContextMenu={onContextMenu}>
      <div className="pointer-events-none absolute -top-14 mb-2 rounded-xl bg-black/80 px-3 py-1.5 text-xs text-white opacity-0 shadow-xl transition duration-200 group-hover:opacity-100">
        {label}
      </div>

      <motion.button
        whileHover={{ scale: 1.15, y: -12 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="flex h-14 w-14 origin-bottom items-end justify-center transform"
        onClick={onClick}
      >
        <Image
          src={icon}
          alt={label}
          width={60}
          height={60}
          className={`object-contain drop-shadow-2xl ${
            iconSize === 'compact' ? 'h-10 w-auto' : 'h-14 w-14'
          }`}
          sizes="60px"
        />
      </motion.button>

      <div
        className={`absolute -bottom-2 h-1 w-1 rounded-full transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundColor: 'currentColor' }}
      />
    </div>
  );
}
