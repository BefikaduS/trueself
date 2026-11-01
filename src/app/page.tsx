"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { Logo } from "@/components/common/Logo";
import { HeroReflection } from "@/components/landing/HeroReflection";

const STAGES = [
  {
    number: "01",
    title: "Reflect",
    icon: "pen-new-square",
    description: "Answer six thoughtfully written questions about how you actually behave — not how you wish you behaved.",
  },
  {
    number: "02",
    title: "Understand",
    icon: "magic-stick-3",
    description: "Trueself looks at your six answers as one connected set and identifies patterns, contradictions, strengths, and possible blind spots.",
  },
  {
    number: "03",
    title: "Move forward",
    icon: "flag-2",
    description: "Get a realistic, personal plan — a 24-hour action, a 7-day reset, and a 30-day experiment — grounded in what you actually told us.",
  },
];

const heroContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.03,
    },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingPage() {
  return (
    <main>
      {/* ---------- Hero ---------- */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={heroContainer}
        className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 pt-10 text-center sm:pt-16"
      >
        <motion.p
          variants={heroItem}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]"
        >
          A personal reflection experience
        </motion.p>

        <motion.div variants={heroItem} className="w-full">
          <HeroReflection />
        </motion.div>

        <motion.h1
          variants={heroItem}
          className="font-editorial text-balance text-[2.1rem] leading-[1.1] sm:text-5xl md:text-[3.4rem]"
        >
          How well do you really know yourself?
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="mt-5 max-w-xl text-balance text-[1.05rem] leading-relaxed text-[var(--color-text-muted)]"
        >
          Six thoughtful questions. One honest look at your patterns, your strengths, and the
          things you might be overlooking. Discover what your answers reveal and where to go
          from here.
        </motion.p>

        <motion.div variants={heroItem} className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/assess">
            <Button size="lg">
              Meet Yourself <Icon name="arrow-right" size={18} />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="outline">
              How it works
            </Button>
          </Link>
        </motion.div>

        <motion.p variants={heroItem} className="mt-5 text-sm text-[var(--color-text-muted)]">
          No complicated personality tests. Just six questions and a little honesty.
        </motion.p>
      </motion.section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className="mx-auto max-w-4xl scroll-mt-28 px-6 py-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
        >
          How it works
        </motion.p>
        <div className="mt-10 flex flex-col">
          {STAGES.map((stage, i) => (
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              className="flex gap-6 border-b border-[var(--color-border)] py-8 last:border-none sm:gap-10"
            >
              <span className="font-editorial text-3xl text-[var(--color-text-muted)] sm:text-4xl">{stage.number}</span>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2.5">
                  <Icon name={stage.icon} size={20} className="text-[var(--color-accent)]" />
                  <h3 className="text-lg font-semibold">{stage.title}</h3>
                </div>
                <p className="max-w-lg text-[var(--color-text-muted)]">{stage.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- Privacy reassurance ---------- */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="surface-card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-surface)]">
            <Icon name="shield-check" variant="bold" size={20} className="text-[var(--color-accent)]" />
          </div>
          <div className="flex-1">
            <p className="text-[1.05rem] leading-relaxed">
              Your answers are personal. You decide what to save and what to share. Your full
              report is private by default.
            </p>
            <Link href="/privacy" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)]">
              Read the privacy page <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="mx-auto max-w-3xl px-6 pb-28 pt-6 text-center">
        <h2 className="font-editorial text-3xl sm:text-4xl">The person you are. The person you&rsquo;re becoming.</h2>
        <p className="mx-auto mt-4 max-w-md text-[var(--color-text-muted)]">
          It takes about three minutes. The honesty might stay with you a little longer.
        </p>
        <Link href="/assess" className="mt-7 inline-block">
          <Button size="lg">Meet Yourself</Button>
        </Link>
      </section>

      <footer className="flex flex-col items-center justify-center gap-3 border-t border-[var(--color-border)] px-6 py-12 text-center text-sm text-[var(--color-text-muted)]">
        <Logo variant="mark" size="sm" />
        <p className="font-medium text-[var(--color-text)]">Trueself — a little more honest with yourself.</p>
        <p className="text-xs text-[var(--color-text-muted)]">
          made by{" "}
          <a
            href="https://instagram.com/bfkdesign"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--color-accent)] underline decoration-[var(--color-accent)]/40 underline-offset-3 transition-colors hover:decoration-[var(--color-accent)]"
          >
            bfkdesign
          </a>
        </p>
      </footer>
    </main>
  );
}
