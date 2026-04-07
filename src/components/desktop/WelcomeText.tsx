'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import type { ResolvedThemeMode } from '@/lib/dataService';
import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";

export function WelcomeText({
  enableAutoIntro = false,
  theme,
}: {
  enableAutoIntro?: boolean;
  theme: ResolvedThemeMode;
}) {
  const profile = usePortfolioDataStore((state) => state.profile);
  const ref = useRef<HTMLDivElement>(null);
  const hasPlayedIntroRef = useRef(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [autoPlayToken, setAutoPlayToken] = useState(0);

  const rotateX = useSpring(useTransform(mouseY, [-140, 140], [10, -10]), { stiffness: 160, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-220, 220], [-10, 10]), { stiffness: 160, damping: 20 });

  useEffect(() => {
    if (!enableAutoIntro || typeof window === 'undefined') {
      return;
    }

    if (hasPlayedIntroRef.current) {
      return;
    }

    hasPlayedIntroRef.current = true;

    const timer = window.setTimeout(() => {
      setAutoPlayToken(Date.now());
    }, 260);

    return () => window.clearTimeout(timer);
  }, [enableAutoIntro]);

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
          theme={theme}
          autoPlayToken={autoPlayToken}
          autoPlayDelay={120}
          className={`max-w-[21ch] text-[clamp(1.55rem,2.9vw,3.35rem)] font-[220] tracking-[-0.045em] sm:max-w-none ${
            theme === 'light' ? 'text-black/78' : 'text-white/88'
          }`}
        />
        <InteractiveTextLine
          text={profile.signature}
          variant="signature"
          theme={theme}
          autoPlayToken={autoPlayToken}
          autoPlayDelay={380}
          className={`leading-[0.9] ${theme === 'light' ? 'text-[#101216]' : 'text-white'}`}
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
  theme,
  autoPlayToken,
  autoPlayDelay = 0,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  variant: 'greeting' | 'signature';
  theme: ResolvedThemeMode;
  autoPlayToken?: number;
  autoPlayDelay?: number;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [autoIndex, setAutoIndex] = useState<number | null>(null);
  const [underlinePulseKey, setUnderlinePulseKey] = useState<number>(0);
  const characters = useMemo(() => Array.from(text), [text]);
  const playableIndices = useMemo(
    () => characters.map((character, index) => (character === ' ' ? null : index)).filter((value): value is number => value !== null),
    [characters],
  );

  useEffect(() => {
    if (!autoPlayToken || playableIndices.length === 0) {
      return;
    }

    let frame = 0;
    const totalFrames = playableIndices.length + 2;

    const startTimer = window.setTimeout(() => {
      const intervalId = window.setInterval(() => {
        if (frame >= totalFrames) {
          setAutoIndex(null);
          window.clearInterval(intervalId);
          return;
        }

        setAutoIndex(playableIndices[frame] ?? null);
        frame += 1;
      }, variant === 'signature' ? 58 : 46);
    }, autoPlayDelay);

    return () => {
      window.clearTimeout(startTimer);
      setAutoIndex(null);
    };
  }, [autoPlayDelay, autoPlayToken, playableIndices, variant]);

  useEffect(() => {
    if (variant !== 'signature' || !autoPlayToken) {
      return;
    }

    const timer = window.setTimeout(() => {
      setUnderlinePulseKey(autoPlayToken);
    }, autoPlayDelay + 220);

    return () => window.clearTimeout(timer);
  }, [autoPlayDelay, autoPlayToken, variant]);

  const activeIndex = hoveredIndex ?? autoIndex;
  const idleColor = theme === 'light'
    ? variant === 'signature'
      ? '#111418'
      : 'rgba(17, 20, 24, 0.82)'
    : '#ffffff';
  const activeColor = theme === 'light' ? '#06080b' : '#f8fbff';
  const signatureShadow = theme === 'light'
    ? isSignatureShadow(activeIndex)
    : isSignatureShadow(activeIndex, true);
  const greetingShadow = theme === 'light'
    ? isGreetingShadow(activeIndex)
    : isGreetingShadow(activeIndex, true);

  return (
    <p
      className={`relative inline-block ${className ?? ''}`}
      style={style}
      onMouseEnter={() => {
        if (variant === 'signature') {
          setUnderlinePulseKey(Date.now());
        }
      }}
    >
      {characters.map((character, index) => {
        if (character === ' ') {
          return <span key={`${variant}-space-${index}`} className="inline-block w-[0.32em]" />;
        }

        const distance = activeIndex === null ? null : Math.abs(activeIndex - index);
        const isActive = distance === 0;
        const isNear = distance === 1;
        const isWave = distance === 2;

        const y = activeIndex === null ? 0 : variant === 'signature' ? isActive ? -6 : isNear ? -3 : isWave ? -1 : 0 : isActive ? -4 : isNear ? -2 : isWave ? -0.5 : 0;
        const rotate = variant === 'signature'
          ? activeIndex === null
            ? 0
            : isActive
              ? -2
              : isNear
                ? -0.5
                : 0
          : 0;
        const scale = activeIndex === null ? 1 : variant === 'signature' ? isActive ? 1.045 : isNear ? 1.02 : isWave ? 1.008 : 1 : isActive ? 1.035 : isNear ? 1.015 : 1.004;

        return (
          <motion.span
            key={`${variant}-${character}-${index}`}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            animate={{
              y,
              rotate,
              scale,
              color: isActive ? activeColor : idleColor,
              textShadow:
                variant === 'signature'
                  ? signatureShadow(distance)
                  : greetingShadow(distance),
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
      {variant === 'signature' && underlinePulseKey > 0 ? (
        <>
          <motion.span
            key={`signature-underline-glow-${underlinePulseKey}`}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 0], opacity: [0, 0.5, 0.18, 0] }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-none absolute left-1/2 bottom-[-0.085em] h-[0.09em] w-[72%] -translate-x-1/2 rounded-full blur-[6px] ${
              theme === 'light' ? 'bg-black/24' : 'bg-white/35'
            }`}
            style={{ transformOrigin: 'center center' }}
          />
          <motion.span
            key={`signature-underline-core-${underlinePulseKey}`}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 0], opacity: [0, 0.92, 0.82, 0] }}
            transition={{ duration: 0.84, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-none absolute left-1/2 bottom-[-0.03em] h-[2px] w-[64%] -translate-x-1/2 rounded-full ${
              theme === 'light'
                ? 'bg-[linear-gradient(90deg,rgba(0,0,0,0),rgba(12,16,22,0.92)_18%,rgba(12,16,22,0.92)_82%,rgba(0,0,0,0))]'
                : 'bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.98)_18%,rgba(255,255,255,0.98)_82%,rgba(255,255,255,0))]'
            }`}
            style={{ transformOrigin: 'center center' }}
          />
        </>
      ) : null}
    </p>
  );
}

function isSignatureShadow(activeIndex: number | null, dark = false) {
  return (distance: number | null) => {
    if (dark) {
      if (distance === 0) {
        return '0 4px 12px rgba(255,255,255,0.1), 0 18px 34px rgba(2,6,23,0.36)';
      }
      if (distance === 1) {
        return '0 3px 10px rgba(255,255,255,0.08), 0 14px 28px rgba(2,6,23,0.3)';
      }
      return '0 12px 24px rgba(2,6,23,0.27)';
    }

    if (distance === 0) {
      return '0 4px 14px rgba(255,255,255,0.18), 0 14px 30px rgba(31,59,99,0.16)';
    }
    if (distance === 1) {
      return '0 2px 8px rgba(255,255,255,0.16), 0 10px 22px rgba(31,59,99,0.12)';
    }
    return '0 10px 24px rgba(56,88,140,0.14)';
  };
}

function isGreetingShadow(activeIndex: number | null, dark = false) {
  return (distance: number | null) => {
    if (dark) {
      if (distance === 0) {
        return '0 3px 10px rgba(255,255,255,0.1), 0 12px 24px rgba(0,0,0,0.3)';
      }
      return '0 10px 22px rgba(0,0,0,0.24)';
    }

    if (distance === 0) {
      return '0 3px 10px rgba(255,255,255,0.18), 0 10px 22px rgba(37,61,107,0.12)';
    }
    return '0 8px 18px rgba(37,61,107,0.1)';
  };
}
