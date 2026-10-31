"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { AssessmentQuestion } from "@/lib/types";
import { Button } from "../common/Button";
import { Icon } from "../common/Icon";
import { TextAreaField } from "../common/Field";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export function QuestionStep({
  question,
  selectedOptionId,
  context,
  onSelect,
  onContextChange,
  onBack,
  onContinue,
  isFirst,
  isLast,
}: {
  question: AssessmentQuestion;
  selectedOptionId?: string;
  context: string;
  onSelect: (optionId: string) => void;
  onContextChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [showContext, setShowContext] = useState(Boolean(context));
  const radioRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) return;
    e.preventDefault();
    const currentIndex = question.options.findIndex((o) => o.id === selectedOptionId);
    let nextIndex = 0;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      nextIndex = currentIndex === -1 || currentIndex === question.options.length - 1 ? 0 : currentIndex + 1;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      nextIndex = currentIndex <= 0 ? question.options.length - 1 : currentIndex - 1;
    }
    const nextOption = question.options[nextIndex];
    if (nextOption) {
      onSelect(nextOption.id);
      radioRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">{question.eyebrow}</p>
        <h2 className="mt-3 font-editorial text-balance text-[1.6rem] leading-tight sm:text-3xl">{question.question}</h2>
        {question.helper && <p className="mt-2 text-sm text-[var(--color-text-muted)]">{question.helper}</p>}
      </div>

      <motion.div
        role="radiogroup"
        aria-label={question.question}
        onKeyDown={handleKeyDown}
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2.5"
      >
        {question.options.map((option, index) => {
          const selected = selectedOptionId === option.id;
          const isFocusable = selectedOptionId ? selected : index === 0;
          return (
            <motion.button
              key={option.id}
              ref={(el) => {
                radioRefs.current[index] = el;
              }}
              type="button"
              variants={itemVariants}
              role="radio"
              tabIndex={isFocusable ? 0 : -1}
              aria-checked={selected}
              onClick={() => onSelect(option.id)}
              whileTap={{ scale: 0.99 }}
              className={`flex items-start gap-3 rounded-[var(--radius-md)] border px-4 py-3.5 text-left text-[0.95rem] leading-snug transition-colors duration-150 ${
                selected
                  ? "border-[var(--color-accent)] bg-[var(--color-surface)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-text-muted)]"
              }`}
            >
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[0.65rem] font-semibold transition-colors ${
                  selected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-text)]"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                {option.id}
              </span>
              <span>{option.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      <div>
        <button
          type="button"
          onClick={() => setShowContext((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          aria-expanded={showContext}
        >
          <Icon name={showContext ? "minus-circle" : "add-circle"} size={16} />
          Want to explain your answer?
        </button>
        {showContext && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="mt-3 overflow-hidden">
            <TextAreaField
              value={context}
              charLimit={280}
              onChange={(e) => onContextChange(e.target.value)}
              placeholder={question.contextPlaceholder}
              aria-label="Optional context for your answer"
            />
          </motion.div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onBack} disabled={isFirst}>
          <Icon name="arrow-left" size={16} /> Back
        </Button>
        <Button type="button" onClick={onContinue} disabled={!selectedOptionId}>
          {isLast ? "Finish" : "Continue"} <Icon name="arrow-right" size={16} />
        </Button>
      </div>
    </motion.div>
  );
}
