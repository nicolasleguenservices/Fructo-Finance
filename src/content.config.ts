import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const commonFields = {
  title: z.string(),
  description: z.string().optional(),
  meta_title: z.string().optional(),
  date: z.coerce.date().optional(),
  image: z.string().optional(),
  draft: z.boolean().optional(),
};

// Collection « blog » — architecture SEO commune à tous les articles Fructo Finance.
const blogCollection = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!**/-*.{md,mdx}"],
    base: "src/content/blog",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    meta_title: z.string().optional(),
    /** Segment d'URL : /blog/[slug]. Par défaut, le nom du fichier. */
    slug: z.string().optional(),
    /** Mot-clé principal ciblé (usage éditorial / interne). */
    keyword: z.string().optional(),
    author: z.string().default("Nicolas Le Guen"),
    datePublished: z.coerce.date(),
    dateModified: z.coerce.date().optional(),
    coverImage: z.string(),
    coverAlt: z.string(),
    /** Attribut title de l'image de couverture (infobulle au survol). Optionnel. */
    coverTitle: z.string().optional(),
    /** Légende affichée sous l'image de couverture (<figcaption>). Optionnel. */
    coverCaption: z.string().optional(),
    /** Dimensions réelles de coverImage (évite tout CLS). Par défaut : format paysage standard du site. */
    coverWidth: z.number().default(1200),
    coverHeight: z.number().default(630),
    /** "contain" pour une image qui ne doit pas être rognée (ex. composition avec logos à ne pas couper). */
    coverFit: z.enum(["cover", "contain"]).default("cover"),
    pillar: z.enum(["investir", "cartes-credit", "epargne"]),
    draft: z.boolean().default(false),
    /** Affiche l'encart de divulgation d'affiliation quand true. */
    hasAffiliateLinks: z.boolean().default(false),
    /** FAQ visible en bas d'article + source du JSON-LD FAQPage. */
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default(() => []),
  }),
});

// Collection « reviews » — pages « avis complet » (spokes) rattachées à un pilier.
// Le corps MDX porte les sections détaillées en prose (Frais, Comptes, Plateforme,
// Sécurité, Pour qui, Avantages/Inconvénients, vs alternatives). Le frontmatter porte
// les blocs structurés (avis en bref, passage ancré, case grise, étapes, FAQ, verdict).
const reviewsCollection = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!**/-*.{md,mdx}"],
    base: "src/content/reviews",
    // ID scopé par pilier : le loader utilise `data.slug` comme id par défaut,
    // ce qui provoque une collision silencieuse (entrée écrasée) dès que deux
    // piliers différents réutilisent le même slug (ex. "wealthsimple" en
    // investir et en épargne). Le slug reste l'unique source du segment
    // d'URL (voir `[pilier]/[produit].astro`), seul l'id interne change.
    generateId: ({ entry, data }) =>
      `${data.pillar}/${entry.replace(/\.(md|mdx)$/, "")}`,
  }),
  schema: z.object({
    /** <title> (≤ 60 car.) : "[Produit] : avis complet (année) | Fructo Finance". */
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string(),
    /** Segment d'URL : /[pilier]/[slug]. Par défaut, le nom du fichier. */
    slug: z.string().optional(),
    /** Mot-clé principal ciblé (usage éditorial / interne). */
    keyword: z.string().optional(),
    /** Identifiant du produit dans src/data/products.json (badges, lien affilié, logo, pilier). */
    productId: z.string(),
    pillar: z.enum(["investir", "cartes-credit", "epargne"]),
    author: z.string().default("Nicolas Le Guen"),
    datePublished: z.coerce.date(),
    dateModified: z.coerce.date().optional(),
    /** Date de dernière vérification affichée (ex. "septembre 2026"). */
    lastVerified: z.string(),
    draft: z.boolean().default(false),
    /** Chapô sous le H1 : verdict en une phrase, avec le mot-clé. */
    chapo: z.string(),
    /** Encadré résumé (featured snippet) : pour qui / points forts / points faibles. */
    enBref: z.object({
      pourQui: z.string(),
      forts: z.array(z.string()).min(1),
      faibles: z.array(z.string()).min(1),
    }),
    /** Passage ancré : réponse directe "[Produit] est-il un bon choix au Québec ?" (150-200 mots). */
    passageAncre: z.object({ question: z.string(), reponse: z.string() }),
    /** "Case grise" : mêmes champs que la fiche du pilier, format label/valeur. */
    caracteristiques: z
      .array(z.object({ label: z.string(), valeur: z.string() }))
      .min(1),
    /** "Comment ouvrir un compte" : étapes courtes + CTA affilié rendu par le gabarit. */
    ouvrir: z.object({
      intro: z.string().optional(),
      etapes: z.array(z.string()).min(1),
    }),
    /** FAQ (PAA) : accordéon + source du JSON-LD FAQPage. */
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default(() => []),
    /** Verdict final (paragraphe) précédant le CTA. */
    verdict: z.string(),
    /** Ligne "Sources" du bloc de transparence. */
    sources: z.string(),
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({ ...commonFields }),
});

const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    ...commonFields,
    page_header: z
      .object({ title: z.string(), subtitle: z.string() })
      .optional(),
    contact_info: z
      .object({
        enable: z.boolean(),
        items: z.array(
          z.object({
            type: z.string(),
            title: z.string(),
            detail: z.string(),
            link: z.string().optional(),
            icon: z.string().optional(),
          }),
        ),
      })
      .optional(),
  }),
});

