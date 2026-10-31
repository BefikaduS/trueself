import type { ThemeId, FontPairingId } from "./types";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  swatch: { bg: string; surface: string; text: string; accent: string };
}

export interface FontPairingDefinition {
  id: FontPairingId;
  name: string;
  editorialName: string;
  interfaceName: string;
  description: string;
  previewHeadline: string;
  previewBody: string;
}

// Metadata for the Appearance panel. Actual colors live in tokens.css —
// this just drives the theme picker UI and swatch previews.
export const THEMES: ThemeDefinition[] = [
  {
    id: "paper",
    name: "Paper",
    description: "Warm, editorial, quietly confident.",
    swatch: { bg: "#F7F0E9", surface: "#EFE8DF", text: "#191715", accent: "#ED6C30" },
  },
  {
    id: "ink",
    name: "Ink",
    description: "Dark, restrained, sophisticated.",
    swatch: { bg: "#121214", surface: "#1E1E22", text: "#EEEEF0", accent: "#8F93FF" },
  },
  {
    id: "terra",
    name: "Terra",
    description: "Earthy, warm, expressive.",
    swatch: { bg: "#F4E7DA", surface: "#EAD9C7", text: "#2D1D14", accent: "#C1512D" },
  },
  {
    id: "moss",
    name: "Moss",
    description: "Calm, natural, balanced.",
    swatch: { bg: "#EEF0E6", surface: "#E2E6D6", text: "#1E241B", accent: "#4C6B45" },
  },
];

export const FONT_PAIRINGS: FontPairingDefinition[] = [
  {
    id: "editorial",
    name: "Reflective Editorial",
    editorialName: "Instrument Serif",
    interfaceName: "Manrope",
    description: "Quietly confident, literary, and contemplative.",
    previewHeadline: "Know yourself honestly",
    previewBody: "Six thoughtful questions about who you are behind decisions.",
  },
  {
    id: "literary",
    name: "Classic Literary",
    editorialName: "Newsreader",
    interfaceName: "Plus Jakarta Sans",
    description: "Scholarly, balanced, and bookish.",
    previewHeadline: "Patterns in the mirror",
    previewBody: "Grounded observations on your habits and natural strengths.",
  },
  {
    id: "modern",
    name: "Warm Modernist",
    editorialName: "Fraunces",
    interfaceName: "DM Sans",
    description: "Approachable, expressive, and human.",
    previewHeadline: "The person becoming",
    previewBody: "A clear, realistic horizon for the habits that shape you.",
  },
  {
    id: "humanist",
    name: "Pure Humanist",
    editorialName: "Newsreader",
    interfaceName: "Manrope",
    description: "Direct, clean, and deeply readable.",
    previewHeadline: "Clear inner alignment",
    previewBody: "Honest perspectives without algorithmic noise or pretense.",
  },
];
