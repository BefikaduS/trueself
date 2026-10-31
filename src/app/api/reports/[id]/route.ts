import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  friendInvitations,
  friendPerspectives,
  planProgress,
  reports,
  valuesCompass,
} from "@/db/schema";

type Params = { params: Promise<{ id: string }> };

function getCallerAnonymousId(req: NextRequest, body?: any): string {
  return (
    req.headers.get("x-anonymous-id") ||
    req.nextUrl.searchParams.get("anonymousId") ||
    body?.anonymousId ||
    ""
  ).toString().trim();
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const [row] = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
  if (!row) return NextResponse.json({ error: "Report not found." }, { status: 404 });
  return NextResponse.json({ report: row });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const [existing] = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Report not found." }, { status: 404 });

  const callerId = getCallerAnonymousId(req, body);
  // If caller provided an anonymousId, enforce ownership; or if it's the pattern confirmation
  if (callerId && existing.anonymousId && callerId !== existing.anonymousId) {
    return NextResponse.json({ error: "Unauthorized to modify this report." }, { status: 403 });
  }

  const update: Partial<typeof reports.$inferInsert> = { updatedAt: new Date() };
  if (typeof body.patternConfirmed === "boolean") update.patternConfirmed = body.patternConfirmed;

  const [row] = await db.update(reports).set(update).where(eq(reports.id, id)).returning();
  return NextResponse.json({ report: row });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const [existing] = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Report not found." }, { status: 404 });

  const callerId = getCallerAnonymousId(req);
  if (!callerId || callerId !== existing.anonymousId) {
    return NextResponse.json(
      { error: "Unauthorized: You can only delete your own reports." },
      { status: 403 }
    );
  }

  await db.delete(planProgress).where(eq(planProgress.reportId, id));
  await db.delete(valuesCompass).where(eq(valuesCompass.reportId, id));
  await db.delete(friendPerspectives).where(eq(friendPerspectives.reportId, id));
  await db.delete(friendInvitations).where(eq(friendInvitations.reportId, id));
  await db.delete(reports).where(eq(reports.id, id));

  return NextResponse.json({ ok: true });
}
