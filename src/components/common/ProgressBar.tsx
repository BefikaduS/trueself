"use client";

import { motion } from "framer-motion";

// Smooth, deliberate progress indicator used across the assessment —
// intentionally not a spinner, since progress here is meaningful (how far
// through the six questions the user is), not indeterminate loading.
export function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label || "Assessment progress"}
      aria-valuetext={label || `${Math.round(pct)}%`}
    >
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-border)]">
        <motion.div
          className="h-full rounded-full bg-[var(--color-accent)]"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {label && (
        <p className="mt-2 text-xs tracking-wide text-[var(--color-text-muted)]" aria-live="polite">
          {label}
        </p>
      )}
    </div>
  );
}
