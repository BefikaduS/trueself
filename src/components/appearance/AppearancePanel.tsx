"use client";

import { useState } from "react";
import { clsx } from "clsx";
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

type PanelTab = "theme" | "glass" | "typography";

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
  { id: "sharp", label: "Sharp", desc: "Crisp architectural lines (4-10px)" },
  { id: "balanced", label: "Balanced", desc: "Apple standard curvature (8-20px)" },
  { id: "soft", label: "Soft", desc: "Relaxed, organic curves (12-28px)" },
];

const GLASS_OPTIONS: { id: GlassIntensity; label: string; desc: string; blurPx: number }[] = [
  { id: "subtle", label: "Subtle Film", desc: "Lightweight minimal blur", blurPx: 10 },
  { id: "balanced", label: "Liquid Glass", desc: "Apple Vision frosted glass", blurPx: 26 },
  { id: "deep", label: "Deep Frost", desc: "Ultra-diffused optical depth", blurPx: 46 },
  { id: "crystal", label: "Crystal Caustic", desc: "Deep prism luminous glow", blurPx: 64 },
];

const MOTION_OPTIONS: { id: MotionPreference; label: string; desc: string; icon: string }[] = [
  { id: "fluid", label: "Fluid & Expressive", desc: "Full microanimations & floating particles", icon: "magic-stick-3" },
  { id: "reduced", label: "Calm & Reduced", desc: "Gentle instant transitions, zero distraction", icon: "shield-check" },
];

