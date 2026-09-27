import pg from "pg";
import { databaseUrl } from "./database-url";

// One pool per server instance, reused across hot reloads in development.
const globalForPool = globalThis as unknown as { __pgPool?: pg.Pool };

export function pool(): pg.Pool {
  if (!globalForPool.__pgPool) {
    const connectionString = databaseUrl();
    if (!connectionString) throw new Error("DATABASE_URL is not set");
    globalForPool.__pgPool = new pg.Pool({
      connectionString,
      max: Number(process.env.DATABASE_POOL_MAX ?? 5),
      idleTimeoutMillis: 10_000,
    });
  }
  return globalForPool.__pgPool;
}

export type Db = pg.Pool | pg.PoolClient;

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = [],
  db: Db = pool(),
): Promise<pg.QueryResult<T>> {
  return db.query<T>(text, params);
}

/**
 * Runs `fn` in a transaction; rolls back on any error. Deadlocks and
 * serialization failures are retried: concurrent inserts into the exclusion
 * constraint's index can deadlock, and Postgres then aborts one side. The
 * retry sees the winner's committed row and fails cleanly with 23P01.
 */
export async function tx<T>(fn: (client: pg.PoolClient) => Promise<T>, attempts = 4): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    const client = await pool().connect();
    try {
      await client.query("BEGIN");
      const result = await fn(client);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK").catch(() => {});
      const code = pgCode(err);
      if ((code === PG.deadlock || code === PG.serializationFailure) && attempt < attempts) {
        await new Promise((r) => setTimeout(r, 10 + Math.random() * 40 * attempt));
        continue;
      }
      throw err;
    } finally {
      client.release();
    }
  }
}

/** Postgres error codes we handle explicitly. */
export const PG = {
  exclusionViolation: "23P01",
  uniqueViolation: "23505",
  checkViolation: "23514",
  deadlock: "40P01",
  serializationFailure: "40001",
} as const;

export function pgCode(err: unknown): string | undefined {
  return typeof err === "object" && err !== null && "code" in err ? String((err as { code: unknown }).code) : undefined;
}
