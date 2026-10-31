"use client";

import { VALUE_DIMENSIONS } from "@/lib/types";

// A small dependency-free SVG radar chart visualizing the 8 value
// dimensions. Purely illustrative — exact numeric accuracy isn't the point.
export function RadarChart({ weights }: { weights: Record<string, number> }) {
  const size = 320;
  const center = size / 2;
  const radius = 95;
  const n = VALUE_DIMENSIONS.length;

  const points = VALUE_DIMENSIONS.map((dim, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const value = (weights[dim] ?? 50) / 100;
    const x = center + Math.cos(angle) * radius * value;
    const y = center + Math.sin(angle) * radius * value;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto w-full max-w-sm overflow-visible py-2"
      aria-label="Values radar chart"
      role="img"
    >
      {[0.25, 0.5, 0.75, 1].map((ring) => (
        <polygon
          key={ring}
          points={VALUE_DIMENSIONS.map((_, i) => {
            const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
            const x = center + Math.cos(angle) * radius * ring;
            const y = center + Math.sin(angle) * radius * ring;
            return `${x},${y}`;
          }).join(" ")}
          fill="none"
          stroke="var(--color-border)"
        />
      ))}
      {VALUE_DIMENSIONS.map((dim, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = center + Math.cos(angle) * (radius + 24);
        const y = center + Math.sin(angle) * (radius + 24);
        return (
          <text
            key={dim}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="500"
            fill="var(--color-text-muted)"
          >
            {dim}
          </text>
        );
      })}
      <polygon
        points={points}
        fill="var(--color-accent)"
        fillOpacity={0.28}
        stroke="var(--color-accent)"
        strokeWidth={2}
      />
    </svg>
  );
}
