import React from "react";

export interface IllustrationProps {
  className?: string;
  size?: number;
}

/**
 * 0. 'T' — The Inner Eye & Perspective (Introspection & Self-Awareness)
 * Refined geometric eye with an inner focal pupil and vertical perception axis.
 */
export function EyeIllustration({ className, size = 20 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Outer eye contour */}
      <path d="M2.5 12C5.5 6.5 18.5 6.5 21.5 12C18.5 17.5 5.5 17.5 2.5 12Z" />
      {/* Concentric inner focal iris */}
      <circle cx="12" cy="12" r="3.2" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      {/* Subtle perception rays */}
      <line x1="12" y1="4" x2="12" y2="6" strokeOpacity="0.6" />
      <line x1="12" y1="18" x2="12" y2="20" strokeOpacity="0.6" />
    </svg>
  );
}

/**
 * 1. 'R' — Concentric Ripples & Resonance (Mental Waves & Mindfulness)
 * Minimalist radiating arcs and harmonic consciousness frequencies.
 */
export function RipplesIllustration({ className, size = 20 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="5.5" strokeOpacity="0.8" />
      <path d="M4 12A8 8 0 0 1 20 12" strokeOpacity="0.6" />
      <path d="M1.5 12A10.5 10.5 0 0 1 22.5 12" strokeOpacity="0.4" />
      <path d="M6 18A8 8 0 0 1 18 18" strokeOpacity="0.3" strokeDasharray="1 2" />
    </svg>
  );
}

/**
 * 2. 'U' — The Mirror Portal (Self-Reflection & Duality)
 * Opposing parabolic arches forming an infinite reflective gateway.
 */
export function MirrorIllustration({ className, size = 20 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Left and Right mirror apertures */}
      <path d="M7 4C4.5 7.5 4.5 16.5 7 20" />
      <path d="M17 4C19.5 7.5 19.5 16.5 17 20" />
      {/* Center axis of symmetry */}
      <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="2 2" strokeOpacity="0.5" />
      {/* Core reflective focal point */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * 3. 'E' — Synaptic Constellation (Connected Thoughts & Habit Patterns)
 * Minimal linked nodes forming neural pathways and mental clarity.
 */
export function ConstellationIllustration({ className, size = 20 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Hairline neural branches */}
      <line x1="6" y1="17" x2="12" y2="12" strokeOpacity="0.5" />
      <line x1="12" y1="12" x2="18" y2="7" strokeOpacity="0.7" />
      <line x1="12" y1="12" x2="17" y2="17" strokeOpacity="0.5" />
      <line x1="12" y1="12" x2="7" y2="7" strokeOpacity="0.6" />
      {/* Synaptic nodes */}
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <circle cx="18" cy="7" r="1.8" />
      <circle cx="7" cy="7" r="1.5" />
      <circle cx="6" cy="17" r="1.5" />
      <circle cx="17" cy="17" r="1.5" />
    </svg>
  );
}

/**
 * 4. 'S' — Dialectic Wave (Inner Dialogue & Synthesis)
 * Intertwined lemniscate curves representing the conversation between reason and emotion.
 */
export function DialogueIllustration({ className, size = 20 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* S-shaped dialogue flow */}
      <path d="M8 5C5 5 4 8 7 11C10 14 11 17 8 20C5.5 20 5 18 5 18" />
      <path d="M16 19C19 19 20 16 17 13C14 10 13 7 16 4C18.5 4 19 6 19 6" strokeOpacity="0.8" />
      {/* Harmonic connection */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * 5. 'E' — Cerebral Architecture (The Living Mind & Cognitive Depth)
 * Pure, continuous minimalist profile of cerebral hemispheres.
 */
export function MindIllustration({ className, size = 20 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Cerebral silhouette */}
      <path d="M12 4C8.5 4 5 6.5 5 11C5 14 7 16 9 17.5V19.5H15V17.5C17 16 19 14 19 11C19 6.5 15.5 4 12 4Z" />
      {/* Internal neural locus */}
      <path d="M9.5 11C9.5 9.5 10.5 8.5 12 8.5C13.5 8.5 14.5 9.5 14.5 11" strokeOpacity="0.6" />
      <line x1="12" y1="12" x2="12" y2="16" strokeOpacity="0.6" />
      <circle cx="12" cy="11.5" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * 6. 'L' — Contemplative Profile (Identity & Vision)
 * Continuous fine-line human profile gazing toward an open horizon.
 */
export function ProfileIllustration({ className, size = 20 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Minimalist profile line */}
      <path d="M7 4C11.5 4 15 6 15 9.5C15 11.5 14 12.5 16 14C17.5 15 16.5 17 15 17.5C14.5 18 14 20 10 20H6" />
      {/* Horizon gaze point */}
      <circle cx="19" cy="9.5" r="1.2" fill="currentColor" />
      <line x1="15" y1="9.5" x2="17" y2="9.5" strokeOpacity="0.5" strokeDasharray="1 1" />
    </svg>
  );
}

/**
 * 7. 'F' — Compass of Inquiry (Curiosity & Authentic Discovery)
 * A sculpted inquiry curve blossoming into a four-point radiant discovery spark.
 */
export function CompassIllustration({ className, size = 20 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Question / discovery arch */}
      <path d="M8.5 8C8.5 5.5 10.5 4 12 4C13.5 4 15.5 5 15.5 7C15.5 9 13.5 10 12 11.5V13" />
      {/* Four-point star / discovery spark */}
      <path
        d="M12 16.5L12.6 18L14.1 18.6L12.6 19.2L12 20.7L11.4 19.2L9.9 18.6L11.4 18Z"
        fill="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export interface CharacterDiscovery {
  char: string;
  word: "TRUE" | "SELF";
  index: number;
  label: string;
  tagline: string;
  Illustration: React.ComponentType<IllustrationProps>;
}

export const DISCOVERIES: CharacterDiscovery[] = [
  {
    char: "T",
    word: "TRUE",
    index: 0,
    label: "Perception",
    tagline: "How you perceive your motives",
    Illustration: EyeIllustration,
  },
  {
    char: "R",
    word: "TRUE",
    index: 1,
    label: "Resonance",
    tagline: "The emotional frequency of your choices",
    Illustration: RipplesIllustration,
  },
  {
    char: "U",
    word: "TRUE",
    index: 2,
    label: "Reflection",
    tagline: "Who you are vs who you project",
    Illustration: MirrorIllustration,
  },
  {
    char: "E",
    word: "TRUE",
    index: 3,
    label: "Patterns",
    tagline: "The hidden habits linking your decisions",
    Illustration: ConstellationIllustration,
  },
  {
    char: "S",
    word: "SELF",
    index: 4,
    label: "Dialogue",
    tagline: "The silent conversation within yourself",
    Illustration: DialogueIllustration,
  },
  {
    char: "E",
    word: "SELF",
    index: 5,
    label: "Mind",
    tagline: "The cognitive architecture of your doubts",
    Illustration: MindIllustration,
  },
  {
    char: "L",
    word: "SELF",
    index: 6,
    label: "Identity",
    tagline: "The core person behind every decision",
    Illustration: ProfileIllustration,
  },
  {
    char: "F",
    word: "SELF",
    index: 7,
    label: "Inquiry",
    tagline: "The courage to ask what is genuinely true",
    Illustration: CompassIllustration,
  },
];
