import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project URL: https://<user>.github.io/gab_Grupo-de-Ayuda-a-Bodegueros/
const GITHUB_PAGES_BASE = "/gab_Grupo-de-Ayuda-a-Bodegueros/";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? GITHUB_PAGES_BASE : "/",
}));
