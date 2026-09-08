import raw from "./products.json";
import type { ClusterId, Product, ProductsData } from "./types";

const data = raw as unknown as ProductsData;

export const allProducts: Product[] = [
  ...data.brokers,
  ...data.credit_cards,
  ...data.savings_accounts,
];

export function getProductsByCluster(cluster: ClusterId): Product[] {
  return allProducts.filter((product) => product.cluster === cluster);
}

/** Produits d'un cluster triés par rang éditorial (rank), puis par score_global décroissant. */
export function getProductsByClusterRanked(cluster: ClusterId): Product[] {
  return getProductsByCluster(cluster).sort((a, b) => {
    if (a.rank != null && b.rank != null) return a.rank - b.rank;
    return (b.score_global ?? 0) - (a.score_global ?? 0);
  });
}

/** Valeur de frais la plus représentative d'un produit, tous clusters confondus. */
export function primaryFee(product: Product): string {
  if (product.fees) {
    return (
      product.fees.commission_actions_fnb ??
      Object.values(product.fees)[0] ??
      "—"
    );
  }
  if (product.card_details) {
    return (
      product.card_details.frais_annuels ??
      Object.values(product.card_details)[0] ??
      "—"
    );
  }
  if (product.account_details) {
    const value =
      product.account_details.frais_mensuels ??
      Object.values(product.account_details)[0];
    return Array.isArray(value) ? value.join(", ") : (value ?? "—");
  }
  return "—";
}

/** Résumé des récompenses d'une carte de crédit (card_details.type_recompenses). */
export function rewardsSummary(product: Product): string {
  return product.card_details?.type_recompenses ?? "—";
}

/** Prime de bienvenue actuelle d'une carte de crédit (card_details.bonus_bienvenue). */
export function welcomeBonus(product: Product): string {
  return product.card_details?.bonus_bienvenue ?? "—";
}

/** Frais annuels au format court pour le tableau comparatif (product.comparatif). */
export function tableFee(product: Product): string {
  return product.comparatif?.frais_annuels ?? primaryFee(product);
}

/** Récompenses au format court pour le tableau comparatif (product.comparatif). */
export function tableRewards(product: Product): string {
  return product.comparatif?.recompenses ?? rewardsSummary(product);
}

/** Prime de bienvenue au format court pour le tableau comparatif (product.comparatif). */
export function tableBonus(product: Product): string {
  return product.comparatif?.prime_bienvenue ?? welcomeBonus(product);
}

/** Verbe d'action du CTA affilié : une carte de crédit fait l'objet d'une "demande", pas d'une "ouverture de compte". */
export function ctaVerb(product: Product): string {
  return product.category === "carte_credit" ? "Faire une demande" : "Ouvrir un compte";
}

function accountDetail(product: Product, key: string): string {
  const value = product.account_details?.[key];
  if (Array.isArray(value)) return value.join(", ");
  return value ?? "—";
}

/** Taux d'intérêt au format court pour le tableau comparatif épargne. */
export function tableRate(product: Product): string {
  return product.comparatif?.taux ?? accountDetail(product, "taux_interet");
}

/** Frais au format court pour le tableau comparatif épargne. */
export function tableSavingsFee(product: Product): string {
  return product.comparatif?.frais ?? accountDetail(product, "frais_mensuels");
}

/** Assurance-dépôts au format court pour le tableau comparatif épargne. */
export function tableInsurance(product: Product): string {
  return (
    product.comparatif?.assurance ?? accountDetail(product, "assurance_depots")
  );
}

export function getProductBySlug(
  cluster: ClusterId,
  slug: string,
): Product | undefined {
  return allProducts.find(
    (product) => product.cluster === cluster && product.slug === slug,
  );
}

export { data as productsData };
