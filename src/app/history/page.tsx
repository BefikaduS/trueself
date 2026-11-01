"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { getAnonymousId } from "@/lib/anonymous";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useToast } from "@/components/common/Toast";
import { LoadingState, EmptyState } from "@/components/common/States";

interface ReportItem {
  id: string;
  name: string;
  isDemo: boolean;
  isArchived: boolean;
  archivedAt?: string | null;
  createdAt: string;
  portraitTitle: string;
}

export default function HistoryPage() {
  const [reports, setReports] = useState<ReportItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [deleteTarget, setDeleteTarget] = useState<ReportItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { show } = useToast();

  const loadReports = () => {
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
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleToggleArchive = async (item: ReportItem, nextArchived: boolean) => {
    const anonymousId = getAnonymousId();
    setActionLoadingId(item.id);
    try {
      const res = await fetch(`/api/reports/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-anonymous-id": anonymousId,
        },
        body: JSON.stringify({ isArchived: nextArchived, anonymousId }),
      });
      if (!res.ok) throw new Error("Failed to update report");

      setReports((prev) =>
        prev
          ? prev.map((r) => (r.id === item.id ? { ...r, isArchived: nextArchived } : r))
          : prev
      );

      show(
        nextArchived
          ? "Reflection archived. Moved to your archived reflections."
          : "Reflection restored to active.",
        "success"
      );
    } catch {
      show("Could not update reflection status. Please try again.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isDeleting) return;
    const anonymousId = getAnonymousId();
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/reports/${deleteTarget.id}?anonymousId=${encodeURIComponent(anonymousId)}`,
        {
          method: "DELETE",
          headers: {
            "x-anonymous-id": anonymousId,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete report");

      setReports((prev) => (prev ? prev.filter((r) => r.id !== deleteTarget.id) : prev));
      show("Reflection permanently deleted.", "default");
      setDeleteTarget(null);
    } catch {
      show("Could not delete reflection. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <LoadingState label="Loading your previous reflections..." />
      </main>
    );
  }

  const activeReports = reports?.filter((r) => !r.isArchived) || [];
  const archivedReports = reports?.filter((r) => r.isArchived) || [];
  const currentList = activeTab === "active" ? activeReports : archivedReports;

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

      {/* Tabs */}
      <div className="mt-8 flex items-center gap-2 border-b border-[var(--color-border)]/50 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={clsx(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeTab === "active"
              ? "bg-[var(--color-surface-strong)] text-[var(--color-text)] shadow-sm"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          )}
        >
          <span>Active reflections</span>
          <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs font-mono">
            {activeReports.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("archived")}
          className={clsx(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeTab === "archived"
              ? "bg-[var(--color-surface-strong)] text-[var(--color-text)] shadow-sm"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          )}
        >
          <Icon name="archive-down" size={14} />
          <span>Archived</span>
          <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs font-mono">
            {archivedReports.length}
          </span>
        </button>
      </div>

      {currentList.length === 0 ? (
        <div className="mt-12">
          {activeTab === "active" ? (
            <EmptyState
              icon="clock-circle"
              title="No active reflections."
              description={
                archivedReports.length > 0
                  ? "You have archived reflections stored in the Archived tab."
                  : "Complete the 6-question assessment to generate your first deep portrait and values compass."
              }
              action={
                <Link href="/assess">
                  <Button>Meet Yourself</Button>
                </Link>
              }
            />
          ) : (
            <EmptyState
              icon="archive-down"
              title="No archived reflections."
              description="Reflections you archive will be safely preserved here, out of your active view."
            />
          )}
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {currentList.map((item) => {
            const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            const isItemBusy = actionLoadingId === item.id;

            return (
              <div
                key={item.id}
                className={clsx(
                  "group relative rounded-[var(--radius-lg)] border p-6 transition-all duration-200",
                  item.isArchived
                    ? "border-[var(--color-border)]/50 bg-[var(--color-surface)]/30 hover:border-[var(--color-border)] hover:bg-[var(--color-surface)]/50"
                    : "border-[var(--color-border)]/70 bg-[var(--color-surface)]/50 hover:border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:shadow-md"
                )}
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
                      {item.isArchived && (
                        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[0.68rem] font-medium text-amber-600 dark:text-amber-400">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                      <Icon name="calendar" size={13} />
                      Completed on {formattedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/report/${item.id}`}>
                      <Button size="sm" variant="primary">
                        Open Report <Icon name="arrow-right" size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>

                {item.portraitTitle && (
                  <p className="mt-3 text-sm italic text-[var(--color-text-muted)] line-clamp-2 border-l-2 border-[var(--color-accent)]/50 pl-3 py-0.5">
                    &ldquo;{item.portraitTitle}...&rdquo;
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)]/40 pt-4">
                  <div className="flex flex-wrap items-center gap-2">
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

                  <div className="flex items-center gap-2">
                    {item.isArchived ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleToggleArchive(item, false)}
                        disabled={isItemBusy}
                        title="Restore to active reflections"
                      >
                        <Icon name="refresh" size={14} />
                        Restore
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleArchive(item, true)}
                        disabled={isItemBusy}
                        title="Archive this reflection"
                      >
                        <Icon name="archive-down" size={14} />
                        Archive
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setDeleteTarget(item)}
                      title="Permanently delete this reflection"
                    >
                      <Icon name="trash-bin-trash" size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        title="Delete reflection permanently?"
      >
        {deleteTarget && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-[var(--color-text)]">{deleteTarget.name}&rsquo;s reflection</strong>?
            </p>
            <div className="rounded-[var(--radius-md)] border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-[var(--color-text-muted)] leading-relaxed">
              This will permanently erase your psychological portrait, values compass, action plan progress,
              and any received friend perspectives. This action cannot be undone.
            </div>

            <div className="mt-2 flex flex-wrap justify-end gap-2.5">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Keep reflection
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                <Icon name="trash-bin-trash" size={15} />
                {isDeleting ? "Deleting..." : "Delete permanently"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
