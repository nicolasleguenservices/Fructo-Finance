import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "../dist");
const redirectsPath = path.join(distDir, "_redirects");

// Avec build.format: "file", chaque route produit un fichier plat
// (page.html) plutôt qu'un dossier avec index.html : Cloudflare Pages sert
// alors /page en 200 directement (voir astro.config.mjs pour le pourquoi).
//
// Cloudflare a longtemps servi la variante AVEC slash final en 200 (index de
// dossier) et 308-redirigé la variante sans slash — l'inverse de ce que le
// site déclare partout (sitemap, canonicals, liens internes). Des moteurs de
// recherche ou des liens externes ont donc pu indexer/mémoriser la variante
// avec slash. Ce script ajoute une redirection 301 "avec slash → sans slash"
// pour chaque page générée, afin que ces anciennes URL ne deviennent pas de
// simples 404 après le passage à build.format: "file".
function collectHtmlRoutes(dir, base = "") {
  const routes = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      routes.push(...collectHtmlRoutes(full, `${base}/${entry.name}`));
    } else if (entry.name.endsWith(".html") && entry.name !== "404.html") {
      const routePath =
        entry.name === "index.html"
          ? base
          : `${base}/${entry.name.slice(0, -".html".length)}`;
      if (routePath) routes.push(routePath);
    }
  }
  return routes;
}

const routes = collectHtmlRoutes(distDir).sort();
const rules = routes.map((route) => `${route}/ ${route} 301`);

fs.appendFileSync(redirectsPath, "\n" + rules.join("\n") + "\n");
console.log(
  `[generateSlashRedirects] ${rules.length} redirection(s) "avec slash → sans slash" ajoutée(s) à dist/_redirects`,
);
