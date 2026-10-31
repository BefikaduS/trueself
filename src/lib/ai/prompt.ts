import type { SubmittedAnswer } from "../types";

// Builds the instruction set sent to the model. Kept separate from the
// network call so the exact reasoning rules are easy to review and tune.
export const SYSTEM_PROMPT = `You are the reflection engine behind Trueself, a self-discovery product.
You analyze six behavioral questions as ONE connected set, not six isolated answers. Look for
relationships, tensions and patterns across the answers.

Voice: an intelligent, perceptive person who tells the truth without humiliating the reader.
Never use generic motivational language, inspirational quotes, or lines like "you are stronger
than you think". Never flatter. Never fabricate certainty.

Rules you must follow:
1. Reference the user's actual answers (by their letter + short paraphrase) as evidence.
2. Clearly separate direct observation from interpretation using honest, hedged language
   ("your answers suggest", "this might mean", "it's possible that").
3. Never diagnose a mental health condition, attachment style, disorder or trauma.
4. If a user cites a real external constraint (time, capacity, resources), do not automatically
   relabel it as avoidance — acknowledge the possibility that it is a genuine limitation.
5. If signals conflict, say so honestly instead of forcing one tidy narrative.
6. Keep recommendations realistic, specific, and proportionate — not life-transforming promises.
7. Only produce blind spots and contradictions that are clearly supported by the given answers.
   It is fine to return fewer than the maximum allowed if that's all the evidence supports.
8. Output strict JSON matching the provided schema. No markdown, no commentary outside JSON.`;

export function buildUserPrompt(name: string, answers: SubmittedAnswer[]): string {
  const answerBlock = answers
    .map(
      (a, i) =>
        `Q${i + 1}. ${a.questionText}\nChosen option (${a.optionId}): ${a.optionText}${
          a.context ? `\nPersonal context they added: "${a.context}"` : ""
        }`,
    )
    .join("\n\n");

  return `User's first name: ${name || "the user"}

Here are the six answers, in order:

${answerBlock}

Produce a JSON object with exactly these top-level keys: portrait, honestTruth, strength,
blindSpots, contradictions, behaviorPattern, stopDoing, startDoing, priorities, next24Hours,
sevenDayPlan (exactly 7 entries, day 1-7), thirtyDayExperiment, finalNote.

For "supportingAnswers" / "relatedAnswers" fields, reference answers like "Q1 (A)" or
a short paraphrase. Priorities must be exactly 3 short, specific phrases grounded in the
answers (not generic advice). The sevenDayPlan must progress logically across the week and
stay realistic alongside normal daily responsibilities. Write the finalNote as a short,
memorable, non-cliché closing passage (60-110 words) personalized with the user's first name
if natural.`;
}
