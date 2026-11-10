// Build estático (Firebase Hosting, Vercel ou qualquer hospedagem de arquivos).
// `npm run build` gera ./dist/client e copia o resultado para ./dist-static.
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// SITE_BASE é o caminho em que o site é publicado (ex.: "/colchoes/").
// O build central (scripts/build.mjs na raiz do repositório) define essa variável;
// sem ela o site roda na raiz, como no `npm run dev`.
export default defineConfig({
  base: process.env.SITE_BASE ?? "/",
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
      pages: [{ path: "/" }],
      prerender: { enabled: true, autoStaticPathsDiscovery: false },
    }),
    viteReact(),
  ],
});
