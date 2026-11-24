import { Pool, QueryResult, QueryResultRow } from "pg";
import { env } from "../config/env";

export const pool = new Pool({
  ...env.database,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// Prevents the process from crashing on idle client errors.
pool.on("error", (err) => {
  console.error("Unexpected error on idle DB client:", err);
});

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

/** Returns true if the database answers a trivial query. */
export async function isDbConnected(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (err) {
    console.error("DB health check failed:", err);
    return false;
  }
}

export async function closeDb(): Promise<void> {
  await pool.end();
}
