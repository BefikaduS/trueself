"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ColorMode, ThemeId, FontPairingId } from "../types";

interface AppearanceState {
  theme: ThemeId;
  mode: ColorMode;
  customAccent: string | null; // hex, overrides the theme's accent when set
  fontPairing: FontPairingId;
  setTheme: (theme: ThemeId) => void;
  setMode: (mode: ColorMode) => void;
  setCustomAccent: (hex: string | null) => void;
  setFontPairing: (fontPairing: FontPairingId) => void;
  reset: () => void;
}

const DEFAULTS = {
  theme: "paper" as ThemeId,
  mode: "system" as ColorMode,
  customAccent: null,
  fontPairing: "editorial" as FontPairingId,
};

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setTheme: (theme) => set({ theme }),
      setMode: (mode) => set({ mode }),
      setCustomAccent: (customAccent) => set({ customAccent }),
      setFontPairing: (fontPairing) => set({ fontPairing }),
      reset: () => set({ ...DEFAULTS }),
    }),
    { name: "trueself.appearance" },
  ),
);
