// Copyright © 2026 Christopher Snow
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  base: process.env.BASE_PATH ?? "/bit-lab/",
  plugins: [react()],
  build: { target: "es2022", sourcemap: true },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
