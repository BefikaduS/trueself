"use client";

import { useState } from "react";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

const PROMPTS = [
  "Why do I keep postponing things I care about?",
  "How can I become more consistent?",
  "I disagree with one part of my report.",
];

interface Exchange {
  question: string;
  answer: string;
}

// A small, scoped reflection box — deliberately not a full chat UI. One
// question in, one grounded answer out, using this report as context.
export function AskTrueself({ reportId }: { reportId: string }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Exchange[]>([]);

  const ask = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, question: q }),
      });
      const data = await res.json();
      setHistory((h) => [...h, { question: q, answer: data.answer }]);
      setQuestion("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t border-[var(--color-border)] py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">Ask Trueself</p>
      <h2 className="mt-2 font-editorial text-2xl sm:text-3xl">Revisit or question something in your report.</h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {PROMPTS.map((p) => (
          <button key={p} onClick={() => ask(p)} className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm hover:border-[var(--color-accent)]">
            {p}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {history.map((ex, i) => (
          <div key={i} className="flex flex-col gap-2">
            <p className="self-start rounded-[var(--radius-md)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium">{ex.question}</p>
            <p className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3 text-sm leading-relaxed">{ex.answer}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something about your report..."
          aria-label="Ask something about your report"
          className="input-surface flex-1 rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-[var(--color-input-text,var(--color-text))] placeholder:text-[var(--color-input-placeholder)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-input-focus-ring)]"
        />
        <Button type="submit" size="sm" disabled={loading || !question.trim()}>
          <Icon name="plain-2" size={16} /> {loading ? "Thinking..." : "Ask"}
        </Button>
      </form>
    </section>
  );
}
