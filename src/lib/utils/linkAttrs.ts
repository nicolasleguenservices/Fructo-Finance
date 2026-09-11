import config from "@/config/config.json";

function safeHostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

// Domaines considérés comme "internes" (maillage) : le domaine configuré (base_url)
// + le domaine de production, au cas où config.json ne serait pas à jour.
const INTERNAL_HOSTS = new Set(
  [safeHostname(config.site.base_url), "fructofinance.ca"].filter(
    (host): host is string => Boolean(host),
  ),
);

/** Vrai si `href` pointe vers un autre domaine que fructofinance.ca. */
export function isExternalUrl(href: string | undefined | null): boolean {
  if (!href) return false;
  if (
    href.startsWith("#") ||
    href.startsWith("/") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }
  const hostname = safeHostname(href);
  if (!hostname) return false; // URL relative ou invalide -> traitée comme interne
  return !INTERNAL_HOSTS.has(hostname);
}

/**
 * Attributs `target`/`rel` à appliquer à un lien externe (nouvel onglet).
 * Conserve un éventuel `rel` déjà présent (ex. "sponsored") et y ajoute noopener/noreferrer.
 */
export function externalLinkAttrs(existingRel?: string | null) {
  const rel = new Set((existingRel ?? "").split(/\s+/).filter(Boolean));
  rel.add("noopener");
  rel.add("noreferrer");
  return { target: "_blank" as const, rel: Array.from(rel).join(" ") };
}

/** Retourne les attributs `target`/`rel` corrects selon que `href` est interne ou externe. */
export function linkAttrsFor(href: string | undefined | null, existingRel?: string | null) {
  if (isExternalUrl(href)) {
    return externalLinkAttrs(existingRel);
  }
  return { target: undefined, rel: existingRel || undefined };
}
