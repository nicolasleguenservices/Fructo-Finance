#!/usr/bin/env node
/**
 * Test manuel de la connexion Odoo — À LANCER EN LOCAL UNIQUEMENT.
 * Ne JAMAIS committer la clé API : elle se passe en variable d'environnement
 * du terminal, pas dans un fichier.
 *
 * Exemples :
 *
 *   # 1. Authentifier + lister les listes de diffusion (pour trouver l'ID)
 *   ODOO_URL=https://fructofinance.odoo.com \
 *   ODOO_DB=fructofinance \
 *   ODOO_LOGIN=vous@exemple.com \
 *   ODOO_API_KEY=xxxxxxxxxxxx \
 *   node scripts/odoo-test.mjs
 *
 *   # 2. Créer un contact test dans une liste donnée
 *   ODOO_URL=... ODOO_DB=... ODOO_LOGIN=... ODOO_API_KEY=... \
 *   node scripts/odoo-test.mjs --create test+infolettre@exemple.com --list-id 3
 *
 * Node 18+ requis (fetch natif).
 */

const { ODOO_URL, ODOO_DB, ODOO_LOGIN, ODOO_API_KEY } = process.env;

if (!ODOO_URL || !ODOO_DB || !ODOO_LOGIN || !ODOO_API_KEY) {
  console.error(
    "Variables manquantes. Requis : ODOO_URL, ODOO_DB, ODOO_LOGIN, ODOO_API_KEY.",
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const getFlag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const createEmail = getFlag("--create");
const listIdArg = getFlag("--list-id");

async function rpc(params) {
  const res = await fetch(`${ODOO_URL.replace(/\/+$/, "")}/jsonrpc`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "call", params }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) {
    console.error(JSON.stringify(data.error, null, 2));
    throw new Error(data.error?.data?.message || data.error.message || "RPC error");
  }
  return data.result;
}

const main = async () => {
  console.log(`→ Authentification sur ${ODOO_URL} (db=${ODOO_DB}, login=${ODOO_LOGIN})…`);
  const uid = await rpc({
    service: "common",
    method: "authenticate",
    args: [ODOO_DB, ODOO_LOGIN, ODOO_API_KEY, {}],
  });

  if (!uid) {
    console.error("✗ Authentification refusée. Vérifie ODOO_DB, ODOO_LOGIN et la clé API.");
    process.exit(1);
  }
  console.log(`✓ Authentifié — uid = ${uid}\n`);

  const execKw = (model, method, mArgs, kwargs = {}) =>
    rpc({
      service: "object",
      method: "execute_kw",
      args: [ODOO_DB, uid, ODOO_API_KEY, model, method, mArgs, kwargs],
    });

  if (createEmail) {
    if (!listIdArg) {
      console.error("✗ --create nécessite aussi --list-id <ID>.");
      process.exit(1);
    }
    const listId = Number(listIdArg);
    console.log(`→ Création du contact « ${createEmail} » dans la liste ${listId}…`);
    const id = await execKw("mailing.contact", "create", [
      { email: createEmail, list_ids: [[4, listId]] },
    ]);
    console.log(`✓ mailing.contact créé — id = ${id}`);
    const [check] = await execKw(
      "mailing.contact",
      "search_read",
      [[["id", "=", id]], ["id", "email", "list_ids"]],
    );
    console.log(check);
    return;
  }

  console.log("→ Listes de diffusion (mailing.list) :\n");
  const lists = await execKw(
    "mailing.list",
    "search_read",
    [[], ["id", "name", "contact_count"]],
    { order: "id asc" },
  );
  if (!lists.length) {
    console.log("  (aucune liste — crée-la dans Odoo : Email Marketing → Listes de diffusion)");
  }
  for (const l of lists) {
    console.log(`  id=${l.id}\tcontacts=${l.contact_count ?? "?"}\t${l.name}`);
  }
  console.log(
    "\n→ Reporte l'id de « Infolettre Fructo Finance » dans la variable Cloudflare ODOO_LIST_ID.",
  );
};

main().catch((err) => {
  console.error("\n✗ Échec :", err.message);
  process.exit(1);
});
