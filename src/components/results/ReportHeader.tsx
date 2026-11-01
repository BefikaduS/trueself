"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { useToast } from "../common/Toast";
import { getAnonymousId } from "@/lib/anonymous";

export function ReportHeader({
  id,
  name,
  isDemo,
  isArchived = false,
  anonymousId: reportAnonymousId,
  onArchivedChange,
}: {
  id: string;
  name: string;
  isDemo: boolean;
  isArchived?: boolean;
  anonymousId?: string;
  onArchivedChange?: (archived: boolean) => void;
}) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [currentAnonymousId] = useState(() =>
    typeof window !== "undefined" ? getAnonymousId() : ""
  );
  const { show } = useToast();
  const router = useRouter();

  const isOwner = Boolean(
    currentAnonymousId && reportAnonymousId && currentAnonymousId === reportAnonymousId
  );

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href).then(() => {
        show("Report link copied to clipboard!", "success");
      });
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s True Self Reflection`,
          text: `Read ${name}'s personal psychological reflection and values compass on True Self.`,
          url: window.location.href,
        });
        show("Shared successfully!", "success");
      } catch {
        // User cancelled or failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleScrollToAddFriend = () => {
    const el = document.getElementById("friend-perspectives");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/report/${id}#friend-perspectives`);
    }
  };

  const handleToggleArchive = async () => {
    if (!isOwner || isArchiving) return;
    setIsArchiving(true);
    try {
      const nextArchived = !isArchived;
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-anonymous-id": currentAnonymousId,
        },
        body: JSON.stringify({ isArchived: nextArchived, anonymousId: currentAnonymousId }),
      });
      if (!res.ok) throw new Error("Failed to update report");
      onArchivedChange?.(nextArchived);
      show(
        nextArchived
          ? "Reflection archived. It is hidden from your active history."
          : "Reflection restored to active.",
        "success"
      );
    } catch {
      show("Could not update archival status. Please try again.", "error");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDeletePermanent = async () => {
    if (!isOwner || isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/reports/${id}?anonymousId=${encodeURIComponent(currentAnonymousId)}`, {
        method: "DELETE",
        headers: {
          "x-anonymous-id": currentAnonymousId,
        },
      });
      if (!res.ok) throw new Error("Failed to delete report");
      setDeleteModalOpen(false);
      show("Reflection permanently deleted.", "default");
      router.push("/history");
    } catch {
      show("Could not delete reflection. Please try again.", "error");
      setIsDeleting(false);
    }
  };

  return (
    <div className="mb-10 flex flex-col gap-5">
      {isArchived && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-[var(--color-text)]">
          <div className="flex items-center gap-2">
            <Icon name="archive-down" size={18} className="shrink-0 text-amber-500" />
            <span>
              <strong>Archived:</strong> This reflection is stored in your personal archive and hidden from your active history.
            </span>
          </div>
          {isOwner && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleToggleArchive}
              disabled={isArchiving}
            >
              <Icon name="refresh" size={14} /> Restore reflection
            </Button>
          )}
        </div>
      )}

      {isDemo && (
        <div className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
          <Icon name="info-circle" size={16} className="mt-0.5 shrink-0" />
          <span>
            AI analysis isn&rsquo;t connected in this environment, so this is a{" "}
            <strong className="text-[var(--color-text)]">demo analysis</strong> generated directly from your actual answers — not a fabricated AI result.
          </span>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          {name}&rsquo;s reflection
        </p>
        <h1 className="mt-2 font-editorial text-4xl sm:text-5xl text-[var(--color-text)]">
          Here&rsquo;s what your answers reveal.
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Link href={`/plan/${id}`}>
          <Button size="sm" variant="secondary">
            <Icon name="checklist" size={16} /> Improvement plan
          </Button>
        </Link>
        <Link href={`/compass/${id}`}>
          <Button size="sm" variant="secondary">
            <Icon name="compass" size={16} /> Values compass
          </Button>
        </Link>
        <Button size="sm" variant="secondary" onClick={() => setShareModalOpen(true)}>
          <Icon name="square-share-line" size={16} /> Share
        </Button>
        <Button size="sm" variant="secondary" onClick={handleScrollToAddFriend}>
          <Icon name="user-plus" size={16} /> Add Friend
        </Button>
        <Link href="/history">
          <Button size="sm" variant="ghost">
            <Icon name="clock-circle" size={16} /> My reports
          </Button>
        </Link>

        {isOwner && (
          <div className="flex items-center gap-2 sm:ml-auto">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                if (isArchived) {
                  handleToggleArchive();
                } else {
                  setArchiveModalOpen(true);
                }
              }}
              disabled={isArchiving}
              title={isArchived ? "Restore to active reflections" : "Archive this reflection"}
            >
              <Icon name={isArchived ? "refresh" : "archive-down"} size={15} />
              {isArchived ? "Restore" : "Archive"}
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setDeleteModalOpen(true)}
              title="Permanently delete this reflection"
            >
              <Icon name="trash-bin-trash" size={15} />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Share Popover / Modal */}
      <Modal open={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Share Reflection">
        <div className="flex flex-col gap-5 pt-2">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Share this reflection with someone you trust, or generate a high-aesthetic visual card designed for social media.
          </p>

          <div className="flex flex-col gap-2.5">
            <Link href={`/share/${id}`} onClick={() => setShareModalOpen(false)}>
              <div className="group flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 p-4 transition-all hover:bg-[var(--color-accent)]/15">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-accent)] text-white">
                    <Icon name="gallery-wide" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      Create Shareable Card Studio
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      5 aesthetic styles, 3 aspect ratios, downloadable high-res image.
                    </p>
                  </div>
                </div>
                <Icon name="arrow-right" size={16} className="text-[var(--color-accent)] transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left transition-colors hover:bg-[var(--color-surface-strong)]"
            >
              <div className="flex items-center gap-2.5">
                <Icon name="copy" size={18} className="text-[var(--color-text-muted)]" />
                <span className="text-sm font-medium text-[var(--color-text)]">Copy reflection link</span>
              </div>
              <span className="text-xs font-mono text-[var(--color-text-muted)]">1-Click</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left transition-colors hover:bg-[var(--color-surface-strong)]"
            >
              <div className="flex items-center gap-2.5">
                <Icon name="square-share-line" size={18} className="text-[var(--color-text-muted)]" />
                <span className="text-sm font-medium text-[var(--color-text)]">Open system share sheet</span>
              </div>
            </button>
          </div>

          <div className="border-t border-[var(--color-border)]/50 pt-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Quick Share to Socials
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `I just completed a 6-question psychological reflection on True Self. Here's what it revealed about how I operate:`
                )}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
              >
                X (Twitter)
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Here is my personal reflection from True Self: ${typeof window !== "undefined" ? window.location.href : ""}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}&text=${encodeURIComponent("Check out my True Self reflection")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
              >
                Telegram
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </Modal>

      {/* Archive Confirmation Modal */}
      <Modal
        open={archiveModalOpen}
        onClose={() => !isArchiving && setArchiveModalOpen(false)}
        title="Archive this reflection?"
      >
        <div className="flex flex-col gap-4 pt-2">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Are you sure you want to archive{" "}
            <strong className="text-[var(--color-text)]">{name}&rsquo;s reflection</strong>?
          </p>
          <div className="rounded-[var(--radius-md)] border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-[var(--color-text-muted)] leading-relaxed">
            Archiving moves this reflection out of your active history. It will remain securely stored in your personal
            archive and can be restored at any time.
          </div>

          <div className="mt-2 flex flex-wrap justify-end gap-2.5">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setArchiveModalOpen(false)}
              disabled={isArchiving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={async () => {
                await handleToggleArchive();
                setArchiveModalOpen(false);
              }}
              disabled={isArchiving}
            >
              <Icon name="archive-down" size={15} />
              {isArchiving ? "Archiving..." : "Archive reflection"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
        title="Delete reflection permanently?"
      >
        <div className="flex flex-col gap-4 pt-2">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Are you sure you want to permanently delete{" "}
            <strong className="text-[var(--color-text)]">{name}&rsquo;s reflection</strong>?
          </p>
          <div className="rounded-[var(--radius-md)] border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-[var(--color-text-muted)] leading-relaxed">
            This will permanently erase your psychological portrait, values compass, action plan progress,
            and any received friend perspectives. This action cannot be undone.
          </div>

          <div className="mt-2 flex flex-wrap justify-end gap-2.5">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Keep reflection
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={handleDeletePermanent}
              disabled={isDeleting}
            >
              <Icon name="trash-bin-trash" size={15} />
              {isDeleting ? "Deleting..." : "Delete permanently"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
