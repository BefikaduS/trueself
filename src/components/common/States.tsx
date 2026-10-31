import { Icon } from "./Icon";

// Reusable empty / loading / error presentation blocks so no screen ships
// without an intentional state for "nothing here yet" or "something broke".
export function EmptyState({
  icon = "notebook",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] px-6 py-12 text-center">
      <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)]">
        <Icon name={icon} size={20} />
      </div>
      <p className="font-editorial text-xl">{title}</p>
      <p className="max-w-sm text-sm text-[var(--color-text-muted)]">{description}</p>
      {action}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-[var(--color-text-muted)]" role="status" aria-live="polite">
      <span className="relative inline-flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-50" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
      </span>
      {label}
    </div>
  );
}

export function ErrorState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 text-center">
      <Icon name="danger-triangle" variant="bold" size={22} className="text-[var(--color-warning)]" />
      <p className="font-editorial text-xl">{title}</p>
      <p className="max-w-sm text-sm text-[var(--color-text-muted)]">{description}</p>
      {action}
    </div>
  );
}
