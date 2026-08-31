"use client";

import React from "react";

export function BrushDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 24"
      aria-hidden="true"
      className={`h-5 w-40 text-rose ${className}`}
      fill="none"
    >
      <path
        d="M4 16c60-12 110 4 168-2 52-5 96-12 152-4 28 4 48 6 72 2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M28 21c74-8 126 2 190-4 40-4 84-8 130-2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export function FloralLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={`-translate-x-20 -translate-y-20 text-[#CFAE82] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M60 112V44" />
      <path d="M60 78c-14 0-24-8-26-22 16-2 26 6 26 22Z" />
      <path d="M60 62c14-2 22-11 22-25-16-1-24 8-22 25Z" />
      <circle cx="60" cy="30" r="9" />
      <circle cx="47" cy="22" r="7" />
      <circle cx="73" cy="22" r="7" />
      <circle cx="60" cy="14" r="7" />
    </svg>
  );
}

type Floater = { left: string; top: string; animClass: string; size: number; kind: number };

const floaters: Floater[] = [
  {
    left: "3%",
    top: "12%",
    animClass: "animate-float-slow",
    size: 38,
    kind: 0,
  },
  {
    left: "92%",
    top: "8%",
    animClass: "animate-float-delayed",
    size: 32,
    kind: 1,
  },
  {
    left: "4%",
    top: "68%",
    animClass: "animate-float-alt",
    size: 40,
    kind: 2,
  },
  {
    left: "94%",
    top: "62%",
    animClass: "animate-float-slow",
    size: 36,
    kind: 0,
  },
  {
    left: "48%",
    top: "5%",
    animClass: "animate-float-delayed",
    size: 28,
    kind: 3,
  },
  {
    left: "58%",
    top: "88%",
    animClass: "animate-float-alt",
    size: 30,
    kind: 1,
  },
];

function Glyph({ kind, size }: { kind: number; size: number }) {
  const common = { width: size, height: size, "aria-hidden": true as const };
  if (kind === 0)
    return (
      <svg {...common} viewBox="0 0 24 24" className="text-blush" fill="currentColor">
        <circle cx="12" cy="6" r="4.4" />
        <circle cx="6" cy="13" r="4.4" />
        <circle cx="18" cy="13" r="4.4" />
        <circle cx="12" cy="18" r="4.4" />
      </svg>
    );
  if (kind === 1)
    return (
      <svg {...common} viewBox="0 0 24 24" className="text-sage" fill="currentColor">
        <path d="M20 4C10 5 4 10 4 18c8 2 15-4 16-14Z" />
      </svg>
    );
  if (kind === 2)
    return (
      <svg
      {...common}
      viewBox="0 0 24 24"
      className="rotate-[-15deg] text-rose"
      fill="currentColor"
    >
      <path d="M12 21S3 14.7 3 9.2A4.7 4.7 0 0 1 12 6.9 4.7 4.7 0 0 1 21 9.2C21 14.7 12 21 12 21Z" />
    </svg>
    );
  return (
    <svg {...common} viewBox="0 0 24 24" className="text-champagne" fill="currentColor">
      <path d="M12 2c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10Z" />
    </svg>
  );
}

export function FloatingGarden() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none">
      {floaters.map((f, i) => (
        <span
          key={i}
          className={`absolute opacity-50 lg:opacity-70 ${f.animClass}`}
          style={{ left: f.left, top: f.top }}
        >
          <Glyph kind={f.kind} size={f.size} />
        </span>
      ))}
    </div>
  );
}
