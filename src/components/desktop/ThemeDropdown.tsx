'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '@/store/useSystemStore';

interface ThemeDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeDropdown({ isOpen, onClose }: ThemeDropdownProps) {
  const theme = useSystemStore((state) => state.theme);
  const setTheme = useSystemStore((state) => state.setTheme);

  const handleSet = (nextTheme: 'light' | 'dark') => {
    setTheme(nextTheme);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[9990]" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-8 z-[9991] w-60 overflow-hidden rounded-2xl border border-white/35 bg-[#f1f2fb]/88 shadow-[0_20px_60px_rgba(6,7,20,0.35)] backdrop-blur-2xl"
          >
            <div className="p-2">
              {(['light', 'dark'] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => handleSet(value)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[16px] font-medium transition ${
                    theme === value
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-800 hover:bg-slate-900/5'
                  }`}
                >
                  <span>{value === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                  {theme === value && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
