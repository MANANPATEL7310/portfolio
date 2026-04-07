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
              ? 'radial-gradient(circle at 18% 12%, rgba(255,255,255,0.92), transparent 18%), radial-gradient(circle at 76% 14%, rgba(158,248,255,0.5), transparent 24%), radial-gradient(circle at 64% 70%, rgba(73,125,255,0.22), transparent 34%), linear-gradient(150deg, #f4f8ff 0%, #c8e1ff 18%, #438fff 48%, #0e42bf 76%, #020d46 100%)'
              : 'radial-gradient(circle at 18% 12%, rgba(255,255,255,0.14), transparent 16%), radial-gradient(circle at 76% 14%, rgba(106,248,255,0.24), transparent 22%), radial-gradient(circle at 68% 74%, rgba(51,96,255,0.22), transparent 30%), linear-gradient(150deg, #01030d 0%, #06143f 20%, #0b2f8b 46%, #0a56d8 70%, #020718 100%)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_56%,rgba(255,255,255,0.12),transparent_34%)] opacity-70" />

      <motion.div
        className="absolute inset-[-12%]"
        style={{ transform: scene.sceneTransform, transformStyle: 'preserve-3d' }}
      >
        <DepthLayer depth={-240}>
          <motion.div
            className="absolute -left-[8%] bottom-[0%] h-[58%] w-[52%] rounded-full blur-[130px]"
            style={{
              x: scene.farX,
              y: scene.farY,
              background: 'radial-gradient(circle at center, rgba(87,132,255,0.62), rgba(34,80,224,0.16) 54%, transparent 74%)',
            }}
            animate={{
              scale: [1, 1.08, 0.96, 1],
              opacity: [0.8, 0.62, 0.84, 0.8],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[-10%] top-[2%] h-[54%] w-[46%] rounded-full blur-[135px]"
            style={{
              x: scene.glowX,
              y: scene.glowY,
              background: 'radial-gradient(circle at center, rgba(101,255,232,0.34), rgba(115,96,255,0.12) 54%, transparent 74%)',
            }}
            animate={{
              scale: [1, 0.95, 1.08, 1],
              opacity: [0.42, 0.68, 0.48, 0.42],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={-100}>
          <motion.div
            className="absolute left-[-22%] top-[24%] h-[18%] w-[152%] rounded-[999px] border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.02))] shadow-[0_16px_84px_rgba(255,255,255,0.06)] backdrop-blur-[10px]"
            style={{ x: scene.beamX, y: scene.beamY, rotate: -21 }}
            animate={{
              opacity: [0.2, 0.38, 0.22, 0.2],
              y: [0, 18, -10, 0],
            }}
            transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={20}>
          <motion.div
            className="absolute inset-x-[6%] bottom-[8%] h-[54%] rounded-[68px] border border-white/22 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_36%,rgba(255,255,255,0.01)_72%,rgba(255,255,255,0.11))] shadow-[0_30px_120px_rgba(3,14,52,0.48)] backdrop-blur-[28px]"
            style={{ x: scene.nearX, y: scene.nearY, rotate: -10 }}
            animate={{
              rotate: [-10, -6, -11, -10],
              y: [0, -12, 9, 0],
              opacity: [0.88, 0.98, 0.91, 0.88],
            }}
            transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute left-[22%] top-[28%] h-[12%] w-[24%] rounded-full bg-white/18 blur-[28px]"
            style={{ x: scene.beamX, y: scene.beamY }}
            animate={{ opacity: [0.16, 0.28, 0.18, 0.16] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={210}>
          <motion.div
            className="absolute right-[10%] top-[14%] h-[19rem] w-[19rem] rounded-full border border-white/18 bg-[radial-gradient(circle_at_36%_32%,rgba(255,255,255,0.98),rgba(211,234,255,0.48)_16%,rgba(104,146,255,0.18)_40%,rgba(54,92,255,0.04)_60%,transparent_74%)] shadow-[0_34px_130px_rgba(96,155,255,0.32)]"
            style={{ x: scene.glowX, y: scene.glowY }}
            animate={{
              y: [0, -16, 10, 0],
              scale: [1, 1.05, 0.97, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[18%] top-[22%] h-[6rem] w-[6rem] rounded-full border border-white/18 bg-white/20 backdrop-blur-[10px]"
            style={{ x: scene.beamX, y: scene.beamY }}
            animate={{
              y: [0, 10, -8, 0],
              opacity: [0.48, 0.68, 0.5, 0.48],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={110}>
          <motion.div
            className="absolute left-[10%] top-[16%] h-28 w-[22%] rounded-[36px] border border-white/18 bg-white/[0.09] shadow-[0_20px_70px_rgba(255,255,255,0.08)] backdrop-blur-[20px]"
            style={{ x: scene.nearX, y: scene.nearY, rotate: -11 }}
            animate={{
              rotate: [-11, -8, -12, -11],
              y: [0, 8, -10, 0],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
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
              ? 'radial-gradient(circle at 20% 12%, rgba(255,255,255,0.95), transparent 18%), radial-gradient(circle at 82% 14%, rgba(183,243,255,0.44), transparent 22%), linear-gradient(156deg, #f6faff 0%, #d3ebff 18%, #73beff 40%, #2278ff 66%, #021354 100%)'
              : 'radial-gradient(circle at 20% 12%, rgba(255,255,255,0.14), transparent 16%), radial-gradient(circle at 82% 12%, rgba(120,245,255,0.2), transparent 20%), linear-gradient(156deg, #01040f 0%, #07205f 22%, #1160ff 48%, #0c43c1 72%, #01040d 100%)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_68%,rgba(255,255,255,0.14),transparent_30%)] opacity-70" />

      <motion.div
        className="absolute inset-[-12%]"
        style={{ transform: scene.sceneTransform, transformStyle: 'preserve-3d' }}
      >
        <DepthLayer depth={-200}>
          <motion.div
            className="absolute inset-x-[-20%] top-[16%] h-[18%] rounded-[50%] border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.02))] shadow-[0_20px_90px_rgba(255,255,255,0.05)] backdrop-blur-[10px]"
            style={{ x: scene.farX, y: scene.farY, rotate: -7 }}
            animate={{
              rotate: [-7, -4, -8, -7],
              y: [0, 16, -8, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={-90}>
          <motion.div
            className="absolute inset-x-[-18%] top-[48%] h-[22%] rounded-[50%] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.01))] shadow-[0_20px_110px_rgba(30,120,255,0.16)] backdrop-blur-[12px]"
            style={{ x: scene.beamX, y: scene.beamY, rotate: 6 }}
            animate={{
              rotate: [6, 9, 5, 6],
              y: [0, -12, 10, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[4%] top-[8%] h-[62%] w-[20%] rounded-full blur-[38px]"
            style={{
              x: scene.glowX,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0))',
            }}
            animate={{ opacity: [0.18, 0.42, 0.22, 0.18] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={80}>
          <motion.div
            className="absolute left-[8%] top-[20%] h-[42%] w-[38%] rounded-[46px] border border-white/18 bg-[linear-gradient(145deg,rgba(255,255,255,0.22),rgba(255,255,255,0.04)_34%,rgba(255,255,255,0.02)_70%,rgba(255,255,255,0.14))] shadow-[0_34px_120px_rgba(7,28,82,0.24)] backdrop-blur-[24px]"
            style={{ x: scene.nearX, y: scene.nearY, rotate: -9 }}
            animate={{
              rotate: [-9, -6, -10, -9],
              y: [0, -10, 8, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[10%] bottom-[12%] h-[28%] w-[30%] rounded-[42px] border border-white/18 bg-[linear-gradient(145deg,rgba(255,255,255,0.2),rgba(255,255,255,0.04)_34%,rgba(255,255,255,0.02)_72%,rgba(255,255,255,0.14))] shadow-[0_26px_96px_rgba(10,40,100,0.22)] backdrop-blur-[24px]"
            style={{ x: scene.beamX, y: scene.beamY, rotate: 12 }}
            animate={{
              rotate: [12, 15, 10, 12],
              y: [0, 10, -8, 0],
            }}
            transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={240}>
          <motion.div
            className="absolute left-[48%] top-[18%] h-[12rem] w-[12rem] rounded-full border border-white/20 bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.98),rgba(217,239,255,0.56)_16%,rgba(96,180,255,0.16)_42%,transparent_72%)] shadow-[0_24px_110px_rgba(255,255,255,0.24)]"
            style={{ x: scene.glowX, y: scene.glowY }}
            animate={{
              y: [0, -14, 10, 0],
              scale: [1, 1.05, 0.97, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
        </DepthLayer>

        <DepthLayer depth={150}>
          <motion.div
            className="absolute left-[16%] bottom-[18%] h-16 w-[16%] rounded-[28px] border border-white/22 bg-white/[0.12] shadow-[0_14px_48px_rgba(255,255,255,0.12)] backdrop-blur-[16px]"
            style={{ x: scene.nearX, y: scene.nearY, rotate: -12 }}
            animate={{
              rotate: [-12, -9, -13, -12],
              y: [0, 8, -6, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
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
