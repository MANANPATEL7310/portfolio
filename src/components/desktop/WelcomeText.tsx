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
        className="pointer-events-auto flex cursor-default flex-col items-center gap-2 text-center select-none"
      >
        <InteractiveTextLine
          text={profile.greeting}
          variant="greeting"
          className="max-w-[21ch] text-[clamp(1.55rem,2.9vw,3.35rem)] font-[220] tracking-[-0.045em] text-white/88 sm:max-w-none"
        />
        <InteractiveTextLine
          text={profile.signature}
          variant="signature"
          className="leading-[0.9] text-white"
          style={{
            fontFamily: '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
            fontStyle: 'italic',
            fontWeight: 200,
            letterSpacing: '-0.055em',
            fontSize: 'clamp(4.15rem, 9.1vw, 7.9rem)',
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

        const y = hoveredIndex === null ? 0 : variant === 'signature' ? isActive ? -6 : isNear ? -3 : isWave ? -1 : 0 : isActive ? -4 : isNear ? -2 : isWave ? -0.5 : 0;
        const rotate = variant === 'signature'
          ? hoveredIndex === null
            ? 0
            : isActive
              ? -2
              : isNear
                ? -0.5
                : 0
          : 0;
        const scale = hoveredIndex === null ? 1 : variant === 'signature' ? isActive ? 1.045 : isNear ? 1.02 : isWave ? 1.008 : 1 : isActive ? 1.035 : isNear ? 1.015 : 1.004;

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
                    ? '0 4px 12px rgba(255,255,255,0.1), 0 18px 34px rgba(2,6,23,0.36)'
                    : isNear
                      ? '0 3px 10px rgba(255,255,255,0.08), 0 14px 28px rgba(2,6,23,0.3)'
                      : '0 12px 24px rgba(2,6,23,0.27)'
                  : isActive
                    ? '0 3px 10px rgba(255,255,255,0.1), 0 12px 24px rgba(0,0,0,0.3)'
                    : '0 10px 22px rgba(0,0,0,0.24)',
            }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 26,
              mass: 0.7,
            }}
            className={`inline-block origin-bottom will-change-transform ${
              variant === 'signature'
                ? isActive
                  ? 'font-normal'
                  : ''
                : isActive
                  ? 'font-medium'
                  : isNear
                    ? 'font-normal'
                    : ''
            }`}
          >
            {character}
          </motion.span>
        );
      })}
    </p>
  );
}
