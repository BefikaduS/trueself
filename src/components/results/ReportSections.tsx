"use client";

import { motion } from "framer-motion";
import type { AnalysisResult } from "@/lib/types";
import { Icon } from "../common/Icon";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="scroll-mt-28 border-b border-[var(--color-border)] py-10 first:pt-0 last:border-none"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">{eyebrow}</p>
      <h2 className="mt-2 font-editorial text-balance text-2xl sm:text-3xl">{title}</h2>
      <div className="mt-5 text-[1.02rem] leading-relaxed text-[var(--color-text)]">{children}</div>
    </motion.section>
  );
}

function SupportTags({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-text-muted)]">
          {item}
        </span>
      ))}
    </div>
  );
}

function ConfidenceTag({ level }: { level: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
      <Icon name="chart-2" size={13} /> {level} confidence — a reading, not a verdict
    </span>
  );
}

export function PortraitSection({ data }: { data: AnalysisResult["portrait"] }) {
  return (
    <Section id="portrait" eyebrow="01 · Your current portrait" title={data.title}>
      <p className="font-editorial text-xl leading-relaxed sm:text-[1.4rem]">{data.summary}</p>
      <div className="mt-3"><ConfidenceTag level={data.confidence} /></div>
      <SupportTags items={data.supportingAnswers} />
    </Section>
  );
}

export function HonestTruthSection({ data }: { data: AnalysisResult["honestTruth"] }) {
  return (
    <Section id="honest-truth" eyebrow="02 · The honest truth" title={data.title}>
      <div className="surface-card border-l-4 border-l-[var(--color-accent)] p-6">
        <p className="leading-relaxed">{data.observation}</p>
      </div>
      <p className="mt-4 text-sm text-[var(--color-text-muted)]">{data.reasoning}</p>
      <div className="mt-3"><ConfidenceTag level={data.confidence} /></div>
      <SupportTags items={data.supportingAnswers} />
    </Section>
  );
}

export function StrengthSection({ data }: { data: AnalysisResult["strength"] }) {
  return (
    <Section id="strength" eyebrow="03 · Your underused strength" title={data.title}>
      <p className="leading-relaxed">{data.description}</p>
      <p className="mt-3 text-[var(--color-text-muted)]">
        <strong className="text-[var(--color-text)]">Use it more intentionally: </strong>
        {data.howToUseIt}
      </p>
      <SupportTags items={data.supportingAnswers} />
    </Section>
  );
}

export function BlindSpotsSection({ data }: { data: AnalysisResult["blindSpots"] }) {
  return (
    <Section id="blind-spots" eyebrow="04 · Your blind spots" title="What might be getting in your way?">
      <div className="flex flex-col gap-5">
        {data.map((spot) => (
          <div key={spot.title} className="surface-card p-5">
            <h3 className="flex items-center gap-2 font-semibold">
              <Icon name="danger-circle" size={16} className="text-[var(--color-accent)]" /> {spot.title}
            </h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed">{spot.pattern}</p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-text)]">In everyday life: </strong>
              {spot.everydayImpact}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-text)]">Notice it by: </strong>
              {spot.howToNotice}
            </p>
            <SupportTags items={spot.relatedAnswers} />
          </div>
        ))}
      </div>
    </Section>
  );
}

export function ContradictionsSection({ data }: { data: AnalysisResult["contradictions"] }) {
  return (
    <Section id="contradictions" eyebrow="05 · Your internal contradiction" title="Where your actions and intentions might disagree.">
      <div className="flex flex-col gap-6">
        {data.map((c, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">What you appear to value</p>
              <p className="mt-1.5 text-sm leading-relaxed">{c.valuedThing}</p>
            </div>
            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">What your answers suggest you sometimes do</p>
              <p className="mt-1.5 text-sm leading-relaxed">{c.observedBehavior}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm"><strong>The possible contradiction: </strong>{c.possibleContradiction}</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]"><strong className="text-[var(--color-text)]">A useful way forward: </strong>{c.wayForward}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function PatternSection({
  data,
  confirmed,
  onConfirm,
}: {
  data: AnalysisResult["behaviorPattern"];
  confirmed: boolean | null;
  onConfirm: (value: boolean) => void;
}) {
  return (
    <Section id="pattern" eyebrow="06 · Your personal pattern" title="A cycle your answers might be describing.">
      <div className="flex flex-wrap items-center gap-2">
        {data.stages.map((stageLabel, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm">
              {stageLabel}
            </span>
            {i < data.stages.length - 1 && <Icon name="arrow-right" size={14} className="text-[var(--color-text-muted)]" />}
          </div>
        ))}
      </div>
      <p className="mt-4 text-[var(--color-text-muted)]">{data.explanation}</p>
      <div className="mt-5 flex items-center gap-3">
        <span className="text-sm">Does this feel accurate?</span>
        <button
          onClick={() => onConfirm(true)}
          className={`rounded-full border px-3 py-1.5 text-sm ${confirmed === true ? "border-[var(--color-accent)] bg-[var(--color-surface)]" : "border-[var(--color-border)]"}`}
        >
          Yes, mostly
        </button>
        <button
          onClick={() => onConfirm(false)}
          className={`rounded-full border px-3 py-1.5 text-sm ${confirmed === false ? "border-[var(--color-accent)] bg-[var(--color-surface)]" : "border-[var(--color-border)]"}`}
        >
          Not quite
        </button>
      </div>
    </Section>
  );
}

export function StopStartSection({ stop, start }: { stop: AnalysisResult["stopDoing"]; start: AnalysisResult["startDoing"] }) {
  return (
    <Section id="stop-start" eyebrow="07–08 · Stop and start" title="One thing to leave behind. One thing to take seriously.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="surface-card p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            <Icon name="close-circle" size={14} /> Worth leaving behind
          </p>
          <p className="mt-2 font-medium">{stop.action}</p>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{stop.reason}</p>
        </div>
        <div className="surface-card p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            <Icon name="check-circle" size={14} /> Worth taking seriously
          </p>
          <p className="mt-2 font-medium">{start.action}</p>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{start.reason}</p>
        </div>
      </div>
    </Section>
  );
}

export function PrioritiesSection({ data }: { data: string[] }) {
  return (
    <Section id="priorities" eyebrow="09 · Your next chapter" title="Where to go from here.">
      <ol className="flex flex-col gap-3">
        {data.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="font-editorial text-xl text-[var(--color-accent)]">{i + 1}</span>
            <span className="pt-0.5">{p}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function FinalNoteSection({ note }: { note: string }) {
  return (
    <Section id="final-note" eyebrow="10 · A final note" title="Before you go.">
      <p className="font-editorial text-balance text-xl leading-relaxed sm:text-2xl">{note}</p>
    </Section>
  );
}
