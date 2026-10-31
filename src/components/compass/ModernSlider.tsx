"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { ValueDimension } from "@/lib/types";

interface ModernSliderProps {
  dimension: ValueDimension;
  value: number;
  onChange: (val: number) => void;
}

const DIMENSION_METADATA: Record<
  ValueDimension,
  { subtitle: string; icon: string }
> = {
  Independence: {
    subtitle: "Relying on your own judgment and self-direction.",
    icon: "user",
  },
  Creativity: {
    subtitle: "Bringing novel ideas, forms, and solutions into being.",
    icon: "magic-stick",
  },
  Stability: {
    subtitle: "Security, grounded predictability, and psychological safety.",
    icon: "shield",
  },
  Connection: {
    subtitle: "Deep emotional resonance, empathy, and genuine understanding.",
    icon: "heart",
  },
  Achievement: {
    subtitle: "Mastery, ambitious standard of craft, and tangible milestones.",
    icon: "cup-star",
  },
  Freedom: {
    subtitle: "Unrestricted autonomy in how you spend time and energy.",
    icon: "sun",
  },
  Contribution: {
    subtitle: "Positively impacting others and leaving something behind.",
    icon: "hand-stars",
  },
  Learning: {
    subtitle: "Curiosity, intellectual growth, and expanding perspective.",
    icon: "notebook",
  },
};

function getTierBadge(val: number): { label: string; color: string } {
  if (val >= 85) return { label: "Non-Negotiable", color: "text-[var(--color-accent)] bg-[var(--color-accent)]/15 border-[var(--color-accent)]/30" };
  if (val >= 68) return { label: "Core Driver", color: "text-[var(--color-text)] bg-[var(--color-surface-strong)] border-[var(--color-border)]" };
  if (val >= 45) return { label: "Important", color: "text-[var(--color-text-muted)] bg-[var(--color-surface)] border-[var(--color-border)]/50" };
  if (val >= 25) return { label: "Secondary", color: "text-[var(--color-text-muted)]/80 bg-[var(--color-surface)]/60 border-[var(--color-border)]/30" };
  return { label: "Low Priority", color: "text-[var(--color-text-muted)]/60 bg-transparent border-transparent" };
}

export function ModernSlider({ dimension, value, onChange }: ModernSliderProps) {
  const id = useId();
  const meta = DIMENSION_METADATA[dimension] ?? { subtitle: "", icon: "star" };
  const tier = getTierBadge(value);

  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className="group relative rounded-[var(--radius-lg)] border border-[var(--color-border)]/70 bg-[var(--color-surface)]/40 p-4.5 transition-all duration-200 hover:border-[var(--color-border)] hover:bg-[var(--color-surface)]/70">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor={id} className="text-[0.95rem] font-semibold text-[var(--color-text)] cursor-pointer">
            {dimension}
          </label>
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.72rem] font-medium tracking-tight transition-colors ${tier.color}`}>
            {tier.label}
          </span>
        </div>

        {/* Dynamic score pill */}
        <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-[var(--color-text)]">
          <span className="text-base text-[var(--color-accent)]">{value}</span>
          <span className="text-xs text-[var(--color-text-muted)]">/ 100</span>
        </div>
      </div>

      <p className="mt-1 text-xs text-[var(--color-text-muted)] leading-relaxed">
        {meta.subtitle}
      </p>

      {/* Modern Slider Track & Thumb Container */}
      <div className="relative mt-3.5 flex items-center">
        {/* Visual Custom Track */}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]/40">
          {/* Active Gradient Fill */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-accent)]/80 via-[var(--color-accent)] to-[var(--color-accent)]"
            style={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        </div>

        {/* Real Native Range Input (Transparent, accessible, full overlay) */}
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`${dimension} priority slider`}
          className="modern-range-input absolute inset-0 h-6 w-full cursor-pointer opacity-0"
        />

        {/* Visible Custom Thumb (positioned at percentage) */}
        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform group-hover:scale-110"
          style={{ left: `${percentage}%` }}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[var(--color-accent)] shadow-md">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Tick Marks */}
      <div className="mt-2 flex justify-between px-0.5 text-[0.65rem] font-medium text-[var(--color-text-muted)]/70">
        <span>0</span>
        <span className="hidden sm:inline">25</span>
        <span>50</span>
        <span className="hidden sm:inline">75</span>
        <span>100</span>
      </div>
    </div>
  );
}

