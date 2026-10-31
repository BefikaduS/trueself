import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { personalNotes } from "@/db/schema";

export async function GET(req: NextRequest) {
  const anonymousId = req.nextUrl.searchParams.get("anonymousId");
  if (!anonymousId) return NextResponse.json({ error: "anonymousId is required." }, { status: 400 });
  const rows = await db
    .select()
    .from(personalNotes)
    .where(eq(personalNotes.anonymousId, anonymousId))
    .orderBy(sql`${personalNotes.updatedAt} desc`);
  return NextResponse.json({ notes: rows });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, any>;
  const anonymousId = (body.anonymousId ?? "").toString();
  const title = (body.title ?? "").toString().trim().slice(0, 120);
  const bodyText = (body.body ?? "").toString().trim().slice(0, 2000);
  const category = (body.category ?? "note").toString().slice(0, 40);
  const linkedInsight = body.linkedInsight ? body.linkedInsight.toString().slice(0, 200) : null;

  if (!anonymousId || !title || !bodyText) {
    return NextResponse.json({ error: "Title and note content are required." }, { status: 400 });
  }

  const [row] = await db
    .insert(personalNotes)
    .values({ anonymousId, title, body: bodyText, category, linkedInsight })
    .returning();
  return NextResponse.json({ note: row });
}