const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    banner: z.object({
      badge: z.string().optional(),
      title: z.string(),
      content: z.string(),
      image: z.string().optional(),
      button_primary: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
      button_secondary: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
    }),
    main_features: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string().optional(),
      content: z.string().optional(),
      items: z.array(z.string()),
    }),
    value_props: z
      .object({
        enable: z.boolean(),
        badge: z.string().optional(),
        title: z.string(),
        content: z.string(),
        items: z.array(
          z.object({
            logo: z.string(),
            title: z.string(),
            list: z.array(z.string()).optional(),
          }),
        ),
      })
      .optional(),
    partners: z
      .object({ badge: z.string().optional(), title: z.string() })
      .optional(),
    smart_platform: z
      .object({
        badge: z.string().optional(),
        title: z.string(),
        content: z.string(),
        cards: z.array(z.object({ title: z.string(), logo: z.string() })),
      })
      .optional(),
    our_features: z
      .object({
        enable: z.boolean(),
        badge: z.string().optional(),
        title: z.string(),
        content: z.string(),
        items: z.array(
          z.object({
            logo: z.string(),
            title: z.string(),
            is_starred: z.boolean(),
          }),
        ),
      })
      .optional(),
    testimonial_quote: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string(),
      quote: z.string(),
    }),
    single_testimonial: z
      .object({
        enable: z.boolean(),
        stats: z.array(z.object({ value: z.string(), label: z.string() })),
        testimonial: z.object({
          quote: z.string(),
          avatar: z.string(),
          name: z.string(),
          company: z.string(),
        }),
      })
      .optional(),
    growth_process: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string(),
      subtitle: z.string().optional(),
      disclosure: z.string().optional(),
      items: z.array(
        z.object({
          logo: z.string(),
          title: z.string(),
          content: z.string(),
        }),
      ),
      button: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
    }),
    integrations: z
      .object({
        enable: z.boolean(),
        badge: z.string().optional(),
        title: z.string(),
        items: z.array(z.object({ image: z.string(), alt: z.string() })),
      })
      .optional(),
  }),
});

const blogIndexCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({
    ...commonFields,
    page_header: z
      .object({ title: z.string(), featured_post: z.string().optional() })
      .optional(),
    featured_post: z.object({ enable: z.boolean() }).optional(),
    latest_posts: z
      .object({ enable: z.boolean(), title: z.string() })
      .optional(),
  }),
});

const ctaSectionCollection = defineCollection({
  loader: glob({
    pattern: "call-to-action.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    badge: z.string().optional(),
    title: z.string(),
    description: z.string(),
    button: z.object({
      enable: z.boolean(),
      label: z.string(),
      link: z.string(),
    }),
  }),
});

const comparisonRowSectionCollection = defineCollection({
  loader: glob({
    pattern: "comparison-row.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    badge: z.string().optional(),
    title: z.string(),
    price_suffix: z.string().optional(),
    items: z.array(
      z.object({
        title: z.string(),
        price: z.string(),
        images: z.array(z.string()),
      }),
    ),
  }),
});

const faqSectionCollection = defineCollection({
  loader: glob({ pattern: "faq.{md,mdx}", base: "src/content/sections" }),
  schema: z.object({
    enable: z.boolean(),
    badge: z.string().optional(),
    title: z.string(),
    description: z.string(),
    button: z.object({
      enable: z.boolean(),
      label: z.string(),
      link: z.string(),
    }),
    items: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
});

const brandsSectionCollection = defineCollection({
  loader: glob({ pattern: "brands.{md,mdx}", base: "src/content/sections" }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    images: z.array(z.object({ src: z.string(), alt: z.string() })),
  }),
});

const ourStorySectionCollection = defineCollection({
  loader: glob({ pattern: "our-story.{md,mdx}", base: "src/content/sections" }),
  schema: z.object({
    enable: z.boolean(),
    badge: z.string().optional(),
    title: z.string(),
    ceo: z.object({ image: z.string(), name: z.string(), role: z.string() }),
    letter: z.string(),
    letter_points_title: z.string().optional(),
    letter_points: z.array(z.string()),
    closing_content: z.string().optional(),
    button: z.object({
      enable: z.boolean(),
      label: z.string(),
      link: z.string(),
    }),
  }),
});

const testimonialSectionCollection = defineCollection({
  loader: glob({
    pattern: "testimonial.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    testimonials: z.array(
      z.object({
        name: z.string(),
        designation: z.string(),
        poster: z.string(),
        content: z.string(),
        video: z.string().optional(),
      }),
    ),
  }),
});

const businessNeedsSectionCollection = defineCollection({
  loader: glob({
    pattern: "business-needs.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    badge: z.string().optional(),
    title: z.string(),
    items: z.array(
      z.object({
        image: z.string(),
        number: z.string(),
        title: z.string(),
        content: z.string(),
      }),
    ),
  }),
});

export const collections = {
  blog: blogCollection,
  reviews: reviewsCollection,
  blogIndex: blogIndexCollection,
  pages: pagesCollection,
  contact: contactCollection,
  homepage: homepageCollection,
  ctaSection: ctaSectionCollection,
  faqSection: faqSectionCollection,
  brandsSection: brandsSectionCollection,
  ourStorySection: ourStorySectionCollection,
  testimonialSection: testimonialSectionCollection,
  comparisonRowSection: comparisonRowSectionCollection,
  businessNeedsSection: businessNeedsSectionCollection,
};
