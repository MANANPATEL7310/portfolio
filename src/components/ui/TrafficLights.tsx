'use client';

import type { ReactNode } from 'react';

export function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
}: {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}) {
  return (
    <div className="group/traffic flex items-center gap-[5px] px-[1px]">
      <TrafficLightButton
        label="Close"
        colorClass="bg-[#ff5f57] hover:bg-[#ff6b63]"
        icon={<CloseGlyph />}
        onClick={onClose}
      />
      <TrafficLightButton
        label="Minimize"
        colorClass="bg-[#febc2e] hover:bg-[#ffc94d]"
        icon={<MinimizeGlyph />}
        onClick={onMinimize}
      />
      <TrafficLightButton
        label="Maximize"
        colorClass="bg-[#28c840] hover:bg-[#3bd455]"
        icon={<MaximizeGlyph />}
        onClick={onMaximize}
      />
    </div>
  );
}

function TrafficLightButton({
  label,
  colorClass,
  icon,
  onClick,
}: {
  label: string;
  colorClass: string;
  icon: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className="relative flex h-[18px] w-[18px] items-center justify-center rounded-full"
    >
      <span
        className={`relative flex h-[14px] w-[14px] items-center justify-center rounded-full border border-black/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.26)] transition-all duration-150 group-hover/traffic:scale-[1.03] ${colorClass}`}
      >
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover/traffic:opacity-100">
          {icon}
        </span>
      </span>
    </button>
  );
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="h-[8px] w-[8px]" aria-hidden="true">
      <path
        d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5"
        fill="none"
        stroke="rgba(61, 28, 28, 0.88)"
        strokeLinecap="round"
        strokeWidth="2.1"
      />
    </svg>
  );
}

function MinimizeGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="h-[8px] w-[8px]" aria-hidden="true">
      <path
        d="M2.25 6H9.75"
        fill="none"
        stroke="rgba(74, 58, 20, 0.92)"
        strokeLinecap="round"
        strokeWidth="2.25"
      />
    </svg>
  );
}

function MaximizeGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="h-[8px] w-[8px]" aria-hidden="true">
      <path
        d="M3 9L9 3"
        fill="none"
        stroke="rgba(22, 73, 31, 0.92)"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M6.9 3H9v2.1"
        fill="none"
        stroke="rgba(22, 73, 31, 0.92)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M5.1 9H3V6.9"
        fill="none"
        stroke="rgba(22, 73, 31, 0.92)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
