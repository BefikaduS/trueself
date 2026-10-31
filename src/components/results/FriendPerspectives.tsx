"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import { EmptyState } from "../common/States";
import { Modal } from "../common/Modal";
import { TextField } from "../common/Field";
import { useToast } from "../common/Toast";

export type FriendPermission = "blind" | "full" | "blindspots" | "compass";

export interface FriendInvitation {
  id: string;
  reportId: string;
  email: string;
  name?: string | null;
  permission: FriendPermission;
  status: "pending" | "opened" | "completed";
  openedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Perspective {
  id: string;
  fromName: string;
  underestimatedStrength: string;
  deservesMoreCredit: string;
  improvementSuggestion: string;
  revealed: boolean;
}

const PERMISSION_OPTIONS: { id: FriendPermission; title: string; desc: string; badge: string }[] = [
  {
    id: "blind",
    title: "Blind Mirror (Recommended)",
    desc: "Hides your reflection completely so your friend provides their purely unbiased, genuine outside read.",
    badge: "Unbiased",
  },
  {
    id: "full",
    title: "Full Reflection",
    desc: "Friend can read your portrait summary and blind spots to give deeper, informed context.",
    badge: "Full view",
  },
  {
    id: "blindspots",
    title: "Blind Spots Only",
    desc: "Friend only sees your identified blind spots to help you test whether they notice them too.",
    badge: "Focus area",
  },
  {
    id: "compass",
    title: "Values Compass View",
    desc: "Friend can view your 8 values dimensions alongside their questions.",
    badge: "Values",
  },
];

function formatTimeAgo(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.max(0, Math.floor((now.getTime() - d.getTime()) / 1000));
    if (diffSec < 45) return "just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function FriendPerspectives({ reportId }: { reportId: string }) {
  const [items, setItems] = useState<Perspective[] | null>(null);
  const [invitations, setInvitations] = useState<FriendInvitation[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);

  // Form states
  const [friendEmail, setFriendEmail] = useState("");
  const [friendName, setFriendName] = useState("");
  const [permission, setPermission] = useState<FriendPermission>("blind");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit permission target
  const [editingInvite, setEditingInvite] = useState<FriendInvitation | null>(null);
  const [editPermValue, setEditPermValue] = useState<FriendPermission>("blind");

  // Track copied feedback per invite ID
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const prevStatusRef = useRef<Record<string, string>>({});
  const { show } = useToast();

  // Load invitations and poll for real-time status changes ("pending" -> "opened")
  useEffect(() => {
    let cancelled = false;

    const fetchInvites = (silent = false) => {
      fetch(`/api/reports/${reportId}/invitations`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: any) => {
          if (cancelled || !data) return;
          const list: FriendInvitation[] = data.invitations || [];

          // Check if any invitation transitioned from pending to opened
          for (const inv of list) {
            const prev = prevStatusRef.current[inv.id];
            if (prev === "pending" && inv.status === "opened") {
              show(
                `👀 ${inv.name || inv.email} just opened your invitation!`,
                "success"
              );
            }
            prevStatusRef.current[inv.id] = inv.status;
          }

          setInvitations(list);
        })
        .catch(() => {
          if (!cancelled && !silent) setInvitations([]);
        });
    };

    fetchInvites();
    // Poll every 4 seconds to catch when friend opens link
    const timer = setInterval(() => {
      fetchInvites(true);
    }, 4000);

    const onFocus = () => fetchInvites(true);
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [reportId, show]);

  // Load submitted perspectives
  useEffect(() => {
    fetch(`/api/reports/${reportId}/friend`)
      .then((r) => r.json())
      .then((d: any) => setItems(d.perspectives || []))
      .catch(() => setItems([]));
  }, [reportId]);

  const getInviteLink = (inviteId: string, name?: string | null, perm?: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams();
    params.set("inviteId", inviteId);
    if (name?.trim()) params.set("friend", name.trim());
    if (perm) params.set("perm", perm);
    return `${origin}/report/${reportId}/friend?${params.toString()}`;
  };

  const handleSendNow = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const emailTrimmed = friendEmail.trim().toLowerCase();
    if (!emailTrimmed || !emailTrimmed.includes("@") || !emailTrimmed.includes(".")) {
      show("Please enter a valid email address.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reports/${reportId}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailTrimmed,
          name: friendName.trim() || undefined,
          permission,
        }),
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData.error || "Failed to create invitation");
      }

      const { invitation } = (await res.json()) as { invitation: FriendInvitation };
      const displayName = invitation.name || invitation.email;
      const inviteUrl = getInviteLink(invitation.id, invitation.name, invitation.permission);

      // Add to list and record initial "pending" status
      prevStatusRef.current[invitation.id] = "pending";
      setInvitations((prev) => [invitation, ...prev]);

      // Copy invite link to clipboard automatically
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(inviteUrl).catch(() => {});
      }

      show(
        `Invitation created for ${displayName}! Status is Pending until they open it.`,
        "success"
      );

      // Compose mailto link so user can open their mail client directly
      const subject = encodeURIComponent("I'd value your honest outside perspective on me");
      const mailBody = encodeURIComponent(
        `Hey ${displayName},\n\nI just completed a self-reflection on Trueself and would really value your honest outside perspective.\n\nCould you take 2 minutes to answer 3 quick questions about how you see me?\n\n${inviteUrl}\n\nThank you!`
      );
      const mailtoUrl = `mailto:${encodeURIComponent(emailTrimmed)}?subject=${subject}&body=${mailBody}`;

      // Open email client in background/window
      try {
        window.open(mailtoUrl, "_blank");
      } catch {
        // Fallback
      }

      // Reset form
      setFriendEmail("");
      setFriendName("");
      setPermission("blind");
      setIsAddModalOpen(false);
    } catch (err: any) {
      show(err.message || "Failed to send invitation. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePermission = async () => {
    if (!editingInvite) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reports/${reportId}/invitations`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteId: editingInvite.id,
          action: "permission",
          permission: editPermValue,
        }),
      });

      if (!res.ok) throw new Error("Failed to update permission");

      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id === editingInvite.id ? { ...inv, permission: editPermValue } : inv
        )
      );

      show(`Permission updated to ${editPermValue}!`, "success");
      setIsPermModalOpen(false);
      setEditingInvite(null);
    } catch {
      show("Could not update permission.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInvite = async (inviteId: string, name: string) => {
    if (!confirm(`Remove invitation for ${name}?`)) return;
    try {
      const res = await fetch(`/api/reports/${reportId}/invitations?inviteId=${inviteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setInvitations((prev) => prev.filter((i) => i.id !== inviteId));
      show(`Removed invitation for ${name}`, "default");
    } catch {
      show("Failed to remove invitation", "error");
    }
  };

  const copyInviteLink = (inv: FriendInvitation) => {
    const link = getInviteLink(inv.id, inv.name, inv.permission);
    navigator.clipboard?.writeText(link).then(() => {
      setCopiedId(inv.id);
      show(`Copied invitation link for ${inv.name || inv.email}!`, "success");
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const openMailClient = (inv: FriendInvitation) => {
    const inviteUrl = getInviteLink(inv.id, inv.name, inv.permission);
    const displayName = inv.name || inv.email;
    const subject = encodeURIComponent("I'd value your honest outside perspective on me");
    const mailBody = encodeURIComponent(
      `Hey ${displayName},\n\nI just completed a self-reflection on Trueself and would really value your honest outside perspective.\n\nCould you take 2 minutes to answer 3 quick questions about how you see me?\n\n${inviteUrl}\n\nThank you!`
    );
    window.location.href = `mailto:${encodeURIComponent(inv.email)}?subject=${subject}&body=${mailBody}`;
  };

  const togglePerspective = async (fid: string, revealed: boolean) => {
    setItems((prev) => prev?.map((p) => (p.id === fid ? { ...p, revealed } : p)) ?? null);
    await fetch(`/api/reports/${reportId}/friend/${fid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revealed }),
    });
  };

  return (
    <section id="friend-perspectives" className="border-t border-[var(--color-border)] py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            The friend perspective
          </p>
          <h2 className="mt-1 font-editorial text-2xl sm:text-3xl text-[var(--color-text)]">
            What someone you trust sees in you.
          </h2>
        </div>

        <Button
          onClick={() => {
            setFriendEmail("");
            setFriendName("");
            setPermission("blind");
            setIsAddModalOpen(true);
          }}
          className="!rounded-full px-5 py-2.5 shadow-sm hover:shadow transition-all"
        >
          <Icon name="user-plus" size={16} /> Add Friend
        </Button>
      </div>

      {/* Invitations List with Live Status Tracking */}
      {invitations.length > 0 && (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-border)]/70 bg-[var(--color-surface)]/40 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border)]/50 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Invited Friends ({invitations.length})
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-[0.68rem] font-medium text-[var(--color-accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Tracking
              </span>
            </div>
            <span className="text-[0.75rem] text-[var(--color-text-muted)] hidden sm:inline">
              Updates automatically when link is opened
            </span>
          </div>

          <div className="mt-3.5 flex flex-col gap-3">
            {invitations.map((inv) => {
              const permMeta = PERMISSION_OPTIONS.find((p) => p.id === inv.permission);
              const displayName = inv.name || inv.email.split("@")[0];
              const isCopied = copiedId === inv.id;

              return (
                <div
                  key={inv.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)]/60 bg-[var(--color-surface)] p-3.5 sm:px-4 sm:py-3 transition-colors hover:border-[var(--color-border)]"
                >
                  {/* Left: Avatar, Name, Email, Permission, and Dynamic Status */}
                  <div className="flex items-center gap-3 min-w-[220px]">
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-[var(--color-accent)]/15 text-sm font-bold text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/25">
                      {displayName.charAt(0).toUpperCase()}
                    </span>

                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--color-text)]">
                          {displayName}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] font-mono">
                          ({inv.email})
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {/* Dynamic Status Badge */}
                        {inv.status === "opened" ? (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[0.72rem] font-medium text-emerald-600 dark:text-emerald-400"
                            title={inv.openedAt ? `Opened at ${new Date(inv.openedAt).toLocaleString()}` : "Opened"}
                          >
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <strong>Opened</strong>
                            {inv.openedAt && (
                              <span className="text-[0.68rem] opacity-80">
                                • {formatTimeAgo(inv.openedAt)}
                              </span>
                            )}
                          </span>
                        ) : inv.status === "completed" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[0.72rem] font-medium text-purple-600 dark:text-purple-400">
                            <Icon name="check" size={12} className="text-purple-500" />
                            <strong>Completed</strong>
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[0.72rem] font-medium text-amber-600 dark:text-amber-400"
                            title="Waiting for recipient to open the invitation link"
                          >
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                            </span>
                            <strong>Pending</strong>
                            <span className="text-[0.68rem] opacity-75 hidden sm:inline">
                              (waiting to open)
                            </span>
                          </span>
                        )}

                        {/* Permission Badge */}
                        <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-2 py-0.5 text-[0.68rem] text-[var(--color-text-muted)]">
                          {permMeta?.badge || inv.permission}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-1.5 ml-auto">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingInvite(inv);
                        setEditPermValue(inv.permission);
                        setIsPermModalOpen(true);
                      }}
                      title="Change permissions for this friend"
                      className="text-xs"
                    >
                      <Icon name="settings" size={14} />
                      <span className="hidden sm:inline">Change permissions</span>
                    </Button>

                    <Button
                      size="sm"
                      variant={isCopied ? "secondary" : "outline"}
                      onClick={() => copyInviteLink(inv)}
                      title="Copy invitation link"
                      className="text-xs"
                    >
                      <Icon name={isCopied ? "check" : "copy"} size={14} />
                      <span>{isCopied ? "Copied!" : "Copy link"}</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openMailClient(inv)}
                      title="Send or resend email"
                      className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    >
                      <Icon name="link-external" size={14} />
                      <span className="hidden sm:inline">Email</span>
                    </Button>

                    <button
                      onClick={() => handleDeleteInvite(inv.id, displayName)}
                      aria-label="Remove friend"
                      title="Remove invitation"
                      className="grid h-8 w-8 place-items-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-warning)]/10 hover:text-[var(--color-warning)] transition-colors"
                    >
                      <Icon name="close-circle" size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Submitted Perspectives Display */}
      {!items || items.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon="users-group-rounded"
            title="No perspectives received yet."
            description="Add a friend's email above to send them an invitation. You decide what they can see and whether to reveal their answers."
          />
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          {items.map((p) => (
            <div key={p.id} className="surface-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="user" size={18} className="text-[var(--color-accent)]" />
                  <p className="font-medium text-[var(--color-text)]">From {p.fromName}</p>
                </div>
                <Button
                  size="sm"
                  variant={p.revealed ? "secondary" : "outline"}
                  onClick={() => togglePerspective(p.id, !p.revealed)}
                >
                  <Icon name={p.revealed ? "eye-closed" : "eye"} size={14} />{" "}
                  {p.revealed ? "Hide" : "Reveal & save"}
                </Button>
              </div>
              {p.revealed && (
                <div className="mt-3 flex flex-col gap-2.5 text-sm text-[var(--color-text-muted)]">
                  <p>
                    <strong className="text-[var(--color-text)]">Underestimated strength:</strong>{" "}
                    {p.underestimatedStrength}
                  </p>
                  <p>
                    <strong className="text-[var(--color-text)]">Deserves more credit for:</strong>{" "}
                    {p.deservesMoreCredit}
                  </p>
                  <p>
                    <strong className="text-[var(--color-text)]">Could improve:</strong>{" "}
                    {p.improvementSuggestion}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Add Friend via Email */}
      <Modal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFriendEmail("");
          setFriendName("");
        }}
        title="Add Friend & Send Invitation"
      >
        <form onSubmit={handleSendNow} className="flex flex-col gap-5 pt-2">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Invite someone who knows you well to share 3 honest observations. We will track when they open your invitation link.
          </p>

          <TextField
            label="Friend's Email Address"
            type="email"
            placeholder="friend@example.com"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <TextField
            label="Friend's Name or Nickname (Optional)"
            placeholder="e.g. Maya, David, Sam"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
          />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
              Choose Permission
            </label>
            <div className="mt-2.5 flex flex-col gap-2">
              {PERMISSION_OPTIONS.map((opt) => {
                const isSelected = permission === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPermission(opt.id)}
                    className={`flex items-start gap-3 rounded-[var(--radius-md)] border p-3 text-left transition-all ${
                      isSelected
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]"
                        : "border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                    }`}
                  >
                    <div className="mt-0.5">
                      <span
                        className={`grid h-4 w-4 place-items-center rounded-full border transition-colors ${
                          isSelected
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                            : "border-[var(--color-border)]"
                        }`}
                      >
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[var(--color-text)]">
                          {opt.title}
                        </span>
                        <span className="rounded-full bg-[var(--color-surface-strong)] px-2 py-0.5 text-[0.68rem] text-[var(--color-text-muted)]">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--color-text-muted)] leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setFriendEmail("");
                setFriendName("");
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Icon name="check" size={16} />
              {isSubmitting ? "Sending..." : "Send Now"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Change Permissions */}
      <Modal
        open={isPermModalOpen}
        onClose={() => {
          setIsPermModalOpen(false);
          setEditingInvite(null);
        }}
        title={`Change Permissions for ${editingInvite?.name || editingInvite?.email || "Friend"}`}
      >
        <div className="flex flex-col gap-5 pt-2">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Choose what {editingInvite?.name || editingInvite?.email} can view when opening your reflection.
          </p>

          <div className="flex flex-col gap-2">
            {PERMISSION_OPTIONS.map((opt) => {
              const isSelected = editPermValue === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setEditPermValue(opt.id)}
                  className={`flex items-start gap-3 rounded-[var(--radius-md)] border p-3 text-left transition-all ${
                    isSelected
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]"
                      : "border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                  }`}
                >
                  <div className="mt-0.5">
                    <span
                      className={`grid h-4 w-4 place-items-center rounded-full border transition-colors ${
                        isSelected
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                          : "border-[var(--color-border)]"
                      }`}
                    >
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[var(--color-text)]">
                        {opt.title}
                      </span>
                      <span className="rounded-full bg-[var(--color-surface-strong)] px-2 py-0.5 text-[0.68rem] text-[var(--color-text-muted)]">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)] leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsPermModalOpen(false);
                setEditingInvite(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePermission} disabled={isSubmitting}>
              <Icon name="check" size={16} />
              {isSubmitting ? "Saving..." : "Save Permission"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
