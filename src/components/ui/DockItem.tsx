'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface DockItemProps {
  label: string;
  icon: string;
  isOpen?: boolean;
  onClick?: () => void;
}

export function DockItem({ label, icon, isOpen = false, onClick }: DockItemProps) {
  return (
    <div className="group relative flex cursor-pointer flex-col items-center">
      <div className="pointer-events-none absolute -top-12 rounded-xl bg-black/80 px-3 py-1.5 text-xs text-white opacity-0 shadow-xl transition group-hover:opacity-100">
        {label}
      </div>

      <motion.button
        whileHover={{ scale: 1.4, y: -10 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="transform origin-bottom"
        onClick={onClick}
      >
        <Image src={icon} alt={label} width={70} height={70} className="w-[4.4rem] drop-shadow-2xl" sizes="70px" />
      </motion.button>

      <div
        className={`absolute -bottom-1.5 h-1 w-1 rounded-full transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundColor: 'currentColor' }}
      />
    </div>
  );
}
