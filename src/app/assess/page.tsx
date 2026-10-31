"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { AssessmentShell } from "@/components/assessment/AssessmentShell";
import { NameStep } from "@/components/assessment/NameStep";
import { IntroStep } from "@/components/assessment/IntroStep";
import { QuestionStep } from "@/components/assessment/QuestionStep";
import { AnalyzingStep } from "@/components/assessment/AnalyzingStep";
import { useAssessmentStore } from "@/lib/store/assessmentStore";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/questions";
import { getAnonymousId } from "@/lib/anonymous";
import type { SubmittedAnswer } from "@/lib/types";

const emptySubscribe = () => () => {};

export default function AssessPage() {
  const router = useRouter();
  const { name, step, answers, setName, goTo, setAnswer, setContext, isComplete, resetAssessment } = useAssessmentStore();
  const [submitStatus, setSubmitStatus] = useState<"idle" | "pending" | "slow" | "error">("idle");
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean client hydration without triggering cascading render warnings
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    const store = useAssessmentStore.getState();
    // Always ask for a name first before starting the questions
    if (!store.name?.trim() || store.isComplete()) {
      if (store.isComplete()) {
        store.resetAssessment();
      }
      store.goTo("name");
    }
  }, []);

  const questionIndex = QUESTIONS.findIndex((q) => q.id === step);
  const isQuestionStep = questionIndex !== -1;

  const submit = async () => {
    setSubmitStatus("pending");
    slowTimer.current = setTimeout(() => setSubmitStatus("slow"), 7000);
    try {
      const payload: SubmittedAnswer[] = QUESTIONS.map((q) => {
        const draft = answers[q.id];
        const option = q.options.find((o) => o.id === draft?.optionId);
        return {
          questionId: q.id,
          questionText: q.question,
          optionId: draft?.optionId ?? "",
          optionText: option?.label ?? "",
          context: draft?.context?.trim() || undefined,
        };
      });

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), answers: payload, anonymousId: getAnonymousId() }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Request failed");
      }
      const data = await res.json();
      if (slowTimer.current) clearTimeout(slowTimer.current);
      
      // Navigate to report immediately while keeping AnalyzingStep visible
      router.push(`/report/${data.id}`);
      
      // Defer store reset so we never flash the "Enter your name" step during page transition
      setTimeout(() => {
        resetAssessment();
      }, 1500);
    } catch (error) {
      console.error("Assessment submit error:", error);
      if (slowTimer.current) clearTimeout(slowTimer.current);
      setSubmitStatus("error");
    }
  };

  if (!hydrated) {
    return (
      <AssessmentShell>
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
        </div>
      </AssessmentShell>
    );
  }

  // While analyzing / submitting, always keep the sleek AnalyzingStep visible
  if (submitStatus !== "idle") {
    return (
      <AssessmentShell>
        <AnalyzingStep
          status={submitStatus === "slow" ? "slow" : submitStatus === "error" ? "error" : "pending"}
          onRetry={submit}
          onCancel={() => setSubmitStatus("idle")}
        />
      </AssessmentShell>
    );
  }

  // Ask for name first before starting the questions
  if (step === "name" || !name?.trim()) {
    return (
      <AssessmentShell>
        <NameStep
          initialName={name}
          onSubmit={(value) => {
            setName(value);
            goTo("intro");
          }}
        />
      </AssessmentShell>
    );
  }

  // Intro step before starting question 1
  if (step === "intro") {
    return (
      <AssessmentShell>
        <IntroStep
          name={name}
          onStart={() => goTo(QUESTIONS[0].id)}
          onBack={() => goTo("name")}
        />
      </AssessmentShell>
    );
  }

  if (isQuestionStep) {
    const question = QUESTIONS[questionIndex];
    const draft = answers[question.id];
    return (
      <AssessmentShell current={question.index} total={TOTAL_QUESTIONS}>
        <AnimatePresence mode="wait">
          <QuestionStep
            key={question.id}
            question={question}
            selectedOptionId={draft?.optionId}
            context={draft?.context ?? ""}
            onSelect={(optionId) => setAnswer(question.id, optionId)}
            onContextChange={(value) => setContext(question.id, value)}
            isFirst={questionIndex === 0}
            isLast={questionIndex === QUESTIONS.length - 1}
            onBack={() => goTo(questionIndex === 0 ? "intro" : QUESTIONS[questionIndex - 1].id)}
            onContinue={() => {
              if (questionIndex === QUESTIONS.length - 1) {
                if (isComplete()) submit();
              } else {
                goTo(QUESTIONS[questionIndex + 1].id);
              }
            }}
          />
        </AnimatePresence>
      </AssessmentShell>
    );
  }

  // Fallback so the assessment page is never blank
  return (
    <AssessmentShell>
      <IntroStep
        name={name || "Friend"}
        onStart={() => goTo(QUESTIONS[0].id)}
        onBack={() => goTo("name")}
      />
    </AssessmentShell>
  );
}
