import {
  Manrope,
  Instrument_Serif,
  Newsreader,
  Fraunces,
  Plus_Jakarta_Sans,
  DM_Sans,
  Caveat,
} from "next/font/google";

// 1. Manrope: precise, warm, geometric interface typeface (Default interface)
export const fontManrope = Manrope({
  subsets: ["latin"],
  variable: "--font-interface-manrope",
  display: "swap",
});

// 2. Instrument Serif: reflective editorial accent typeface (Default editorial)
export const fontInstrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-editorial-instrument",
  display: "swap",
});

// 3. Newsreader: classic literary serif for thoughtful reading passages
export const fontNewsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-editorial-newsreader",
  display: "swap",
  preload: false,
});

// 4. Fraunces: expressive, warm contemporary variable serif
export const fontFraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-editorial-fraunces",
  display: "swap",
  preload: false,
});

// 5. Plus Jakarta Sans: modern, rhythmic, legible geometric sans
export const fontPlusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-interface-jakarta",
  display: "swap",
  preload: false,
});

// 6. DM Sans: crisp, balanced, approachable geometric sans
export const fontDMSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-interface-dmsans",
  display: "swap",
  preload: false,
});

// 7. Caveat: warm, organic, authentic handwriting font
export const fontCaveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting-caveat",
  display: "swap",
  preload: false,
});

// Backwards-compatible exports
export const interfaceFont = fontManrope;
export const editorialFont = fontInstrumentSerif;
