import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { generateDeepenQuestions } from "@/lib/ai/analyze";
import type { AnalysisResult, SubmittedAnswer } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

// "Go Deeper": produces three personalized follow-up questions generated
// from the user's own report, targeting uncertainty the six answers left open.
export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const [row] = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
  if (!row) return NextResponse.json({ error: "Report not found." }, { status: 404 });

  const analysis = row.analysis as AnalysisResult;
  const answers = row.answers as SubmittedAnswer[];
  const outcome = await generateDeepenQuestions(row.name, answers, analysis.honestTruth?.observation ?? "");
  return NextResponse.json(outcome);
}
