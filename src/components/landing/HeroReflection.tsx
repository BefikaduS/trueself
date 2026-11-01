"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

// Self-reflection motifs: brain, thought cloud, eye/clarity, compass, insight spark, mirror ripple, spiral, heart, crescent moon, mindfulness feather
const ICONS = [
  // 1. Brain / Neural Mind
  (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.5 2a3.5 3.5 0 0 0-3.4 4.3A3.5 3.5 0 0 0 3 9.5c0 1.5.9 2.7 2.2 3.2A3.5 3.5 0 0 0 4 15.5 3.5 3.5 0 0 0 7.5 19c.4 0 .8-.1 1.2-.2A3.5 3.5 0 0 0 12 22a3.5 3.5 0 0 0 3.3-3.2c.4.1.8.2 1.2.2a3.5 3.5 0 0 0 3.5-3.5 3.5 3.5 0 0 0-1.2-2.8c1.3-.5 2.2-1.7 2.2-3.2a3.5 3.5 0 0 0-3.1-3.2A3.5 3.5 0 0 0 14.5 2a3.5 3.5 0 0 0-2.5 1.1A3.5 3.5 0 0 0 9.5 2z" />
      <path d="M12 4v16" strokeDasharray="2 2" />
      <path d="M8 8.5c1 .5 2 1 4 1s3-.5 4-1" />
      <path d="M8 14.5c1 .5 2 1 4 1s3-.5 4-1" />
    </svg>
  ),
  // 2. Thought Cloud
  (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7.5 17h9a4.5 4.5 0 0 0 1.5-8.7A5.5 5.5 0 0 0 7.3 7 4.5 4.5 0 0 0 7.5 17z" />
      <circle cx="8" cy="20.5" r="1.2" fill="currentColor" />
      <circle cx="5" cy="21.5" r="0.8" fill="currentColor" />
    </svg>
  ),
  // 3. Eye / Clarity / Perspective
  (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  // 4. Values Compass
  (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <polygon points="12 4 14.5 10.5 12 12" fill="currentColor" opacity="0.3" />
      <polygon points="12 4 9.5 10.5 12 12" />
      <polygon points="12 20 9.5 13.5 12 12" fill="currentColor" opacity="0.3" />
      <polygon points="12 20 14.5 13.5 12 12" />
    </svg>
  ),
  // 5. Spark of Insight / Revelation
  (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
      <path d="m4.93 4.93 2.83 2.83m8.48 8.48 2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" opacity="0.6" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  ),
  // 6. Mirror / Reflection Ripples
  (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="8" rx="7" ry="3.5" />
      <path d="M5 8c0 3 3.1 5.5 7 5.5s7-2.5 7-5.5" opacity="0.6" />
      <path d="M6.5 13.5c1.4 2 3.3 3 5.5 3s4.1-1 5.5-3" opacity="0.4" />
      <path d="M8 17.5c1.1 1.2 2.5 1.8 4 1.8s2.9-.6 4-1.8" opacity="0.2" />
    </svg>
  ),
  // 7. Core Heart / Emotional Truth
  (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M12 8.5c-.8-1-1.8-1.5-2.8-1.5" opacity="0.6" />
    </svg>
  ),
  // 8. Labyrinth / Inner Journey Spiral
  (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 12a1 1 0 0 1 1 1c0 1.1-.9 2-2 2s-3-.9-3-2 1.3-4 3-4 5 1.8 5 4-2.2 6-5 6-7-2.7-7-6 3.1-8 7-8 9 3.6 9 8" />
    </svg>
  ),
  // 9. Crescent Moon / Introspection
  (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
      <circle cx="17.5" cy="5.5" r="0.9" fill="currentColor" />
    </svg>
  ),
  // 10. Mindfulness Feather / Balance
  (props: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" opacity="0.6" />
    </svg>
  ),
];

// Symbolic reflection runes and glyphs used for character morphing
const SCRAMBLE_GLYPHS = ["✦", "✧", "◈", "◇", "○", "●", "∆", "∇", "Ψ", "Ω", "∞", "·", "≈", "T", "R", "U", "E", "S", "L", "F"];

const ORIGINAL_CHARS = ["T", "R", "U", "E", "S", "E", "L", "F"];

interface Particle {
  id: number;
  iconIndex: number;
  x: number;
  y: number;
  driftX: number;
  rotation: number;
  scale: number;
}

export function HeroReflection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 120, damping: 20 });
  const shift = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 20 });

  // Character scramble state
  const [displayChars, setDisplayChars] = useState<string[]>(ORIGINAL_CHARS);
  const [activeHoverIdx, setActiveHoverIdx] = useState<number | null>(null);
  const scrambleTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Floating micro-illustration particles
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastSpawnPos = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const particleIdRef = useRef(0);

  // Trigger character scramble on a specific letter
  const scrambleCharacter = useCallback((idx: number) => {
    // Clear any active scramble timer for this letter
    const existing = scrambleTimers.current.get(idx);
    if (existing) clearTimeout(existing);

    setActiveHoverIdx(idx);
    const targetChar = ORIGINAL_CHARS[idx];
    const durationMs = 260;
    const intervalMs = 40;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= durationMs) {
        setDisplayChars((prev) => {
          const next = [...prev];
          next[idx] = targetChar;
          return next;
        });
        scrambleTimers.current.delete(idx);
      } else {
        const randomGlyph = SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
        setDisplayChars((prev) => {
          const next = [...prev];
          next[idx] = randomGlyph;
          return next;
        });
        const timer = setTimeout(tick, intervalMs);
        scrambleTimers.current.set(idx, timer);
      }
    };

    tick();
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = scrambleTimers.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  // Spawn floating particle on pointer move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mx.set(x / rect.width - 0.5);
    my.set(y / rect.height - 0.5);

    // Throttle particle creation to ~60ms and at least 14px displacement
    const now = performance.now();
    const dx = x - lastSpawnPos.current.x;
    const dy = y - lastSpawnPos.current.y;
    const dist = Math.hypot(dx, dy);

    if (now - lastSpawnPos.current.time > 65 && dist > 14) {
      lastSpawnPos.current = { x, y, time: now };

      const newParticle: Particle = {
        id: particleIdRef.current++,
        iconIndex: Math.floor(Math.random() * ICONS.length),
        x: x + (Math.random() * 12 - 6),
        y: y + (Math.random() * 8 - 4),
        driftX: Math.random() * 28 - 14,
        rotation: Math.random() * 30 - 15,
        scale: 0.9 + Math.random() * 0.3,
      };

      setParticles((prev) => [...prev.slice(-12), newParticle]);
    }
  };

  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
    setActiveHoverIdx(null);
  };

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex select-none flex-col items-center py-4 sm:py-6 [perspective:1200px] cursor-default"
      aria-label="TRUESELF interactive reflection wordmark"
    >
      {/* Floating reflection micro-illustrations */}
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        <AnimatePresence>
          {particles.map((p) => {
            const IconComponent = ICONS[p.iconIndex];
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.4, x: p.x, y: p.y, rotate: 0 }}
                animate={{
                  opacity: [0, 0.95, 0.85, 0],
                  scale: [0.4, p.scale, p.scale * 0.92, 0.3],
                  x: p.x + p.driftX,
                  y: p.y - 48,
                  rotate: p.rotation,
                }}
                exit={{ opacity: 0, scale: 0.2 }}
                transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() => removeParticle(p.id)}
                className="absolute text-[var(--color-accent)] drop-shadow-[0_2px_8px_rgba(var(--color-accent-rgb,143,147,255),0.4)]"
                style={{ width: 22, height: 22 }}
              >
                <IconComponent className="h-full w-full" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Main interactive wordmark */}
      <motion.div style={{ rotateX, rotateY }} className="relative z-10 [transform-style:preserve-3d]">
        <h2 className="flex items-center text-[16vw] font-semibold leading-[0.82] tracking-tight text-[var(--color-text)] sm:text-[9rem] md:text-[10.5rem]">
          {displayChars.map((char, i) => {
            const isHovered = activeHoverIdx === i;
            return (
              <motion.span
                key={i}
                onPointerEnter={() => scrambleCharacter(i)}
                whileHover={{
                  y: -4,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 450, damping: 18 },
                }}
                className={`inline-block transition-colors duration-150 ${
                  isHovered ? "text-[var(--color-accent)] drop-shadow-sm" : ""
                }`}
              >
                {char}
              </motion.span>
            );
          })}
        </h2>
      </motion.div>

      {/* Reflected mirror layer beneath */}
      <div className="relative mt-1 w-full overflow-hidden" style={{ maxHeight: "6.5rem" }} aria-hidden="true">
        <motion.div
          style={{ rotateX, rotateY, x: shift }}
          className="origin-top scale-y-[-1] opacity-[0.16] [transform-style:preserve-3d]"
        >
          <h2 className="flex items-center justify-center text-[16vw] font-semibold leading-[0.82] tracking-tight text-[var(--color-text)] sm:text-[9rem] md:text-[10.5rem]">
            {displayChars.map((char, i) => (
              <span key={i} className="inline-block">
                {char}
              </span>
            ))}
          </h2>
        </motion.div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 0%, var(--color-bg) 85%)" }}
        />
      </div>
    </div>
  );
}
