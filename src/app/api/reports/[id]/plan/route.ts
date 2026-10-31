import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { planProgress } from "@/db/schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const rows = await db.select().from(planProgress).where(eq(planProgress.reportId, id));
  return NextResponse.json({ items: rows });
}

// Upserts completion state for one plan item (24h action / day-N / 30-day
// experiment). Missing a day never produces an error — it's just a note.
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const itemKey = (body.itemKey ?? "").toString();
  if (!itemKey) return NextResponse.json({ error: "itemKey is required." }, { status: 400 });

  const [existing] = await db
    .select()
    .from(planProgress)
    .where(and(eq(planProgress.reportId, id), eq(planProgress.itemKey, itemKey)))
    .limit(1);

  const values = {
    completed: Boolean(body.completed),
    skippedReason: typeof body.skippedReason === "string" ? body.skippedReason.slice(0, 280) : null,
    note: typeof body.note === "string" ? body.note.slice(0, 500) : null,
    updatedAt: new Date(),
  };

  if (existing) {
    const [row] = await db.update(planProgress).set(values).where(eq(planProgress.id, existing.id)).returning();
    return NextResponse.json({ item: row });
  }

  const [row] = await db
    .insert(planProgress)
    .values({ reportId: id, itemKey, ...values })
    .returning();
  return NextResponse.json({ item: row });
}
