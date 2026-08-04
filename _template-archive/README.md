# Archive du template Automark original

Ce dossier contient toutes les pages, composants et intégrations du template
Automark original qui ne sont **pas utilisés** dans le site Finance Québec
actuel (retirés aux Étapes 2 et 5 de la migration), conservés ici pour
référence et réutilisation future.

**Ce dossier est en dehors de `src/` et n'est jamais lu par Astro** — ni le
serveur de dev, ni le build de production. Il est purement documentaire.

## Contenu

- `.agents/skills/gohighlevel/`, `.agents/skills/stripe-*/` — skills liés aux
  intégrations GoHighLevel (CRM) et Stripe (paiement), non utilisées ici.
- `src/pages/pricing.astro`, `src/pages/careers/`, `src/pages/case-study/`,
  `src/pages/integrations.astro` — pages du template SaaS d'origine.
- `src/pages/api/checkout.ts`, `lead.ts`, `contact.ts`, `webhooks/stripe.ts` —
  routes API liées à GoHighLevel et Stripe.
- `src/layouts/components/PricingSection.astro`, `PricingCard.astro`,
  `PricingCheckout.tsx`, `CareerCard.astro`, `CareerApplyForm.astro`,
  `CaseStudyCard.astro`, `IntegrationCard.astro`, `LeadGeneration.astro`,
  `TeamCard.astro` — composants associés aux pages ci-dessus.
- `src/layouts/partials/GHLMeeting.astro` — modal de réservation GoHighLevel.
- `src/content/pricing/`, `src/content/careers/`, `src/content/case-study/`,
  `src/content/integrations/` — données de contenu associées.
- `src/content/about/-index.md` — ancienne page "About" du template (fausse
  équipe, faux chiffres), remplacée à l'Étape 5 par une page réelle plus
  simple.
- `src/content/blog/post-1.md` à `post-6.md`, `human-touch-ai-marketing.md` —
  faux articles de blog SaaS du template, remplacés par le vrai contenu.
- `src/content/pages/privacy-policy.md`, `term-and-condition.md` — pages
  légales du template (texte Lorem Ipsum), remplacées par `mentions-legales.md`.

## Comment réutiliser un élément

Chaque fichier a gardé son chemin d'origine relatif au projet (ex.
`_template-archive/src/layouts/components/PricingCard.astro` correspondait à
`src/layouts/components/PricingCard.astro`). Pour réactiver un élément :
recopier le fichier à son emplacement d'origine sous `src/`, puis l'adapter
au thème et aux conventions actuelles du projet (voir Étape 3 pour la charte
graphique — ces fichiers utilisent encore l'ancienne palette violette du
template et devront être recolorés).

Si tu me demandes de retravailler « la page pricing du template », « le
composant carrousel d'intégrations », etc., c'est ici que je vais chercher.
