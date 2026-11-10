// Copia o build do cliente (dist/client) para dist-static, a pasta publicada
// pelo Firebase Hosting e pela Vercel. Funciona em Windows, macOS e Linux.
import { cpSync, rmSync } from "node:fs";

rmSync("dist-static", { recursive: true, force: true });
cpSync("dist/client", "dist-static", { recursive: true });
console.log("dist-static atualizado.");
