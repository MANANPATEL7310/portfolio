'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// Linter-clean, idiomatic SSR guard: returns true only on the client
// Prevents the "background vs backgroundClip" hydration blank-box bug
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function WelcomeText() {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isMounted = useIsClient();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [12, -12]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-12, 12]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Use backgroundImage (not background shorthand) to avoid React's
  // shorthand vs longhand style conflict warning that caused the blank box bug
  const gradientImage = isHovered
    ? 'linear-gradient(135deg, #ffffff 0%, #a8d8ff 35%, #c084fc 65%, #ffffff 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #ffffffcc 100%)';

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none"
      style={{ perspective: '800px' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="flex flex-col items-center gap-1 select-none pointer-events-auto cursor-default"
      >
        {/* Subtitle */}
        <motion.p
          animate={{
            letterSpacing: isHovered ? '0.35em' : '0.2em',
            color: isHovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)',
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-xl md:text-2xl font-light drop-shadow-lg"
          style={{ textShadow: isHovered ? '0 0 30px rgba(120,180,255,0.5)' : '0 2px 20px rgba(0,0,0,0.5)' }}
        >
          Hey, welcome to my
        </motion.p>

        {/* Hero word — gradient text using backgroundImage (not background shorthand) */}
        <motion.p
          animate={{ scale: isHovered ? 1.04 : 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="font-bold leading-none drop-shadow-2xl"
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(4rem, 12vw, 9rem)',
            transform: 'translateZ(30px)',
            // Only apply gradient clip after client mount to avoid hydration blank-box bug
            backgroundImage: isMounted ? gradientImage : undefined,
            WebkitBackgroundClip: isMounted ? 'text' : undefined,
            WebkitTextFillColor: isMounted ? 'transparent' : 'white',
            backgroundClip: isMounted ? 'text' : undefined,
            color: isMounted ? undefined : 'white',
            filter: isHovered
              ? 'drop-shadow(0 0 30px rgba(168,216,255,0.7)) drop-shadow(0 0 60px rgba(192,132,252,0.4))'
              : 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))',
          }}
        >
          portfolio
        </motion.p>
      </motion.div>
    </div>
  );
}
