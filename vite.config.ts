/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import pwa from "./vite.config.pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy(), pwa()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          ionic: ["@ionic/react"],
        },
      },
    },
  },
});
