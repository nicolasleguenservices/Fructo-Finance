#!/usr/bin/env python3
"""Requêtes Search Console (sc-domain:fructofinance.ca), gratuites.

À lancer avec le Python de mcp-gsc (authentification déjà faite) :
  ~/seo-tools/mcp-gsc/.venv/bin/python scripts/redaction/gsc.py [--page /cartes-credit] [--contient "world elite"] [--jours 90]
"""
import argparse, datetime as dt, os, sys

sys.path.insert(0, os.path.expanduser("~/seo-tools/mcp-gsc"))
from gsc_server import get_gsc_service  # noqa: E402

p = argparse.ArgumentParser()
p.add_argument("--page", default="")
p.add_argument("--contient", default="")
p.add_argument("--jours", type=int, default=90)
p.add_argument("--limite", type=int, default=60)
a = p.parse_args()

end = dt.date.today() - dt.timedelta(days=2)
body = {"startDate": str(end - dt.timedelta(days=a.jours)), "endDate": str(end),
        "dimensions": ["query", "page"], "rowLimit": 1000}
rows = get_gsc_service().searchanalytics().query(siteUrl="sc-domain:fructofinance.ca", body=body).execute().get("rows", [])
rows = [r for r in rows if a.page in r["keys"][1] and a.contient.lower() in r["keys"][0].lower()]
print(f"{len(rows)} lignes ({body['startDate']} au {body['endDate']})")
for r in sorted(rows, key=lambda r: -r["impressions"])[: a.limite]:
    print(f'{r["impressions"]:>5} imp | {r["clicks"]:>3} clics | pos {r["position"]:>5.1f} | {r["keys"][0]} | {r["keys"][1].replace("https://fructofinance.ca", "")}')
