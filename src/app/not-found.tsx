import Link from "next/link";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--color-surface)] ring-1 ring-[var(--color-border)]">
        <Icon name="compass" size={28} className="text-[var(--color-accent)]" />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
        404 &middot; Not Found
      </p>

      <h1 className="mt-2 font-editorial text-4xl sm:text-5xl">
        We couldn&apos;t find that page.
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
        The link you followed may be outdated, incomplete, or the page might have moved.
        Any reports or notes you have saved on this device remain safe.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="primary">Return to Trueself</Button>
        </Link>
        <Link href="/history">
          <Button variant="outline">View My Reports</Button>
        </Link>
      </div>
    </main>
  );
}

