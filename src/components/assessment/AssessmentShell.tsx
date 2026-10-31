"use client";

import Link from "next/link";
import { Icon } from "../common/Icon";
import { ProgressBar } from "../common/ProgressBar";

// Minimal chrome for the assessment: just a wordmark, an exit link, and
// (optionally) progress. Deliberately avoids the full site navigation so
// the six questions stay the focus, per product rules.
export function AssessmentShell({
  children,
  current,
  total,
}: {
  children: React.ReactNode;
  current?: number;
  total?: number;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-text)]">
            <Icon name="compass" variant="bold" size={13} />
          </span>
          Trueself
        </Link>
        {typeof current === "number" && typeof total === "number" && (
          <span className="font-editorial text-lg text-[var(--color-text-muted)]" aria-hidden="true">
            {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        )}
        <Link
          href="/"
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          aria-label="Save and exit assessment"
        >
          Save &amp; exit
        </Link>
      </header>

      {typeof current === "number" && typeof total === "number" && (
        <div className="px-5 sm:px-8">
          <ProgressBar value={current} max={total} />
        </div>
      )}

      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-xl">{children}</div>
      </div>
    </div>
  );
}
