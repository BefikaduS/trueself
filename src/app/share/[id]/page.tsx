"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { LoadingState, ErrorState } from "@/components/common/States";
import { useToast } from "@/components/common/Toast";
import type { AnalysisResult } from "@/lib/types";
import { LogoMark } from "@/components/common/Logo";

type CardStyle = "noir" | "parchment" | "liquid" | "sunset" | "swiss";
type CardRatio = "square" | "story" | "landscape";
type CardFont = "handwriting" | "editorial" | "literary" | "modern" | "sans";
type ContentSection = "portrait" | "honestTruth" | "strength" | "pattern";

interface ReportData {
  id: string;
  name: string;
  analysis: AnalysisResult;
}

const STYLES: { id: CardStyle; name: string; desc: string; previewBg: string }[] = [
  { id: "noir", name: "Noir Velvet", desc: "Deep dark editorial with gold-tinged warm typography", previewBg: "bg-[#0b0b0e]" },
  { id: "parchment", name: "Warm Parchment", desc: "Tactile ivory literary paper with sharp charcoal serifs", previewBg: "bg-[#fbf7f0]" },
  { id: "liquid", name: "Liquid Caustic Glass", desc: "Frosted glass with iridescent specular rim & cyan glow", previewBg: "bg-[#10141f]" },
  { id: "sunset", name: "Sunset Horizon", desc: "Atmospheric amber & violet gradient aura with crisp text", previewBg: "bg-gradient-to-br from-[#2a133a] to-[#c1512d]" },
  { id: "swiss", name: "Swiss Minimal", desc: "Stark monochrome monumental layout with bold punch", previewBg: "bg-[#000000]" },
];

const RATIOS: { id: CardRatio; name: string; aspect: string; width: number; height: number }[] = [
  { id: "square", name: "Square 1:1", aspect: "aspect-square max-w-[460px]", width: 1080, height: 1080 },
  { id: "story", name: "Story 9:16", aspect: "aspect-[9/16] max-w-[360px]", width: 1080, height: 1920 },
  { id: "landscape", name: "Landscape 16:9", aspect: "aspect-[16/9] max-w-[540px]", width: 1200, height: 675 },
];

const FONTS: { id: CardFont; name: string; styleName: string; fontClass: string; canvasFamily: string }[] = [
  {
    id: "handwriting",
    name: "Handwritten",
    styleName: "Caveat Notebook",
    fontClass: "font-handwriting text-2xl sm:text-3xl leading-snug",
    canvasFamily: '"Caveat", cursive, sans-serif',
  },
  {
    id: "editorial",
    name: "Reflective Serif",
    styleName: "Instrument Serif",
    fontClass: "font-editorial text-lg sm:text-xl leading-relaxed",
    canvasFamily: '"Instrument Serif", Georgia, serif',
  },
  {
    id: "literary",
    name: "Classic Literary",
    styleName: "Newsreader",
    fontClass: "font-serif text-base sm:text-lg leading-relaxed",
    canvasFamily: '"Newsreader", Georgia, serif',
  },
  {
    id: "modern",
    name: "Expressive Serif",
    styleName: "Fraunces",
    fontClass: "font-serif font-medium text-base sm:text-lg leading-relaxed",
    canvasFamily: '"Fraunces", Georgia, serif',
  },
  {
    id: "sans",
    name: "Clean Geometric",
    styleName: "Manrope Sans",
    fontClass: "font-sans font-medium text-sm sm:text-base tracking-tight leading-relaxed",
    canvasFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif',
  },
];

