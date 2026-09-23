# Brief : système d'agents de rédaction Fructo Finance

Source de vérité pour les agents `fructo-*` (.claude/agents) et les skills `nouvel-article` / `publier-article`.
Projet : ~/finance-quebec-v2 (Astro, Cloudflare Pages via GitHub). NE JAMAIS toucher à la v1 (~/finance-quebec).

## Principe directeur (non négociable, site YMYL finance)
- Agents autonomes pour tout le travail (sujet, recherche, vérification, rédaction, images, balises), MAIS arrêt OBLIGATOIRE avant publication.
- Rien n'est commité ni poussé sans validation humaine explicite.
- Aucune donnée chiffrée (taux, frais, primes, plafonds) publiée sans vérification à une source officielle datée. Donnée non confirmée = SIGNALÉE (« à confirmer »), jamais inventée.
- Cohérence obligatoire avec products.json (30 fiches) et les articles déjà en ligne.

## Partie A : règles SEO de chaque article
- Reproduire structure et forme des articles de src/content/blog/.
- Title (meta_title) ≤ 60 caractères, avec le mot-clé principal.
- Meta description ~150-160 caractères, mot-clé dans la 1re phrase, incitative.
- Slug court, minuscules-avec-tirets, sans accents, avec le mot-clé.
- H1 unique (champ title), 7-10 mots, avec le mot-clé.
- Chapô court (150-300 caractères), mot-clé dans la 1re phrase. Dans le gabarit, le chapô affiché sous le H1 est le champ description.
- Passage ancré de 150-200 mots dans les 300 premiers mots, qui répond directement à la question cible (featured snippet, visibilité IA).
- H2 = vecteurs sémantiques, hiérarchie cohérente, au moins un angle différenciateur québécois (AMF vs SADC, produits offerts au QC, fiscalité provinciale, paiement minimum 5 %, etc.).
- 800-1500 mots.
- FAQ en bas (questions type People Also Ask) : champ faq du frontmatter, qui alimente l'accordéon et le JSON-LD FAQPage.
- CTA (Know -> Do) vers la page pilier (/investir/, /cartes-credit/ ou /epargne/). Le gabarit ajoute aussi PillarCta.
- Bloc auteur E-E-A-T : « Nicolas Le Guen, fondateur de Fructo Finance ».
- Divulgation honnête : les liens mènent aux sites officiels, AUCUNE commission. hasAffiliateLinks: false.
- Sources officielles uniquement (ARC, Revenu Québec, AMF, OCRI, SADC, Banque du Canada, Office de la protection du consommateur, ACFC, Épargne Placements Québec, sites officiels des institutions). Pas de comparateur tiers comme source primaire.
- Ton : vulgarisation simple + comparatif neutre et factuel (avantages ET inconvénients). Pas de conseil personnalisé ; renvoi à un professionnel inscrit à l'AMF pour le fiscal.
- INTERDIT : tiret cadratin (—). Virgules, deux-points ou parenthèses.
- Mêmes composants, gabarit (layout BlogPost), styles de titres que les articles existants.

## Partie B : balises meta
Générées par BlogPost.astro + Base.astro à partir du frontmatter : title, meta description, canonical (fructofinance.ca), Open Graph (og:type=article, og:image), Twitter Card summary_large_image, JSON-LD BlogPosting + BreadcrumbList + FAQPage, lang fr-CA, dates. Le rédacteur doit donc remplir correctement : title, meta_title, description, slug, keyword, datePublished, dateModified, coverImage, coverAlt, coverTitle, coverCaption, pillar, faq, hasAffiliateLinks: false.

## Partie C : images
- Proposer (pas choisir) 2 à 3 images de banques libres de droits et gratuites (Unsplash, Pexels, Pixabay) : URL source, auteur/crédit, pourquoi elle illustre l'article.
- Licence clairement libre uniquement. Éviter logos de marque, personnes identifiables sensibles, contenus sous copyright.
- Après validation : WebP, 1200 x 630, < 150 Ko, nom SEO minuscules-tirets, dans public/images/blog/ (script scripts/redaction/image.mjs).
- coverImage, coverAlt (< 100 car., mot-clé naturel). width/height, loading eager et fetchpriority high sont gérés par le gabarit.
- Style homogène avec le reste du blog ; signaler une image qui détonne.

## Partie D : structure du site
- 3 piliers hub-and-spoke : /investir/, /cartes-credit/, /epargne/, avec fiches produits et pages d'avis /[pilier]/[produit]/.
- Chaque article renforce le maillage : liens vers la page pilier, les pages d'avis et les articles pertinents (et inversement si possible).
- Charte : blanc dominant, bleu nuit #0A2540, corail #DC3F36 (texte blanc sur boutons), corail clair #F55B52, jaune #EDF06A en micro-accent sur fond foncé seulement. Poppins (titres), Lexend (corps). Violet BANNI. H1 bleu nuit.
- Sitemap, canonicals, URL cohérents (fructofinance.ca).
- Pas de doublon de sujet.

## Partie E : workflow
1. STRATÈGE : sujet depuis docs/redaction/liste-editoriale.md ou proposition à fort potentiel ; vérifie l'absence de doublon.
2. CHERCHEUR : données à la source officielle, URL et date pour chaque donnée.
3. VÉRIFICATEUR : recoupe avec products.json et les articles existants ; signale incohérences et données non confirmées.
4. RÉDACTEUR : Partie A + B, gabarit existant.
5. IMAGES : 2-3 visuels libres de droits (Partie C).
6. POINT D'ARRÊT : article complet + récap des balises + données et sources + images proposées + « à confirmer ». Rien n'est commité/poussé avant le feu vert.
7. Après validation : MDX dans src/content/blog/, image traitée et branchée, build (dist/) vérifié, commit et push.

## Maîtrise de la consommation
Lancement manuel, recherche ciblée (pages officielles, pas de crawl massif), un article ou un petit lot à la fois, estimation de consommation à chaque exécution.
