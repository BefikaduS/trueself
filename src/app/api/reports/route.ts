import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { reportCounters, reports } from "@/db/schema";
import { analyzeAssessment } from "@/lib/ai/analyze";
import type { SubmittedAnswer } from "@/lib/types";

// Minimal request validation. We purposely avoid sending anything beyond
// the six answers + optional context + first name to the AI service.
function isValidAnswers(answers: unknown): answers is SubmittedAnswer[] {
  return (
    Array.isArray(answers) &&
    answers.length === 6 &&
    answers.every(
      (a) =>
        a &&
        typeof a.questionId === "string" &&
        typeof a.questionText === "string" &&
        typeof a.optionId === "string" &&
        typeof a.optionText === "string",
    )
  );
}

export async function POST(req: NextRequest) {
  let body: { name?: string; answers?: unknown; anonymousId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = (body.name ?? "").toString().trim().slice(0, 60);
  const anonymousId = (body.anonymousId ?? "").toString().trim();

  if (!name) return NextResponse.json({ error: "A name is required." }, { status: 400 });
  if (!anonymousId) return NextResponse.json({ error: "Missing anonymous session id." }, { status: 400 });
  if (!isValidAnswers(body.answers)) {
    return NextResponse.json({ error: "All six answers are required before an assessment can be analyzed." }, { status: 400 });
  }

  const answers = body.answers.map((a) => ({
    questionId: a.questionId,
    questionText: a.questionText,
    optionId: a.optionId,
    optionText: a.optionText,
    context: typeof a.context === "string" ? a.context.slice(0, 500) : undefined,
  }));

  try {
    const outcome = await analyzeAssessment(name, answers);

    const [row] = await db
      .insert(reports)
      .values({
        anonymousId,
        name,
        answers,
        analysis: outcome.analysis,
        source: outcome.source,
        isDemo: outcome.isDemo,
      })
      .returning();

    await db
      .insert(reportCounters)
      .values({ anonymousId, totalReports: 1 })
      .onConflictDoUpdate({
        target: reportCounters.anonymousId,
        set: { totalReports: sql`${reportCounters.totalReports} + 1` },
      });

    return NextResponse.json({ id: row.id, analysis: outcome.analysis, source: outcome.source, isDemo: outcome.isDemo, warning: outcome.warning });
  } catch (error) {
    console.error("Failed to create report", error);
    return NextResponse.json(
      { error: "We couldn't finish your reflection this time. Your answers are safe — please try again." },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const anonymousId = req.nextUrl.searchParams.get("anonymousId");
  if (!anonymousId) return NextResponse.json({ error: "anonymousId is required." }, { status: 400 });

  const rows = await db
    .select({
      id: reports.id,
      name: reports.name,
      analysis: reports.analysis,
      isDemo: reports.isDemo,
      createdAt: reports.createdAt,
    })
    .from(reports)
    .where(eq(reports.anonymousId, anonymousId))
    .orderBy(sql`${reports.createdAt} desc`);

  return NextResponse.json({
    reports: rows.map((r) => ({
      id: r.id,
      name: r.name,
      isDemo: r.isDemo,
      createdAt: r.createdAt,
      portraitTitle: (r.analysis as { portrait?: { summary?: string } })?.portrait?.summary?.slice(0, 120) ?? "",
    })),
  });
}
