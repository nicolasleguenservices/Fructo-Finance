/**
 * Fiches auteurs pour le bloc E-E-A-T des articles de blog.
 * La clé est le nom exact utilisé dans le frontmatter `author` des articles.
 */

export interface Author {
  name: string;
  /** Chemin public de la photo (doit exister dans /public/images/...). */
  image: string;
  /** Titre / rôle court affiché sous le nom. */
  role: string;
  /** Rôle très court pour la signature en tête d'article (ex. « Fondateur de Fructo Finance »). */
  shortRole?: string;
  /** Bio courte E-E-A-T (~40-60 mots). */
  bio: string;
  /** Lien vers une page profil (facultatif). */
  url?: string;
}

export const authors: Record<string, Author> = {
  "Nicolas Le Guen": {
    name: "Nicolas Le Guen",
    image: "/images/nicolas-le-guen-fondateur-fructo-finance.webp",
    role: "Spécialiste SEO et fondateur de Fructo Finance",
    shortRole: "Fondateur de Fructo Finance",
    bio: "Nicolas Le Guen est spécialiste du référencement et fondateur de Fructo Finance, comparateur indépendant de produits financiers offerts au Québec. Fructo Finance présente des données vérifiées à la source (courtiers, banques, organismes officiels) et indique la date de dernière vérification.",
    url: "/a-propos",
  },
};

export function getAuthor(name: string): Author {
  return (
    authors[name] ?? {
      name,
      image: "/images/nicolas-le-guen-fondateur-fructo-finance.webp",
      role: "Rédaction Fructo Finance",
      bio: "Rédigé par l'équipe de Fructo Finance, comparateur indépendant de produits financiers offerts au Québec.",
    }
  );
}
