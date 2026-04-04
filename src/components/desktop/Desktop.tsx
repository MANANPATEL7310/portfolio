'use client';

import { useRef } from 'react';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { WindowManager } from '../window/WindowManager';

export function Desktop() {
  // Pass this ref down so Framer Motion prevents windows dragging off screen
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-gray-900 text-foreground selection:bg-blue-500 selection:text-white"
      ref={constraintsRef}
    >
      {/* Background Wallpaper */}
      <img 
        src="/assets/Desktop Wallpaper.png" 
        alt="macOS Wallpaper" 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" 
      />
      
      {/* Frame Elements */}
      <MenuBar />
      
      {/* Window Manager Layer */}
      <WindowManager constraintsRef={constraintsRef} />

      <Dock />
    </div>
  );
}
