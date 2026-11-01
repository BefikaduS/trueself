// @ts-nocheck
import { Client } from "pg";

export default {
  async fetch(request, env, ctx) {
    const connectionString = env?.HYPERDRIVE?.connectionString || process.env.DATABASE_URL;
    if (!connectionString) {
      return Response.json({ error: "No connection string found" }, { status: 500 });
    }

    const client = new Client({ connectionString });
    await client.connect();

    try {
      await client.query("SELECT 1");
      await client.end();
      return Response.json({ status: "connected" });
    } catch (e) {
      try { await client.end(); } catch {}
      return Response.json({ error: e instanceof Error ? e.message : "Database connection error" }, { status: 500 });
    }
  },
};
