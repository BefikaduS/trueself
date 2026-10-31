"use client";

import { Icon as IconifyIcon } from "@iconify/react";

// Thin wrapper around Iconify's Solar icon set so every icon in the app
// shares sizing, stroke weight and default style conventions. `name`
// should be the Solar icon slug, e.g. "compass", "pen-2", "chat-round-dots".
export function Icon({
  name,
  variant = "linear",
  size = 20,
  className,
}: {
  name: string;
  variant?: "linear" | "bold" | "broken" | "outline";
  size?: number;
  className?: string;
}) {
  return (
    <IconifyIcon
      icon={`solar:${name}-${variant}`}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    />
  );
}
