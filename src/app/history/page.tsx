"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAnonymousId } from "@/lib/anonymous";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { LoadingState, EmptyState } from "@/components/common/States";

interface ReportItem {
  id: string;
  name: string;
  isDemo: boolean;
  createdAt: string;
  portraitTitle: string;
}

export default function HistoryPage() {
  const [reports, setReports] = useState<ReportItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const anonymousId = getAnonymousId();
    fetch(`/api/reports?anonymousId=${encodeURIComponent(anonymousId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load reports");
        return res.json();
      })
      .then((data: any) => {
        setReports(data.reports || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load history:", err);
        setReports([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <LoadingState label="Loading your previous reflections..." />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)]/60 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Personal Archive
          </p>
          <h1 className="mt-2 font-editorial text-4xl sm:text-5xl text-[var(--color-text)]">
            My Reflections
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Your saved psychological reflections on this device. Anonymous, private, and unlinked to accounts.
          </p>
        </div>

        <Link href="/assess">
          <Button size="sm">
            <Icon name="pen-new-square" size={16} /> Meet Yourself
          </Button>
        </Link>
      </div>

      {!reports || reports.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            icon="clock-circle"
            title="No reflections recorded yet."
            description="Complete the 6-question assessment to generate your first deep portrait and values compass."
            action={
              <Link href="/assess">
                <Button>Meet Yourself</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {reports.map((item) => {
            const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={item.id}
                className="group relative rounded-[var(--radius-lg)] border border-[var(--color-border)]/70 bg-[var(--color-surface)]/50 p-6 transition-all duration-200 hover:border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-editorial text-2xl font-semibold text-[var(--color-text)]">
                        {item.name}&rsquo;s Reflection
                      </span>
                      {item.isDemo && (
                        <span className="rounded-full bg-[var(--color-surface-strong)] px-2 py-0.5 text-[0.68rem] font-medium text-[var(--color-text-muted)]">
                          Demo
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                      <Icon name="calendar" size={13} />
                      Completed on {formattedDate}
                    </p>
                  </div>

                  <Link href={`/report/${item.id}`}>
                    <Button size="sm" variant="primary">
                      Open Report <Icon name="arrow-right" size={14} />
                    </Button>
                  </Link>
                </div>

                {item.portraitTitle && (
                  <p className="mt-3 text-sm italic text-[var(--color-text-muted)] line-clamp-2 border-l-2 border-[var(--color-accent)]/50 pl-3 py-0.5">
                    &ldquo;{item.portraitTitle}...&rdquo;
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)]/40 pt-4">
                  <Link href={`/report/${item.id}`}>
                    <Button size="sm" variant="ghost">
                      <Icon name="document-text" size={14} /> Full read
                    </Button>
                  </Link>
                  <Link href={`/compass/${item.id}`}>
                    <Button size="sm" variant="ghost">
                      <Icon name="compass" size={14} /> Values compass
                    </Button>
                  </Link>
                  <Link href={`/plan/${item.id}`}>
                    <Button size="sm" variant="ghost">
                      <Icon name="checklist" size={14} /> Action plan
                    </Button>
                  </Link>
                  <Link href={`/share/${item.id}`}>
                    <Button size="sm" variant="ghost">
                      <Icon name="square-share-line" size={14} /> Share card
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

