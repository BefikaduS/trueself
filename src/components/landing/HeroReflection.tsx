"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

// Clean inline vector illustrations themed for mindful self-reflection
function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-4.5 sm:w-4.5">
      <path d="M9.5 2A4.5 4.5 0 0 0 5 6.5c0 .4.05.8.15 1.17A4.5 4.5 0 0 0 3 11.5c0 1.6 1.05 3.05 2.5 3.65v.35A4.5 4.5 0 0 0 10 20h.5" />
      <path d="M14.5 2A4.5 4.5 0 0 1 19 6.5c0 .4-.05.8-.15 1.17A4.5 4.5 0 0 1 21 11.5c0 1.6-1.05 3.05-2.5 3.65v.35A4.5 4.5 0 0 1 14 20h-.5" />
      <path d="M12 4v16" />
      <path d="M8.5 7.5A2.5 2.5 0 0 1 11 10" />
      <path d="M15.5 7.5A2.5 2.5 0 0 0 13 10" />
      <path d="M8 14a2 2 0 0 0 3 1.7" />
      <path d="M16 14a2 2 0 0 1-3 1.7" />
    </svg>
  );
}

function ThoughtIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-4.5 sm:w-4.5">
      <path d="M7.5 17h9a4.5 4.5 0 0 0 1.5-8.74 5.5 5.5 0 0 0-10.74-1.3A4.5 4.5 0 0 0 7.5 17z" />
      <circle cx="9" cy="12" r="0.9" fill="currentColor" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" />
      <circle cx="15" cy="12" r="0.9" fill="currentColor" />
      <circle cx="6" cy="19.5" r="1.5" />
      <circle cx="3.5" cy="21.5" r="1" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-4.5 sm:w-4.5">
      <circle cx="12" cy="12" r="9.5" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.25" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-4.5 sm:w-4.5">
      <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-4.5 sm:w-4.5">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-4.5 sm:w-4.5">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
      <path d="M12 6v3" />
    </svg>
  );
}

function MirrorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-4.5 sm:w-4.5">
      <rect x="5" y="3" width="14" height="18" rx="3" />
      <line x1="8" y1="8" x2="16" y2="16" strokeDasharray="2 2" />
      <line x1="11" y1="7" x2="16" y2="12" strokeDasharray="2 2" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function LotusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-4.5 sm:w-4.5">
      <path d="M12 3c-1.5 3.5-3 6.5-3 9.5 0 2.5 1.3 4.5 3 4.5s3-2 3-4.5c0-3-1.5-6-3-9.5z" fill="currentColor" fillOpacity="0.2" />
      <path d="M6 10c0 3 1.5 5.5 3.5 6.5-1.5 0-3-.5-4-1.5-1-1-1.5-2.5-1.5-4 1.5 0 2.5-.5 3.5-1z" />
      <path d="M18 10c0 3-1.5 5.5-3.5 6.5 1.5 0 3-.5 4-1.5 1-1 1.5-2.5 1.5-4-1.5 0-2.5-.5-3.5-1z" />
      <path d="M4 17c3.5 1 6.5 1 8 1s4.5 0 8-1" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-4.5 sm:w-4.5">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

interface FloatingElement {
  id: string;
  label: string;
  icon: () => React.JSX.Element;
  leftPercent: number; // 0 to 100% horizontal placement
  topOffset: number;   // px offset relative to text baseline
  floatDelay: number;
  duration: number;
  mobileHidden?: boolean;
}

const FLOATING_ELEMENTS: FloatingElement[] = [
  { id: "brain", label: "Mind", icon: BrainIcon, leftPercent: 10, topOffset: -46, floatDelay: 0, duration: 2.8 },
  { id: "thought", label: "Thought", icon: ThoughtIcon, leftPercent: 24, topOffset: -64, floatDelay: 0.2, duration: 3.3 },
  { id: "spark", label: "Insight", icon: SparkIcon, leftPercent: 38, topOffset: -52, floatDelay: 0.1, duration: 2.6 },
  { id: "compass", label: "True North", icon: CompassIcon, leftPercent: 50, topOffset: -72, floatDelay: 0.3, duration: 3.5 },
  { id: "eye", label: "Awareness", icon: EyeIcon, leftPercent: 63, topOffset: -50, floatDelay: 0.15, duration: 2.9 },
  { id: "lightbulb", label: "Clarity", icon: LightbulbIcon, leftPercent: 77, topOffset: -62, floatDelay: 0.25, duration: 3.1 },
  { id: "mirror", label: "Reflection", icon: MirrorIcon, leftPercent: 90, topOffset: -42, floatDelay: 0.05, duration: 2.7 },
  { id: "lotus", label: "Stillness", icon: LotusIcon, leftPercent: 30, topOffset: 48, floatDelay: 0.35, duration: 3.2, mobileHidden: true },
  { id: "heart", label: "Authentic", icon: HeartIcon, leftPercent: 70, topOffset: 50, floatDelay: 0.18, duration: 2.9, mobileHidden: true },
];

