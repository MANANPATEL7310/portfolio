'use client';

import { useEffect, useState } from 'react';
import { GlassWrapper } from '../ui/GlassWrapper';

export function MenuBar() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateRealTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateRealTime();
    const interval = setInterval(updateRealTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassWrapper className="fixed top-0 left-0 right-0 h-7 px-4 flex items-center justify-between text-xs font-medium z-[9999] rounded-none border-t-0 border-x-0 shadow-sm mac-glass pointer-events-auto">
      <div className="flex items-center space-x-4 cursor-default">
        <img src="/assets/Apple Logo.svg" alt="Apple" className="w-[14px] h-[14px] opacity-90 transition-transform hover:scale-105" />
        <span className="font-bold">Finder</span>
        <span className="hidden sm:inline">File</span>
        <span className="hidden sm:inline">Edit</span>
        <span className="hidden sm:inline">View</span>
        <span className="hidden sm:inline">Go</span>
        <span className="hidden sm:inline">Window</span>
        <span className="hidden sm:inline">Help</span>
      </div>

      <div className="flex items-center space-x-4 cursor-default tracking-wide font-mono">
        <span className="hidden sm:inline opacity-80">100%</span>
        <span>{time}</span>
      </div>
    </GlassWrapper>
  );
}
