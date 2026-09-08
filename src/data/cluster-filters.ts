import type { ClusterId } from "./types";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

export const clusterFilters: Record<ClusterId, FilterGroup[]> = {
  investir: [
    {
      id: "compte",
      label: "Type de compte",
      options: [
        { label: "CELI", value: "celi" },
        { label: "REER", value: "reer" },
        { label: "CELIAPP", value: "celiapp" },
        { label: "REEE", value: "reee" },
        { label: "Non enregistré", value: "non-enregistre" },
      ],
    },
    {
      id: "profil",
      label: "Profil",
      options: [
        { label: "Débutant", value: "debutant" },
        { label: "Passif (FNB)", value: "passif" },
        { label: "Actif", value: "actif" },
        { label: "Avancé", value: "avance" },
      ],
    },
    {
      id: "frais",
      label: "Frais",
      options: [
        { label: "Sans commission (0 $)", value: "sans-commission" },
        { label: "Sans frais d'administration", value: "sans-frais-admin" },
      ],
    },
    {
      id: "origine",
      label: "Origine",
      options: [
        { label: "Québécois", value: "quebecois" },
        { label: "Grande banque", value: "grande-banque" },
        { label: "International", value: "international" },
      ],
    },
  ],
  "cartes-credit": [
    {
      id: "type",
      label: "Type",
      options: [
        { label: "Remise en argent", value: "remise-argent" },
        { label: "Voyage", value: "voyage" },
        { label: "Points flexibles", value: "points-flexibles" },
      ],
    },
    {
      id: "frais-annuels",
      label: "Frais annuels",
      options: [
        { label: "0 $", value: "0" },
        { label: "< 100 $", value: "moins-100" },
        { label: "100 $ et plus", value: "100-plus" },
      ],
    },
    {
      id: "reseau",
      label: "Réseau",
      options: [
        { label: "Visa", value: "visa" },
        { label: "Mastercard", value: "mastercard" },
        { label: "American Express", value: "amex" },
      ],
    },
    {
      id: "avantage",
      label: "Avantage",
      options: [
        { label: "Sans frais de conversion", value: "sans-frais-conversion" },
        { label: "Assurance voyage", value: "assurance-voyage" },
        { label: "Faible taux d'intérêt", value: "faible-taux-interet" },
      ],
    },
  ],
  epargne: [
    {
      id: "type",
      label: "Type",
      options: [
        {
          label: "Compte épargne à intérêt élevé",
          value: "epargne-interet-eleve",
        },
        { label: "CELI", value: "celi" },
        { label: "Compte chèque à intérêt", value: "compte-cheque-interet" },
        { label: "CPG", value: "cpg" },
      ],
    },
    {
      id: "taux",
      label: "Taux",
      options: [
        { label: "Taux de base élevé (durable)", value: "taux-base-eleve" },
        { label: "Taux promotionnel", value: "taux-promotionnel" },
      ],
    },
    {
      id: "frais",
      label: "Frais",
      options: [{ label: "Sans frais mensuels", value: "sans-frais-mensuels" }],
    },
    {
      id: "assurance",
      label: "Assurance",
      options: [
        { label: "SADC", value: "sadc" },
        { label: "AMF (Québec)", value: "amf-quebec" },
      ],
    },
  ],
};

/**
 * Répartit la liste plate `product.filters` d'une fiche produit selon les groupes de
 * filtres du cluster, pour générer un attribut `data-{groupId}` par groupe sur la box
 * produit (ex. { compte: ["celi", "reer"], profil: ["debutant"] }).
 */
export function groupFiltersByGroup(
  cluster: ClusterId,
  filters: string[] = [],
): Record<string, string[]> {
  const groups = clusterFilters[cluster];
  const valueToGroup = new Map<string, string>();
  for (const group of groups) {
    for (const option of group.options) {
      valueToGroup.set(option.value, group.id);
    }
  }

  const result: Record<string, string[]> = {};
  for (const value of filters) {
    const groupId = valueToGroup.get(value);
    if (!groupId) continue;
    (result[groupId] ??= []).push(value);
  }
  return result;
}
