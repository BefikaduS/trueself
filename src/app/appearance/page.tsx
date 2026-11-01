import { AppearancePanel } from "@/components/appearance/AppearancePanel";

export default function AppearancePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        Appearance Studio
      </p>
      <h1 className="mt-2 font-editorial text-3xl sm:text-4xl md:text-5xl text-[var(--color-text)]">
        Make Trueself feel like yours.
      </h1>
      <p className="mt-3 text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
        Personalize themes, optical glass intensity, typography, and accents. Every change adapts
        in real time across the entire interface and is remembered on this device.
      </p>
      <div className="mt-8 sm:mt-10">
        <AppearancePanel />
      </div>
    </main>
  );
}
