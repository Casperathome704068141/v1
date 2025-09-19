"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

interface ProcessLoaderProps {
  className?: string;
  overline?: string;
  headline?: string;
  description?: string;
  accentClassName?: string;
}

const tickAngles = [0, 45, 90, 135, 180, 225, 270, 315];

export function ProcessLoader({
  className,
  overline = "Live status",
  headline = "Calibrating your plan",
  description = "Synchronizing program intakes, deadlines, and document tasks.",
  accentClassName = "text-blue",
}: ProcessLoaderProps) {
  const uniqueId = useId();
  const gradientId = `${uniqueId}-gradient`;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 text-center text-foreground/90",
        className,
      )}
    >
      <svg
        className={cn("pl", accentClassName)}
        viewBox="0 0 160 160"
        role="img"
        aria-label={headline}
      >
        {tickAngles.map((angle, index) => (
          <line
            key={angle}
            className="pl__tick"
            x1="80"
            y1="20"
            x2="80"
            y2="38"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="12"
            strokeDashoffset="-12"
            style={{
              transformOrigin: "80px 80px",
              transform: `rotate(${angle}deg)`,
              animationDelay: `${-0.25 * index}s`,
            }}
          />
        ))}
        <g
          className="pl__arrows"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="32 52 52 52 52 32" />
          <polyline points="128 108 108 108 108 128" />
        </g>
        <g className="pl__ring-rotate">
          <circle
            className="pl__ring-stroke"
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="452"
            strokeDashoffset="452"
          />
        </g>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slateMuted">
          {overline}
        </span>
        <p className="text-lg font-semibold text-foreground">{headline}</p>
        <p className="text-sm text-slateMuted">{description}</p>
      </div>
    </div>
  );
}
