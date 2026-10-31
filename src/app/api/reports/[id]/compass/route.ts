import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { valuesCompass } from "@/db/schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const [row] = await db.select().from(valuesCompass).where(eq(valuesCompass.reportId, id)).limit(1);
  return NextResponse.json({ weights: row?.weights ?? null });
}

// Saves the user's own adjustments to their Values Compass. The AI-derived
// starting weights are only a suggestion — this endpoint always stores
// exactly what the user set.
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, any>;
  if (!body.weights || typeof body.weights !== "object") {
    return NextResponse.json({ error: "weights object is required." }, { status: 400 });
  }

  const [existing] = await db.select().from(valuesCompass).where(eq(valuesCompass.reportId, id)).limit(1);
  if (existing) {
    const [row] = await db
      .update(valuesCompass)
      .set({ weights: body.weights, updatedAt: new Date() })
      .where(eq(valuesCompass.id, existing.id))
      .returning();
    return NextResponse.json({ weights: row.weights });
  }
  const [row] = await db.insert(valuesCompass).values({ reportId: id, weights: body.weights }).returning();
  return NextResponse.json({ weights: row.weights });
}
