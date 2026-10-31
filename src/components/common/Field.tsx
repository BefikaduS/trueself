"use client";

import { forwardRef, useId } from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-sm font-medium text-[var(--color-text-muted)]">
        {label}
      </label>
      <input
        ref={ref}
        id={fieldId}
        className={`input-surface w-full rounded-[var(--radius-md)] px-4 py-3 text-base text-[var(--color-input-text,var(--color-text))] placeholder:text-[var(--color-input-placeholder)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-input-focus-ring)] ${
          error ? "!border-[var(--color-warning)]" : ""
        } ${className ?? ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-[var(--color-warning)]">
          {error}
        </p>
      )}
    </div>
  );
});

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  charLimit?: number;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(function TextAreaField(
  { label, charLimit = 280, id, className, value, rows = 3, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const length = typeof value === "string" ? value.length : 0;
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-[var(--color-text-muted)]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={fieldId}
        value={value}
        maxLength={charLimit}
        rows={rows}
        className={`input-surface w-full resize-none rounded-[var(--radius-md)] px-4 py-3 text-[0.95rem] text-[var(--color-input-text,var(--color-text))] placeholder:text-[var(--color-input-placeholder)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-input-focus-ring)] ${className ?? ""}`}
        {...props}
      />
      <span className="self-end text-xs text-[var(--color-text-muted)]">
        {length}/{charLimit}
      </span>
    </div>
  );
});
