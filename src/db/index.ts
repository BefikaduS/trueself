import { cache } from "react";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type TrueselfDb = NodePgDatabase<typeof schema>;

declare global {
  interface CloudflareEnv {
    HYPERDRIVE?: {
      connectionString: string;
    };
  }
}

/**
 * Resolves the database connection string:
 * 1. In Cloudflare Workers (production/preview), retrieves the Hyperdrive
 *    accelerated connection string from the OpenNext request context.
 * 2. In local development or node scripts, uses process.env.DATABASE_URL.
 */
export function getConnectionString(): string {
  // 1. Attempt to retrieve Hyperdrive from OpenNext Cloudflare request context
  try {
    // Dynamic require so local Node / Next build without OpenNext context does not fail
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const cf = getCloudflareContext({ async: false });
    if (cf?.env?.HYPERDRIVE?.connectionString) {
      return cf.env.HYPERDRIVE.connectionString;
    }
  } catch {
    // Expected outside of Cloudflare Worker request lifecycle (e.g. local build/dev)
  }

  // 2. Fall back to environment variables (for local dev, tests, or containerized environments)
  if (typeof process !== "undefined" && process.env) {
    if (process.env.HYPERDRIVE_URL) {
      return process.env.HYPERDRIVE_URL;
    }
    if ((process.env as any).HYPERDRIVE?.connectionString) {
      return (process.env as any).HYPERDRIVE.connectionString;
    }
    if (process.env.DATABASE_URL) {
      return process.env.DATABASE_URL;
    }
  }

  return "";
}

/**
 * Request-scoped database client factory using React cache().
 * Following OpenNext and Cloudflare guidance:
 * - A single Pool with max: 1 is created per request lifecycle.
 * - Cloudflare Hyperdrive manages global connection pooling at the edge.
 * - Prevents cross-request connection leaks and stale sockets across Worker isolates.
 */
export const getDb = cache((): TrueselfDb => {
  const connectionString = getConnectionString();

  if (!connectionString) {
    const errorMsg =
      process.env.NODE_ENV === "production"
        ? "[Trueself DB] Hyperdrive database binding is missing in Cloudflare request context."
        : "[Trueself DB] DATABASE_URL is not set in environment or .env.local.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const pool = new Pool({
    connectionString,
    max: 1, // Hyperdrive manages connection pooling globally
    connectionTimeoutMillis: 5000,
  });

  return drizzle(pool, { schema });
});

/**
 * Transparent proxy for `db` ensuring all existing call sites (`import { db } from "@/db"`)
 * resolve through the request-scoped `getDb()` factory.
 */
export const db: TrueselfDb = new Proxy({} as TrueselfDb, {
  get(_target, prop) {
    const instance = getDb();
    const value = (instance as any)[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

export default db;
