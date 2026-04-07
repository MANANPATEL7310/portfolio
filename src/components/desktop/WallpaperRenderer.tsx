'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

import type { ResolvedThemeMode, WallpaperOption } from '@/lib/dataService';

const POINTER_SPRING = { stiffness: 90, damping: 22, mass: 0.8 };

type SceneMotion = {
  sceneTransform: MotionValue<string>;
  nearX: MotionValue<number>;
  nearY: MotionValue<number>;
  farX: MotionValue<number>;
  farY: MotionValue<number>;
  glowX: MotionValue<number>;
  glowY: MotionValue<number>;
  beamX: MotionValue<number>;
  beamY: MotionValue<number>;
};

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

  if (!shouldAnimate) {
    return <StaticWallpaper posterSrc={posterSrc} theme={theme} />;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {wallpaper.renderer === 'glass-wave' ? (
        <GlassHorizonWallpaper theme={theme} />
      ) : (
        <AuroraDepthWallpaper theme={theme} />
      )}
    </div>
  );
}

function StaticWallpaper({
  posterSrc,
  theme,
}: {
  posterSrc: string;
  theme: ResolvedThemeMode;
}) {
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
    </div>
  );
}

function useWallpaperSceneMotion(): SceneMotion {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const nextX = event.clientX / window.innerWidth - 0.5;
      const nextY = event.clientY / window.innerHeight - 0.5;
      pointerX.set(nextX);
      pointerY.set(nextY);
    };

    const resetPointer = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', resetPointer);
    window.addEventListener('blur', resetPointer);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', resetPointer);
      window.removeEventListener('blur', resetPointer);
    };
  }, [pointerX, pointerY]);

  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [9, -9]), POINTER_SPRING);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-12, 12]), POINTER_SPRING);
  const nearX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-28, 28]), POINTER_SPRING);
  const nearY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-18, 18]), POINTER_SPRING);
  const farX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-58, 58]), POINTER_SPRING);
  const farY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-34, 34]), POINTER_SPRING);
  const glowX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-42, 42]), POINTER_SPRING);
  const glowY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-24, 24]), POINTER_SPRING);
  const beamX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-22, 22]), POINTER_SPRING);
  const beamY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-12, 12]), POINTER_SPRING);

  const sceneTransform = useMotionTemplate`perspective(2200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`;

  return {
    sceneTransform,
    nearX,
    nearY,
    farX,
    farY,
    glowX,
    glowY,
    beamX,
    beamY,
  };
}

