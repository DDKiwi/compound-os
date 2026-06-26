import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
   test: {
      environment: "node",
      include: ["src/**/*.test.ts"],
   },
   plugins: [react(), tailwindcss()],
});
