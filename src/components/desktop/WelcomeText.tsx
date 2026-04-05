'use client';

import { useMemo, useRef, useState, type CSSProperties } from 'react';
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
        <InteractiveTextLine
          text={profile.greeting}
          variant="greeting"
          className="text-[clamp(2.2rem,4vw,5rem)] font-light tracking-[-0.05em] text-white/92"
        />
        <InteractiveTextLine
          text={profile.signature}
          variant="signature"
          className="leading-none text-white"
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(6rem, 13vw, 13rem)',
          }}
        />
      </motion.div>
    </div>
  );
}

function InteractiveTextLine({
  text,
  className,
  style,
  variant,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  variant: 'greeting' | 'signature';
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const characters = useMemo(() => Array.from(text), [text]);

  return (
    <p className={className} style={style}>
      {characters.map((character, index) => {
        if (character === ' ') {
          return <span key={`${variant}-space-${index}`} className="inline-block w-[0.32em]" />;
        }

        const distance = hoveredIndex === null ? null : Math.abs(hoveredIndex - index);
        const isActive = distance === 0;
        const isNear = distance === 1;
        const isWave = distance === 2;

        const y = hoveredIndex === null ? 0 : isActive ? -16 : isNear ? -9 : isWave ? -4 : 0;
        const rotate = variant === 'signature'
          ? hoveredIndex === null
            ? 0
            : isActive
              ? -5
              : isNear
                ? -2
                : 0
          : 0;
        const scale = hoveredIndex === null ? 1 : isActive ? 1.18 : isNear ? 1.09 : isWave ? 1.03 : 1;

        return (
          <motion.span
            key={`${variant}-${character}-${index}`}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            animate={{
              y,
              rotate,
              scale,
              color: isActive ? '#f8fbff' : '#ffffff',
              textShadow:
                variant === 'signature'
                  ? isActive
                    ? '0 10px 28px rgba(255,255,255,0.28), 0 28px 48px rgba(2,6,23,0.5)'
                    : isNear
                      ? '0 8px 22px rgba(255,255,255,0.2), 0 22px 42px rgba(2,6,23,0.42)'
                      : '0 22px 40px rgba(2,6,23,0.42)'
                  : isActive
                    ? '0 6px 18px rgba(255,255,255,0.22), 0 18px 42px rgba(0,0,0,0.38)'
                    : '0 18px 42px rgba(0,0,0,0.32)',
            }}
            transition={{
              type: 'spring',
              stiffness: 360,
              damping: 22,
              mass: 0.55,
            }}
            className={`inline-block origin-bottom will-change-transform ${
              isActive ? 'font-semibold' : isNear ? 'font-medium' : ''
            }`}
          >
            {character}
          </motion.span>
        );
      })}
    </p>
  );
}
