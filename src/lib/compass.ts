import { VALUE_DIMENSIONS, type SubmittedAnswer, type ValueDimension } from "./types";

// Produces a *starting suggestion* for the Values Compass based on which
// options the user picked. This is explicitly a heuristic clue, not a
// validated measurement — the UI always lets the user override it.
const WEIGHT_HINTS: Record<string, Partial<Record<ValueDimension, number>>> = {
  "natural-self:A": { Creativity: 25, Achievement: 10 },
  "natural-self:B": { Learning: 25 },
  "natural-self:C": { Connection: 25 },
  "natural-self:D": { Stability: 25 },
  "natural-self:E": { Freedom: 10 },
  "natural-self:F": { Stability: 10, Freedom: 10 },
  "response-to-difficulty:A": { Achievement: 20 },
  "response-to-difficulty:B": { Freedom: 10 },
  "response-to-difficulty:C": { Learning: 15 },
  "response-to-difficulty:D": { Achievement: 15, Freedom: 10 },
  "response-to-difficulty:E": { Connection: 20 },
  "response-to-difficulty:F": { Contribution: 15, Achievement: 10 },
  "the-excuse:A": { Freedom: -10, Stability: 10 },
  "the-excuse:B": { Achievement: 10 },
  "the-excuse:C": { Freedom: 10 },
  "the-excuse:D": { Independence: -10, Connection: 10 },
  "the-excuse:E": { Independence: -10 },
  "the-excuse:F": { Stability: 15 },
  "emotional-reflex:A": { Independence: 15 },
  "emotional-reflex:B": { Learning: 10 },
  "emotional-reflex:C": { Connection: 15 },
  "emotional-reflex:D": { Independence: 10 },
  "emotional-reflex:E": { Contribution: 10 },
  "emotional-reflex:F": { Connection: 20 },
  "real-success:A": { Creativity: 20, Independence: 10 },
  "real-success:B": { Freedom: 20 },
  "real-success:C": { Connection: 20 },
  "real-success:D": { Contribution: 10, Stability: 10 },
  "real-success:E": { Independence: 20 },
  "real-success:F": { Stability: 10 },
  "future-responsibility:A": { Freedom: 10 },
  "future-responsibility:B": { Achievement: 15 },
  "future-responsibility:C": { Learning: 10 },
  "future-responsibility:D": { Independence: 15 },
  "future-responsibility:E": { Connection: 10 },
  "future-responsibility:F": { Independence: 10 },
  "future-responsibility:G": { Stability: 15 },
};

export function suggestValueWeights(answers: SubmittedAnswer[]): Record<ValueDimension, number> {
  const base: Record<ValueDimension, number> = Object.fromEntries(VALUE_DIMENSIONS.map((d) => [d, 50])) as Record<
    ValueDimension,
    number
  >;

  for (const answer of answers) {
    const hint = WEIGHT_HINTS[`${answer.questionId}:${answer.optionId}`];
    if (!hint) continue;
    for (const [dim, delta] of Object.entries(hint)) {
      base[dim as ValueDimension] = Math.max(0, Math.min(100, base[dim as ValueDimension] + (delta ?? 0)));
    }
  }
  return base;
}
