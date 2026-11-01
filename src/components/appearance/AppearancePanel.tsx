"use client";

import { useState } from "react";
import { useAppearanceStore } from "@/lib/store/appearanceStore";
import { THEMES, FONT_PAIRINGS } from "@/lib/themes";
import { contrastRatio, isValidHex } from "@/lib/contrast";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import { Logo } from "../common/Logo";
import { useToast } from "../common/Toast";
import type {
  ColorMode,
  RadiusScale,
  GlassIntensity,
  MotionPreference,
} from "@/lib/types";

const MODES: { id: ColorMode; label: string; icon: string }[] = [
  { id: "system", label: "System", icon: "monitor" },
  { id: "light", label: "Light", icon: "sun-2" },
  { id: "dark", label: "Dark", icon: "moon" },
];

const QUICK_ACCENTS = [
  { name: "Amber", hex: "#ED6C30" },
  { name: "Iris", hex: "#8F93FF" },
  { name: "Terra", hex: "#C1512D" },
  { name: "Moss", hex: "#4C6B45" },
  { name: "Rose", hex: "#E05D7A" },
  { name: "Sky", hex: "#3B82F6" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Violet", hex: "#8B5CF6" },
  { name: "Gold", hex: "#F59E0B" },
];

const RADIUS_OPTIONS: { id: RadiusScale; label: string; desc: string }[] = [
  { id: "sharp", label: "Sharp", desc: "Crisp, structured architectural edges" },
  { id: "balanced", label: "Balanced", desc: "Apple standard curvature (Default)" },
  { id: "soft", label: "Soft", desc: "Organic, relaxed pill-like curves" },
];

const GLASS_OPTIONS: { id: GlassIntensity; label: string; desc: string }[] = [
  { id: "subtle", label: "Subtle", desc: "Lightweight, minimal blur" },
  { id: "balanced", label: "Liquid Glass", desc: "Rich frosted glass & specular shine" },
  { id: "deep", label: "Deep Frost", desc: "Ultra-frosted high contrast depth" },
];

const MOTION_OPTIONS: { id: MotionPreference; label: string; desc: string; icon: string }[] = [
  { id: "fluid", label: "Fluid & Expressive", desc: "Full microanimations & floating particles", icon: "magic-stick-3" },
  { id: "reduced", label: "Calm & Reduced", desc: "Gentle instant transitions, zero distraction", icon: "shield-check" },
];

export function AppearancePanel() {
  const {
    theme,
    mode,
    customAccent,
    fontPairing,
    radiusScale,
    glassIntensity,
    motionPreference,
    setTheme,
    setMode,
    setCustomAccent,
    setFontPairing,
    setRadiusScale,
    setGlassIntensity,
    setMotionPreference,
    reset,
  } = useAppearanceStore();
  const [hexDraft, setHexDraft] = useState(customAccent ?? "");
  const { show } = useToast();

  const activeTheme = THEMES.find((t) => t.id === theme) ?? THEMES[0];
  const previewAccent = customAccent ?? activeTheme.swatch.accent;
  const contrastOk =
    contrastRatio(previewAccent, "#ffffff") > 2.2 ||
    contrastRatio(previewAccent, "#000000") > 2.2;

  const handleCustomHexChange = (v: string) => {
    setHexDraft(v);
    if (isValidHex(v)) setCustomAccent(v);
  };

  const handlePickAccent = (hex: string) => {
    setHexDraft(hex);
    setCustomAccent(hex);
  };

  const handleSelectTheme = (themeId: typeof theme) => {
    setTheme(themeId);
    setCustomAccent(null);
    setHexDraft("");
    show("Applied theme palette.", "success");
  };

  const handleReset = () => {
    reset();
    setHexDraft("");
    show("Appearance reset to defaults.", "default");
  };

  return (
    <div className="flex flex-col gap-12">
      {/* 0. Live Realtime Preview Card */}
      <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-6 shadow-sm backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between border-b border-[var(--color-border)]/50 pb-3">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
            Live Interactive Preview
          </span>
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full shadow-xs"
              style={{ backgroundColor: previewAccent }}
            />
            <span className="font-mono text-xs uppercase text-[var(--color-text-muted)]">
              {previewAccent}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <Logo size="md" interactive />
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Theme: <strong className="text-[var(--color-text)]">{activeTheme.name}</strong> • Mode:{" "}
              <strong className="text-[var(--color-text)] capitalize">{mode}</strong> • Radius:{" "}
              <strong className="text-[var(--color-text)] capitalize">{radiusScale}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button size="sm" variant="primary">
              Primary CTA
            </Button>
            <Button size="sm" variant="secondary">
              Secondary
            </Button>
            <Button size="sm" variant="outline">
              Outline
            </Button>
          </div>
        </div>

        <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)]/60 bg-[var(--color-bg)]/80 p-4">
          <p className="font-editorial text-xl font-medium leading-snug text-[var(--color-text)]">
            &ldquo;The curious paradox is that when I accept myself just as I am, then I can change.&rdquo;
          </p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Carl Rogers • Applied typography &amp; layout token preview
          </p>
        </div>
      </section>

      {/* 1. Color Mode */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">Color Mode</h3>
          <span className="text-xs text-[var(--color-text-muted)]">Daylight, Midnight, or System matching</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              className={`flex flex-col items-center gap-2 rounded-[var(--radius-md)] border px-3 py-4 text-sm transition-all duration-200 ${
                mode === m.id
                  ? "border-[var(--color-accent)] bg-[var(--color-surface)] shadow-xs ring-1 ring-[var(--color-accent)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/40"
              }`}
            >
              <Icon name={m.icon} size={20} />
              <span className="font-medium">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Curated Themes */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">Curated Themes</h3>
          <span className="text-xs text-[var(--color-text-muted)]">Changes base palette, backgrounds &amp; accent</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectTheme(t.id)}
              aria-pressed={theme === t.id && !customAccent}
              className={`flex flex-col gap-3 rounded-[var(--radius-md)] border p-3.5 text-left transition-all duration-200 ${
                theme === t.id
                  ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] bg-[var(--color-surface)]/70 shadow-xs"
                  : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/30"
              }`}
            >
              <div
                className="flex h-12 overflow-hidden rounded-[var(--radius-sm)] border border-black/10 shadow-inner"
                style={{ background: t.swatch.bg }}
              >
                <span className="h-full w-1/3" style={{ background: t.swatch.surface }} />
                <span className="h-full w-1/3" style={{ background: t.swatch.text }} />
                <span className="h-full w-1/3" style={{ background: t.swatch.accent }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">{t.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Custom Accent Color */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">Accent &amp; Primary Color</h3>
          <span className="text-xs text-[var(--color-text-muted)]">Affects main CTAs, logo, focus rings, highlights</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-border)] shadow-xs transition-transform hover:scale-105"
            style={{ backgroundColor: previewAccent }}
          >
            <input
              type="color"
              value={isValidHex(hexDraft) ? hexDraft : activeTheme.swatch.accent}
              onChange={(e) => handlePickAccent(e.target.value)}
              className="absolute -inset-2 h-16 w-16 cursor-pointer opacity-0"
              aria-label="Pick a custom accent color"
            />
          </div>
          <input
            type="text"
            value={hexDraft}
            placeholder={activeTheme.swatch.accent}
            aria-label="Custom accent color hex code"
            onChange={(e) => handleCustomHexChange(e.target.value)}
            className="input-surface w-36 rounded-[var(--radius-sm)] px-3 py-2 font-mono text-sm uppercase text-[var(--color-input-text,var(--color-text))] placeholder:text-[var(--color-input-placeholder)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-input-focus-ring)]"
          />
          {customAccent && (
            <button
              onClick={() => {
                setCustomAccent(null);
                setHexDraft("");
                show("Restored theme's original accent.", "default");
              }}
              className="text-sm text-[var(--color-text-muted)] underline underline-offset-2 hover:text-[var(--color-text)]"
            >
              Use theme accent
            </button>
          )}
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">Palette chips:</span>
          {QUICK_ACCENTS.map((qa) => (
            <button
              key={qa.name}
              type="button"
              onClick={() => handlePickAccent(qa.hex)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all ${
                previewAccent.toLowerCase() === qa.hex.toLowerCase()
                  ? "border-[var(--color-accent)] bg-[var(--color-surface)] font-medium shadow-xs"
                  : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: qa.hex }} />
              {qa.name}
            </button>
          ))}
        </div>

        {!contrastOk && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-warning)]">
            <Icon name="danger-triangle" size={14} /> This color may have lower contrast. We automatically ensure readability.
          </p>
        )}
      </section>

      {/* 4. Font Pairings */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">Typography Pairings</h3>
          <span className="text-xs text-[var(--color-text-muted)]">Editorial headlines + Clean interface sans</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FONT_PAIRINGS.map((fp) => {
            const isSelected = (fontPairing || "editorial") === fp.id;
            return (
              <button
                key={fp.id}
                type="button"
                onClick={() => setFontPairing(fp.id)}
                aria-pressed={isSelected}
                className={`flex flex-col gap-2.5 rounded-[var(--radius-md)] border p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-[var(--color-accent)] bg-[var(--color-surface)] ring-1 ring-[var(--color-accent)] shadow-xs"
                    : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--color-text)]">{fp.name}</span>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-text)]">
                      <Icon name="check-read" size={12} variant="bold" />
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-accent)]">
                  {fp.editorialName} + {fp.interfaceName}
                </p>
                <div className="mt-1 rounded-[var(--radius-sm)] border border-[var(--color-border)]/60 bg-[var(--color-bg)] p-3">
                  <p
                    className="text-lg leading-snug font-medium text-[var(--color-text)]"
                    style={{
                      fontFamily:
                        fp.id === "editorial"
                          ? "var(--font-editorial-instrument), Georgia, serif"
                          : fp.id === "literary"
                          ? "var(--font-editorial-newsreader), 'Times New Roman', Georgia, serif"
                          : fp.id === "modern"
                          ? "var(--font-editorial-fraunces), Georgia, serif"
                          : "var(--font-editorial-newsreader), Georgia, serif",
                    }}
                  >
                    {fp.previewHeadline}
                  </p>
                  <p
                    className="mt-1 text-xs text-[var(--color-text-muted)]"
                    style={{
                      fontFamily:
                        fp.id === "editorial"
                          ? "var(--font-interface-manrope), sans-serif"
                          : fp.id === "literary"
                          ? "var(--font-interface-jakarta), sans-serif"
                          : fp.id === "modern"
                          ? "var(--font-interface-dmsans), sans-serif"
                          : "var(--font-interface-manrope), sans-serif",
                    }}
                  >
                    {fp.previewBody}
                  </p>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">{fp.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Interface Corner Radius */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">Corner Roundness</h3>
          <span className="text-xs text-[var(--color-text-muted)]">Tailors buttons, cards &amp; modal aesthetics</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setRadiusScale(opt.id)}
              aria-pressed={radiusScale === opt.id}
              className={`flex flex-col gap-1.5 rounded-[var(--radius-md)] border p-4 text-left transition-all ${
                radiusScale === opt.id
                  ? "border-[var(--color-accent)] bg-[var(--color-surface)] ring-1 ring-[var(--color-accent)] shadow-xs"
                  : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--color-text)]">{opt.label}</span>
                {radiusScale === opt.id && (
                  <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                )}
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">{opt.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 6. Liquid Glass & Blur Intensity */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">Glass Refraction</h3>
          <span className="text-xs text-[var(--color-text-muted)]">Navigation pill &amp; translucent surfaces</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {GLASS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setGlassIntensity(opt.id)}
              aria-pressed={glassIntensity === opt.id}
              className={`flex flex-col gap-1.5 rounded-[var(--radius-md)] border p-4 text-left transition-all ${
                glassIntensity === opt.id
                  ? "border-[var(--color-accent)] bg-[var(--color-surface)] ring-1 ring-[var(--color-accent)] shadow-xs"
                  : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--color-text)]">{opt.label}</span>
                {glassIntensity === opt.id && (
                  <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                )}
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">{opt.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 7. Motion & Interaction */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">Motion &amp; Transitions</h3>
          <span className="text-xs text-[var(--color-text-muted)]">Microanimations &amp; hero reflection particles</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MOTION_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setMotionPreference(opt.id)}
              aria-pressed={motionPreference === opt.id}
              className={`flex items-start gap-3 rounded-[var(--radius-md)] border p-4 text-left transition-all ${
                motionPreference === opt.id
                  ? "border-[var(--color-accent)] bg-[var(--color-surface)] ring-1 ring-[var(--color-accent)] shadow-xs"
                  : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/30"
              }`}
            >
              <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-surface-strong)] text-[var(--color-accent)]">
                <Icon name={opt.icon} size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">{opt.label}</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Reset */}
      <div className="border-t border-[var(--color-border)]/50 pt-6">
        <Button variant="outline" onClick={handleReset} className="self-start">
          <Icon name="refresh" size={16} /> Reset all appearance preferences
        </Button>
      </div>
    </div>
  );
}
