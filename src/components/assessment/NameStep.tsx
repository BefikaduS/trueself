"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../common/Button";
import { Icon } from "../common/Icon";

export function NameStep({ initialName, onSubmit }: { initialName: string; onSubmit: (name: string) => void }) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Let us know what to call you before we begin.");
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <h1 className="font-editorial text-balance text-3xl sm:text-4xl">Before we begin, what should we call you?</h1>
      <p className="text-[var(--color-text-muted)]">Let&rsquo;s make this a little more personal.</p>

      <div>
        <label htmlFor="name" className="sr-only">
          Your name
        </label>
        <input
          id="name"
          autoFocus
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter your first name"
          className="w-full border-b-2 border-[var(--color-input-border)] bg-transparent pb-3 text-2xl text-[var(--color-input-text,var(--color-text))] placeholder:text-[var(--color-input-placeholder)] caret-[var(--color-accent)] outline-none transition-colors focus:border-[var(--color-accent)]"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "name-error" : undefined}
        />
        {error && (
          <p id="name-error" className="mt-2 text-sm text-[var(--color-warning)]">
            {error}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="self-start">
        Meet Yourself <Icon name="arrow-right" size={18} />
      </Button>
    </motion.form>
  );
}
