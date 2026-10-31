import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { personalNotes } from "@/db/schema";

type Params = { params: Promise<{ id: string }> };

function getCallerAnonymousId(req: NextRequest, body?: any): string {
  return (
    req.headers.get("x-anonymous-id") ||
    req.nextUrl.searchParams.get("anonymousId") ||
    body?.anonymousId ||
    ""
  ).toString().trim();
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, any>;

  const [existing] = await db.select().from(personalNotes).where(eq(personalNotes.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Note not found." }, { status: 404 });

  const callerId = getCallerAnonymousId(req, body);
  if (callerId && callerId !== existing.anonymousId) {
    return NextResponse.json({ error: "Unauthorized to edit this note." }, { status: 403 });
  }

  const update: Partial<typeof personalNotes.$inferInsert> = { updatedAt: new Date() };
  if (typeof body.title === "string") update.title = body.title.trim().slice(0, 120);
  if (typeof body.body === "string") update.body = body.body.trim().slice(0, 2000);
  if (typeof body.category === "string") update.category = body.category.slice(0, 40);
  if (typeof body.linkedInsight === "string") update.linkedInsight = body.linkedInsight.slice(0, 200);

  const [row] = await db.update(personalNotes).set(update).where(eq(personalNotes.id, id)).returning();
  return NextResponse.json({ note: row });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const [existing] = await db.select().from(personalNotes).where(eq(personalNotes.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Note not found." }, { status: 404 });

  const callerId = getCallerAnonymousId(req);
  if (callerId && callerId !== existing.anonymousId) {
    return NextResponse.json({ error: "Unauthorized to delete this note." }, { status: 403 });
  }

  await db.delete(personalNotes).where(eq(personalNotes.id, id));
  return NextResponse.json({ ok: true });
}
