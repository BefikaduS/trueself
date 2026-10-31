"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QUESTIONS } from "../questions";

export interface DraftAnswer {
  optionId: string;
  context: string;
}

// Steps: "name" -> "intro" -> one per question id -> "review"
export type AssessmentStep = "name" | "intro" | "review" | (string & {});

interface AssessmentState {
  name: string;
  step: AssessmentStep;
  answers: Record<string, DraftAnswer>;
  setName: (name: string) => void;
  goTo: (step: AssessmentStep) => void;
  setAnswer: (questionId: string, optionId: string) => void;
  setContext: (questionId: string, context: string) => void;
  isComplete: () => boolean;
  resetAssessment: () => void;
}

const initialState = {
  name: "",
  step: "name" as AssessmentStep,
  answers: {} as Record<string, DraftAnswer>,
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setName: (name) => set({ name: name.trim() }),
      goTo: (step) => set({ step }),
      setAnswer: (questionId, optionId) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: { optionId, context: state.answers[questionId]?.context ?? "" },
          },
        })),
      setContext: (questionId, context) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: { optionId: state.answers[questionId]?.optionId ?? "", context },
          },
        })),
      isComplete: () => QUESTIONS.every((q) => Boolean(get().answers[q.id]?.optionId)),
      resetAssessment: () => set({ ...initialState, answers: {} }),
    }),
    { name: "trueself.assessment" },
  ),
);
