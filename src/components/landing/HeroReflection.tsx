"use client";

import React, { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { DISCOVERIES, type CharacterDiscovery } from "./ReflectionIllustrations";

function subscribeTouch(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(hover: none)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getTouchSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none)").matches || "ontouchstart" in window;
}

function getTouchServerSnapshot() {
  return false;
}

export function HeroReflection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Tilt springs for desktop pointer tracking
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 120, damping: 22 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 22 });
  const shift = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 22 });

  // Interactive character states
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);
  const [rippleDepths, setRippleDepths] = useState<number[]>(new Array(8).fill(0));
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean hydration subscription for touch/pointer media without cascading effect renders
  const isTouchDevice = useSyncExternalStore(subscribeTouch, getTouchSnapshot, getTouchServerSnapshot);

  // Cascading ripple calculation when hovering on a character
  const triggerCascade = useCallback((centerIndex: number) => {
    setActiveCharIndex(centerIndex);

    // Calculate wave intensity across all 8 characters
    DISCOVERIES.forEach((_, idx) => {
      const distance = Math.abs(idx - centerIndex);
      const delay = distance * 60; // 60ms delay per character distance
      const intensity = Math.max(0.2, 1 - distance * 0.22);

      setTimeout(() => {
        setRippleDepths((prev) => {
          const next = [...prev];
          next[idx] = intensity;
          return next;
        });

        // Decay wave after transition
        setTimeout(() => {
          setRippleDepths((prev) => {
            const next = [...prev];
            // Only decay if not the currently hovered active index
            next[idx] = 0;
            return next;
          });
        }, 550);
      }, delay);
    });
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
    setActiveCharIndex(null);
    setRippleDepths(new Array(8).fill(0));
  };

  // Touch tap handler for mobile devices
  const handleTouchTap = (index: number) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    triggerCascade(index);

    // Auto-dismiss floating reveal after 2.4s on touch devices
    touchTimerRef.current = setTimeout(() => {
      setActiveCharIndex(null);
      setRippleDepths(new Array(8).fill(0));
    }, 2400);
  };

  // Separate characters for "TRUE" (0-3) and "SELF" (4-7)
  const trueLetters = DISCOVERIES.slice(0, 4);
  const selfLetters = DISCOVERIES.slice(4, 8);

  // Active discovery details
  const activeDiscovery = activeCharIndex !== null ? DISCOVERIES[activeCharIndex] : null;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex select-none flex-col items-center py-6 sm:py-8 [perspective:1200px]"
      aria-label="TrueSelf — A personal reflection experience"
      role="banner"
    >
      {/* ---------- Main Interactive Title ---------- */}
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative flex flex-col items-center [transform-style:preserve-3d]"
      >
        {/* Floating Discovery Card */}
        <AnimatePresence>
          {activeDiscovery && (
            <motion.div
              key={`discovery-${activeDiscovery.index}`}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.94 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute -top-14 z-30 flex items-center gap-2.5 rounded-full border border-[var(--color-accent)]/30 bg-[#121217]/90 px-3.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.55)] backdrop-blur-md sm:-top-16"
            >
              <div className="flex h-5 w-5 items-center justify-center text-[var(--color-accent)]">
                <activeDiscovery.Illustration size={18} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                  {activeDiscovery.label}
                </span>
                <span className="hidden text-[11px] text-[#9595a2] sm:inline">
                  — {activeDiscovery.tagline}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heading Typography Container: "TRUE" + "SELF" */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 md:gap-x-12"
          aria-hidden="true"
        >
          {/* Word 1: TRUE */}
          <div className="flex items-center">
            {trueLetters.map((item) => (
              <InteractiveLetter
                key={item.index}
                item={item}
                isActive={activeCharIndex === item.index}
                rippleDepth={rippleDepths[item.index]}
                onHover={() => triggerCascade(item.index)}
                onTap={() => handleTouchTap(item.index)}
              />
            ))}
          </div>

          {/* Word 2: SELF */}
          <div className="flex items-center">
            {selfLetters.map((item) => (
              <InteractiveLetter
                key={item.index}
                item={item}
                isActive={activeCharIndex === item.index}
                rippleDepth={rippleDepths[item.index]}
                onHover={() => triggerCascade(item.index)}
                onTap={() => handleTouchTap(item.index)}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ---------- Mirrored Reflection Beneath ---------- */}
      <div
        className="relative mt-1 w-full overflow-hidden"
        style={{ maxHeight: "6.5rem" }}
        aria-hidden="true"
      >
        <motion.div
          style={{ rotateX, rotateY, x: shift }}
          className="origin-top scale-y-[-1] opacity-[0.16] [transform-style:preserve-3d]"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 md:gap-x-12">
            <div className="flex items-center">
              {trueLetters.map((item) => (
                <ReflectedLetter
                  key={`reflect-${item.index}`}
                  char={item.char}
                  isActive={activeCharIndex === item.index}
                  rippleDepth={rippleDepths[item.index]}
                />
              ))}
            </div>
            <div className="flex items-center">
              {selfLetters.map((item) => (
                <ReflectedLetter
                  key={`reflect-${item.index}`}
                  char={item.char}
                  isActive={activeCharIndex === item.index}
                  rippleDepth={rippleDepths[item.index]}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Ambient fade-out gradient for liquid reflection */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--color-bg) 85%)",
          }}
        />
      </div>

      {/* Touch Interaction Hint (Shown subtly on mobile/touch screens) */}
      {isTouchDevice && (
        <p className="mt-3 text-[11px] font-medium tracking-wide text-[var(--color-text-muted)] opacity-60">
          Tap any letter to reveal
        </p>
      )}
    </div>
  );
}

/**
 * Individual interactive character with zero layout shift,
 * subtle vertical lift, luminous color transition, and hairline aperture.
 */
function InteractiveLetter({
  item,
  isActive,
  rippleDepth,
  onHover,
  onTap,
}: {
  item: CharacterDiscovery;
  isActive: boolean;
  rippleDepth: number;
  onHover: () => void;
  onTap: () => void;
}) {
  const isElevated = isActive || rippleDepth > 0;
  const liftAmount = isActive ? -4 : rippleDepth > 0 ? -2 * rippleDepth : 0;

  return (
    <div
      onPointerEnter={onHover}
      onClick={onTap}
      className="group relative inline-flex cursor-pointer items-center justify-center p-0.5 sm:p-1"
    >
      {/* Floating subtle ambient dot above active character */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{ opacity: 0.85, scale: 1, y: -6 }}
            exit={{ opacity: 0, scale: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute -top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]"
          />
        )}
      </AnimatePresence>

      {/* The Character Glyph */}
      <motion.span
        animate={{
          y: liftAmount,
          color: isActive
            ? "var(--color-accent)"
            : rippleDepth > 0
            ? "color-mix(in srgb, var(--color-accent) 60%, var(--color-text))"
            : "var(--color-text)",
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="font-sans text-[14vw] font-semibold leading-[0.82] tracking-tight transition-colors duration-200 sm:text-[8rem] md:text-[9.5rem] lg:text-[10.5rem]"
      >
        {item.char}
      </motion.span>

      {/* Hairline baseline aperture highlight */}
      <motion.div
        animate={{
          opacity: isElevated ? 0.75 : 0,
          scaleX: isElevated ? 1 : 0.4,
        }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none absolute -bottom-1 h-[1.5px] w-3/4 rounded-full bg-[var(--color-accent)]"
      />
    </div>
  );
}

/**
 * Reflected character underneath echoing the active state in the mirror pool.
 */
function ReflectedLetter({
  char,
  isActive,
  rippleDepth,
}: {
  char: string;
  isActive: boolean;
  rippleDepth: number;
}) {
  const isElevated = isActive || rippleDepth > 0;

  return (
    <div className="relative inline-flex items-center justify-center p-0.5 sm:p-1">
      <motion.span
        animate={{
          color: isElevated
            ? "color-mix(in srgb, var(--color-accent) 80%, var(--color-text))"
            : "var(--color-text)",
        }}
        transition={{ duration: 0.22 }}
        className="font-sans text-[14vw] font-semibold leading-[0.82] tracking-tight sm:text-[8rem] md:text-[9.5rem] lg:text-[10.5rem]"
      >
        {char}
      </motion.span>
    </div>
  );
}
