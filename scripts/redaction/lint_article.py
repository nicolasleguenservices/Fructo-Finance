#!/usr/bin/env python3
"""Contrôle qualité d'un article MDX selon le brief Fructo Finance (Partie A + B).

  python3 scripts/redaction/lint_article.py chemin/article.mdx [--publication]

--publication : mode strict avant mise en ligne (image présente, aucun « à confirmer »).
Code de sortie 1 si au moins une erreur bloquante.
"""
import json, re, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PILLARS = ("investir", "cartes-credit", "epargne")


def plain(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


STOP = {"au", "aux", "le", "la", "les", "de", "des", "du", "d", "l", "en", "et", "ou", "a", "un", "une", "pour"}


def has_kw(kwp, text):
    """Tous les mots significatifs du mot-clé présents (ordre libre, sans accents)."""
    toks = [t for t in re.findall(r"[a-z0-9]+", kwp) if t not in STOP]
    t = plain(text)
    return bool(toks) and all(re.search(rf"\b{re.escape(k)}", t) for k in toks)


def words(s):
    return re.findall(r"[\wÀ-ÿ'’-]+", s)


def field(fm, name):
    m = re.search(rf'^{name}:\s*"?(.*?)"?\s*$', fm, re.M)
    return m.group(1).strip() if m else None


def main():
    path = Path(sys.argv[1])
    strict = "--publication" in sys.argv
    src = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", src, re.S)
    if not m:
        sys.exit("Frontmatter introuvable")
    fm, body = m.groups()
    errors, warns, ok = [], [], []

    def check(cond, msg, level=errors):
        (ok if cond else level).append(msg)

    title, meta_title = field(fm, "title") or "", field(fm, "meta_title") or ""
    desc, slug, kw = field(fm, "description") or "", field(fm, "slug") or "", field(fm, "keyword") or ""
    pillar, cover, alt = field(fm, "pillar"), field(fm, "coverImage") or "", field(fm, "coverAlt") or ""
    kwp = plain(kw)

    check(bool(kw), "keyword renseigné")
    tag = meta_title or title
    check(len(tag) <= 60, f"<title> ≤ 60 car. ({len(tag)})")
    check(has_kw(kwp, tag), "mot-clé dans le <title>")
    check(140 <= len(desc) <= 165, f"meta description 150-160 car. ({len(desc)})")
    first_sentence = re.split(r"(?<=[.!?:])\s", desc)[0]
    check(has_kw(kwp, first_sentence), "mot-clé dans la 1re phrase de la description / chapô")
    check(bool(re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", slug)), f"slug minuscules-tirets sans accents ({slug})")
    check(len(slug) <= 60, "slug court (≤ 60 car.)", warns)
    n_h1 = len(words(title))
    check(7 <= n_h1 <= 10, f"H1 de 7 à 10 mots ({n_h1})")
    check(has_kw(kwp, title), "mot-clé dans le H1")
    check(pillar in PILLARS, f"pilier valide ({pillar})")
    check("hasAffiliateLinks: false" in fm, "hasAffiliateLinks: false (aucune commission à ce jour)")
    check(bool(field(fm, "datePublished")) and bool(field(fm, "dateModified")), "dates de publication et de mise à jour")
    check(bool(re.fullmatch(r"/images/blog/[a-z0-9-]+\.webp", cover)), f"coverImage en /images/blog/*.webp ({cover})")
    check(0 < len(alt) < 100, f"coverAlt < 100 car. ({len(alt)})")
    n_faq = len(re.findall(r"^\s*- question:", fm, re.M))
    check(n_faq >= 3, f"FAQ (≥ 3 questions) : {n_faq}")

    text = re.sub(r"^(import|export) .*$", "", body, flags=re.M)
    text = re.sub(r"\{[\s\S]*?\n\}", "", text)  # blocs JSX
    prose = re.sub(r"<[^>]+>", "", text)
    n_words = len(words(prose))
    check(800 <= n_words <= 1500, f"longueur 800-1500 mots ({n_words})")
    check(not re.search(r"^# ", text, re.M), "aucun H1 dans le corps (le H1 vient du title)")
    n_h2 = len(re.findall(r"^## ", text, re.M))
    check(n_h2 >= 3, f"au moins 3 H2 ({n_h2})")

    paras = [p.strip() for p in re.split(r"\n\s*\n", prose) if p.strip() and not p.strip().startswith("#")]
    seen, anchored = 0, None
    for p in paras:
        n = len(words(p))
        if 150 <= n <= 200 and seen <= 300:
            anchored = n
            break
        seen += n
    check(anchored is not None, "passage ancré de 150-200 mots dans les 300 premiers mots")

    check("—" not in src, "aucun tiret cadratin (—)")
    check(bool(re.search(rf"\]\(/(?:{'|'.join(PILLARS)})/?\)", text)), "lien vers une page pilier")
    n_internal = len(set(re.findall(r"\]\((/(?:blog|investir|cartes-credit|epargne)[^)]*)\)", text)))
    check(n_internal >= 3, f"maillage interne (≥ 3 liens internes distincts) : {n_internal}", warns)
    check(bool(re.search(r"^Sources\s*:", text, re.M)), "ligne « Sources : » présente")
    check(bool(re.search(r"Vérifié en", text)), "mention « Vérifié en <mois année> »")
    check("Nicolas Le Guen" in text, "bloc auteur « Nicolas Le Guen, fondateur de Fructo Finance »")
    check(bool(re.search(r"professionnel inscrit (?:à|auprès de) l'AMF", text)), "renvoi à un professionnel inscrit à l'AMF")

    todo = len(re.findall(r"à confirmer|\[TK", src, re.I))
    if strict:
        check(todo == 0, f"aucune donnée « à confirmer » ({todo})")
        check((ROOT / "public" / cover.lstrip("/")).exists(), f"image de couverture présente ({cover})")
    elif todo:
        warns.append(f"{todo} mention(s) « à confirmer » à lever avant publication")

    for s in ok:
        print("  OK   ", s)
    for s in warns:
        print("  AVERT", s)
    for s in errors:
        print("  ERREUR", s)
    print(f"\n{len(errors)} erreur(s), {len(warns)} avertissement(s)")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
