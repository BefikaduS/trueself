// Shared domain types for the Trueself assessment, AI analysis and
// personal-development features. Keeping these centralized avoids
// duplicating shape definitions across client components and API routes.

export interface AnswerOption {
  id: string; // e.g. "A"
  label: string;
  trait?: string; // archetype or trait key e.g. "builder", "perfectionist"
}

export interface AssessmentQuestion {
  id: string; // e.g. "natural-self-1"
  dimension?: "natural-self" | "response-to-difficulty" | "the-excuse" | "emotional-reflex" | "real-success" | "future-responsibility";
  dimensionIndex?: number; // 1-6
  index: number; // 1-6 in active view
  eyebrow: string;
  question: string;
  helper?: string;
  options: AnswerOption[];
  contextPlaceholder: string;
}

export interface SubmittedAnswer {
  questionId: string;
  questionText: string;
  optionId: string;
  optionText: string;
  context?: string;
  trait?: string;
}

export type Confidence = "low" | "moderate" | "high";

export interface BlindSpot {
  title: string;
  pattern: string;
  relatedAnswers: string[];
  everydayImpact: string;
  howToNotice: string;
}

export interface Contradiction {
  valuedThing: string;
  observedBehavior: string;
  possibleContradiction: string;
  wayForward: string;
}

export interface SevenDayPlanItem {
  day: number;
  title: string;
  action: string;
  minutes: number;
  purpose: string;
}

export interface AnalysisResult {
  portrait: {
    title: string;
    summary: string;
    supportingAnswers: string[];
    confidence: Confidence;
  };
  honestTruth: {
    title: string;
    observation: string;
    supportingAnswers: string[];
    reasoning: string;
    confidence: Confidence;
  };
  strength: {
    title: string;
    description: string;
    supportingAnswers: string[];
    howToUseIt: string;
  };
  blindSpots: BlindSpot[];
  contradictions: Contradiction[];
  behaviorPattern: {
    stages: string[];
    explanation: string;
  };
  stopDoing: { action: string; reason: string };
  startDoing: { action: string; reason: string };
  priorities: string[];
  next24Hours: { action: string; purpose: string };
  sevenDayPlan: SevenDayPlanItem[];
  thirtyDayExperiment: {
    focusArea: string;
    behavior: string;
    frequency: string;
    successLooksLike: string;
    ifYouMissADay: string;
    howProgressIsEvaluated: string;
  };
  finalNote: string;
}

export interface ReportRecord {
  id: string;
  name: string;
  answers: SubmittedAnswer[];
  analysis: AnalysisResult;
  source: "ai" | "demo";
  isDemo: boolean;
  patternConfirmed: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export type ThemeId = "paper" | "ink" | "terra" | "moss";
export type ColorMode = "system" | "light" | "dark";
export type FontPairingId = "editorial" | "literary" | "modern" | "humanist";
export type RadiusScale = "sharp" | "balanced" | "soft";
export type GlassIntensity = "subtle" | "balanced" | "deep" | "crystal";
export type MotionPreference = "fluid" | "reduced";

export const VALUE_DIMENSIONS = [
  "Independence",
  "Creativity",
  "Stability",
  "Connection",
  "Achievement",
  "Freedom",
  "Contribution",
  "Learning",
] as const;

export type ValueDimension = (typeof VALUE_DIMENSIONS)[number];
