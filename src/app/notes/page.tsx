"use client";

import { useEffect, useState } from "react";
import { getAnonymousId } from "@/lib/anonymous";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { TextAreaField, TextField } from "@/components/common/Field";
import { EmptyState, LoadingState } from "@/components/common/States";
import { useToast } from "@/components/common/Toast";

interface Note {
  id: string;
  title: string;
  body: string;
  category: string;
  linkedInsight: string | null;
  updatedAt: string;
}

const CATEGORIES = [
  { id: "note", label: "Personal note" },
  { id: "works-well", label: "What helps me work well" },
  { id: "drains-me", label: "What drains my energy" },
  { id: "avoidance", label: "What makes me avoid decisions" },
  { id: "overwhelmed", label: "What I need when overwhelmed" },
  { id: "consistency", label: "What I want to become consistent about" },
];

// Combines "My Patterns" and "My Personal Notes" into one minimal,
// searchable journal — both are free-text observations scoped by category.
export default function NotesPage() {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ title: "", body: "", category: "note" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { show } = useToast();

  const load = () => {
    fetch(`/api/notes?anonymousId=${encodeURIComponent(getAnonymousId())}`)
      .then((r) => r.json())
      .then((d) => setNotes(d.notes || []))
      .catch(() => setNotes([]));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm({ title: "", body: "", category: "note" });
    setEditingId(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    const anonymousId = getAnonymousId();
    if (editingId) {
      await fetch(`/api/notes/${editingId}?anonymousId=${encodeURIComponent(anonymousId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-anonymous-id": anonymousId,
        },
        body: JSON.stringify({ ...form, anonymousId }),
      });
      show("Note updated.");
    } else {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, anonymousId }),
      });
      show("Your thoughts found a place to land.", "success");
    }
    resetForm();
    load();
  };

  const remove = async (id: string) => {
    const anonymousId = getAnonymousId();
    await fetch(`/api/notes/${id}?anonymousId=${encodeURIComponent(anonymousId)}`, {
      method: "DELETE",
      headers: { "x-anonymous-id": anonymousId },
    });
    setConfirmDeleteId(null);
    show("Note deleted.");
    load();
  };

  const filtered = notes?.filter(
    (n) => n.title.toLowerCase().includes(query.toLowerCase()) || n.body.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">My patterns &amp; notes</p>
      <h1 className="mt-2 font-editorial text-4xl">A private place to write things down.</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        Observations about yourself, decisions, realizations, commitments. This stays visible only
        to you via this browser.
      </p>

      <form onSubmit={submit} className="surface-card mt-8 flex flex-col gap-4 p-6">
        <TextField label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. What helps me focus" />
        <TextAreaField label="Note" value={form.body} charLimit={2000} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} placeholder="Write what's on your mind..." rows={4} />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => setForm((f) => ({ ...f, category: c.id }))}
              className={`rounded-full border px-3 py-1.5 text-xs ${form.category === c.id ? "border-[var(--color-accent)] bg-[var(--color-surface)]" : "border-[var(--color-border)]"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 self-start">
          <Button type="submit">{editingId ? "Save changes" : "Add note"}</Button>
          {editingId && <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>}
        </div>
      </form>

      <div className="input-surface mt-8 flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2.5 transition-all duration-200 focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-input-focus-ring)]">
        <Icon name="magnifer" size={16} className="text-[var(--color-text-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes..."
          aria-label="Search notes"
          className="w-full bg-transparent text-sm text-[var(--color-input-text,var(--color-text))] placeholder:text-[var(--color-input-placeholder)] outline-none"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {!notes && <LoadingState label="Loading your notes..." />}
        {notes && filtered?.length === 0 && (
          <EmptyState icon="notebook" title="Your thoughts need a place to land." description="Start with something small." />
        )}
        {filtered?.map((note) => (
          <div key={note.id} className="surface-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs text-[var(--color-text-muted)]">{CATEGORIES.find((c) => c.id === note.category)?.label}</span>
                <h3 className="font-semibold">{note.title}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setForm({ title: note.title, body: note.body, category: note.category });
                    setEditingId(note.id);
                  }}
                  className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--color-surface)]"
                  aria-label="Edit note"
                >
                  <Icon name="pen-2" size={15} />
                </button>
                <button
                  onClick={() => setConfirmDeleteId(confirmDeleteId === note.id ? null : note.id)}
                  className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--color-surface)]"
                  aria-label="Delete note"
                >
                  <Icon name="trash-bin-trash" size={15} />
                </button>
              </div>
            </div>
            {confirmDeleteId === note.id && (
              <div className="mt-3 flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <p className="text-xs text-[var(--color-text-muted)]">Permanently delete this note?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(null)}
                    className="rounded px-2.5 py-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(note.id)}
                    className="rounded bg-[var(--color-warning)] px-2.5 py-1 text-xs font-semibold text-white hover:opacity-90"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-muted)]">{note.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
