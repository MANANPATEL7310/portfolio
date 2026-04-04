'use client';

import { useWindowStore } from '@/store/useWindowStore';
import { GlassWrapper } from '../ui/GlassWrapper';
import { motion } from 'framer-motion';

const DOCK_APPS = [
  { id: 'finder', name: 'Finder', icon: '/assets/Finder.png' },
  { id: 'about', name: 'About Me', icon: '/assets/App Icon.png' },
  { id: 'projects', name: 'Projects', icon: '/assets/_System App Icon.png' },
  { id: 'resume', name: 'Resume', icon: '/assets/App Icon-2.png' },
  { id: 'settings', name: 'Settings', icon: '/assets/App Icon-3.png' }
];

export function Dock() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);

  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center z-[9999] pointer-events-none">
      <GlassWrapper className="flex items-end gap-3 px-3 pb-2 pt-2 rounded-2xl mac-glass mx-auto pointer-events-auto shadow-2xl">
        {DOCK_APPS.map((app) => {
          const isOpen = windows.find((w) => w.id === app.id)?.isOpen;
          
          return (
            <div key={app.id} className="relative group cursor-pointer flex flex-col items-center">
              
              {/* Tooltip */}
              <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap pointer-events-none shadow-lg">
                {app.name}
              </div>

              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.4, y: -10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => openWindow(app.id, app.name)}
                className="transform origin-bottom"
              >
                <img src={app.icon} alt={app.name} className="w-12 h-12 object-contain drop-shadow-xl" />
              </motion.div>
              
              {/* Active Dot */}
              <div className={`absolute -bottom-1.5 w-1 h-1 rounded-full bg-black dark:bg-white/80 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          );
        })}
      </GlassWrapper>
    </div>
  );
}
