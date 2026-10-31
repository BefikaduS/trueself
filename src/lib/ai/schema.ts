import { z } from "zod";

// Every AI (or demo) response must satisfy this schema before it is ever
// rendered. This is what lets us safely trust model output: if the shape
// is wrong, we reject it and surface a clear error instead of rendering
// something broken or fabricated.
const confidence = z.enum(["low", "moderate", "high"]);

export const analysisSchema = z.object({
  portrait: z.object({
    title: z.string().min(3),
    summary: z.string().min(40),
    supportingAnswers: z.array(z.string()).min(1).max(6),
    confidence,
  }),
  honestTruth: z.object({
    title: z.string().min(3),
    observation: z.string().min(40),
    supportingAnswers: z.array(z.string()).min(1).max(6),
    reasoning: z.string().min(20),
    confidence,
  }),
  strength: z.object({
    title: z.string().min(3),
    description: z.string().min(30),
    supportingAnswers: z.array(z.string()).min(1).max(6),
    howToUseIt: z.string().min(20),
  }),
  blindSpots: z
    .array(
      z.object({
        title: z.string().min(2),
        pattern: z.string().min(20),
        relatedAnswers: z.array(z.string()).min(1),
        everydayImpact: z.string().min(10),
        howToNotice: z.string().min(10),
      }),
    )
    .min(1)
    .max(3),
  contradictions: z
    .array(
      z.object({
        valuedThing: z.string().min(5),
        observedBehavior: z.string().min(5),
        possibleContradiction: z.string().min(10),
        wayForward: z.string().min(10),
      }),
    )
    .min(1)
    .max(2),
  behaviorPattern: z.object({
    stages: z.array(z.string()).min(3).max(7),
    explanation: z.string().min(20),
  }),
  stopDoing: z.object({ action: z.string().min(5), reason: z.string().min(10) }),
  startDoing: z.object({ action: z.string().min(5), reason: z.string().min(10) }),
  priorities: z.array(z.string()).min(3).max(3),
  next24Hours: z.object({ action: z.string().min(10), purpose: z.string().min(10) }),
  sevenDayPlan: z
    .array(
      z.object({
        day: z.number().int().min(1).max(7),
        title: z.string().min(2),
        action: z.string().min(5),
        minutes: z.number().int().min(1).max(180),
        purpose: z.string().min(5),
      }),
    )
    .length(7),
  thirtyDayExperiment: z.object({
    focusArea: z.string().min(5),
    behavior: z.string().min(5),
    frequency: z.string().min(2),
    successLooksLike: z.string().min(10),
    ifYouMissADay: z.string().min(10),
    howProgressIsEvaluated: z.string().min(10),
  }),
  finalNote: z.string().min(30),
});

export type ValidatedAnalysis = z.infer<typeof analysisSchema>;

// Three personalized follow-up questions for "Go Deeper".
export const deepenSchema = z.object({
  questions: z
    .array(
      z.object({
        id: z.string(),
        question: z.string().min(15),
        reason: z.string().min(10),
        options: z.array(z.string()).min(2).max(5),
      }),
    )
    .length(3),
});

export type ValidatedDeepen = z.infer<typeof deepenSchema>;