function DepthLayer({
  depth,
  children,
}: {
  depth: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0"
      style={{
        transform: `translate3d(0, 0, ${depth}px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}

function AuroraDepthWallpaper({ theme }: { theme: ResolvedThemeMode }) {
  const scene = useWallpaperSceneMotion();

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            theme === 'light'
              ? 'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.78), transparent 24%), radial-gradient(circle at 78% 14%, rgba(99,210,255,0.42), transparent 28%), radial-gradient(circle at 50% 62%, rgba(44,104,255,0.28), transparent 36%), linear-gradient(155deg, #d9ebff 0%, #6ab3ff 32%, #0f4bff 70%, #07185c 100%)'
              : 'radial-gradient(circle at 16% 12%, rgba(94,130,255,0.42), transparent 24%), radial-gradient(circle at 78% 18%, rgba(101,255,232,0.24), transparent 30%), radial-gradient(circle at 50% 62%, rgba(88,148,255,0.22), transparent 38%), linear-gradient(150deg, #030a31 0%, #09247b 36%, #0d47c5 70%, #02081f 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12), transparent 42%), linear-gradient(125deg, rgba(255,255,255,0.04), transparent 28%, rgba(255,255,255,0.08) 56%, transparent 75%)',
        }}
      />

      <motion.div
        className="absolute inset-[-12%]"
        style={{ transform: scene.sceneTransform, transformStyle: 'preserve-3d' }}
      >
        <DepthLayer depth={-260}>
          <motion.div
            className="absolute -left-[16%] top-[6%] h-[48%] w-[42%] rounded-full blur-[120px]"
            style={{
              x: scene.farX,
              y: scene.farY,
              background: 'radial-gradient(circle at center, rgba(130,188,255,0.72), rgba(55,112,255,0.18) 52%, transparent 74%)',
            }}
            animate={{
              scale: [1, 1.08, 0.96, 1],
              opacity: [0.9, 0.72, 0.94, 0.9],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[-14%] top-[12%] h-[52%] w-[46%] rounded-full blur-[140px]"
            style={{
              x: scene.glowX,
              y: scene.glowY,
              background: 'radial-gradient(circle at center, rgba(115,255,224,0.42), rgba(67,133,255,0.12) 52%, transparent 76%)',
            }}
            animate={{
              scale: [1, 0.94, 1.08, 1],
              opacity: [0.5, 0.72, 0.48, 0.5],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={-120}>
          <motion.div
            className="absolute left-[-8%] top-[20%] h-[24%] w-[88%] rounded-[999px] border border-white/18 bg-white/[0.08] shadow-[0_20px_80px_rgba(255,255,255,0.06)] backdrop-blur-[10px]"
            style={{ x: scene.beamX, y: scene.beamY, rotate: -17 }}
            animate={{
              opacity: [0.28, 0.42, 0.3, 0.28],
              y: [0, 18, -8, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[-4%] top-[8%] h-[58%] w-[20%] rounded-full blur-[40px]"
            style={{
              x: scene.glowX,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0))',
            }}
            animate={{ opacity: [0.18, 0.34, 0.2, 0.18] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={40}>
          <motion.div
            className="absolute inset-x-[8%] bottom-[6%] h-[54%] rounded-[58px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.05)_28%,rgba(255,255,255,0.02)_72%,rgba(255,255,255,0.16))] shadow-[0_24px_120px_rgba(10,28,84,0.45)] backdrop-blur-[18px]"
            style={{ x: scene.nearX, y: scene.nearY, rotate: -7 }}
            animate={{
              rotate: [-7, -4, -8, -7],
              y: [0, -14, 10, 0],
              opacity: [0.86, 1, 0.92, 0.86],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute left-[26%] top-[18%] h-[16%] w-[32%] rounded-full bg-white/25 blur-[26px]"
            style={{ x: scene.beamX, y: scene.beamY }}
            animate={{ opacity: [0.24, 0.46, 0.28, 0.24] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={150}>
          <motion.div
            className="absolute right-[14%] top-[18%] h-48 w-48 rounded-full border border-white/18 bg-[radial-gradient(circle_at_32%_30%,rgba(255,255,255,0.95),rgba(171,214,255,0.56)_18%,rgba(84,137,255,0.18)_44%,transparent_72%)] shadow-[0_20px_70px_rgba(88,144,255,0.34)] backdrop-blur-[4px]"
            style={{ x: scene.glowX, y: scene.glowY }}
            animate={{
              y: [0, -18, 12, 0],
              scale: [1, 1.05, 0.96, 1],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={230}>
          <motion.div
            className="absolute left-[14%] top-[24%] h-24 w-[22%] rounded-[32px] border border-white/22 bg-white/[0.12] shadow-[0_16px_48px_rgba(255,255,255,0.12)] backdrop-blur-[16px]"
            style={{ x: scene.nearX, y: scene.nearY, rotate: -12 }}
            animate={{
              rotate: [-12, -8, -14, -12],
              y: [0, 10, -12, 0],
            }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 56%, rgba(0,0,0,0.18) 100%)',
        }}
      />
    </>
  );
}

function GlassHorizonWallpaper({ theme }: { theme: ResolvedThemeMode }) {
  const scene = useWallpaperSceneMotion();

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            theme === 'light'
              ? 'radial-gradient(circle at 20% 18%, rgba(255,255,255,0.94), transparent 24%), radial-gradient(circle at 82% 16%, rgba(158,241,255,0.7), transparent 26%), radial-gradient(circle at 30% 76%, rgba(34,132,255,0.42), transparent 34%), linear-gradient(145deg, #f2f7ff 0%, #8ed2ff 28%, #1c84ff 62%, #021458 100%)'
              : 'radial-gradient(circle at 20% 16%, rgba(255,255,255,0.22), transparent 24%), radial-gradient(circle at 84% 18%, rgba(121,236,255,0.26), transparent 28%), radial-gradient(circle at 28% 72%, rgba(46,104,255,0.32), transparent 34%), linear-gradient(150deg, #040d37 0%, #0d2f98 38%, #1269ff 68%, #02091f 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 50% 62%, rgba(255,255,255,0.16), transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.05), transparent 24%, rgba(255,255,255,0.06) 58%, transparent 100%)',
        }}
      />

      <motion.div
        className="absolute inset-[-12%]"
        style={{ transform: scene.sceneTransform, transformStyle: 'preserve-3d' }}
      >
        <DepthLayer depth={-220}>
          <motion.div
            className="absolute inset-x-[-10%] top-[14%] h-[26%] rounded-[50%] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.04))] shadow-[0_18px_90px_rgba(255,255,255,0.06)] backdrop-blur-[8px]"
            style={{ x: scene.farX, y: scene.farY, rotate: -4 }}
            animate={{
              rotate: [-4, -1, -5, -4],
              y: [0, 16, -10, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={-60}>
          <motion.div
            className="absolute inset-x-[-12%] top-[36%] h-[30%] rounded-[50%] border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03))] shadow-[0_18px_110px_rgba(30,120,255,0.16)] backdrop-blur-[12px]"
            style={{ x: scene.beamX, y: scene.beamY, rotate: 3 }}
            animate={{
              rotate: [3, 6, 2, 3],
              y: [0, -14, 10, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[6%] top-[12%] h-[56%] w-[18%] rounded-full blur-[34px]"
            style={{
              x: scene.glowX,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0))',
            }}
            animate={{ opacity: [0.18, 0.36, 0.22, 0.18] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={60}>
          <motion.div
            className="absolute left-[8%] top-[18%] h-[46%] w-[46%] rounded-[44px] border border-white/18 bg-[linear-gradient(145deg,rgba(255,255,255,0.26),rgba(255,255,255,0.05)_34%,rgba(255,255,255,0.02)_68%,rgba(255,255,255,0.16))] shadow-[0_30px_120px_rgba(9,34,92,0.28)] backdrop-blur-[20px]"
            style={{ x: scene.nearX, y: scene.nearY, rotate: -9 }}
            animate={{
              rotate: [-9, -5, -10, -9],
              y: [0, -12, 10, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[10%] bottom-[10%] h-[38%] w-[36%] rounded-[40px] border border-white/18 bg-[linear-gradient(145deg,rgba(255,255,255,0.24),rgba(255,255,255,0.05)_34%,rgba(255,255,255,0.02)_72%,rgba(255,255,255,0.16))] shadow-[0_24px_100px_rgba(11,38,99,0.22)] backdrop-blur-[18px]"
            style={{ x: scene.beamX, y: scene.beamY, rotate: 8 }}
            animate={{
              rotate: [8, 12, 6, 8],
              y: [0, 12, -10, 0],
            }}
            transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={160}>
          <motion.div
            className="absolute left-[48%] top-[20%] h-40 w-40 rounded-full border border-white/22 bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.95),rgba(195,233,255,0.64)_20%,rgba(82,174,255,0.22)_46%,transparent_72%)] shadow-[0_20px_80px_rgba(255,255,255,0.22)]"
            style={{ x: scene.glowX, y: scene.glowY }}
            animate={{
              y: [0, -16, 10, 0],
              scale: [1, 1.06, 0.95, 1],
            }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={240}>
          <motion.div
            className="absolute left-[18%] bottom-[14%] h-20 w-[20%] rounded-[30px] border border-white/24 bg-white/[0.12] shadow-[0_16px_56px_rgba(255,255,255,0.14)] backdrop-blur-[14px]"
            style={{ x: scene.nearX, y: scene.nearY, rotate: -10 }}
            animate={{
              rotate: [-10, -6, -12, -10],
              y: [0, 10, -8, 0],
            }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 54%, rgba(0,0,0,0.14) 100%)',
        }}
      />
    </>
  );
}
