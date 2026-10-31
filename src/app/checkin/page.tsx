"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { getAnonymousId } from "@/lib/anonymous";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { TextAreaField } from "@/components/common/Field";
import { EmptyState, LoadingState } from "@/components/common/States";
import { useToast } from "@/components/common/Toast";

interface DailyCheckin {
  id: string;
  anonymousId: string;
  checkinDate: string;
  energyDrain: string | null;
  wentWell: string | null;
  avoiding: string | null;
  createdAt: string;
}

export default function CheckinPage() {
  const [todayDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({
    energyDrain: "",
    wentWell: "",
    avoiding: "",
  });
  const [checkins, setCheckins] = useState<DailyCheckin[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const { show } = useToast();

  const loadCheckins = () => {
    const anonymousId = getAnonymousId();
    fetch(`/api/checkins?anonymousId=${encodeURIComponent(anonymousId)}`)
      .then((res) => (res.ok ? res.json() : { checkins: [] }))
      .then((data) => {
        const list: DailyCheckin[] = data.checkins || [];
        setCheckins(list);
        const match = list.find((c) => c.checkinDate === selectedDate);
        if (match) {
          setForm({
            energyDrain: match.energyDrain ?? "",
            wentWell: match.wentWell ?? "",
            avoiding: match.avoiding ?? "",
          });
        }
      })
      .catch(() => setCheckins([]));
  };

  useEffect(() => {
    loadCheckins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When date changes, prefill with existing entry for that date if any
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (!checkins) return;
    const match = checkins.find((c) => c.checkinDate === date);
    if (match) {
      setForm({
        energyDrain: match.energyDrain ?? "",
        wentWell: match.wentWell ?? "",
        avoiding: match.avoiding ?? "",
      });
    } else {
      setForm({ energyDrain: "", wentWell: "", avoiding: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.energyDrain.trim() && !form.wentWell.trim() && !form.avoiding.trim()) {
      show("Please write at least one thought for today.", "error");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/checkins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            anonymousId: getAnonymousId(),
            checkinDate: selectedDate,
            energyDrain: form.energyDrain.trim() || null,
            wentWell: form.wentWell.trim() || null,
            avoiding: form.avoiding.trim() || null,
          }),
        });

        if (!res.ok) throw new Error("Failed to save checkin");
        show("Today's check-in recorded.", "success");
        loadCheckins();
      } catch {
        show("Could not save your check-in. Please try again.", "error");
      }
    });
  };

  const isToday = selectedDate === todayDate;

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        <Icon name="calendar" size={14} />
        <span>Daily Check-In</span>
      </div>

      <h1 className="mt-2 font-editorial text-4xl">A daily pause to stay honest.</h1>
      <p className="mt-3 leading-relaxed text-[var(--color-text-muted)]">
        Change does not happen in grand epiphanies — it happens in small, daily recognitions.
        Three focused questions to reflect on how you showed up today.
      </p>

      {/* Date selector header */}
      <div className="surface-card mt-8 flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--color-text-muted)]">Check-in for:</span>
          <input
            type="date"
            value={selectedDate}
            max={todayDate}
            onChange={(e) => handleDateChange(e.target.value)}
            aria-label="Select check-in date"
            className="input-surface rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)] outline-none"
          />
        </div>
        {isToday ? (
          <span className="rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
            Today
          </span>
        ) : (
          <button
            type="button"
            onClick={() => handleDateChange(todayDate)}
            className="text-xs font-medium text-[var(--color-accent)] underline hover:opacity-80"
          >
            Jump to today
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="surface-card mt-4 flex flex-col gap-6 p-6">
        <div>
          <TextAreaField
            label="1. What drained your energy today?"
            placeholder="A conversation, an avoided task, second-guessing yourself, over-explaining..."
            charLimit={300}
            rows={3}
            value={form.energyDrain}
            onChange={(e) => setForm((f) => ({ ...f, energyDrain: e.target.value }))}
          />
        </div>

        <div>
          <TextAreaField
            label="2. What went well or felt meaningful?"
            placeholder="A moment of clear boundary, finishing something without procrastinating, genuine presence..."
            charLimit={300}
            rows={3}
            value={form.wentWell}
            onChange={(e) => setForm((f) => ({ ...f, wentWell: e.target.value }))}
          />
        </div>

        <div>
          <TextAreaField
            label="3. What did you catch yourself avoiding?"
            placeholder="An email, an honest answer, making a difficult decision, sitting with discomfort..."
            charLimit={300}
            rows={3}
            value={form.avoiding}
            onChange={(e) => setForm((f) => ({ ...f, avoiding: e.target.value }))}
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            Stored locally and privately on this browser.
          </p>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save check-in"}
          </Button>
        </div>
      </form>

      {/* Prior check-ins history */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Past Reflections
        </h2>

        <div className="mt-4 flex flex-col gap-4">
          {!checkins && <LoadingState label="Loading past reflections..." />}
          {checkins && checkins.length === 0 && (
            <EmptyState
              icon="calendar"
              title="No check-ins yet."
              description="Your first check-in will appear here. Build a small track record of honest observations."
            />
          )}
          {checkins &&
            checkins.map((item) => (
              <div
                key={item.id}
                className={`surface-card p-5 transition-all ${
                  item.checkinDate === selectedDate ? "ring-2 ring-[var(--color-accent)]" : ""
                }`}
              >
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                  <span className="font-mono text-xs font-semibold text-[var(--color-accent)]">
                    {item.checkinDate}
                  </span>
                  {item.checkinDate !== selectedDate && (
                    <button
                      type="button"
                      onClick={() => handleDateChange(item.checkinDate)}
                      className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    >
                      Edit this day
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-3 text-sm">
                  {item.energyDrain && (
                    <div>
                      <span className="text-xs font-medium text-[var(--color-text-muted)]">
                        Energy drain:
                      </span>
                      <p className="text-[var(--color-text)]">{item.energyDrain}</p>
                    </div>
                  )}
                  {item.wentWell && (
                    <div>
                      <span className="text-xs font-medium text-[var(--color-text-muted)]">
                        Went well:
                      </span>
                      <p className="text-[var(--color-text)]">{item.wentWell}</p>
                    </div>
                  )}
                  {item.avoiding && (
                    <div>
                      <span className="text-xs font-medium text-[var(--color-text-muted)]">
                        Caught avoiding:
                      </span>
                      <p className="text-[var(--color-text)]">{item.avoiding}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Navigation footer */}
      <div className="mt-10 flex flex-wrap gap-3 border-t border-[var(--color-border)] pt-6">
        <Link href="/history">
          <Button variant="outline">My Reports</Button>
        </Link>
        <Link href="/notes">
          <Button variant="secondary">My notes &amp; patterns</Button>
        </Link>
      </div>
    </main>
  );
}

