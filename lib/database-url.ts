// The Postgres connection string. Vercel's Neon integration names it
// DATABASE_URL, but can also add POSTGRES_URL, or prefix both when a custom
// prefix is chosen (e.g. STORAGE_DATABASE_URL). Keep in sync with scripts/migrate.mjs.
export function databaseUrl(env: NodeJS.ProcessEnv = process.env): string | undefined {
  if (env.DATABASE_URL) return env.DATABASE_URL;
  if (env.POSTGRES_URL) return env.POSTGRES_URL;
  const key = Object.keys(env)
    .sort()
    .find((k) => /_(DATABASE_URL|POSTGRES_URL)$/.test(k) && env[k]);
  return key ? env[key] : undefined;
}
