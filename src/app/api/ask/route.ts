import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { reports } from "@/db/schema";
import type { AnalysisResult, SubmittedAnswer } from "@/lib/types";

// In-memory rate limiting map: 10 requests per 60 seconds per IP
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(identifier) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(identifier, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(identifier, validTimestamps);

  // Clean up stale entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, times] of rateLimitMap.entries()) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitMap.delete(key);
      }
    }
  }

  return false;
}

// "Ask Trueself": a small, scoped reflection interface — not a general
// chatbot. It only ever reasons over the user's own saved report.
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "client";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many reflection requests. Please pause for a moment." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const body = await req.json().catch(() => ({}));
  const reportId = (body.reportId ?? "").toString();
  const question = (body.question ?? "").toString().trim().slice(0, 500);
  if (!reportId || !question) {
    return NextResponse.json({ error: "reportId and question are required." }, { status: 400 });
  }

  const [row] = await db.select().from(reports).where(eq(reports.id, reportId)).limit(1);
  if (!row) return NextResponse.json({ error: "Report not found." }, { status: 404 });

  const analysis = row.analysis as AnalysisResult;
  const answers = row.answers as SubmittedAnswer[];
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      answer: `AI follow-up isn't connected in this environment, so here's what's already in your report: ${analysis.honestTruth.observation} If you want to revisit this, the "Go Deeper" and improvement plan sections are built directly from the same six answers.`,
      source: "demo",
    });
  }

  try {
    const system = `You are Trueself's reflection assistant. Answer ONLY using the user's saved report and
answers below as context. Clearly separate what the user told you from your own interpretation.
Be direct, warm, and brief (120 words max). Never diagnose. If the user disagrees with part of
their report, acknowledge their own read is more authoritative than the inference.`;
    const user = `Report context:\n${JSON.stringify(analysis)}\n\nOriginal answers:\n${answers
      .map((a) => `${a.questionText} -> ${a.optionText}`)
      .join("\n")}\n\nUser's question: ${question}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.TRUESELF_AI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.6,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Ask request failed (${res.status})`);
    const data = await res.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error("Empty answer from model");
    return NextResponse.json({ answer, source: "ai" });
  } catch (error) {
    console.error("Ask Trueself failed", error);
    return NextResponse.json({
      answer:
        "We couldn't reach the AI service just now. Your report is unaffected — try again in a moment, or revisit the Honest Truth and Patterns sections in your report directly.",
      source: "error",
    });
  }
}
