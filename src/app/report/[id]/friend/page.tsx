"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { TextAreaField, TextField } from "@/components/common/Field";
import { Icon } from "@/components/common/Icon";

export default function FriendPerspectivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();

  const friendParam = searchParams.get("friend") || "";
  const permParam = searchParams.get("perm") || "blind";
  const inviteIdParam = searchParams.get("inviteId") || searchParams.get("token") || "";

  const [fromName, setFromName] = useState(friendParam);
  const [reportOwnerName, setReportOwnerName] = useState("");
  const [reportSummary, setReportSummary] = useState<string | null>(null);
  const [blindSpots, setBlindSpots] = useState<{ title: string; pattern: string }[] | null>(null);

  const [underestimatedStrength, setUnderestimatedStrength] = useState("");
  const [deservesMoreCredit, setDeservesMoreCredit] = useState("");
  const [improvementSuggestion, setImprovementSuggestion] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // Track invitation open event immediately when the friend visits
  useEffect(() => {
    if (inviteIdParam) {
      fetch(`/api/reports/${id}/invitations`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId: inviteIdParam, action: "opened" }),
      }).catch(() => {});
    }
  }, [id, inviteIdParam]);

  useEffect(() => {
    fetch(`/api/reports/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: any) => {
        if (data?.report) {
          setReportOwnerName(data.report.name || "A friend");
          if (permParam === "full") {
            setReportSummary(data.report.analysis?.portrait?.summary || null);
            setBlindSpots(data.report.analysis?.blindSpots || null);
          } else if (permParam === "blindspots") {
            setBlindSpots(data.report.analysis?.blindSpots || null);
          }
        }
      })
      .catch(() => {});
  }, [id, permParam]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`/api/reports/${id}/friend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromName, underestimatedStrength, deservesMoreCredit, improvementSuggestion }),
      });
      if (!res.ok) throw new Error();
      if (inviteIdParam) {
        fetch(`/api/reports/${id}/invitations`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inviteId: inviteIdParam, action: "completed" }),
        }).catch(() => {});
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center">
        <Icon name="check-circle" variant="bold" size={32} className="mx-auto text-[var(--color-positive)]" />
        <h1 className="mt-4 font-editorial text-3xl">Thank you, {fromName || "friend"}.</h1>
        <p className="mt-2 text-[var(--color-text-muted)] leading-relaxed">
          Your perspective was safely sent to {reportOwnerName || "them"}. They decide whether to save or reveal it in their private reflection.
        </p>
        <Link href="/assess" className="mt-8 inline-block">
          <Button size="lg">
            Meet Yourself <Icon name="arrow-right" size={18} />
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        <Icon name="users-group-rounded" size={14} />
        <span>Outside Perspective</span>
      </div>

      <h1 className="mt-3 font-editorial text-3xl sm:text-4xl text-[var(--color-text)]">
        {fromName ? `${fromName}, someone` : "Someone"} trusts your honest read on them.
      </h1>

      <p className="mt-2 text-[var(--color-text-muted)] leading-relaxed">
        {reportOwnerName ? `${reportOwnerName} invited you` : "You've been invited"} to provide a kind, specific outside read. Your name is shown to them — this is a trusted perspective, not anonymous feedback.
      </p>

      {/* Permission Context Banner */}
      {permParam === "blind" && (
        <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)]/70 bg-[var(--color-surface)]/60 px-4 py-3 text-xs text-[var(--color-text-muted)]">
          <strong className="text-[var(--color-text)]">Blind Mirror Mode:</strong> You are answering purely from your real-world experience of them, without seeing their self-assessment first.
        </div>
      )}

      {/* Full reflection shared context preview */}
      {permParam === "full" && reportSummary && (
        <div className="mt-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-xs text-[var(--color-text-muted)]">
          <p className="font-semibold uppercase tracking-wider text-[var(--color-text)]">
            Shared Context from {reportOwnerName}&rsquo;s Reflection:
          </p>
          <p className="mt-1.5 italic leading-relaxed line-clamp-4">
            &ldquo;{reportSummary}&rdquo;
          </p>
        </div>
      )}

      {/* Blind spots shared context preview */}
      {blindSpots && blindSpots.length > 0 && (
        <div className="mt-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-xs text-[var(--color-text-muted)]">
          <p className="font-semibold uppercase tracking-wider text-[var(--color-text)]">
            Areas They&rsquo;re Looking to Explore:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            {blindSpots.slice(0, 2).map((b, idx) => (
              <li key={idx}><strong className="text-[var(--color-text)]">{b.title}</strong></li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
        <TextField
          label="Your name"
          value={fromName}
          onChange={(e) => setFromName(e.target.value)}
          placeholder="How they know you (e.g. Maya)"
          required
        />
        <TextAreaField
          label="What strength do you think they underestimate in themselves?"
          placeholder="Something they do naturally or excel at, but often dismiss or downplay..."
          value={underestimatedStrength}
          charLimit={400}
          onChange={(e) => setUnderestimatedStrength(e.target.value)}
          required
        />
        <TextAreaField
          label="What's one thing you think they should give themselves more credit for?"
          placeholder="An effort, resilience, or standard they rarely acknowledge..."
          value={deservesMoreCredit}
          charLimit={400}
          onChange={(e) => setDeservesMoreCredit(e.target.value)}
          required
        />
        <TextAreaField
          label="What behavior or habit do you think they could gently improve?"
          placeholder="Constructive, specific observation (e.g. overcommitting, waiting too long to start, being too hard on themselves)..."
          value={improvementSuggestion}
          charLimit={400}
          onChange={(e) => setImprovementSuggestion(e.target.value)}
          required
        />

        {status === "error" && (
          <p className="text-sm text-[var(--color-warning)]">
            Something went wrong submitting your perspective. Please try again.
          </p>
        )}

        <Button type="submit" disabled={status === "sending"} className="w-full justify-center">
          {status === "sending" ? "Sending perspective..." : "Send honest perspective"}
        </Button>
      </form>
    </main>
  );
}
