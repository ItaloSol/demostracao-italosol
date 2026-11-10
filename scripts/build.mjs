// Monta a pasta ./public publicada no Firebase Hosting:
//   hub/            -> /            (página inicial com a lista de demonstrações)
//   sites/<nicho>/  -> /<nicho>/    (um site por pasta)
//
// Site com package.json: instala as dependências e roda `npm run build` com
// SITE_BASE="/<nicho>/"; o resultado é lido de dist-static, dist/client, dist ou build
// (ou do campo "saida" do demo.json). Site sem package.json: a pasta é copiada como está.
//
// Uso: node scripts/build.mjs            (todos os sites)
//      node scripts/build.mjs petshop    (reconstrói só os sites informados)
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sitesDir = join(root, "sites");
const outDir = join(root, "public");
const only = process.argv.slice(2);
const RESERVED = new Set(["assets", "hub", "__"]);
const SKIP = new Set(["demo.json", "README.md", "node_modules"]);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const readJson = (file) => (existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {});

const slugs = readdirSync(sitesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

for (const slug of slugs) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || RESERVED.has(slug)) {
    throw new Error(`Nome de pasta inválido em sites/: "${slug}". Use minúsculas, números e hífen (ex.: "odontologia").`);
  }
}
for (const slug of only) {
  if (!slugs.includes(slug)) throw new Error(`Site não encontrado: sites/${slug}`);
}

if (only.length === 0) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const demos = [];
for (const slug of slugs) {
  const dir = join(sitesDir, slug);
  const meta = readJson(join(dir, "demo.json"));
  demos.push({ slug, ordem: 100, titulo: slug, descricao: "", ...meta });
  if (only.length > 0 && !only.includes(slug)) continue;

  const dest = join(outDir, slug);
  rmSync(dest, { recursive: true, force: true });

  if (existsSync(join(dir, "package.json"))) {
    console.log(`\n== ${slug}: build ==`);
    const run = (cmd) =>
      execSync(cmd, { cwd: dir, stdio: "inherit", env: { ...process.env, SITE_BASE: `/${slug}/` } });
    if (process.env.CI || !existsSync(join(dir, "node_modules"))) {
      run(existsSync(join(dir, "package-lock.json")) ? "npm ci --no-audit --no-fund" : "npm install --no-audit --no-fund");
    }
    run("npm run build");
    const built = [meta.saida, "dist-static", "dist/client", "dist", "build"]
      .filter(Boolean)
      .map((p) => join(dir, p))
      .find((p) => existsSync(join(p, "index.html")));
    if (!built) throw new Error(`${slug}: o build não gerou um index.html (informe "saida" no demo.json).`);
    cpSync(built, dest, { recursive: true });
  } else {
    console.log(`\n== ${slug}: cópia (site estático) ==`);
    if (!existsSync(join(dir, "index.html"))) throw new Error(`${slug}: falta o index.html.`);
    cpSync(dir, dest, {
      recursive: true,
      filter: (src) => src === dir || !(SKIP.has(basename(src)) || basename(src).startsWith(".")),
    });
  }
}

// Hub: copia a pasta hub/ para a raiz e preenche a lista de demonstrações.
cpSync(join(root, "hub"), outDir, { recursive: true });
const cards = demos
  .filter((d) => !d.oculto)
  .sort((a, b) => a.ordem - b.ordem || a.titulo.localeCompare(b.titulo, "pt-BR"))
  .map(
    (d) => `      <a class="card" href="/${d.slug}/">
        <span class="path">/${d.slug}</span>
        <h2>${esc(d.titulo)}</h2>
        <p>${esc(d.descricao)}</p>
        <span class="go">Abrir demonstração <span aria-hidden="true">→</span></span>
      </a>`,
  )
  .join("\n");
const hubFile = join(outDir, "index.html");
writeFileSync(hubFile, readFileSync(hubFile, "utf8").replace("<!--DEMOS-->", cards));

console.log(`\nPronto: ./public com ${demos.length} demonstração(ões): ${demos.map((d) => "/" + d.slug).join(", ")}`);
