import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Perform a minimal, real database ping through the active database access layer
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    // Log structured message on server without leaking details to response
    console.error("[Health Check] Database connectivity check failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      {
        status: "error",
        database: "unavailable",
      },
      { status: 503 }
    );
  }
}
