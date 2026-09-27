// Applies db/migrations/*.sql in order, once each. Runs before `next build` on
// deploy; skipped when DATABASE_URL is not set so local builds work without a DB.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("[migrate] DATABASE_URL not set, skipping migrations.");
  process.exit(0);
}

const dir = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "db", "migrations");
const client = new pg.Client({ connectionString: url });
await client.connect();

try {
  // Serialize concurrent deploys.
  await client.query("SELECT pg_advisory_lock(726354)");
  await client.query(
    "CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
  );
  const { rows } = await client.query("SELECT version FROM schema_migrations");
  const applied = new Set(rows.map((r) => r.version));
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await readFile(path.join(dir, file), "utf8");
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(`[migrate] applied ${file}`);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  }
  console.log("[migrate] up to date.");
} finally {
  await client.end();
}
