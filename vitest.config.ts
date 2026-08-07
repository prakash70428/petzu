import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * No Vite plugins on purpose.
 *
 * These tests cover the pure logic layer (utils, schemas) — plain
 * TypeScript, no JSX, no DOM. Pulling in `@vitejs/plugin-react` bought
 * nothing and introduced an ESM/CJS conflict with Vitest's config
 * loader. The `@/*` alias is declared directly instead, which is one
 * line and has no dependency surface.
 *
 * Component and end-to-end tests are a separate concern needing jsdom or
 * Playwright — see PHASE-1.md "Future improvements".
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
  },
});
