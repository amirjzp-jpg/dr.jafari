// Plain JS so scripts/migrate.mjs can share it with the app without a build step.

/**
 * The Postgres connection string. Vercel's Neon integration names it
 * DATABASE_URL, but can also add POSTGRES_URL, or prefix both when a custom
 * prefix is chosen (e.g. STORAGE_DATABASE_URL). SSL is normalized with
 * strictSslMode().
 *
 * @param {Record<string, string | undefined>} [env]
 * @returns {string | undefined}
 */
export function databaseUrl(env = process.env) {
  const prefixed = Object.keys(env)
    .sort()
    .find((k) => /_(DATABASE_URL|POSTGRES_URL)$/.test(k) && env[k]);
  const url = env.DATABASE_URL || env.POSTGRES_URL || (prefixed && env[prefixed]) || undefined;
  return url && strictSslMode(url);
}

// pg already treats these as verify-full and warns on every connection that a
// future major version will weaken them to libpq semantics. Asking for
// verify-full explicitly keeps today's behavior and silences the warning.
const LEGACY_SSL_MODES = new Set(["prefer", "require", "verify-ca"]);

/**
 * Rewrites sslmode=prefer|require|verify-ca to sslmode=verify-full. Leaves
 * every other URL untouched, including an explicit opt-in to libpq semantics
 * (uselibpqcompat=true), sslmode=disable and URLs without sslmode.
 *
 * @param {string} url
 * @returns {string}
 */
export function strictSslMode(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return url; // Let pg report a malformed URL itself.
  }
  const mode = parsed.searchParams.get("sslmode");
  if (!mode || !LEGACY_SSL_MODES.has(mode) || parsed.searchParams.get("uselibpqcompat") === "true") return url;
  parsed.searchParams.set("sslmode", "verify-full");
  return parsed.toString();
}
