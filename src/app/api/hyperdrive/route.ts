import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Minimal safe ping verifying Hyperdrive connection without exposing tables or secrets
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({
      status: "connected",
      message: "Hyperdrive database connection verified",
    });
  } catch (error) {
    console.error("[Hyperdrive Diagnostic] Connection check failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      {
        status: "unavailable",
        message: "Database connection failed",
      },
      { status: 503 }
    );
  }
}
