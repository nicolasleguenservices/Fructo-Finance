/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Relaie le formulaire de contact (/contact/) vers Web3Forms
 * (https://web3forms.com), qui envoie le message à l'adresse liée à la
 * clé d'accès (configurée sur web3forms.com, ex. fructofinance@gmail.com).
 *
 * La clé Web3Forms n'est jamais exposée au navigateur : elle est lue depuis
 * les variables d'environnement Cloudflare (Pages → Settings → Variables
 * and Secrets) :
 *   - WEB3FORMS_KEY  clé d'accès Web3Forms → à définir comme SECRET chiffré
 *
 * Le client ne reçoit jamais de détail technique Web3Forms : uniquement un
 * message court en français (succès ou erreur générique).
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

export async function onRequestPost({ request, env }) {
  const { WEB3FORMS_KEY } = env;

  if (!WEB3FORMS_KEY) {
    console.error("contact: variable d'environnement WEB3FORMS_KEY manquante");
    return json(500, {
      ok: false,
      error: "Le service de contact n'est pas configuré.",
    });
  }

  // --- Lecture + validation de la requête ------------------------------------
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, error: "Requête invalide." });
  }

  const name = String(payload?.name ?? "").trim();
  const email = String(payload?.email ?? "").trim().toLowerCase();
  const phone = String(payload?.phone ?? "").trim();
  const message = String(payload?.message ?? "").trim();
  const honeypot = String(payload?.botcheck ?? "").trim(); // champ piège anti-bot

  // Bot détecté : on renvoie un faux succès sans rien envoyer.
  if (honeypot) {
    return json(200, { ok: true, message: "Merci, votre message a été envoyé !" });
  }

  if (!name || name.length > 200) {
    return json(400, { ok: false, error: "Veuillez indiquer votre nom." });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json(400, { ok: false, error: "Adresse courriel invalide." });
  }
  if (!message || message.length > 5000) {
    return json(400, { ok: false, error: "Veuillez rédiger un message." });
  }

  // --- Relais vers Web3Forms --------------------------------------------------
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: "Nouveau message depuis fructofinance.ca",
        from_name: name,
        name,
        email,
        phone,
        message,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      console.error("contact: échec Web3Forms —", data?.message || res.status);
      return json(502, {
        ok: false,
        error: "Impossible d'envoyer le message pour le moment. Réessayez plus tard.",
      });
    }

    return json(200, { ok: true, message: "Merci, votre message a été envoyé !" });
  } catch (err) {
    console.error("contact: échec Web3Forms —", err?.message || err);
    return json(502, {
      ok: false,
      error: "Impossible d'envoyer le message pour le moment. Réessayez plus tard.",
    });
  }
}
