/**
 * Cloudflare Pages Function — POST /api/subscribe
 *
 * Ajoute une adresse courriel à la liste de diffusion Odoo « Infolettre Fructo
 * Finance » (modèle `mailing.contact` rattaché à une `mailing.list`).
 *
 * Aucun identifiant en dur : tout est lu depuis les variables d'environnement
 * Cloudflare (Pages → Settings → Variables and Secrets) :
 *   - ODOO_URL      ex. https://fructofinance.odoo.com
 *   - ODOO_DB       ex. fructofinance
 *   - ODOO_LOGIN    adresse du compte Odoo
 *   - ODOO_API_KEY  clé API Odoo  → à définir comme SECRET chiffré
 *   - ODOO_LIST_ID  id numérique de la liste de diffusion cible
 *
 * Le client ne reçoit jamais de détail technique Odoo ni de secret : uniquement
 * un message court en français (succès ou erreur générique).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Réponse JSON standard. */
function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

/** Appel JSON-RPC générique vers Odoo (`/jsonrpc`, méthode `call`). */
async function odooCall(baseUrl, params) {
  const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/jsonrpc`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "call", params }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();
  if (data.error) {
    const message =
      data.error?.data?.message || data.error?.message || "RPC error";
    throw new Error(message);
  }
  return data.result;
}

export async function onRequestPost({ request, env }) {
  const { ODOO_URL, ODOO_DB, ODOO_LOGIN, ODOO_API_KEY, ODOO_LIST_ID } = env;

  if (
    !ODOO_URL ||
    !ODOO_DB ||
    !ODOO_LOGIN ||
    !ODOO_API_KEY ||
    !ODOO_LIST_ID
  ) {
    console.error(
      "subscribe: variables d'environnement Odoo manquantes (ODOO_URL/DB/LOGIN/API_KEY/LIST_ID)",
    );
    return json(500, {
      ok: false,
      error: "Le service d'inscription n'est pas configuré.",
    });
  }

  // --- Lecture + validation de la requête ------------------------------------
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, error: "Requête invalide." });
  }

  const email = String(payload?.email ?? "").trim().toLowerCase();
  const consent = payload?.consent === true;
  const honeypot = String(payload?.company ?? "").trim(); // champ piège anti-bot

  // Bot détecté : on renvoie un faux succès sans rien faire.
  if (honeypot) {
    return json(200, { ok: true, message: "Merci, vous êtes inscrit !" });
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json(400, { ok: false, error: "Adresse courriel invalide." });
  }

  if (!consent) {
    return json(400, {
      ok: false,
      error: "Vous devez accepter de recevoir l'infolettre pour vous inscrire.",
    });
  }

  const listId = Number(ODOO_LIST_ID);
  if (!Number.isInteger(listId) || listId <= 0) {
    console.error("subscribe: ODOO_LIST_ID invalide:", ODOO_LIST_ID);
    return json(500, {
      ok: false,
      error: "Le service d'inscription n'est pas configuré.",
    });
  }

  // --- Dialogue avec Odoo ---------------------------------------------------
  try {
    const uid = await odooCall(ODOO_URL, {
      service: "common",
      method: "authenticate",
      args: [ODOO_DB, ODOO_LOGIN, ODOO_API_KEY, {}],
    });

    if (!uid) {
      console.error("subscribe: authentification Odoo refusée");
      return json(502, {
        ok: false,
        error: "Service temporairement indisponible. Réessayez plus tard.",
      });
    }

    const execKw = (model, method, args, kwargs = {}) =>
      odooCall(ODOO_URL, {
        service: "object",
        method: "execute_kw",
        args: [ODOO_DB, uid, ODOO_API_KEY, model, method, args, kwargs],
      });

    // Contact déjà présent ? (évite les doublons)
    const existing = await execKw(
      "mailing.contact",
      "search_read",
      [[["email", "=ilike", email]], ["id", "list_ids"]],
      { limit: 1 },
    );

    if (Array.isArray(existing) && existing.length > 0) {
      const contact = existing[0];
      const lists = Array.isArray(contact.list_ids) ? contact.list_ids : [];

      if (lists.includes(listId)) {
        return json(200, {
          ok: true,
          message: "Vous êtes déjà inscrit à l'infolettre.",
        });
      }

      // Contact connu mais pas encore dans cette liste → on l'y ajoute.
      await execKw("mailing.contact", "write", [
        [contact.id],
        { list_ids: [[4, listId]] },
      ]);
      return json(200, { ok: true, message: "Merci, vous êtes inscrit !" });
    }

    // Nouveau contact.
    await execKw("mailing.contact", "create", [
      { email, list_ids: [[4, listId]] },
    ]);

    return json(200, { ok: true, message: "Merci, vous êtes inscrit !" });
  } catch (err) {
    console.error("subscribe: échec Odoo —", err?.message || err);
    return json(502, {
      ok: false,
      error:
        "Impossible de finaliser l'inscription pour le moment. Réessayez plus tard.",
    });
  }
}
