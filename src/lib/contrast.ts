// Small relative-luminance contrast helper so a custom accent color never
// makes accent-colored text unreadable. Returns a foreground color
// ("#191715" or "#FFFFFF" style tokens) with sufficient contrast.
function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "").trim();
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function luminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function isValidHex(hex: string): boolean {
  return hexToRgb(hex) !== null;
}

// Returns the readable foreground (dark or light) for a given background hex.
export function readableForeground(hex: string, dark = "#191715", light = "#fffaf5"): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return dark;
  const l = luminance(rgb);
  // WCAG contrast of white vs black against this luminance.
  const contrastWithWhite = (1.05) / (l + 0.05);
  const contrastWithBlack = (l + 0.05) / 0.05;
  return contrastWithWhite >= contrastWithBlack ? light : dark;
}

export function contrastRatio(hexA: string, hexB: string): number {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return 1;
  const la = luminance(a) + 0.05;
  const lb = luminance(b) + 0.05;
  return la > lb ? la / lb : lb / la;
}
