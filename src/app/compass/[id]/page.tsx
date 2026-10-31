"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { VALUE_DIMENSIONS, type SubmittedAnswer } from "@/lib/types";
import { suggestValueWeights } from "@/lib/compass";
import { RadarChart } from "@/components/compass/RadarChart";
import { ModernSlider } from "@/components/compass/ModernSlider";
import { LoadingState, ErrorState } from "@/components/common/States";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { useToast } from "@/components/common/Toast";

export default function CompassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [weights, setWeights] = useState<Record<string, number> | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const { show } = useToast();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [reportRes, compassRes] = await Promise.all([fetch(`/api/reports/${id}`), fetch(`/api/reports/${id}/compass`)]);
        if (!reportRes.ok) throw new Error();
        const reportData = await reportRes.json();
        const compassData = await compassRes.json();
        if (!active) return;
        const saved = compassData.weights as Record<string, number> | null;
        setWeights(saved ?? suggestValueWeights(reportData.report.answers as SubmittedAnswer[]));
        setState("ready");
      } catch {
        if (active) setState("error");
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = (next: Record<string, number>, immediate = false) => {
    setWeights(next);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    const persistToApi = () => {
      fetch(`/api/reports/${id}/compass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weights: next }),
      }).catch(() => {});
    };

    if (immediate) {
      persistToApi();
    } else {
      saveTimerRef.current = setTimeout(persistToApi, 400);
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  if (state === "loading") return <main className="mx-auto max-w-xl px-6 py-20"><LoadingState label="Mapping your priorities..." /></main>;
  if (state === "error" || !weights) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20">
        <ErrorState title="Couldn't load the compass." description="Try again from your report." action={<Link href="/"><Button>Go home</Button></Link>} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">Feature · Values compass</p>
      <h1 className="mt-2 font-editorial text-4xl">What seems to matter most to you.</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        Your answers offer clues about these eight dimensions — but you have the final say. Adjust
        any slider to reflect what&rsquo;s actually true for you.
      </p>

      <div className="surface-card mt-8 p-6">
        <RadarChart weights={weights} />
      </div>

      {/* Presets and quick alignment */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)]/50 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Adjust 8 Life Dimensions
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => {
              const balanced: Record<string, number> = {};
              VALUE_DIMENSIONS.forEach((d) => (balanced[d] = 50));
              save(balanced, true);
              show("Reset to balanced 50 across all dimensions.", "default");
            }}
            className="rounded-full border border-[var(--color-border)] px-3 py-1 font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
          >
            Equal balance
          </button>
          <button
            onClick={() => {
              const sorted = Object.entries(weights).sort((a, b) => b[1] - a[1]);
              const topKeys = new Set(sorted.slice(0, 3).map(([k]) => k));
              const focused: Record<string, number> = {};
              VALUE_DIMENSIONS.forEach((d) => {
                focused[d] = topKeys.has(d) ? 90 : 35;
              });
              save(focused, true);
              show("Sharpened focus around your top 3 core dimensions.", "success");
            }}
            className="rounded-full border border-[var(--color-accent)]/40 px-3 py-1 font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors"
          >
            Sharpen top 3
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {VALUE_DIMENSIONS.map((dim) => (
          <ModernSlider
            key={dim}
            dimension={dim}
            value={weights[dim] ?? 50}
            onChange={(newVal) => save({ ...weights, [dim]: newVal })}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => show("Saved — this is your read, not a fixed score.", "success")}>
          <Icon name="diskette" size={16} /> Confirm my priorities
        </Button>
        <Link href={`/report/${id}`}><Button variant="secondary">Back to report</Button></Link>
      </div>
    </main>
  );
}
