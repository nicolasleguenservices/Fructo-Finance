export type ClusterId = "investir" | "cartes-credit" | "epargne";

export interface Affiliate {
  type: string;
  network: string;
  url: string;
  commission_note: string;
  cookie_days?: number;
  rel: "sponsored";
}

export interface ScoreBreakdown {
  frais?: number;
  experience_numerique?: number;
  choix_produits?: number;
  service_client?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  /**
   * Logo local optionnel (fichier déposé dans public/logos/). S'il est absent, le
   * logo est récupéré automatiquement par domaine à partir de `url_officiel` — voir
   * ProductLogo.astro. Ne renseigner ce champ que lorsque le fichier existe vraiment.
   */
  logo?: string;
  category: string;
  rating: number;
  cluster: ClusterId;
  affiliate: Affiliate;
  resume: string;
  highlights: string[];
  pros: string[];
  cons: string[];
  fees?: Record<string, string>;
  card_details?: Record<string, string>;
  account_details?: Record<string, string | string[]>;
  comptes_supportes?: string[];
  ideal_pour: string[];
  regulateur?: string;
  emetteur?: string;
  url_officiel: string;
  last_verified: string;
  /** Position dans le classement éditorial du cluster (1 = premier). */
  rank?: number;
  /** Note globale éditoriale sur 10 (méthodologie : frais, expérience numérique, choix de produits, service client). */
  score_global?: number;
  score_breakdown?: ScoreBreakdown;
  /** Courte phrase sous le nom du produit. */
  tagline?: string;
  /** Mini-verdict : pourquoi ce produit se démarque. */
  verdict?: string;
}

export interface ProductsData {
  _meta: {
    description: string;
    avertissement: string;
    derniere_maj: string;
  };
  brokers: Product[];
  credit_cards: Product[];
  savings_accounts: Product[];
}
