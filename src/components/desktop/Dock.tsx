'use client';

import { useWindowStore } from '@/store/useWindowStore';
import { useSystemStore } from '@/store/useSystemStore';
import { motion } from 'framer-motion';

const DOCK_APPS = [
  { id: 'finder', name: 'Finder', icon: '/assets/Finder.png' },
  { id: 'about', name: 'About Me', icon: '/assets/App Icon-5.png' },
  { id: 'projects', name: 'Projects', icon: '/assets/App Icon-3.png' },
  { id: 'resume', name: 'Resume', icon: '/assets/App Icon-7.png' },
  { id: 'spotlight-btn', name: 'Spotlight', icon: '/assets/App Icon-10.png', isSpotlight: true },
];

export function Dock() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const windows = useWindowStore((s) => s.windows);
  const toggleSpotlight = useSystemStore((s) => s.toggleSpotlight);

  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center z-[9999] pointer-events-none">
      <div
        className="flex items-end gap-3 px-3 pb-2 pt-2 rounded-2xl mx-auto pointer-events-auto shadow-2xl"
        style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.25)',
        }}
      >
        {DOCK_APPS.map((app) => {
          const isOpen = windows.find((w) => w.id === app.id)?.isOpen;
          const isSpotlight = (app as { isSpotlight?: boolean }).isSpotlight;

          return (
            <div key={`${app.id}-${app.name}`} className="relative group cursor-pointer flex flex-col items-center">
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none shadow-xl">
                {app.name}
              </div>

              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.4, y: -10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => isSpotlight ? toggleSpotlight() : openWindow(app.id, app.name)}
                className="transform origin-bottom"
              >
                <img src={app.icon} alt={app.name} className="w-12 h-12 object-contain drop-shadow-xl" />
              </motion.div>

              {/* Active dot */}
              <div className={`absolute -bottom-1.5 w-1 h-1 rounded-full bg-white/80 transition-opacity ${isOpen && !isSpotlight ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
