"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { AnalysisResult } from "@/lib/types";
import { LoadingState, ErrorState } from "@/components/common/States";
import { Button } from "@/components/common/Button";
import { ReportHeader } from "@/components/results/ReportHeader";
import {
  PortraitSection,
  HonestTruthSection,
  StrengthSection,
  BlindSpotsSection,
  ContradictionsSection,
  PatternSection,
  StopStartSection,
  PrioritiesSection,
  FinalNoteSection,
} from "@/components/results/ReportSections";
import { GoDeeperPanel } from "@/components/results/GoDeeperPanel";
import { AskTrueself } from "@/components/results/AskTrueself";
import { FriendPerspectives } from "@/components/results/FriendPerspectives";

interface ReportRow {
  id: string;
  name: string;
  analysis: AnalysisResult;
  isDemo: boolean;
  patternConfirmed: boolean | null;
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<ReportRow | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/reports/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (active) {
          setReport(data.report);
          setState("ready");
        }
      } catch {
        if (active) setState("error");
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const confirmPattern = async (value: boolean) => {
    setReport((r) => (r ? { ...r, patternConfirmed: value } : r));
    await fetch(`/api/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patternConfirmed: value }),
    });
  };

  if (state === "loading") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <LoadingState label="Opening your report..." />
      </main>
    );
  }

  if (state === "error" || !report) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20">
        <ErrorState
          title="We couldn't find that report."
          description="The link may be incorrect, or the report may have been deleted."
          action={
            <Link href="/">
              <Button>Go home</Button>
            </Link>
          }
        />
      </main>
    );
  }

  const { analysis } = report;

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <ReportHeader id={report.id} name={report.name} isDemo={report.isDemo} />
      <PortraitSection data={analysis.portrait} />
      <HonestTruthSection data={analysis.honestTruth} />
      <StrengthSection data={analysis.strength} />
      <BlindSpotsSection data={analysis.blindSpots} />
      <ContradictionsSection data={analysis.contradictions} />
      <PatternSection data={analysis.behaviorPattern} confirmed={report.patternConfirmed} onConfirm={confirmPattern} />
      <StopStartSection stop={analysis.stopDoing} start={analysis.startDoing} />
      <PrioritiesSection data={analysis.priorities} />
      <FinalNoteSection note={analysis.finalNote} />

      <div className="mt-4 flex flex-wrap gap-3 border-t border-[var(--color-border)] pt-8">
        <Link href={`/plan/${report.id}`}>
          <Button>Build my improvement plan</Button>
        </Link>
        <Link href={`/share/${report.id}`}>
          <Button variant="outline">Create a shareable card</Button>
        </Link>
      </div>

      <GoDeeperPanel reportId={report.id} />
      <FriendPerspectives reportId={report.id} />
      <AskTrueself reportId={report.id} />
    </main>
  );
}
