"use client";

import { forwardRef } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-[var(--ease-standard)] disabled:opacity-45 disabled:pointer-events-none select-none active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--color-accent)] text-[var(--color-accent-text)] hover:brightness-105 shadow-[var(--shadow-soft)]",
  secondary: "bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-strong)] border border-[var(--color-border)]",
  outline: "bg-transparent text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-accent)]",
  ghost: "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)]",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3.5 py-2 rounded-[var(--radius-sm)]",
  md: "text-[0.95rem] px-5 py-2.5 rounded-[var(--radius-md)]",
  lg: "text-base px-7 py-3.5 rounded-[var(--radius-md)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, children, ...props },
  ref,
) {
  return (
    <button ref={ref} className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
});