const TARGET_TEXT = "TRUE SELF";
const TARGET_LETTERS = TARGET_TEXT.split("");

const GLYPH_POOL = [
  "✦", "✧", "◈", "◇", "○", "●", "☼", "☽", "Ψ", "Ω",
  "▲", "▼", "∞", "◎", "§", "¶", "※", "7", "X", "Z",
  "A", "E", "O", "R", "S", "T", "U", "L", "F", "Y"
];

export function HeroReflection() {
  const ref = useRef<HTMLDivElement>(null);
  const [letters, setLetters] = useState<string[]>(TARGET_LETTERS);
  const [isHovered, setIsHovered] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  // 3D Perspective motion springs
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 20 });
  const shift = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 20 });

  const clearScrambleTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // Scramble a single character through quick randomized glyphs before settling
  const scrambleCharacter = useCallback((index: number, iterations = 4, delay = 0) => {
    const target = TARGET_LETTERS[index];
    if (target === " ") return;

    for (let step = 0; step < iterations; step++) {
      const timeout = setTimeout(() => {
        setLetters((prev) => {
          const next = [...prev];
          next[index] = GLYPH_POOL[Math.floor(Math.random() * GLYPH_POOL.length)];
          return next;
        });
      }, delay + step * 40);
      timeoutsRef.current.push(timeout);
    }

    // Settle cleanly back to the target character
    const resolveTimeout = setTimeout(() => {
      setLetters((prev) => {
        const next = [...prev];
        next[index] = target;
        return next;
      });
    }, delay + iterations * 40 + 20);
    timeoutsRef.current.push(resolveTimeout);
  }, []);

  // Cascading character-by-character change across the entire wordmark
  const triggerScrambleCascade = useCallback((delayStart = 0) => {
    clearScrambleTimers();
    TARGET_LETTERS.forEach((char, index) => {
      if (char === " ") return;
      // Stagger character transformation: character at a time
      scrambleCharacter(index, 4, delayStart + index * 45);
    });
  }, [clearScrambleTimers, scrambleCharacter]);

  // Initial startup: Starts immediately on load or reload without waiting
  useEffect(() => {
    // Start immediately on initial page visit / reload
    const introTimer = setTimeout(() => {
      triggerScrambleCascade(80);
    }, 100);

    return () => {
      clearTimeout(introTimer);
      clearScrambleTimers();
    };
  }, [triggerScrambleCascade, clearScrambleTimers]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(normX);
    my.set(normY);

    // Track which character the cursor is nearest to for individual character changes
    const relativeX = (e.clientX - rect.left) / rect.width;
    const hoveredIdx = Math.min(
      TARGET_LETTERS.length - 1,
      Math.max(0, Math.floor(relativeX * TARGET_LETTERS.length))
    );
    if (hoveredIdx !== activeCharIndex) {
      setActiveCharIndex(hoveredIdx);
      scrambleCharacter(hoveredIdx, 3, 0);
    }
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    triggerScrambleCascade(0);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setActiveCharIndex(null);
    mx.set(0);
    my.set(0);
    clearScrambleTimers();
    setLetters(TARGET_LETTERS);
  };

  return (
    <div
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group relative flex w-full select-none flex-col items-center py-8 [perspective:1200px]"
      aria-label="True Self"
    >
      {/* Interactive Radial Ambient Glow with #2364cd */}
      <div
        className={`pointer-events-none absolute -inset-x-12 -inset-y-8 rounded-full transition-opacity duration-700 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(35, 100, 205, 0.18) 0%, transparent 75%)",
        }}
      />

      {/* Floating Self-Reflection Illustrations & Elements (Appears on hover, floats & disappears on mouse off) */}
      <AnimatePresence>
        {isHovered && (
          <div className="pointer-events-none absolute inset-0 z-20">
            {FLOATING_ELEMENTS.map((el) => {
              const IconComponent = el.icon;
              return (
                <motion.div
                  key={el.id}
                  initial={{ opacity: 0, scale: 0.35, y: 18 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -10, 0],
                    rotate: [-3, 3, -3],
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.45,
                    y: -24,
                    transition: { duration: 0.32, ease: "easeOut" },
                  }}
                  transition={{
                    opacity: { duration: 0.22 },
                    scale: { duration: 0.22 },
                    y: {
                      repeat: Infinity,
                      duration: el.duration,
                      ease: "easeInOut",
                      delay: el.floatDelay,
                    },
                    rotate: {
                      repeat: Infinity,
                      duration: el.duration * 1.2,
                      ease: "easeInOut",
                      delay: el.floatDelay,
                    },
                  }}
                  className={`absolute ${el.mobileHidden ? "hidden sm:block" : ""}`}
                  style={{
                    left: `${el.leftPercent}%`,
                    top: `calc(44% + ${el.topOffset}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="flex items-center gap-1.5 rounded-full border border-[#2364cd]/30 bg-white/90 px-2 py-1 text-[#2364cd] shadow-[0_8px_20px_-4px_rgba(35,100,205,0.28)] backdrop-blur-md transition-all duration-200 dark:bg-slate-900/90 dark:shadow-[0_8px_24px_-4px_rgba(35,100,205,0.45)] sm:px-2.5">
                    <IconComponent />
                    <span className="text-[10px] font-semibold tracking-wide text-[#2364cd] select-none sm:text-[11px]">
                      {el.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main TRUE SELF Display in big font with #2364cd theme */}
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative z-10 flex items-center justify-center [transform-style:preserve-3d]"
      >
        <h2 className="flex items-center justify-center whitespace-nowrap text-[13.5vw] font-bold leading-[0.82] tracking-tight sm:text-[8rem] md:text-[9.5rem] lg:text-[10.5rem]">
          {letters.map((char, idx) => {
            if (char === " ") {
              return (
                <span key={`space-${idx}`} className="inline-block w-[0.24em]">
                  {" "}
                </span>
              );
            }
            const isTarget = char === TARGET_LETTERS[idx];
            return (
              <motion.span
                key={`char-${idx}`}
                onPointerEnter={() => scrambleCharacter(idx, 4, 0)}
                animate={{
                  scale: isTarget ? 1 : 1.12,
                  y: isTarget ? 0 : -3,
                }}
                transition={{ duration: 0.15 }}
                className="inline-block cursor-pointer transition-colors duration-150 select-none"
                style={{
                  color: "#2364cd",
                  textShadow: isHovered
                    ? "0 4px 28px rgba(35, 100, 205, 0.35), 0 1px 2px rgba(35, 100, 205, 0.2)"
                    : "0 2px 14px rgba(35, 100, 205, 0.16)",
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </h2>
      </motion.div>

      {/* Mirrored Reflection below the text with real-time character parity */}
      <div className="relative mt-2 w-full overflow-hidden" style={{ maxHeight: "6.5rem" }}>
        <motion.div
          style={{ rotateX, rotateY, x: shift }}
          className="flex origin-top scale-y-[-1] items-center justify-center opacity-[0.20] [transform-style:preserve-3d]"
          aria-hidden="true"
        >
          <h2 className="flex items-center justify-center whitespace-nowrap text-[13.5vw] font-bold leading-[0.82] tracking-tight sm:text-[8rem] md:text-[9.5rem] lg:text-[10.5rem]">
            {letters.map((char, idx) => {
              if (char === " ") {
                return (
                  <span key={`ref-space-${idx}`} className="inline-block w-[0.24em]">
                    {" "}
                  </span>
                );
              }
              return (
                <span
                  key={`ref-char-${idx}`}
                  className="inline-block select-none"
                  style={{ color: "#2364cd" }}
                >
                  {char}
                </span>
              );
            })}
          </h2>
        </motion.div>
        {/* Soft fading gradient to match page background seamlessly */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 15%, var(--color-bg) 90%)" }}
        />
      </div>
    </div>
  );
}
