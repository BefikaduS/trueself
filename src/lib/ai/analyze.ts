import { analysisSchema, deepenSchema, type ValidatedAnalysis, type ValidatedDeepen } from "./schema";
import { buildUserPrompt, SYSTEM_PROMPT } from "./prompt";
import { generateDemoAnalysis } from "./demo";
import type { SubmittedAnswer } from "../types";

export interface AnalyzeOutcome {
  analysis: ValidatedAnalysis;
  source: "ai" | "demo";
  isDemo: boolean;
  warning?: string;
}

const MODEL = process.env.TRUESELF_AI_MODEL || "gpt-4o-mini";

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`OpenAI request failed (${res.status}): ${text.slice(0, 300)}`);
    }

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("OpenAI response did not include message content");
    }
    return JSON.parse(content);
  } finally {
    clearTimeout(timeout);
  }
}

// Runs the AI analysis for a completed assessment. Falls back to a
// clearly-labeled demo analysis whenever no API key is configured or the
// request/validation fails, so the product always works end-to-end.
export async function analyzeAssessment(name: string, answers: SubmittedAnswer[]): Promise<AnalyzeOutcome> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return { analysis: generateDemoAnalysis(name, answers), source: "demo", isDemo: true };
  }

  try {
    const raw = await callOpenAI(SYSTEM_PROMPT, buildUserPrompt(name, answers));
    const parsed = analysisSchema.safeParse(raw);
    if (!parsed.success) {
      console.error("AI analysis failed schema validation", parsed.error.flatten());
      return {
        analysis: generateDemoAnalysis(name, answers),
        source: "demo",
        isDemo: true,
        warning: "The AI response didn't match the expected structure, so a demo analysis was shown instead.",
      };
    }
    return { analysis: parsed.data, source: "ai", isDemo: false };
  } catch (error) {
    console.error("AI analysis request failed", error);
    return {
      analysis: generateDemoAnalysis(name, answers),
      source: "demo",
      isDemo: true,
      warning: "We couldn't reach the AI service, so a demo analysis was shown instead. Your answers are safe.",
    };
  }
}

export interface DeepenOutcome {
  result: ValidatedDeepen;
  source: "ai" | "demo";
}

export async function generateDeepenQuestions(
  name: string,
  answers: SubmittedAnswer[],
  honestTruth: string,
): Promise<DeepenOutcome> {
  const apiKey = process.env.OPENAI_API_KEY;
  const demo: ValidatedDeepen = {
    questions: [
      {
        id: "obstacle-type",
        question: `Your answers suggest starting things you care about can feel difficult, ${name || "friend"}. Is the bigger obstacle fear of getting it wrong, uncertainty about the next step, or a lack of available energy?`,
        reason: "Your six answers leave this genuinely open.",
        options: ["Fear of getting it wrong", "Uncertainty about the next step", "Lack of available energy", "None of these quite fit"],
      },
      {
        id: "support-style",
        question: "When you're stuck, do you usually want someone to help you think it through, or space to work it out alone first?",
        reason: "This affects how your 7-day plan should be structured.",
        options: ["Help thinking it through", "Space to work it out alone", "Depends on the situation"],
      },
      {
        id: "closest-truth",
        question: "Looking back at your honest truth, how close does it actually land?",
        reason: "Your own read matters more than our inference.",
        options: ["It's accurate", "Partly accurate", "It misses something important"],
      },
    ],
  };

  if (!apiKey) return { result: demo, source: "demo" };

  try {
    const system = `You generate exactly 3 short, personalized follow-up questions for a self-reflection product called Trueself.
Base them on the user's six answers and their "honest truth" result below. Target genuine uncertainty the six answers leave open.
Output strict JSON: { "questions": [{ "id": string, "question": string, "reason": string, "options": string[2-5] }] } with exactly 3 items.`;
    const user = `Name: ${name}\n\nAnswers:\n${answers
      .map((a) => `${a.questionText} -> ${a.optionText}${a.context ? ` (context: ${a.context})` : ""}`)
      .join("\n")}\n\nHonest truth already given: ${honestTruth}`;
    const raw = await callOpenAI(system, user);
    const parsed = deepenSchema.safeParse(raw);
    if (!parsed.success) return { result: demo, source: "demo" };
    return { result: parsed.data, source: "ai" };
  } catch (error) {
    console.error("Deepen generation failed", error);
    return { result: demo, source: "demo" };
  }
}
