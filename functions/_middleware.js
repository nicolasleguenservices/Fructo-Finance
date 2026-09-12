/**
 * Cloudflare Pages Function — middleware globale
 *
 * Redirige (301) le domaine par défaut `finance-quebec.pages.dev` vers le
 * domaine de production `fructofinance.ca`, en conservant le chemin et la
 * chaîne de requête. Évite le contenu dupliqué dans l'index Google.
 *
 * Ne touche PAS aux URL de prévisualisation (ex.
 * abc123.finance-quebec-v2.pages.dev) : seul le hostname exact ci-dessous
 * est concerné, pour ne pas casser les previews de branches/déploiements.
 */

const PAGES_DEV_HOST = "finance-quebec.pages.dev";
const CANONICAL_ORIGIN = "https://fructofinance.ca";

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === PAGES_DEV_HOST) {
    return Response.redirect(
      `${CANONICAL_ORIGIN}${url.pathname}${url.search}`,
      301,
    );
  }

  return context.next();
}
