#!/usr/bin/env python3
"""Appels DataForSEO ciblés pour la rédaction (Canada, français).

Les identifiants sont lus dans le .mcp.json du projet SEO (jamais copiés ici).
Chaque commande affiche son coût et le solde restant.

  python3 scripts/redaction/dfs.py balance
  python3 scripts/redaction/dfs.py overview "mot-clé 1" "mot-clé 2" ...   (~0,01 $ + 0,0001 $/mot-clé)
  python3 scripts/redaction/dfs.py serp "mot-clé"                        (~0,004 $, top 20 + PAA + aperçu IA)
  python3 scripts/redaction/dfs.py ideas "mot-clé" [limite]              (~0,01 $ + 0,0001 $/résultat)
"""
import base64, json, os, sys, urllib.error, urllib.request

MCP_JSON = os.environ.get("DFS_MCP_JSON", os.path.expanduser("~/4-agents-SEO-Claude-Code/.mcp.json"))
LOC = {"location_code": 2124, "language_code": "fr"}


def _auth():
    env = json.load(open(MCP_JSON))["mcpServers"]["dfs-mcp"]["env"]
    raw = f'{env["DATAFORSEO_USERNAME"]}:{env["DATAFORSEO_PASSWORD"]}'.encode()
    return "Basic " + base64.b64encode(raw).decode()


def call(path, payload=None):
    req = urllib.request.Request(
        "https://api.dataforseo.com/v3/" + path,
        data=None if payload is None else json.dumps(payload).encode(),
        headers={"Authorization": _auth(), "Content-Type": "application/json"},
        method="GET" if payload is None else "POST",
    )
    try:
        return json.load(urllib.request.urlopen(req, timeout=120))
    except urllib.error.HTTPError as e:
        sys.exit(f"Erreur DataForSEO {e.code} : {e.read()[:300].decode(errors='ignore')}")


def balance():
    return call("appendix/user_data")["tasks"][0]["result"][0]["money"]["balance"]


def overview(kws):
    d = call("dataforseo_labs/google/keyword_overview/live", [{"keywords": kws, **LOC, "include_serp_info": True}])
    rows = []
    for it in d["tasks"][0]["result"][0]["items"] or []:
        ki, kp = it.get("keyword_info") or {}, it.get("keyword_properties") or {}
        si, sv = it.get("search_intent_info") or {}, it.get("serp_info") or {}
        rows.append({
            "keyword": it["keyword"], "volume": ki.get("search_volume"), "cpc": ki.get("cpc"),
            "kd": kp.get("keyword_difficulty"), "intent": si.get("main_intent"),
            "serp": sv.get("serp_item_types") or [],
        })
    rows.sort(key=lambda r: -(r["volume"] or 0))
    print(json.dumps(rows, ensure_ascii=False, indent=1))
    return d["cost"]


def serp(kw):
    d = call("serp/google/organic/live/advanced", [{"keyword": kw, **LOC, "device": "desktop", "depth": 20, "people_also_ask_click_depth": 1}])
    r = d["tasks"][0]["result"][0]
    print("Éléments SERP :", ", ".join(r.get("item_types") or []))
    for it in r["items"]:
        if it["type"] == "organic":
            print(f'{it["rank_group"]:>2}. {it.get("domain")} | {it.get("title")} | {it.get("url")}')
        elif it["type"] == "people_also_ask":
            for q in it.get("items") or []:
                print("PAA :", q.get("title"))
        elif it["type"] == "paid":
            print("Annonce :", it.get("domain"))
    return d["cost"]


def ideas(kw, limit=50):
    d = call("dataforseo_labs/google/keyword_ideas/live", [{"keywords": [kw], **LOC, "limit": int(limit)}])
    for it in d["tasks"][0]["result"][0]["items"] or []:
        ki = it.get("keyword_info") or {}
        print(f'{ki.get("search_volume") or 0:>6} | cpc {ki.get("cpc")} | {it["keyword"]}')
    return d["cost"]


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    cmd, args = sys.argv[1], sys.argv[2:]
    cost = {"balance": lambda: 0, "overview": lambda: overview(args), "serp": lambda: serp(args[0]),
            "ideas": lambda: ideas(*args)}[cmd]()
    print(f"\nCoût de l'appel : {cost} $ | Solde DataForSEO : {balance()} $")