export function AppearancePanel() {
  const [activeTab, setActiveTab] = useState<PanelTab>("theme");

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
    <div className="flex flex-col gap-8">
      {/* Segmented Category Switcher Tabs */}
      <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)]/70 bg-[var(--color-surface)]/60 p-1 backdrop-blur-md self-start">
        <button
          type="button"
          onClick={() => setActiveTab("theme")}
          className={clsx(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
            activeTab === "theme"
              ? "bg-[var(--color-surface-strong)] text-[var(--color-text)] shadow-xs ring-1 ring-[var(--color-border)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          )}
        >
          <Icon name="sun-2" size={16} />
          <span>Theme &amp; Colors</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("glass")}
          className={clsx(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
            activeTab === "glass"
              ? "bg-[var(--color-surface-strong)] text-[var(--color-text)] shadow-xs ring-1 ring-[var(--color-border)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          )}
        >
          <Icon name="magic-stick-3" size={16} />
          <span>Glass &amp; Surfaces</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("typography")}
          className={clsx(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
            activeTab === "typography"
              ? "bg-[var(--color-surface-strong)] text-[var(--color-text)] shadow-xs ring-1 ring-[var(--color-border)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          )}
        >
          <Icon name="pen-2" size={16} />
          <span>Typography</span>
        </button>
      </div>

      {/* Main Grid: Controls on the Left, Live Canvas on the Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Controls Column */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          {/* TAB 1: THEME & COLORS */}
          {activeTab === "theme" && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              {/* Color Mode */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">Color Mode</h3>
                  <span className="text-xs text-[var(--color-text-muted)]">Daylight, Midnight, or System</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      aria-pressed={mode === m.id}
                      className={clsx(
                        "flex flex-col items-center gap-2 rounded-[var(--radius-md)] border px-3 py-3.5 text-sm transition-all duration-200 cursor-pointer",
                        mode === m.id
                          ? "border-[var(--color-accent)] bg-[var(--color-surface)] shadow-xs ring-1 ring-[var(--color-accent)] font-medium"
                          : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/40"
                      )}
                    >
                      <Icon name={m.icon} size={20} />
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Curated Themes */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">Curated Themes</h3>
                  <span className="text-xs text-[var(--color-text-muted)]">Complete harmonious palettes</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTheme(t.id)}
                      aria-pressed={theme === t.id && !customAccent}
                      className={clsx(
                        "flex flex-col gap-2.5 rounded-[var(--radius-md)] border p-3 text-left transition-all duration-200 cursor-pointer",
                        theme === t.id
                          ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] bg-[var(--color-surface)]/70 shadow-xs"
                          : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/30"
                      )}
                    >
                      <div
                        className="flex h-10 overflow-hidden rounded-[var(--radius-sm)] border border-black/10 shadow-inner"
                        style={{ background: t.swatch.bg }}
                      >
                        <span className="h-full w-1/3" style={{ background: t.swatch.surface }} />
                        <span className="h-full w-1/3" style={{ background: t.swatch.text }} />
                        <span className="h-full w-1/3" style={{ background: t.swatch.accent }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text)]">{t.name}</p>
                        <p className="text-[0.72rem] text-[var(--color-text-muted)] line-clamp-1">{t.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Accent & Primary Colors */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">Accent &amp; Primary Color</h3>
                  <span className="text-xs text-[var(--color-text-muted)]">Affects buttons, logo, highlights</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-border)] shadow-xs transition-transform hover:scale-105 cursor-pointer"
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
                      type="button"
                      onClick={() => {
                        setCustomAccent(null);
                        setHexDraft("");
                        show("Restored theme original accent.", "default");
                      }}
                      className="text-xs text-[var(--color-text-muted)] underline underline-offset-2 hover:text-[var(--color-text)] cursor-pointer"
                    >
                      Use theme accent
                    </button>
                  )}
                </div>

                <div className="mt-3.5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[var(--color-text-muted)]">Quick chips:</span>
                  {QUICK_ACCENTS.map((qa) => (
                    <button
                      key={qa.name}
                      type="button"
                      onClick={() => handlePickAccent(qa.hex)}
                      className={clsx(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all cursor-pointer",
                        previewAccent.toLowerCase() === qa.hex.toLowerCase()
                          ? "border-[var(--color-accent)] bg-[var(--color-surface)] font-medium shadow-xs ring-1 ring-[var(--color-accent)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
                      )}
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: qa.hex }} />
                      {qa.name}
                    </button>
                  ))}
                </div>

                {!contrastOk && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-warning)]">
                    <Icon name="danger-triangle" size={14} /> This color has lower contrast. High-legibility text is preserved automatically.
                  </p>
                )}
              </section>
            </div>
          )}

          {/* TAB 2: GLASS & SURFACES */}
          {activeTab === "glass" && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              {/* Glass Refraction */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">Glass Refraction (Realtime)</h3>
                  <span className="text-xs text-[var(--color-text-muted)]">Live optical blur &amp; specular shine</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {GLASS_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setGlassIntensity(opt.id)}
                      aria-pressed={glassIntensity === opt.id}
                      className={clsx(
                        "flex flex-col gap-2 rounded-[var(--radius-md)] border p-3.5 text-left transition-all duration-200 cursor-pointer",
                        glassIntensity === opt.id
                          ? "border-[var(--color-accent)] bg-[var(--color-surface)] ring-1 ring-[var(--color-accent)] shadow-xs"
                          : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/30"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[var(--color-text)]">{opt.label}</span>
                        {glassIntensity === opt.id && (
                          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)]">{opt.desc}</p>
                      <span className="font-mono text-[0.68rem] text-[var(--color-accent)]">
                        {opt.blurPx}px blur
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Interface Corner Radius */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">Corner Roundness</h3>
                  <span className="text-xs text-[var(--color-text-muted)]">Shapes cards, buttons &amp; menus</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {RADIUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setRadiusScale(opt.id)}
                      aria-pressed={radiusScale === opt.id}
                      className={clsx(
                        "flex flex-col gap-1.5 rounded-[var(--radius-md)] border p-4 text-left transition-all duration-200 cursor-pointer",
                        radiusScale === opt.id
                          ? "border-[var(--color-accent)] bg-[var(--color-surface)] ring-1 ring-[var(--color-accent)] shadow-xs"
                          : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/30"
                      )}
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

              {/* Motion & Interaction */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">Motion &amp; Interaction</h3>
                  <span className="text-xs text-[var(--color-text-muted)]">Particle physics and spring dynamics</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {MOTION_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setMotionPreference(opt.id)}
                      aria-pressed={motionPreference === opt.id}
                      className={clsx(
                        "flex items-start gap-3 rounded-[var(--radius-md)] border p-4 text-left transition-all duration-200 cursor-pointer",
                        motionPreference === opt.id
                          ? "border-[var(--color-accent)] bg-[var(--color-surface)] ring-1 ring-[var(--color-accent)] shadow-xs"
                          : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/30"
                      )}
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
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY */}
          {activeTab === "typography" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">Curated Font Pairings</h3>
                <span className="text-xs text-[var(--color-text-muted)]">Editorial headlines + interface sans</span>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {FONT_PAIRINGS.map((fp) => {
                  const isSelected = (fontPairing || "editorial") === fp.id;
                  return (
                    <button
                      key={fp.id}
                      type="button"
                      onClick={() => setFontPairing(fp.id)}
                      aria-pressed={isSelected}
                      className={clsx(
                        "flex flex-col gap-2.5 rounded-[var(--radius-md)] border p-4 text-left transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "border-[var(--color-accent)] bg-[var(--color-surface)] ring-1 ring-[var(--color-accent)] shadow-xs"
                          : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/40"
                      )}
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
                      <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)]/60 bg-[var(--color-bg)] p-3">
                        <p
                          className="text-base leading-snug font-medium text-[var(--color-text)]"
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
            </div>
          )}

          {/* Reset link */}
          <div className="border-t border-[var(--color-border)]/50 pt-5">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <Icon name="refresh" size={14} /> Reset all appearance preferences
            </Button>
          </div>
        </div>

        {/* Right Sticky Canvas: Real-time Live Optical Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-6 shadow-xl backdrop-blur-2xl">
            {/* Ambient colorful backlight to demonstrate glass refraction in real time */}
            <div className="pointer-events-none absolute -inset-10 opacity-40">
              <div
                className="absolute left-4 top-6 h-36 w-36 rounded-full blur-3xl transition-colors duration-500"
                style={{ backgroundColor: previewAccent }}
              />
              <div className="absolute right-6 bottom-8 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl" />
              <div className="absolute inset-x-8 top-28 h-20 bg-amber-400/20 blur-2xl" />
            </div>

            <div className="relative z-10 flex flex-col gap-5">
              {/* Top Canvas Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)]/50 pb-3">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                  Live Canvas
                </span>
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/80 px-2.5 py-0.5 text-[0.68rem] font-mono text-[var(--color-text-muted)]">
                  {glassIntensity} glass • {radiusScale}
                </span>
              </div>

              {/* Sample Floating Liquid Glass Pill */}
              <div className="flex flex-col gap-2">
                <span className="text-[0.72rem] font-medium text-[var(--color-text-muted)]">
                  Liquid Glass Navigation Pill:
                </span>
                <div className="glass-nav-pill flex items-center justify-between rounded-full px-4 py-2 shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                    <span className="text-xs font-semibold text-[var(--color-text)]">Trueself</span>
                  </div>
                  <span className="text-[0.7rem] text-[var(--color-text-muted)]">
                    Active Refraction
                  </span>
                </div>
              </div>

              {/* Interactive Card Preview */}
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)]/90 p-5 shadow-xs transition-all duration-300">
                <div className="flex items-center justify-between">
                  <Logo size="sm" interactive />
                  <span
                    className="inline-block h-3.5 w-3.5 rounded-full shadow-xs"
                    style={{ backgroundColor: previewAccent }}
                    title={`Active accent: ${previewAccent}`}
                  />
                </div>

                <div className="mt-4">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                    Reflective Reading
                  </span>
                  <p className="mt-1 font-editorial text-lg leading-snug text-[var(--color-text)]">
                    &ldquo;Know yourself honestly behind your decisions.&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Applied font pairing &amp; dynamic accent tone
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)]/50 pt-3">
                  <Button size="sm" variant="primary">
                    Meet Yourself
                  </Button>
                  <Button size="sm" variant="secondary">
                    Plan
                  </Button>
                </div>
              </div>

              {/* Live Specs Footer */}
              <div className="flex items-center justify-between text-[0.7rem] text-[var(--color-text-muted)] font-mono">
                <span>Theme: {activeTheme.name}</span>
                <span>Mode: {mode}</span>
                <span>Accent: {previewAccent}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
