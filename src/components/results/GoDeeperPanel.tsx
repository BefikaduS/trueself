"use client";

import { useState } from "react";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import { LoadingState } from "../common/States";

interface DeepenQuestion {
  id: string;
  question: string;
  reason: string;
  options: string[];
}

// "Go Deeper": three follow-up questions generated specifically from this
// user's report. Answering is purely reflective here — there's no further
// backend write, it's meant to sharpen the user's own thinking in the moment.
export function GoDeeperPanel({ reportId }: { reportId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [questions, setQuestions] = useState<DeepenQuestion[]>([]);
  const [picked, setPicked] = useState<Record<string, string>>({});

  const load = async () => {
    setState("loading");
    try {
      const res = await fetch(`/api/reports/${reportId}/deepen`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQuestions(data.result.questions);
      setState("ready");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="border-t border-[var(--color-border)] py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">Go deeper</p>
      <h2 className="mt-2 font-editorial text-2xl sm:text-3xl">Three questions your answers leave open.</h2>
      {state === "idle" && (
        <Button className="mt-4" variant="outline" onClick={load}>
          <Icon name="magic-stick-3" size={16} /> Generate my follow-up questions
        </Button>
      )}
      {state === "loading" && <LoadingState label="Looking for what's still uncertain..." />}
      {state === "error" && <p className="mt-3 text-sm text-[var(--color-warning)]">Couldn&rsquo;t generate follow-up questions right now. Try again shortly.</p>}
      {state === "ready" && (
        <div className="mt-5 flex flex-col gap-6">
          {questions.map((q) => (
            <div key={q.id} className="surface-card p-5">
              <p className="font-medium leading-relaxed">{q.question}</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">{q.reason}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPicked((p) => ({ ...p, [q.id]: opt }))}
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      picked[q.id] === opt ? "border-[var(--color-accent)] bg-[var(--color-surface-strong)]" : "border-[var(--color-border)]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {picked[q.id] && (
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                  Noted — sitting with &ldquo;{picked[q.id]}&rdquo; honestly is often more useful than a quick answer. Consider
                  adding it to your Personal Notes.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
