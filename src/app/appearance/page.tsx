import { AppearancePanel } from "@/components/appearance/AppearancePanel";

export default function AppearancePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">Appearance</p>
      <h1 className="mt-3 font-editorial text-4xl">Make Trueself feel like yours.</h1>
      <p className="mt-4 text-[var(--color-text-muted)]">
        Choose a mode, a curated theme, or your own accent color. Changes apply immediately and
        are remembered on this device.
      </p>
      <div className="mt-10">
        <AppearancePanel />
      </div>
    </main>
  );
}
