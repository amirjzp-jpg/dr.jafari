import { describe, expect, it } from "vitest";
import { databaseUrl, strictSslMode } from "@/lib/database-url.mjs";

describe("strictSslMode", () => {
  it.each(["prefer", "require", "verify-ca"])("upgrades sslmode=%s to verify-full", (mode) => {
    const url = `postgres://u:p@ep-x.neon.tech/db?sslmode=${mode}&channel_binding=require`;
    expect(strictSslMode(url)).toBe("postgres://u:p@ep-x.neon.tech/db?sslmode=verify-full&channel_binding=require");
  });

  it.each([
    "postgres://u:p@localhost/db",
    "postgres://u:p@localhost/db?sslmode=disable",
    "postgres://u:p@host/db?sslmode=verify-full",
    "postgres://u:p@host/db?uselibpqcompat=true&sslmode=require",
    "not a url",
  ])("leaves %s untouched", (url) => {
    expect(strictSslMode(url)).toBe(url);
  });

  it("keeps credentials with special characters intact", () => {
    const url = "postgres://user:p%40ss%2Fw0rd@host:5432/db?sslmode=require";
    const out = new URL(strictSslMode(url));
    expect(decodeURIComponent(out.password)).toBe("p@ss/w0rd");
    expect(out.port).toBe("5432");
    expect(out.searchParams.get("sslmode")).toBe("verify-full");
  });
});

describe("databaseUrl", () => {
  it("prefers DATABASE_URL, then POSTGRES_URL, then a prefixed name", () => {
    expect(databaseUrl({ DATABASE_URL: "postgres://a/db", POSTGRES_URL: "postgres://b/db" })).toBe("postgres://a/db");
    expect(databaseUrl({ POSTGRES_URL: "postgres://b/db", X_DATABASE_URL: "postgres://c/db" })).toBe("postgres://b/db");
    expect(databaseUrl({ STORAGE_DATABASE_URL: "postgres://c/db" })).toBe("postgres://c/db");
    expect(databaseUrl({ DATABASE_URL: "" })).toBeUndefined();
  });

  it("normalizes sslmode", () => {
    expect(databaseUrl({ DATABASE_URL: "postgres://a/db?sslmode=require" })).toBe("postgres://a/db?sslmode=verify-full");
  });
});
