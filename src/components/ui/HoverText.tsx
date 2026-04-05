'use client';

import { motion, Variants } from 'framer-motion';
import { useState } from 'react';

type HoverVariant = 'underline' | 'gradient' | 'slide' | 'glow' | 'letter';

interface HoverTextProps {
  variant?: HoverVariant;
  className?: string;
  children: React.ReactNode;
}

export function HoverText({ variant = 'underline', className = '', children }: HoverTextProps) {
  switch (variant) {
    case 'underline':
      return <UnderlineText className={className}>{children}</UnderlineText>;
    case 'gradient':
      return <GradientText className={className}>{children}</GradientText>;
    case 'slide':
      return <SlideText className={className}>{children}</SlideText>;
    case 'glow':
      return <GlowText className={className}>{children}</GlowText>;
    case 'letter':
      return <LetterText className={className}>{children}</LetterText>;
    default:
      return <UnderlineText className={className}>{children}</UnderlineText>;
  }
}

function UnderlineText({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.span
      className={`relative inline-block cursor-pointer ${className}`}
      whileHover="hover"
      initial="initial"
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] bg-current"
        variants={{
          initial: { width: 0, opacity: 0 },
          hover: { width: '100%', opacity: 1 },
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </motion.span>
  );
}

function GradientText({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.span
      className={`relative inline-block cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent ${className}`}
      whileHover={{
        filter: 'brightness(1.2)',
      }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundSize: '200% 100%',
        backgroundPosition: '0% 50%',
      }}
    >
      <motion.span
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent opacity-0 hover:opacity-100"
      />
      {children}
    </motion.span>
  );
}

function SlideText({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.span
      className={`relative inline-block h-[1.2em] cursor-pointer overflow-hidden ${className}`}
      whileHover="hover"
      initial="initial"
    >
      <motion.span
        className="block"
        variants={{
          initial: { y: 0 },
          hover: { y: '-100%' },
        }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute top-full left-0 block"
        variants={{
          initial: { y: 0 },
          hover: { y: '-100%' },
        }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

function GlowText({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.span
      className={`relative inline-block cursor-pointer ${className}`}
      whileHover={{
        textShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2)',
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.span>
  );
}

function LetterText({ className, children }: { className?: string; children: React.ReactNode }) {
  const text = typeof children === 'string' ? children : '';
  const letters = text.split('');

  const container: Variants = {
    hidden: { opacity: 1 },
    hover: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const letterVariant: Variants = {
    hidden: { y: 0 },
    hover: {
      y: -3,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <motion.span
      className={`inline-block cursor-pointer ${className}`}
      variants={container}
      initial="hidden"
      whileHover="hover"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariant}
          className="inline-block"
          style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function AnimatedLink({
  href,
  children,
  className = '',
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`group relative inline-block cursor-pointer ${className}`}
      whileHover="hover"
      initial="initial"
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute -bottom-0.5 left-0 h-[1px] w-full origin-left bg-current"
        variants={{
          initial: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </motion.a>
  );
}

export function MagneticText({
  children,
  className = '',
  strength = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.span
      className={`inline-block cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.5 }}
    >
      {children}
    </motion.span>
  );
}

export function StaggeredFadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.span>
  );
}

export function SpotlightText({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.span
      className={`relative inline-block cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10">{children}</span>
      {isHovered && (
        <motion.span
          className="pointer-events-none absolute -inset-2 rounded-lg"
          style={{
            background: `radial-gradient(60px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 50%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.span>
  );
}
