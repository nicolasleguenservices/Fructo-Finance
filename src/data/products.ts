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
      product.fees.trading_actions_fnb ?? Object.values(product.fees)[0] ?? "—"
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

export function getProductBySlug(
  cluster: ClusterId,
  slug: string,
): Product | undefined {
  return allProducts.find(
    (product) => product.cluster === cluster && product.slug === slug,
  );
}

export { data as productsData };
