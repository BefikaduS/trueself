"use client";

import { useState } from "react";
import { useAppearanceStore } from "@/lib/store/appearanceStore";
import { THEMES, FONT_PAIRINGS } from "@/lib/themes";
import { contrastRatio, isValidHex } from "@/lib/contrast";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import type { ColorMode } from "@/lib/types";

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
];

// The full Appearance panel: color mode, curated themes, font pairings,
// and a custom accent color with a live contrast check.
export function AppearancePanel() {
  const {
    theme,
    mode,
    customAccent,
    fontPairing,
    setTheme,
    setMode,
    setCustomAccent,
    setFontPairing,
    reset,
  } = useAppearanceStore();
  const [hexDraft, setHexDraft] = useState(customAccent ?? "");

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

  return (
    <div className="flex flex-col gap-10">
      {/* 1. Mode */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-muted)]">Mode</h3>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              className={`flex flex-col items-center gap-2 rounded-[var(--radius-md)] border px-3 py-4 text-sm transition-all duration-200 ${
                mode === m.id
                  ? "border-[var(--color-accent)] bg-[var(--color-surface)] shadow-xs"
                  : "border-[var(--color-border)] hover:border-[var(--color-text-muted)]"
              }`}
            >
              <Icon name={m.icon} size={18} />
              {m.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Curated Themes */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-muted)]">Curated themes</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              aria-pressed={theme === t.id}
              className={`flex flex-col gap-3 rounded-[var(--radius-md)] border p-3 text-left transition-all duration-200 ${
                theme === t.id
                  ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-text-muted)]"
              }`}
            >
              <div
                className="flex h-12 overflow-hidden rounded-[var(--radius-sm)] border border-black/10"
                style={{ background: t.swatch.bg }}
              >
                <span className="h-full w-1/3" style={{ background: t.swatch.surface }} />
                <span className="h-full w-1/3" style={{ background: t.swatch.text }} />
                <span className="h-full w-1/3" style={{ background: t.swatch.accent }} />
              </div>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Font Pairings */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">Font pairings</h3>
          <span className="text-xs text-[var(--color-text-muted)]">Editorial + Interface</span>
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

      {/* 4. Custom Accent */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-muted)]">Custom accent color</h3>
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
              }}
              className="text-sm text-[var(--color-text-muted)] underline underline-offset-2 hover:text-[var(--color-text)]"
            >
              Use theme accent
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">Presets:</span>
          {QUICK_ACCENTS.map((qa) => (
            <button
              key={qa.name}
              type="button"
              onClick={() => handlePickAccent(qa.hex)}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs transition-colors hover:border-[var(--color-accent)]"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: qa.hex }} />
              {qa.name}
            </button>
          ))}
        </div>

        {!contrastOk && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-warning)]">
            <Icon name="danger-triangle" size={14} /> This color may be hard to read as text. We&rsquo;ll
            keep essential text legible automatically.
          </p>
        )}
      </section>

      <Button variant="outline" onClick={reset} className="self-start">
        <Icon name="refresh" size={16} /> Reset to default appearance
      </Button>
    </div>
  );
}
