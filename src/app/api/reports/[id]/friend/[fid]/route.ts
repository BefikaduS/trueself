import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { friendPerspectives } from "@/db/schema";

type Params = { params: Promise<{ id: string; fid: string }> };

// The report owner toggles whether a received perspective is revealed/saved.
export async function PATCH(req: NextRequest, { params }: Params) {
  const { fid } = await params;
  const body = await req.json().catch(() => ({}));
  if (typeof body.revealed !== "boolean") {
    return NextResponse.json({ error: "revealed boolean is required." }, { status: 400 });
  }
  const [row] = await db
    .update(friendPerspectives)
    .set({ revealed: body.revealed })
    .where(eq(friendPerspectives.id, fid))
    .returning();
  if (!row) return NextResponse.json({ error: "Perspective not found." }, { status: 404 });
  return NextResponse.json({ perspective: row });
}
