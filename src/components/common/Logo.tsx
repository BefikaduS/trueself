import React from "react";

export interface LogoProps {
  /** Display variant: icon mark only, text wordmark only, or both */
  variant?: "mark" | "wordmark" | "full";
  /** Size preset or pixel dimension for the mark */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  /** Custom className applied to outer container */
  className?: string;
  /** Whether to show interactive hover animation */
  interactive?: boolean;
}

const SIZE_MAP = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 56,
} as const;

/**
 * Trueself Logo Mark: "The Inward Lens & True Axis"
 *
 * Timeless, minimal, and non-generic geometry representing self-reflection:
 * - Circular grounding vessel (the whole person)
 * - Inward biconvex reflection lens (the honest mirror)
 * - Concentric authentic core (the true self)
 * - Cardinal axis alignment pip (inner compass / true north)
 */
export function LogoMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="Trueself emblem"
    >
      {/* Outer grounding seal / disk */}
      <circle
        cx="16"
        cy="16"
        r="14.5"
        fill="var(--color-accent, #ED6C30)"
      />

      {/* Inward reflection lens (vesica reflection) */}
      <path
        d="M 16 5.5 C 10.5 10.8 10.5 21.2 16 26.5 C 21.5 21.2 21.5 10.8 16 5.5 Z"
        fill="var(--color-surface, #FFFAF5)"
      />

      {/* Subtle precision alignment ring */}
      <circle
        cx="16"
        cy="16"
        r="5.4"
        stroke="var(--color-accent, #ED6C30)"
        strokeWidth="0.8"
        strokeDasharray="1.5 2"
        opacity="0.4"
      />

      {/* Concentric authentic core (true self) */}
      <circle
        cx="16"
        cy="16"
        r="2.8"
        fill="var(--color-accent, #ED6C30)"
      />

      {/* True axis / cardinal alignment pip (inner compass) */}
      <circle
        cx="16"
        cy="9.3"
        r="1.1"
        fill="var(--color-accent, #ED6C30)"
      />
    </svg>
  );
}

export function LogoWordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
}) {
  const textClass =
    typeof size === "number"
      ? size >= 40
        ? "text-2xl"
        : size >= 32
        ? "text-xl"
        : "text-lg"
      : {
          xs: "text-base",
          sm: "text-lg sm:text-[1.12rem]",
          md: "text-xl",
          lg: "text-2xl",
          xl: "text-3xl",
        }[size];

  return (
    <span
      className={`font-editorial font-semibold tracking-[-0.015em] text-[var(--color-text)] ${textClass} ${className}`}
    >
      Trueself<span className="text-[var(--color-accent)] font-serif">.</span>
    </span>
  );
}

export function Logo({
  variant = "full",
  size = "md",
  className = "",
  interactive = false,
}: LogoProps) {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size];

  if (variant === "mark") {
    return (
      <div
        className={`inline-flex items-center justify-center ${
          interactive ? "transition-transform duration-300 hover:scale-105 active:scale-95" : ""
        } ${className}`}
      >
        <LogoMark size={pixelSize} />
      </div>
    );
  }

  if (variant === "wordmark") {
    return <LogoWordmark size={size} className={className} />;
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${
        interactive ? "group cursor-pointer" : ""
      } ${className}`}
    >
      <div
        className={
          interactive
            ? "transition-transform duration-300 ease-out group-hover:rotate-180 group-hover:scale-105 group-active:scale-95"
            : ""
        }
      >
        <LogoMark size={pixelSize} />
      </div>
      <LogoWordmark size={size} />
    </div>
  );
}

