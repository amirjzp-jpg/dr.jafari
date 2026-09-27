import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname),
      // `server-only` throws outside React Server Components; tests run on the server anyway.
      "server-only": path.resolve(import.meta.dirname, "tests/server-only-stub.ts"),
    },
  },
  test: {
    environment: "node",
    globalSetup: ["tests/global-setup.ts"],
    fileParallelism: false,
    testTimeout: 20_000,
    hookTimeout: 20_000,
    env: {
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? "postgres://dev:dev@localhost/drjafari_test",
      DATABASE_POOL_MAX: "25",
    },
  },
});
