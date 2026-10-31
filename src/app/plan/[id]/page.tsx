"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AnalysisResult } from "@/lib/types";
import { LoadingState, ErrorState } from "@/components/common/States";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { PlanItemCard, type PlanItemState } from "@/components/plan/PlanItemCard";

interface PlanProgressRow {
  itemKey: string;
  completed: boolean;
  skippedReason: string | null;
  note: string | null;
}

export default function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState<Record<string, PlanItemState>>({});
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [reportRes, planRes] = await Promise.all([
          fetch(`/api/reports/${id}`),
          fetch(`/api/reports/${id}/plan`),
        ]);
        if (!reportRes.ok) throw new Error();
        const reportData = (await reportRes.json()) as { report: { analysis: AnalysisResult } };
        const planData = (await planRes.json()) as { items?: PlanProgressRow[] };
        if (!active) return;
        setAnalysis(reportData.report.analysis);
        const map: Record<string, PlanItemState> = {};
        ((planData.items || []) as PlanProgressRow[]).forEach((item) => {
          map[item.itemKey] = { completed: item.completed, skippedReason: item.skippedReason, note: item.note };
        });
        setProgress(map);
        setState("ready");
      } catch {
        if (active) setState("error");
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const weeklyCompletion = useMemo(() => {
    const dayKeys = Array.from({ length: 7 }, (_, i) => `day-${i + 1}`);
    const done = dayKeys.filter((k) => progress[k]?.completed).length;
    return { done, total: 7 };
  }, [progress]);

  if (state === "loading") return <main className="mx-auto max-w-2xl px-6 py-20"><LoadingState label="Loading your plan..." /></main>;
  if (state === "error" || !analysis) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20">
        <ErrorState title="Couldn't load this plan." description="The report may not exist, or something went wrong." action={<Link href="/"><Button>Go home</Button></Link>} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">Let&rsquo;s do something with what you&rsquo;ve learned</p>
      <h1 className="mt-2 font-editorial text-4xl">Your personal improvement plan.</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        Self-awareness without action rarely changes anything. These are small, realistic steps —
        not a life overhaul.
      </p>

      {/* 24 hours */}
      <section className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 font-semibold"><Icon name="bolt" size={18} className="text-[var(--color-accent)]" /> The next 24 hours</h2>
        <PlanItemCard reportId={id} itemKey="next24h" title="Today's action" action={analysis.next24Hours.action} meta={analysis.next24Hours.purpose} initial={progress.next24h} />
      </section>

      {/* 7 day plan */}
      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold"><Icon name="calendar" size={18} className="text-[var(--color-accent)]" /> Your 7-day reset</h2>
          <span className="text-sm text-[var(--color-text-muted)]">{weeklyCompletion.done}/{weeklyCompletion.total} days</span>
        </div>
        <div className="flex flex-col gap-3">
          {analysis.sevenDayPlan.map((day) => (
            <PlanItemCard
              key={day.day}
              reportId={id}
              itemKey={`day-${day.day}`}
              title={`Day ${day.day} · ${day.title}`}
              action={day.action}
              meta={`${day.minutes} min · ${day.purpose}`}
              initial={progress[`day-${day.day}`]}
            />
          ))}
        </div>
      </section>

      {/* 30 day experiment */}
      <section className="mt-10 mb-16">
        <h2 className="mb-3 flex items-center gap-2 font-semibold"><Icon name="test-tube" size={18} className="text-[var(--color-accent)]" /> Your 30-day experiment</h2>
        <div className="surface-card flex flex-col gap-3 p-5 text-sm">
          <p><strong>Focus area: </strong>{analysis.thirtyDayExperiment.focusArea}</p>
          <p><strong>Behavior to practice: </strong>{analysis.thirtyDayExperiment.behavior}</p>
          <p><strong>Frequency: </strong>{analysis.thirtyDayExperiment.frequency}</p>
          <p><strong>Success looks like: </strong>{analysis.thirtyDayExperiment.successLooksLike}</p>
          <p><strong>If you miss a day: </strong>{analysis.thirtyDayExperiment.ifYouMissADay}</p>
          <p><strong>How progress is evaluated: </strong>{analysis.thirtyDayExperiment.howProgressIsEvaluated}</p>
        </div>
        <div className="mt-3">
          <PlanItemCard reportId={id} itemKey="thirty-day" title="I'm running this experiment" action="Check in on this periodically over the next 30 days." initial={progress["thirty-day"]} />
        </div>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-[var(--color-border)] pt-6">
        <Link href={`/report/${id}`}><Button variant="outline">Back to report</Button></Link>
        <Link href="/checkin"><Button variant="secondary">Daily check-in</Button></Link>
        <Link href="/notes"><Button variant="secondary">My notes &amp; patterns</Button></Link>
      </div>
    </main>
  );
}
