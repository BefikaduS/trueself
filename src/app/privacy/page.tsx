import Link from "next/link";
import { Icon } from "@/components/common/Icon";

const POINTS = [
  {
    icon: "lock-keyhole-minimalistic",
    title: "Your report is private by default",
    body: "Nobody can see your six answers, your context notes, or your full analysis unless you explicitly share a link or export a card. Reports live behind an unguessable link — not a predictable, sequential ID.",
  },
  {
    icon: "square-share-line",
    title: "You choose exactly what's shared",
    body: "Share cards only ever contain the specific line you approve — never your full answers, your private notes, or your journal entries.",
  },
  {
    icon: "chart-2",
    title: "We minimize what's sent for analysis",
    body: "Only your first name, your six selected answers, and any optional context you choose to add are sent to the AI service that generates your report. Nothing else about you is collected.",
  },
  {
    icon: "trash-bin-trash",
    title: "You can delete your data",
    body: "Every report, note and check-in can be permanently deleted from your history. Deleting a report also removes its plan progress, compass, and any friend perspectives tied to it.",
  },
  {
    icon: "user-id",
    title: "No account, no tracking profile",
    body: "Trueself doesn't require sign-up. A random identifier is stored only in your browser so your notes and reports can be found again — it is never used to identify you personally.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">Privacy</p>
      <h1 className="mt-3 font-editorial text-4xl">Honesty requires trust.</h1>
      <p className="mt-4 text-[var(--color-text-muted)]">
        Trueself asks for a certain kind of honesty from you, so it owes you a clear explanation
        of what happens to what you share. Here is exactly what we do — and don&rsquo;t do.
      </p>

      <div className="mt-10 flex flex-col gap-6">
        {POINTS.map((point) => (
          <div key={point.title} className="flex gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-surface)]">
              <Icon name={point.icon} size={18} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <h2 className="font-semibold">{point.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">{point.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="surface-card mt-12 p-6 text-sm text-[var(--color-text-muted)]">
        If a serious concern comes up for you while reflecting, please know that Trueself is a
        self-reflection tool, not a licensed mental health service, and isn&rsquo;t a substitute
        for professional support.
      </div>

      <Link href="/" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)]">
        <Icon name="arrow-left" size={14} /> Back home
      </Link>
    </main>
  );
}
