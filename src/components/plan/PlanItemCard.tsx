"use client";

import { useEffect, useState } from "react";
import { Icon } from "../common/Icon";
import { useToast } from "../common/Toast";

export interface PlanItemState {
  completed: boolean;
  skippedReason: string | null;
  note: string | null;
}

// A single trackable plan action (24h / day-N / 30-day). Supports marking
// complete, skipping with an optional reason (never punitive), and a short
// personal note — all persisted per report.
export function PlanItemCard({
  reportId,
  itemKey,
  title,
  action,
  meta,
  initial,
}: {
  reportId: string;
  itemKey: string;
  title: string;
  action: string;
  meta?: string;
  initial?: PlanItemState;
}) {
  const [state, setState] = useState<PlanItemState>(initial ?? { completed: false, skippedReason: null, note: null });
  const [prevInitial, setPrevInitial] = useState(initial);
  const [showSkip, setShowSkip] = useState(false);
  const [skipReasonDraft, setSkipReasonDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState(initial?.note ?? "");
  const { show } = useToast();

  if (initial !== prevInitial) {
    setPrevInitial(initial);
    if (initial) {
      setState(initial);
      setNoteDraft(initial.note ?? "");
    }
  }

  const persist = async (next: PlanItemState) => {
    setState(next);
    await fetch(`/api/reports/${reportId}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemKey, ...next }),
    });
  };

  const toggleComplete = () => {
    const next = { ...state, completed: !state.completed, skippedReason: !state.completed ? null : state.skippedReason };
    persist(next);
    if (next.completed) show("That's one promise to yourself you've kept.", "success");
  };

  const saveSkip = (reason: string) => {
    persist({ ...state, completed: false, skippedReason: reason });
    setShowSkip(false);
    setSkipReasonDraft("");
    show("No penalty for skipping — noted for next time.");
  };

  const saveNote = () => {
    persist({ ...state, note: noteDraft });
  };

  return (
    <div className={`surface-card p-5 transition-colors ${state.completed ? "border-[var(--color-positive)]" : ""}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={toggleComplete}
          aria-pressed={state.completed}
          aria-label={state.completed ? "Mark as not done" : "Mark as done"}
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
            state.completed ? "border-[var(--color-positive)] bg-[var(--color-positive)] text-white" : "border-[var(--color-border)]"
          }`}
        >
          {state.completed && <Icon name="check-circle" variant="bold" size={14} />}
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">{title}</h3>
            {meta && <span className="text-xs text-[var(--color-text-muted)]">{meta}</span>}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">{action}</p>

          {state.skippedReason && (
            <p className="mt-2 text-xs italic text-[var(--color-text-muted)]">Skipped: {state.skippedReason}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <button onClick={() => setShowSkip((v) => !v)} className="text-[var(--color-text-muted)] underline underline-offset-2">
              Skip with a reason
            </button>
          </div>

          {showSkip && (
            <div className="mt-2 flex gap-2">
              <input
                value={skipReasonDraft}
                onChange={(e) => setSkipReasonDraft(e.target.value)}
                placeholder="Why skip it? (optional)"
                aria-label="Reason for skipping"
                className="input-surface flex-1 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs text-[var(--color-input-text,var(--color-text))] placeholder:text-[var(--color-input-placeholder)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-input-focus-ring)]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveSkip(skipReasonDraft);
                }}
              />
              <button
                type="button"
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2.5 py-1.5 text-xs transition-colors hover:border-[var(--color-accent)]"
                onClick={() => saveSkip(skipReasonDraft)}
              >
                Save
              </button>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <input
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              onBlur={saveNote}
              placeholder="Add a personal note..."
              aria-label="Personal note"
              className="input-surface flex-1 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs text-[var(--color-input-text,var(--color-text))] placeholder:text-[var(--color-input-placeholder)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-input-focus-ring)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
