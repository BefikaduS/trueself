"use client";

import { motion } from "framer-motion";
import { Button } from "../common/Button";
import { Icon } from "../common/Icon";

export function IntroStep({
  name,
  onStart,
  onBack,
}: {
  name: string;
  onStart: () => void;
  onBack?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Good to meet you, {name}
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-[var(--color-text-muted)] underline underline-offset-2 hover:text-[var(--color-text)] transition-colors"
          >
            Change name
          </button>
        )}
      </div>
      <h1 className="font-editorial text-balance text-3xl leading-tight sm:text-4xl">
        This isn&rsquo;t a test, and there are no perfect answers.
      </h1>
      <p className="text-[1.05rem] leading-relaxed text-[var(--color-text-muted)]">
        You don&rsquo;t need to choose who you want to be. Choose what feels closest to who you
        actually are. Some answers might feel uncomfortable. That&rsquo;s okay. Be honest with
        yourself.
      </p>

      <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
        <Icon name="clock-circle" size={16} />
        About 2–3 minutes · 6 questions
      </div>

      <div className="flex items-center gap-3">
        <Button size="lg" onClick={onStart} className="self-start">
          Meet Yourself <Icon name="arrow-right" size={18} />
        </Button>
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <Icon name="arrow-left" size={16} /> Back
          </Button>
        )}
      </div>
    </motion.div>
  );
}
