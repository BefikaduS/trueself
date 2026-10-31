import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { dailyCheckins } from "@/db/schema";

export async function GET(req: NextRequest) {
  const anonymousId = req.nextUrl.searchParams.get("anonymousId");
  if (!anonymousId) return NextResponse.json({ error: "anonymousId is required." }, { status: 400 });
  const rows = await db
    .select()
    .from(dailyCheckins)
    .where(eq(dailyCheckins.anonymousId, anonymousId))
    .orderBy(sql`${dailyCheckins.checkinDate} desc`);
  return NextResponse.json({ checkins: rows });
}

// One check-in per day per visitor: if today's entry exists, it's updated
// instead of duplicated.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const anonymousId = (body.anonymousId ?? "").toString();
  const checkinDate = (body.checkinDate ?? "").toString();
  if (!anonymousId || !checkinDate) {
    return NextResponse.json({ error: "anonymousId and checkinDate are required." }, { status: 400 });
  }

  const values = {
    energyDrain: typeof body.energyDrain === "string" ? body.energyDrain.slice(0, 300) : null,
    wentWell: typeof body.wentWell === "string" ? body.wentWell.slice(0, 300) : null,
    avoiding: typeof body.avoiding === "string" ? body.avoiding.slice(0, 300) : null,
  };

  const [existing] = await db
    .select()
    .from(dailyCheckins)
    .where(and(eq(dailyCheckins.anonymousId, anonymousId), eq(dailyCheckins.checkinDate, checkinDate)))
    .limit(1);

  if (existing) {
    const [row] = await db.update(dailyCheckins).set(values).where(eq(dailyCheckins.id, existing.id)).returning();
    return NextResponse.json({ checkin: row });
  }
  const [row] = await db.insert(dailyCheckins).values({ anonymousId, checkinDate, ...values }).returning();
  return NextResponse.json({ checkin: row });
}