export default function ShareCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedStyle, setSelectedStyle] = useState<CardStyle>("noir");
  const [selectedRatio, setSelectedRatio] = useState<CardRatio>("square");
  const [selectedFont, setSelectedFont] = useState<CardFont>("handwriting");
  const [selectedSection, setSelectedSection] = useState<ContentSection>("portrait");
  const [showName, setShowName] = useState(true);
  const [showBranding, setShowBranding] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const { show } = useToast();

  useEffect(() => {
    fetch(`/api/reports/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        if (data.report) {
          setReport(data.report);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20">
        <LoadingState label="Opening Card Studio..." />
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="mx-auto max-w-lg px-6 py-20">
        <ErrorState
          title="Couldn't find reflection"
          description="We couldn't generate a card for this report ID."
          action={
            <Link href="/">
              <Button>Go home</Button>
            </Link>
          }
        />
      </main>
    );
  }

  const { name, analysis } = report;

  // Resolve content based on active section
  let titleText = "The Reflection";
  let quoteText = analysis.portrait.summary;
  let tagText = "Core Portrait";

  if (selectedSection === "honestTruth") {
    titleText = analysis.honestTruth.title || "The Honest Truth";
    quoteText = analysis.honestTruth.observation;
    tagText = "Observation";
  } else if (selectedSection === "strength") {
    titleText = analysis.strength.title || "Core Strength";
    quoteText = analysis.strength.description;
    tagText = "Natural Instinct";
  } else if (selectedSection === "pattern") {
    titleText = "Behavioral Cycle";
    quoteText = analysis.behaviorPattern.explanation || analysis.behaviorPattern.stages.join(" → ");
    tagText = "Pattern Loop";
  }

  const activeFontMeta = FONTS.find((f) => f.id === selectedFont) || FONTS[0];

  // Pure Native Canvas Drawing — 100% immune to 'Tainted Canvas' security restrictions
  const renderCardToCanvas = (width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    const scaleFactor = width / 600;

    // 1. Background Fill
    if (selectedStyle === "noir") {
      ctx.fillStyle = "#0b0b0e";
      ctx.fillRect(0, 0, width, height);

      // Subtle warm ambient radial glow
      const radialGlow = ctx.createRadialGradient(
        width / 2,
        0,
        20 * scaleFactor,
        width / 2,
        0,
        height * 0.8
      );
      radialGlow.addColorStop(0, "rgba(237, 108, 48, 0.22)");
      radialGlow.addColorStop(1, "rgba(11, 11, 14, 0)");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Border frame
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 2 * scaleFactor;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(
          16 * scaleFactor,
          16 * scaleFactor,
          width - 32 * scaleFactor,
          height - 32 * scaleFactor,
          24 * scaleFactor
        );
        ctx.stroke();
      }
    } else if (selectedStyle === "parchment") {
      ctx.fillStyle = "#fbf7f0";
      ctx.fillRect(0, 0, width, height);

      // Literary embossed double-frame
      ctx.strokeStyle = "rgba(217, 189, 159, 0.65)";
      ctx.lineWidth = 2 * scaleFactor;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(
          16 * scaleFactor,
          16 * scaleFactor,
          width - 32 * scaleFactor,
          height - 32 * scaleFactor,
          24 * scaleFactor
        );
        ctx.stroke();

        ctx.strokeStyle = "rgba(217, 189, 159, 0.25)";
        ctx.lineWidth = 1 * scaleFactor;
        ctx.beginPath();
        ctx.roundRect(
          24 * scaleFactor,
          24 * scaleFactor,
          width - 48 * scaleFactor,
          height - 48 * scaleFactor,
          18 * scaleFactor
        );
        ctx.stroke();
      }
    } else if (selectedStyle === "liquid") {
      ctx.fillStyle = "#10141f";
      ctx.fillRect(0, 0, width, height);

      // Cyan-teal volumetric glow
      const cyanGlow = ctx.createRadialGradient(
        width * 0.8,
        height * 0.2,
        20 * scaleFactor,
        width * 0.8,
        height * 0.2,
        height * 0.7
      );
      cyanGlow.addColorStop(0, "rgba(45, 212, 191, 0.35)");
      cyanGlow.addColorStop(0.5, "rgba(34, 211, 238, 0.12)");
      cyanGlow.addColorStop(1, "transparent");
      ctx.fillStyle = cyanGlow;
      ctx.fillRect(0, 0, width, height);

      // Iridescent specular rim border
      ctx.strokeStyle = "rgba(45, 212, 191, 0.4)";
      ctx.lineWidth = 2.5 * scaleFactor;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(
          16 * scaleFactor,
          16 * scaleFactor,
          width - 32 * scaleFactor,
          height - 32 * scaleFactor,
          24 * scaleFactor
        );
        ctx.stroke();
      }
    } else if (selectedStyle === "sunset") {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#240e34");
      grad.addColorStop(0.5, "#4a1435");
      grad.addColorStop(1, "#ba431d");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
      ctx.lineWidth = 2 * scaleFactor;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(
          16 * scaleFactor,
          16 * scaleFactor,
          width - 32 * scaleFactor,
          height - 32 * scaleFactor,
          24 * scaleFactor
        );
        ctx.stroke();
      }
    } else {
      // Swiss Minimal
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4 * scaleFactor;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(
          16 * scaleFactor,
          16 * scaleFactor,
          width - 32 * scaleFactor,
          height - 32 * scaleFactor,
          20 * scaleFactor
        );
        ctx.stroke();
      }
    }

    const paddingX = 54 * scaleFactor;
    let topY = 68 * scaleFactor;

    // 2. Top Header (Branding & Category Tag)
    if (showBranding) {
      // Draw Trueself Monogram Mark
      ctx.save();
      const markColor =
        selectedStyle === "parchment" ? "#c1512d" : "#ed6c30";
      ctx.strokeStyle = markColor;
      ctx.lineWidth = 2.5 * scaleFactor;
      const circleR = 10 * scaleFactor;
      const markX = paddingX + circleR;
      const markY = topY - 4 * scaleFactor;
      ctx.beginPath();
      ctx.arc(markX, markY, circleR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = markColor;
      ctx.beginPath();
      ctx.arc(markX, markY, 3.5 * scaleFactor, 0, Math.PI * 2);
      ctx.fill();

      // Wordmark
      ctx.fillStyle = selectedStyle === "parchment" ? "#191715" : "#ffffff";
      ctx.font = `600 ${18 * scaleFactor}px "Instrument Serif", Georgia, serif`;
      ctx.fillText("Trueself", markX + circleR + 10 * scaleFactor, topY + 2 * scaleFactor);
      ctx.restore();
    }

    // Category Tag Pill
    ctx.save();
    const tagBg =
      selectedStyle === "parchment"
        ? "rgba(193, 81, 45, 0.12)"
        : selectedStyle === "liquid"
        ? "rgba(34, 211, 238, 0.18)"
        : "rgba(237, 108, 48, 0.22)";
    const tagFg =
      selectedStyle === "parchment"
        ? "#c1512d"
        : selectedStyle === "liquid"
        ? "#22d3ee"
        : "#ed6c30";

    ctx.font = `bold ${10 * scaleFactor}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    const tagWidth = ctx.measureText(tagText.toUpperCase()).width + 20 * scaleFactor;
    const tagHeight = 22 * scaleFactor;
    const tagX = width - paddingX - tagWidth;
    const tagY = topY - 14 * scaleFactor;

    ctx.fillStyle = tagBg;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 11 * scaleFactor);
      ctx.fill();
    } else {
      ctx.fillRect(tagX, tagY, tagWidth, tagHeight);
    }
    ctx.fillStyle = tagFg;
    ctx.fillText(tagText.toUpperCase(), tagX + 10 * scaleFactor, tagY + 15 * scaleFactor);
    ctx.restore();

    // Horizontal top divider
    ctx.strokeStyle =
      selectedStyle === "parchment" ? "rgba(25, 23, 21, 0.12)" : "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1 * scaleFactor;
    ctx.beginPath();
    ctx.moveTo(paddingX, topY + 22 * scaleFactor);
    ctx.lineTo(width - paddingX, topY + 22 * scaleFactor);
    ctx.stroke();

    // 3. Middle Content: Subject Title & Quote Text
    const contentStartY = topY + 65 * scaleFactor;

    // Subheading (Author / Reflection Title)
    ctx.fillStyle =
      selectedStyle === "parchment" ? "#77716b" : "rgba(255, 255, 255, 0.65)";
    ctx.font = `bold ${11 * scaleFactor}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    const subheader = showName ? `${name}'s reflection`.toUpperCase() : titleText.toUpperCase();
    ctx.fillText(subheader, paddingX, contentStartY);

    // Dynamic Font Calculation & Text Wrapping for the Quote
    let fontSize = 23 * scaleFactor;
    let lineHeight = 36 * scaleFactor;

    if (selectedFont === "handwriting") {
      fontSize = 32 * scaleFactor;
      lineHeight = 44 * scaleFactor;
    } else if (selectedFont === "sans") {
      fontSize = 20 * scaleFactor;
      lineHeight = 30 * scaleFactor;
    } else if (selectedFont === "editorial") {
      fontSize = 25 * scaleFactor;
      lineHeight = 38 * scaleFactor;
    }

    if (selectedRatio === "story") {
      fontSize = fontSize * 1.08;
      lineHeight = lineHeight * 1.1;
    } else if (selectedRatio === "landscape") {
      fontSize = fontSize * 0.92;
      lineHeight = lineHeight * 0.94;
    }

    const fontStyle = selectedFont === "handwriting" ? "500" : selectedFont === "sans" ? "500" : "italic";
    ctx.font = `${fontStyle} ${fontSize}px ${activeFontMeta.canvasFamily}`;
    ctx.fillStyle = selectedStyle === "parchment" ? "#191715" : "#ffffff";

    const maxTextWidth = width - paddingX * 2;
    const words = quoteText.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const test = currentLine ? `${currentLine} ${words[i]}` : words[i];
      if (ctx.measureText(test).width > maxTextWidth) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = test;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Limit lines according to aspect ratio
    const maxLines = selectedRatio === "story" ? 16 : selectedRatio === "landscape" ? 6 : 9;
    const renderLines = lines.slice(0, maxLines);
    if (lines.length > maxLines && renderLines.length > 0) {
      renderLines[renderLines.length - 1] += "...";
    }

    // Vertically center quote between contentStartY and bottom footer
    const bottomY = height - 48 * scaleFactor;
    const availableHeight = bottomY - contentStartY - 30 * scaleFactor;
    const quoteTotalHeight = renderLines.length * lineHeight;
    let quoteY = contentStartY + Math.max(35 * scaleFactor, (availableHeight - quoteTotalHeight) / 2);

    for (let l = 0; l < renderLines.length; l++) {
      const lineStr = l === 0 ? `“${renderLines[l]}` : l === renderLines.length - 1 ? `${renderLines[l]}”` : renderLines[l];
      ctx.fillText(lineStr, paddingX, quoteY + l * lineHeight);
    }

    // 4. Bottom Footer (Attribution / Watermark)
    if (showBranding) {
      ctx.strokeStyle =
        selectedStyle === "parchment" ? "rgba(25, 23, 21, 0.12)" : "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1 * scaleFactor;
      ctx.beginPath();
      ctx.moveTo(paddingX, bottomY - 18 * scaleFactor);
      ctx.lineTo(width - paddingX, bottomY - 18 * scaleFactor);
      ctx.stroke();

      ctx.fillStyle =
        selectedStyle === "parchment" ? "#77716b" : "rgba(255, 255, 255, 0.55)";
      ctx.font = `400 ${11 * scaleFactor}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.fillText("know who you are behind decisions", paddingX, bottomY);

      const domain = "trueself.me";
      ctx.font = `600 ${11 * scaleFactor}px monospace`;
      const domainWidth = ctx.measureText(domain).width;
      ctx.fillText(domain, width - paddingX - domainWidth, bottomY);
    }

    return canvas;
  };

  const handleDownload = () => {
    setDownloading(true);
    try {
      const ratioConfig = RATIOS.find((r) => r.id === selectedRatio) || RATIOS[0];
      const canvas = renderCardToCanvas(ratioConfig.width, ratioConfig.height);

      // Export cleanly without any cross-origin or foreignObject taint
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.download = `trueself-${name.toLowerCase().replace(/\s+/g, "-")}-reflection.png`;
          a.href = url;
          a.click();
          URL.revokeObjectURL(url);
          show("High-resolution card downloaded successfully!", "success");
        } else {
          // Fallback to dataURL
          const pngUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.download = `trueself-${name.toLowerCase().replace(/\s+/g, "-")}-reflection.png`;
          a.href = pngUrl;
          a.click();
          show("Card downloaded successfully!", "success");
        }
        setDownloading(false);
      }, "image/png");
    } catch (err) {
      console.error("Export error:", err);
      show("Could not generate card. Please try another format.", "error");
      setDownloading(false);
    }
  };

  const copyShareLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard?.writeText(`${origin}/report/${id}`).then(() => {
      show("Report link copied to clipboard!", "success");
    });
  };

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)]/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            <Link href={`/report/${id}`} className="hover:underline">
              &larr; Back to Report
            </Link>
            <span>·</span>
            <span>Card Studio</span>
          </div>
          <h1 className="mt-1 font-editorial text-3xl sm:text-4xl text-[var(--color-text)]">
            Shareable Card Studio
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Design an aesthetic visual card with custom handwriting fonts, clean aspect ratios, and optional branding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyShareLink}>
            <Icon name="copy" size={15} /> Copy Report Link
          </Button>
          <Button size="sm" onClick={handleDownload} disabled={downloading}>
            <Icon name="download-square" size={15} />
            {downloading ? "Rendering PNG..." : "Download Card (PNG)"}
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 flex flex-col gap-5 order-2 lg:order-1">
          {/* Font Selector */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)]/70 bg-[var(--color-surface)]/40 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
              Card Typography & Handwriting
            </span>
            <div className="mt-2.5 flex flex-col gap-2">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFont(f.id)}
                  className={`flex items-center justify-between rounded-[var(--radius-md)] border p-2.5 text-left transition-all ${
                    selectedFont === f.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)]"
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-text)] block">
                      {f.name}
                    </span>
                    <span className="text-[0.72rem] text-[var(--color-text-muted)] block">
                      {f.styleName}
                    </span>
                  </div>
                  <span
                    className={`text-sm ${
                      f.id === "handwriting"
                        ? "font-handwriting text-lg text-[var(--color-accent)]"
                        : f.id === "editorial"
                        ? "font-editorial text-base text-[var(--color-accent)]"
                        : "text-xs font-medium text-[var(--color-text-muted)]"
                    }`}
                  >
                    Aa
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)]/70 bg-[var(--color-surface)]/40 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
              Visual Background Theme
            </span>
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STYLES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStyle(st.id)}
                  className={`flex items-center gap-2.5 rounded-[var(--radius-md)] border p-2.5 text-left transition-all ${
                    selectedStyle === st.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]"
                      : "border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                  }`}
                >
                  <span className={`h-6 w-6 rounded-full border border-white/20 shrink-0 ${st.previewBg}`} />
                  <p className="text-xs font-semibold text-[var(--color-text)]">{st.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)]/70 bg-[var(--color-surface)]/40 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
              Format & Aspect Ratio
            </span>
            <div className="mt-2.5 flex gap-2">
              {RATIOS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRatio(r.id)}
                  className={`flex-1 rounded-[var(--radius-md)] border py-2 px-3 text-center text-xs font-medium transition-all ${
                    selectedRatio === r.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-xs"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content Highlight Selector */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)]/70 bg-[var(--color-surface)]/40 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
              Highlight Passage
            </span>
            <div className="mt-2.5 flex flex-col gap-1.5 text-xs">
              {[
                { id: "portrait", label: "Core Portrait Summary" },
                { id: "honestTruth", label: "The Honest Truth" },
                { id: "strength", label: "Core Strength" },
                { id: "pattern", label: "Behavioral Loop" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedSection(c.id as ContentSection)}
                  className={`flex items-center justify-between rounded-[var(--radius-md)] border p-2 text-left transition-all ${
                    selectedSection === c.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 font-semibold text-[var(--color-text)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)]/60 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <span>{c.label}</span>
                  {selectedSection === c.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Customization Toggles (Name & Branding) */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)]/70 bg-[var(--color-surface)]/40 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-[var(--color-text)] block">Include my name</span>
                <span className="text-[var(--color-text-muted)] block text-[0.72rem]">Attributed as &ldquo;{name}&rsquo;s reflection&rdquo;</span>
              </div>
              <button
                onClick={() => setShowName(!showName)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  showName ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    showName ? "translate-x-4.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-[var(--color-border)]/40 pt-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-[var(--color-text)] block">Show Trueself branding</span>
                <span className="text-[var(--color-text-muted)] block text-[0.72rem]">Toggle logo and trueself.me watermark</span>
              </div>
              <button
                onClick={() => setShowBranding(!showBranding)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  showBranding ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    showBranding ? "translate-x-4.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Live Card Preview Column - Sticky on Desktop */}
        <div className="lg:col-span-7 flex flex-col items-center order-1 lg:order-2 lg:sticky lg:top-24 self-start w-full">
          <div className="w-full rounded-[var(--radius-xl)] border border-[var(--color-border)]/70 bg-[var(--color-surface)]/35 p-4 sm:p-5 backdrop-blur-md shadow-sm">
            {/* Live preview header bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]/50 text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-semibold uppercase tracking-wider text-[var(--color-text)] text-[0.72rem]">
                  Live Preview
                </span>
              </div>
              <div className="flex items-center gap-2 text-[0.72rem] text-[var(--color-text-muted)]">
                <span className="rounded-full bg-[var(--color-surface-strong)] px-2.5 py-0.5 font-medium">
                  {RATIOS.find((r) => r.id === selectedRatio)?.name}
                </span>
                <span className="hidden sm:inline font-mono">
                  {activeFontMeta.styleName}
                </span>
              </div>
            </div>

            {/* The Live Rendered Card Container */}
            <div className="w-full flex justify-center py-4 max-h-[calc(100vh-17rem)] overflow-y-auto no-scrollbar">
              {/* The Live Rendered Card */}
              <div
                className={`w-full overflow-hidden transition-all duration-300 relative select-none shadow-2xl ${
                  RATIOS.find((r) => r.id === selectedRatio)?.aspect
                } ${
                  selectedStyle === "noir"
                    ? "bg-[#0b0b0e] text-[#f4efe8] border border-[#23232c]"
                    : selectedStyle === "parchment"
                    ? "bg-[#fbf7f0] text-[#191715] border border-[#d9bd9f]"
                    : selectedStyle === "liquid"
                    ? "bg-[#10141f] text-[#f0f4ff] border border-teal-400/35"
                    : selectedStyle === "sunset"
                    ? "bg-gradient-to-br from-[#240e34] via-[#4a1435] to-[#ba431d] text-white border border-white/10"
                    : "bg-black text-white border-2 border-white/20"
                }`}
                style={{
                  borderRadius: "26px",
                  padding: selectedRatio === "story" ? "32px 24px" : "30px",
                }}
              >
                {/* Liquid caustic glow */}
                {selectedStyle === "liquid" && (
                  <div
                    className="pointer-events-none absolute inset-0 opacity-25"
                    style={{
                      background: "radial-gradient(circle at 80% 20%, rgba(45, 212, 191, 0.45), transparent 60%)",
                    }}
                  />
                )}
                {selectedStyle === "noir" && (
                  <div
                    className="pointer-events-none absolute inset-0 opacity-15"
                    style={{
                      background: "radial-gradient(circle at 50% 0%, rgba(237, 108, 48, 0.3), transparent 70%)",
                    }}
                  />
                )}

                {/* Inner card layout */}
                <div className="relative z-10 flex h-full flex-col justify-between">
                  {/* Top header row */}
                  <div
                    className="flex items-center justify-between border-b pb-3.5"
                    style={{
                      borderColor:
                        selectedStyle === "parchment" ? "rgba(25,23,21,0.12)" : "rgba(255,255,255,0.12)",
                    }}
                  >
                    {showBranding ? (
                      <div className="flex items-center gap-2">
                        <LogoMark size={22} />
                        <span className="font-editorial text-sm font-semibold tracking-wide">
                          Trueself
                        </span>
                      </div>
                    ) : (
                      <span className="text-[0.68rem] tracking-wider uppercase opacity-50">
                        Personal Reflection
                      </span>
                    )}

                    <span
                      className="rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
                      style={{
                        backgroundColor:
                          selectedStyle === "parchment"
                            ? "rgba(193, 81, 45, 0.12)"
                            : selectedStyle === "liquid"
                            ? "rgba(34, 211, 238, 0.2)"
                            : "rgba(237, 108, 48, 0.22)",
                        color:
                          selectedStyle === "parchment"
                            ? "#c1512d"
                            : selectedStyle === "liquid"
                            ? "#22d3ee"
                            : "#ed6c30",
                      }}
                    >
                      {tagText}
                    </span>
                  </div>

                  {/* Main Quote Content */}
                  <div className="my-auto py-4">
                    <p
                      className="text-[0.68rem] uppercase tracking-[0.2em] font-semibold opacity-70"
                      style={{ color: selectedStyle === "parchment" ? "#77716b" : "#aaa" }}
                    >
                      {showName ? `${name}'s reflection` : titleText}
                    </p>

                    <blockquote
                      className={`mt-2 ${activeFontMeta.fontClass} ${
                        selectedRatio === "story"
                          ? "line-clamp-10"
                          : selectedRatio === "landscape"
                          ? "line-clamp-4"
                          : "line-clamp-6"
                      }`}
                    >
                      &ldquo;{quoteText}&rdquo;
                    </blockquote>
                  </div>

                  {/* Bottom Card Footer */}
                  {showBranding && (
                    <div
                      className="flex items-center justify-between border-t pt-3 text-[0.68rem]"
                      style={{
                        borderColor:
                          selectedStyle === "parchment" ? "rgba(25,23,21,0.12)" : "rgba(255,255,255,0.12)",
                        color: selectedStyle === "parchment" ? "#77716b" : "#999",
                      }}
                    >
                      <span className="tracking-tight">know who you are behind decisions</span>
                      <span className="font-mono font-medium tracking-wider uppercase">trueself.me</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Sticky Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--color-border)]/50">
              <span className="text-[0.72rem] text-[var(--color-text-muted)] truncate max-w-[200px]">
                {selectedStyle.toUpperCase()} · {showBranding ? "Branded" : "Unbranded"}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyShareLink} className="text-xs">
                  <Icon name="copy" size={13} /> Copy Link
                </Button>
                <Button size="sm" onClick={handleDownload} disabled={downloading} className="text-xs">
                  <Icon name="download-square" size={13} />
                  {downloading ? "Rendering..." : "Download (PNG)"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
