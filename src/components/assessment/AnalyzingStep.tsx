"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../common/Button";
import { Icon } from "../common/Icon";

const MESSAGES = [
  "Putting the pieces together...",
  "Looking at the patterns in your answers.",
  "Connecting the things you value with the choices you make.",
  "Finding the parts that deserve a closer look.",
  "Preparing your honest reflection.",
];

// A calm, honest "processing" screen. Messages advance on a timer while
// the real request is in flight; they never claim more progress than what
// is actually happening. If the request is slow, a retry path is offered.
export function AnalyzingStep({
  status,
  onRetry,
  onCancel,
}: {
  status: "pending" | "slow" | "error";
  onRetry: () => void;
  onCancel: () => void;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (status !== "pending" && status !== "slow") return;
    const id = setInterval(() => setIndex((i) => Math.min(i + 1, MESSAGES.length - 1)), 2200);
    return () => clearInterval(id);
  }, [status]);

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Icon name="danger-triangle" variant="bold" size={28} className="text-[var(--color-warning)]" />
        <h2 className="font-editorial text-2xl">We couldn&rsquo;t finish your reflection this time.</h2>
        <p className="max-w-sm text-[var(--color-text-muted)]">
          Your answers are safe. Try again when you&rsquo;re ready.
        </p>
        <div className="mt-2 flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Review answers
          </Button>
          <Button onClick={onRetry}>Try again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="relative h-14 w-14">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-[var(--color-accent)]"
          style={{ borderTopColor: "transparent" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
        />
        <span className="absolute inset-3 rounded-full bg-[var(--color-accent)] opacity-20" />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="font-editorial text-xl"
          role="status"
          aria-live="polite"
        >
          {MESSAGES[index]}
        </motion.p>
      </AnimatePresence>
      {status === "slow" && (
        <div className="mt-2 flex flex-col items-center gap-3">
          <p className="text-sm text-[var(--color-text-muted)]">This is taking a little longer than usual.</p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={onRetry}>
              Retry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
