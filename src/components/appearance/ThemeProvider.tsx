"use client";

import { useEffect } from "react";
import { useAppearanceStore } from "@/lib/store/appearanceStore";
import { readableForeground, isValidHex, hexToRgb } from "@/lib/contrast";
import { THEMES } from "@/lib/themes";

// Applies the user's theme, color mode, custom accent, font pairing,
// radius scale, glass intensity, and motion preference to the document root
// as data-attributes and CSS custom properties.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppearanceStore((s) => s.theme);
  const mode = useAppearanceStore((s) => s.mode);
  const customAccent = useAppearanceStore((s) => s.customAccent);
  const fontPairing = useAppearanceStore((s) => s.fontPairing);
  const radiusScale = useAppearanceStore((s) => s.radiusScale);
  const glassIntensity = useAppearanceStore((s) => s.glassIntensity);
  const motionPreference = useAppearanceStore((s) => s.motionPreference);

  useEffect(() => {
    document.documentElement.setAttribute("data-font-pairing", fontPairing || "editorial");
  }, [fontPairing]);

  useEffect(() => {
    document.documentElement.setAttribute("data-radius", radiusScale || "balanced");
  }, [radiusScale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-glass", glassIntensity || "balanced");
  }, [glassIntensity]);

  useEffect(() => {
    document.documentElement.setAttribute("data-motion", motionPreference || "fluid");
  }, [motionPreference]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);

    const applyMode = () => {
      const resolved =
        mode === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : mode;
      root.setAttribute("data-mode", resolved);
      root.style.colorScheme = resolved;
    };
    applyMode();

    if (mode === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener("change", applyMode);
      return () => mql.removeEventListener("change", applyMode);
    }
  }, [theme, mode]);

  useEffect(() => {
    const root = document.documentElement;
    const activeThemeAccent =
      THEMES.find((t) => t.id === theme)?.swatch.accent || "#ED6C30";
    const resolvedAccent =
      customAccent && isValidHex(customAccent) ? customAccent : activeThemeAccent;

    const rgb = hexToRgb(resolvedAccent);
    if (rgb) {
      const [r, g, b] = rgb;
      root.style.setProperty("--color-accent-rgb", `${r}, ${g}, ${b}`);
      root.style.setProperty("--color-input-focus-ring", `rgba(${r}, ${g}, ${b}, 0.35)`);
      root.style.setProperty("--color-accent-subtle", `rgba(${r}, ${g}, ${b}, 0.12)`);
      root.style.setProperty("--color-accent-border", `rgba(${r}, ${g}, ${b}, 0.28)`);
    }

    if (customAccent && isValidHex(customAccent)) {
      root.style.setProperty("--color-accent", customAccent);
      root.style.setProperty("--color-accent-text", readableForeground(customAccent));
    } else {
      root.style.removeProperty("--color-accent");
      root.style.removeProperty("--color-accent-text");
    }
  }, [theme, customAccent]);

  return children as React.JSX.Element;
}
