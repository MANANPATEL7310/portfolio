'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";

export function WelcomeText() {
  const profile = usePortfolioDataStore((state) => state.profile);
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-140, 140], [10, -10]), { stiffness: 160, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-220, 220], [-10, 10]), { stiffness: 160, damping: 20 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-8 pt-12"
      style={{ perspective: '900px' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="pointer-events-auto flex cursor-default flex-col items-center gap-1 text-center select-none"
      >
        <p
          className="text-[clamp(2.2rem,4vw,5rem)] font-light tracking-[-0.05em] text-white/92 drop-shadow-lg"
          style={{ textShadow: "0 18px 42px rgba(0,0,0,0.32)" }}
        >
          {profile.greeting}
        </p>
        <motion.p
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="leading-none drop-shadow-2xl"
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(6rem, 13vw, 13rem)',
            color: "#ffffff",
            filter: 'drop-shadow(0 22px 40px rgba(2,6,23,0.42))',
          }}
        >
          {profile.signature}
        </motion.p>
      </motion.div>
    </div>
  );
}
