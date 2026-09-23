/**
 * Chemin public d'une page, sans l'extension ajoutée par `build.format: "file"`.
 * "/a-propos.html" -> "/a-propos", "/index.html" -> "/", "/blog/x" -> "/blog/x".
 */
export default function pagePath(pathname: string): string {
  return pathname.replace(/\.html$/, "").replace(/\/index$/, "") || "/";
}
