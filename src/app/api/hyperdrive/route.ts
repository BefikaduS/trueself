import { NextResponse } from "next/server";
import { Client } from "pg";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

export async function GET() {
  let connectionString =
    process.env.HYPERDRIVE_URL || process.env.DATABASE_URL || "";

  try {
    const cf = await getCloudflareContext();
    if ((cf?.env as any)?.HYPERDRIVE?.connectionString) {
      connectionString = (cf.env as any).HYPERDRIVE.connectionString;
    }
  } catch {
    // Falls back to environment variables when running in standard local development
  }

  if (!connectionString) {
    return NextResponse.json(
      { error: "No database connection string found in env.HYPERDRIVE or DATABASE_URL" },
      { status: 500 }
    );
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();
    // Sample SQL query
    const result = await client.query("SELECT * FROM pg_tables LIMIT 50;");
    await client.end();

    return NextResponse.json({
      success: true,
      result: result.rows,
    });
  } catch (e: any) {
    try {
      await client.end();
    } catch {
      // ignore
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

