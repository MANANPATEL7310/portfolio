'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function BootScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Setup initial state
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(logoRef.current, { opacity: 0, scale: 0.95 });
      gsap.set(progressRef.current, { scaleX: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: onComplete
          });
        }
      });

      tl.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      });

      tl.to(progressRef.current, {
        scaleX: 1,
        duration: 1.5,
        ease: "power1.inOut"
      }, "+=0.2");
      
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-[60px]">
        <img 
          ref={logoRef}
          src="/assets/Apple Logo.svg" 
          alt="Boot Logo" 
          className="w-20 h-20 invert opacity-0"
        />
        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div ref={progressRef} className="h-full bg-white w-full origin-left transform scale-x-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}
