"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QUESTIONS, getRandomAssessmentSet } from "../questions";
import type { AssessmentQuestion } from "../types";

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
  questions: AssessmentQuestion[];
  setName: (name: string) => void;
  goTo: (step: AssessmentStep) => void;
  setAnswer: (questionId: string, optionId: string) => void;
  setContext: (questionId: string, context: string) => void;
  isComplete: () => boolean;
  resetAssessment: () => void;
  shuffleQuestions: () => AssessmentQuestion[];
}

const initialState = {
  name: "",
  step: "name" as AssessmentStep,
  answers: {} as Record<string, DraftAnswer>,
  questions: QUESTIONS,
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
      isComplete: () => {
        const activeQuestions = get().questions?.length === 6 ? get().questions : QUESTIONS;
        return activeQuestions.every((q) => Boolean(get().answers[q.id]?.optionId));
      },
      shuffleQuestions: () => {
        const nextQuestions = getRandomAssessmentSet();
        set((state) => ({
          questions: nextQuestions,
          answers: {},
          step: state.name?.trim() ? "intro" : "name",
        }));
        return nextQuestions;
      },
      resetAssessment: () => {
        const nextQuestions = getRandomAssessmentSet();
        set({ ...initialState, questions: nextQuestions, answers: {} });
      },
    }),
    { name: "trueself.assessment" },
  ),
);
