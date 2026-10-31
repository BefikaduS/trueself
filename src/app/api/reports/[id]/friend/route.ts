import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { friendPerspectives, reports } from "@/db/schema";

type Params = { params: Promise<{ id: string }> };

// A friend submits a short, structured, non-anonymous perspective. The
// report owner decides whether to reveal/save it — this is never an open
// anonymous feedback box.
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const [report] = await db.select({ id: reports.id }).from(reports).where(eq(reports.id, id)).limit(1);
  if (!report) return NextResponse.json({ error: "This invitation link is no longer valid." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const fromName = (body.fromName ?? "").toString().trim().slice(0, 60);
  const underestimatedStrength = (body.underestimatedStrength ?? "").toString().trim().slice(0, 400);
  const deservesMoreCredit = (body.deservesMoreCredit ?? "").toString().trim().slice(0, 400);
  const improvementSuggestion = (body.improvementSuggestion ?? "").toString().trim().slice(0, 400);

  if (!fromName || !underestimatedStrength || !deservesMoreCredit || !improvementSuggestion) {
    return NextResponse.json({ error: "Please fill in all four fields, including your name." }, { status: 400 });
  }

  const [row] = await db
    .insert(friendPerspectives)
    .values({ reportId: id, fromName, underestimatedStrength, deservesMoreCredit, improvementSuggestion })
    .returning();

  return NextResponse.json({ perspective: row });
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const rows = await db.select().from(friendPerspectives).where(eq(friendPerspectives.reportId, id));
  return NextResponse.json({ perspectives: rows });
}
