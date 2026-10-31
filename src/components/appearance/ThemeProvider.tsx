"use client";

import { useEffect } from "react";
import { useAppearanceStore } from "@/lib/store/appearanceStore";
import { readableForeground, isValidHex } from "@/lib/contrast";

// Applies the user's theme, color mode and optional custom accent to the
// document root as data-attributes / CSS variables. Centralizing this here
// means every component simply reads var(--color-*) and never hardcodes a
// palette — switching themes is instant and consistent everywhere.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppearanceStore((s) => s.theme);
  const mode = useAppearanceStore((s) => s.mode);
  const customAccent = useAppearanceStore((s) => s.customAccent);
  const fontPairing = useAppearanceStore((s) => s.fontPairing);

  useEffect(() => {
    document.documentElement.setAttribute("data-font-pairing", fontPairing || "editorial");
  }, [fontPairing]);

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
    if (customAccent && isValidHex(customAccent)) {
      root.style.setProperty("--color-accent", customAccent);
      root.style.setProperty("--color-accent-text", readableForeground(customAccent));
    } else {
      root.style.removeProperty("--color-accent");
      root.style.removeProperty("--color-accent-text");
    }
  }, [customAccent]);

  return children as React.JSX.Element;
}
