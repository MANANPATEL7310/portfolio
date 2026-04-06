'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

import type { ResolvedThemeMode, WallpaperOption } from '@/lib/dataService';

export function WallpaperRenderer({
  wallpaper,
  theme,
  mobile = false,
}: {
  wallpaper: WallpaperOption;
  theme: ResolvedThemeMode;
  mobile?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const posterSrc = wallpaper.posterSrc ?? wallpaper.src ?? '/portfolio/wallpaper.png';
  const shouldAnimate = wallpaper.type === 'animated' && !prefersReducedMotion && !mobile;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Image
        src={posterSrc}
        alt="Desktop wallpaper"
        fill
        priority
        className={`object-cover transition duration-700 ${
          theme === 'light' ? 'scale-[1.03] saturate-[0.78] brightness-[1.12]' : ''
        }`}
        sizes="100vw"
      />

      {shouldAnimate ? (
        wallpaper.renderer === 'glass-wave' ? (
          <GlassWaveWallpaper />
        ) : (
          <AuroraDriftWallpaper />
        )
      ) : null}
    </div>
  );
}

function AuroraDriftWallpaper() {
  return (
    <>
      <motion.div
        className="absolute -left-[12%] top-[8%] h-[44%] w-[46%] rounded-full bg-[radial-gradient(circle_at_center,rgba(103,186,255,0.32),transparent_68%)] blur-3xl"
        animate={{
          x: [0, 44, -18, 0],
          y: [0, 20, 36, 0],
          scale: [1, 1.08, 0.97, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-8%] top-[14%] h-[42%] w-[38%] rounded-full bg-[radial-gradient(circle_at_center,rgba(133,232,215,0.24),transparent_70%)] blur-3xl"
        animate={{
          x: [0, -46, 16, 0],
          y: [0, 28, -10, 0],
          scale: [1, 0.94, 1.05, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-14%] left-[18%] h-[46%] w-[54%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_72%)] blur-[90px]"
        animate={{
          x: [0, 32, -20, 0],
          y: [0, -22, 10, 0],
          opacity: [0.52, 0.7, 0.46, 0.52],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_36%,rgba(255,255,255,0.06)_64%,transparent)]"
        animate={{ opacity: [0.22, 0.34, 0.24, 0.22] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

function GlassWaveWallpaper() {
  return (
    <>
      <motion.div
        className="absolute inset-x-[-8%] top-[16%] h-[28%] rounded-[50%] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))] blur-[2px]"
        animate={{
          x: [0, 40, -22, 0],
          y: [0, 8, -6, 0],
          opacity: [0.28, 0.42, 0.3, 0.28],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-x-[-10%] top-[35%] h-[34%] rounded-[50%] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03))]"
        animate={{
          x: [0, -52, 24, 0],
          y: [0, -10, 10, 0],
          opacity: [0.18, 0.32, 0.22, 0.18],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_65%,rgba(145,198,255,0.18),transparent_42%),radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.12),transparent_32%)]"
        animate={{ opacity: [0.42, 0.6, 0.45, 0.42] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-y-0 right-[-12%] w-[34%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)] blur-2xl"
        animate={{
          x: [0, -34, 18, 0],
          opacity: [0.2, 0.34, 0.22, 0.2],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}
