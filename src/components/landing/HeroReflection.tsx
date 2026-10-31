"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// The hero's signature visual: the TRUESELF wordmark with a mirrored
// "reflection" beneath it that tilts very slightly toward the pointer.
// This stands in for a generic illustration — it's typographic, specific
// to the product, and reinforces the idea of looking at yourself honestly.
export function HeroReflection() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 120, damping: 20 });
  const shift = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 20 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative flex select-none flex-col items-center py-6 [perspective:1200px]"
      aria-hidden="true"
    >
      <motion.div style={{ rotateX, rotateY }} className="relative [transform-style:preserve-3d]">
        <h2 className="text-[16vw] font-semibold leading-[0.82] tracking-tight text-[var(--color-text)] sm:text-[9rem] md:text-[10.5rem]">
          TRUESELF
        </h2>
      </motion.div>

      <div className="relative mt-1 w-full overflow-hidden" style={{ maxHeight: "6rem" }}>
        <motion.div
          style={{ rotateX, rotateY, x: shift }}
          className="origin-top scale-y-[-1] opacity-[0.16] [transform-style:preserve-3d]"
        >
          <h2 className="text-[16vw] font-semibold leading-[0.82] tracking-tight text-[var(--color-text)] sm:text-[9rem] md:text-[10.5rem]">
            TRUESELF
          </h2>
        </motion.div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-bg) 85%)" }}
        />
      </div>
    </div>
  );
}
