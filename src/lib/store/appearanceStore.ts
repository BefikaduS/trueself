"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ColorMode,
  ThemeId,
  FontPairingId,
  RadiusScale,
  GlassIntensity,
  MotionPreference,
} from "../types";

interface AppearanceState {
  theme: ThemeId;
  mode: ColorMode;
  customAccent: string | null; // hex, overrides the theme's accent when set
  fontPairing: FontPairingId;
  radiusScale: RadiusScale;
  glassIntensity: GlassIntensity;
  motionPreference: MotionPreference;
  setTheme: (theme: ThemeId) => void;
  setMode: (mode: ColorMode) => void;
  setCustomAccent: (hex: string | null) => void;
  setFontPairing: (fontPairing: FontPairingId) => void;
  setRadiusScale: (radius: RadiusScale) => void;
  setGlassIntensity: (intensity: GlassIntensity) => void;
  setMotionPreference: (motion: MotionPreference) => void;
  reset: () => void;
}

const DEFAULTS = {
  theme: "ink" as ThemeId,
  mode: "dark" as ColorMode,
  customAccent: null,
  fontPairing: "editorial" as FontPairingId,
  radiusScale: "balanced" as RadiusScale,
  glassIntensity: "balanced" as GlassIntensity,
  motionPreference: "fluid" as MotionPreference,
};

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setTheme: (theme) => set({ theme }),
      setMode: (mode) => set({ mode }),
      setCustomAccent: (customAccent) => set({ customAccent }),
      setFontPairing: (fontPairing) => set({ fontPairing }),
      setRadiusScale: (radiusScale) => set({ radiusScale }),
      setGlassIntensity: (glassIntensity) => set({ glassIntensity }),
      setMotionPreference: (motionPreference) => set({ motionPreference }),
      reset: () => set({ ...DEFAULTS }),
    }),
    { name: "trueself.appearance" },
  ),
);
