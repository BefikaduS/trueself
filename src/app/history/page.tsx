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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Modal targets
  const [deleteTarget, setDeleteTarget] = useState<ReportItem | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<ReportItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<ReportItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Close kebab menu on outside click or escape
  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-kebab-menu]")) {
        setOpenMenuId(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuId(null);
    };
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenuId]);

  const handleArchiveConfirm = async () => {
    if (!archiveTarget || isProcessing) return;
    const anonymousId = getAnonymousId();
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/reports/${archiveTarget.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-anonymous-id": anonymousId,
        },
        body: JSON.stringify({ isArchived: true, anonymousId }),
      });
      if (!res.ok) throw new Error("Failed to archive report");

      setReports((prev) =>
        prev
          ? prev.map((r) => (r.id === archiveTarget.id ? { ...r, isArchived: true } : r))
          : prev
      );

      show("Reflection archived. Moved to your archived reflections.", "success");
      setArchiveTarget(null);
    } catch {
      show("Could not archive reflection. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreConfirm = async () => {
    if (!restoreTarget || isProcessing) return;
    const anonymousId = getAnonymousId();
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/reports/${restoreTarget.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-anonymous-id": anonymousId,
        },
        body: JSON.stringify({ isArchived: false, anonymousId }),
      });
      if (!res.ok) throw new Error("Failed to restore report");

      setReports((prev) =>
        prev
          ? prev.map((r) => (r.id === restoreTarget.id ? { ...r, isArchived: false } : r))
          : prev
      );

      show("Reflection restored to your active reflections.", "success");
      setRestoreTarget(null);
    } catch {
      show("Could not restore reflection. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isProcessing) return;
    const anonymousId = getAnonymousId();
    setIsProcessing(true);
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
      setIsProcessing(false);
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
          onClick={() => {
            setActiveTab("active");
            setOpenMenuId(null);
          }}
          className={clsx(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
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
          onClick={() => {
            setActiveTab("archived");
            setOpenMenuId(null);
          }}
          className={clsx(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
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
                  ? "You have reflections stored in your Archived tab."
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
              description="Reflections you archive will be preserved safely here, out of your active reflections list."
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
            const isMenuOpen = openMenuId === item.id;

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

                    {/* 3-Dot Actions Kebab Menu */}
                    <div className="relative" data-kebab-menu>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(isMenuOpen ? null : item.id);
                        }}
                        aria-label={`Actions for ${item.name}'s reflection`}
                        aria-expanded={isMenuOpen}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)]/60 bg-[var(--color-surface)] text-[var(--color-text)] transition-colors hover:border-[var(--color-border)] hover:bg-[var(--color-surface-strong)] cursor-pointer"
                        title="More options"
                      >
                        <Icon name="menu-dots-circle" size={18} />
                      </button>

                      {isMenuOpen && (
                        <div
                          className="absolute right-0 top-full z-40 mt-2 min-w-[210px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-1.5 shadow-xl backdrop-blur-xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            href={`/report/${item.id}`}
                            onClick={() => setOpenMenuId(null)}
                            className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)] cursor-pointer"
                          >
                            <Icon name="document-text" size={15} className="text-[var(--color-text-muted)]" />
                            Full read
                          </Link>
                          <Link
                            href={`/compass/${item.id}`}
                            onClick={() => setOpenMenuId(null)}
                            className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)] cursor-pointer"
                          >
                            <Icon name="compass" size={15} className="text-[var(--color-text-muted)]" />
                            Values compass
                          </Link>
                          <Link
                            href={`/plan/${item.id}`}
                            onClick={() => setOpenMenuId(null)}
                            className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)] cursor-pointer"
                          >
                            <Icon name="checklist" size={15} className="text-[var(--color-text-muted)]" />
                            Action plan
                          </Link>
                          <Link
                            href={`/share/${item.id}`}
                            onClick={() => setOpenMenuId(null)}
                            className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)] cursor-pointer"
                          >
                            <Icon name="square-share-line" size={15} className="text-[var(--color-text-muted)]" />
                            Share card
                          </Link>

                          <div className="my-1 border-t border-[var(--color-border)]/50" />

                          {item.isArchived ? (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                setRestoreTarget(item);
                              }}
                              className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)] cursor-pointer"
                            >
                              <Icon name="refresh" size={15} className="text-amber-500" />
                              Restore to active
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                setArchiveTarget(item);
                              }}
                              className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)] cursor-pointer"
                            >
                              <Icon name="archive-down" size={15} className="text-[var(--color-text-muted)]" />
                              Archive reflection
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              setDeleteTarget(item);
                            }}
                            className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-500/10 dark:text-rose-400 cursor-pointer"
                          >
                            <Icon name="trash-bin-trash" size={15} />
                            Delete permanently
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {item.portraitTitle && (
                  <p className="mt-3 text-sm italic text-[var(--color-text-muted)] line-clamp-2 border-l-2 border-[var(--color-accent)]/50 pl-3 py-0.5">
                    &ldquo;{item.portraitTitle}...&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Archive Confirmation Modal */}
      <Modal
        open={Boolean(archiveTarget)}
        onClose={() => !isProcessing && setArchiveTarget(null)}
        title="Archive this reflection?"
      >
        {archiveTarget && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Are you sure you want to archive{" "}
              <strong className="text-[var(--color-text)]">{archiveTarget.name}&rsquo;s reflection</strong>?
            </p>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Archiving moves this reflection out of your active history. It will be preserved safely in your
              Archived tab and can be restored at any time.
            </p>

            <div className="mt-2 flex flex-wrap justify-end gap-2.5">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setArchiveTarget(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleArchiveConfirm}
                disabled={isProcessing}
              >
                <Icon name="archive-down" size={15} />
                {isProcessing ? "Archiving..." : "Archive reflection"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Restore Confirmation Modal */}
      <Modal
        open={Boolean(restoreTarget)}
        onClose={() => !isProcessing && setRestoreTarget(null)}
        title="Restore reflection?"
      >
        {restoreTarget && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Restore <strong className="text-[var(--color-text)]">{restoreTarget.name}&rsquo;s reflection</strong> back to your active reflections list?
            </p>

            <div className="mt-2 flex flex-wrap justify-end gap-2.5">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setRestoreTarget(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleRestoreConfirm}
                disabled={isProcessing}
              >
                <Icon name="refresh" size={15} />
                {isProcessing ? "Restoring..." : "Restore reflection"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => !isProcessing && setDeleteTarget(null)}
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
                disabled={isProcessing}
              >
                Keep reflection
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleDeleteConfirm}
                disabled={isProcessing}
              >
                <Icon name="trash-bin-trash" size={15} />
                {isProcessing ? "Deleting..." : "Delete permanently"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
