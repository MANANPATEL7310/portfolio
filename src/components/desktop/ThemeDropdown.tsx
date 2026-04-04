'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '@/store/useSystemStore';

interface ThemeDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeDropdown({ isOpen, onClose }: ThemeDropdownProps) {
  const { theme, setTheme } = useSystemStore();

  const handleSet = (t: 'light' | 'dark') => {
    setTheme(t);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Click-away overlay */}
          <div className="fixed inset-0 z-[9990]" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-8 right-2 z-[9991] w-44 rounded-xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(30,30,30,0.92)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div className="p-1 flex flex-col gap-0.5">
              {(['light', 'dark'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleSet(t)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    theme === t
                      ? 'bg-blue-500 text-white'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span className="capitalize">{t === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                  {theme === t && (
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
