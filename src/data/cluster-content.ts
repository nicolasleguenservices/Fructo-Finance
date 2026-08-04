import type { ClusterId } from "./types";

export interface PedagogicalSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ClusterContent {
  heroTitle: string;
  heroIntro: string;
  metaTitle: string;
  metaDescription: string;
  pedagogicalSections: PedagogicalSection[];
  faqs: FaqItem[];
  authorId: string;
}

// NOTE : contenu éditorial porté depuis la v1. À faire réviser par un éditeur avant
// publication — voir les avertissements "exemple" sur les fiches produits des
// clusters cartes-credit et epargne dans products.json.
export const clusterContent: Record<ClusterId, ClusterContent> = {
  investir: {
    heroTitle: "Meilleurs courtiers en ligne au Québec en 2026",
    heroIntro:
      "Choisir le mauvais courtier en ligne peut vous coûter des centaines de dollars par année en commissions et en frais de conversion de devises. Nous avons comparé les principales plateformes offertes aux Québécois pour vous aider à ouvrir un CELI, un REER ou un CELIAPP en toute confiance.",
    metaTitle: "Meilleurs courtiers en ligne au Québec (2026) : comparatif et avis",
    metaDescription:
      "Comparatif indépendant des meilleurs courtiers en ligne au Québec en 2026 : frais, comptes CELI/REER/CELIAPP, avis détaillés et FAQ.",
    pedagogicalSections: [
      {
        id: "marche-2026",
        heading: "Le marché des courtiers en ligne au Québec en 2026",
        paragraphs: [
          "La majorité des courtiers en ligne offerts aux Canadiens ont éliminé les commissions sur les transactions d'actions et de fonds négociés en bourse (FNB) au cours des dernières années, rendant l'investissement autonome accessible à un public beaucoup plus large.",
          "Au Québec, les investisseurs ont accès aux mêmes plateformes que le reste du Canada, mais doivent parfois composer avec un service à la clientèle ou des documents qui ne sont pas offerts en français selon l'institution — un critère à vérifier avant d'ouvrir un compte.",
        ],
      },
      {
        id: "comment-choisir",
        heading: "Comment choisir un courtier en ligne",
        paragraphs: [
          "Le bon choix dépend surtout de votre profil : un débutant qui veut investir dans quelques FNB n'a pas les mêmes besoins qu'un investisseur actif qui négocie des options ou détient des actions américaines.",
          "Les critères qui comptent le plus : les frais de négociation, les frais de conversion de devises (souvent ignorés, mais coûteux sur le long terme), les types de comptes enregistrés offerts (CELI, REER, CELIAPP, REEE), la qualité de l'application mobile et le fait que le courtier soit membre de l'Organisme canadien de réglementation des investissements (OCRI).",
        ],
      },
      {
        id: "protection-placements",
        heading: "La protection de vos placements",
        paragraphs: [
          "Au Canada, les comptes détenus chez un courtier membre de l'OCRI sont protégés par le Fonds canadien de protection des épargnants (FCPE) jusqu'à concurrence de 1 000 000 $ en cas de faillite du courtier. Cette protection ne couvre pas les pertes liées aux fluctuations normales du marché.",
        ],
      },
    ],
    faqs: [
      {
        question: "Wealthsimple ou Questrade : lequel choisir ?",
        answer:
          "Wealthsimple convient mieux aux débutants grâce à sa simplicité et à l'absence de frais, tandis que Questrade offre un compte en dollars US natif et davantage de types de comptes, ce qui plaira aux investisseurs plus actifs ou aux détenteurs d'actions américaines.",
      },
      {
        question: "CELI ou REER : lequel privilégier pour investir ?",
        answer:
          "Le REER réduit votre revenu imposable et convient bien si votre taux d'imposition est élevé aujourd'hui. Le CELI offre des retraits non imposables et plus de flexibilité. Les deux comptes sont offerts par tous les courtiers comparés ici.",
      },
      {
        question: "Puis-je perdre mon argent avec un courtier en ligne ?",
        answer:
          "La valeur de vos placements peut fluctuer avec le marché, comme avec n'importe quel courtier. En revanche, la faillite du courtier lui-même est un risque distinct, couvert par le Fonds canadien de protection des épargnants (FCPE) jusqu'à 1 000 000 $.",
      },
      {
        question: "Qu'est-ce que le CELIAPP et est-il offert par ces courtiers ?",
        answer:
          "Le CELIAPP (compte d'épargne libre d'impôt pour l'achat d'une première propriété) combine des avantages du REER et du CELI. Il est offert par Wealthsimple et Questrade pour les Canadiens admissibles.",
      },
      {
        question: "Les courtiers en ligne sont-ils sécuritaires ?",
        answer:
          "Oui, à condition qu'ils soient membres de l'OCRI. Vérifiez toujours ce statut avant d'ouvrir un compte : c'est ce qui donne accès à la protection du FCPE.",
      },
      {
        question: "Combien coûte réellement l'investissement autonome ?",
        answer:
          "Les commissions sur actions et FNB sont maintenant à 0 $ chez la plupart des courtiers. Les coûts restants à surveiller sont les frais de conversion de devises (souvent 1 à 2 % par transaction en USD) et les frais de gestion des fonds eux-mêmes (ratio de frais de gestion des FNB).",
      },
    ],
    authorId: "nicolas-leguen",
  },

  "cartes-credit": {
    heroTitle: "Meilleures cartes de crédit au Québec en 2026",
    heroIntro:
      "Entre les frais annuels, le taux d'intérêt et la valeur réelle des récompenses, le choix d'une carte de crédit a un impact direct sur votre portefeuille. Un mauvais choix peut vous coûter plus de 100 $ par année en frais évitables.",
    metaTitle: "Meilleures cartes de crédit au Québec (2026) : comparatif et avis",
    metaDescription:
      "Comparatif indépendant des meilleures cartes de crédit au Québec en 2026 : remises, voyage, frais annuels, avis détaillés et FAQ.",
    pedagogicalSections: [
      {
        id: "marche-2026",
        heading: "Le marché des cartes de crédit au Québec en 2026",
        paragraphs: [
          "Les grandes institutions financières canadiennes se font une forte concurrence sur les programmes de récompenses — remises en argent, points voyage ou points échangeables — ce qui rend la comparaison indispensable avant de faire une demande.",
          "Chaque demande de carte de crédit entraîne une enquête de crédit qui peut avoir un effet temporaire sur votre pointage : mieux vaut comparer soigneusement avant de postuler plutôt que de faire plusieurs demandes rapprochées.",
        ],
      },
      {
        id: "comment-choisir",
        heading: "Comment choisir sa carte de crédit",
        paragraphs: [
          "Commencez par identifier votre priorité : remises en argent sur l'épicerie et l'essence, points voyage, ou simplement aucuns frais annuels si vous utilisez peu votre carte.",
          "Si vous remboursez votre solde au complet chaque mois, le taux d'intérêt importe peu : concentrez-vous plutôt sur les frais annuels et la valeur du programme de récompenses. Si vous risquez de reporter un solde, priorisez un taux d'intérêt bas avant tout le reste.",
        ],
      },
      {
        id: "criteres-bonus",
        heading: "Le bonus de bienvenue : ce qu'il faut vérifier",
        paragraphs: [
          "Un bonus de bienvenue généreux peut valoir plusieurs centaines de dollars, mais il est souvent conditionnel à un montant minimum de dépenses dans les premiers mois. Assurez-vous de pouvoir atteindre ce seuil sans dépenser au-delà de votre budget habituel.",
        ],
      },
    ],
    faqs: [
      {
        question: "Quelle carte de crédit choisir pour les remises en argent ?",
        answer:
          "Priorisez une carte qui offre un pourcentage de remise plus élevé sur vos catégories de dépenses principales (épicerie, essence, restaurants). Comparez aussi le plafond de remise annuel, souvent limité pour les cartes sans frais.",
      },
      {
        question: "Comment éviter de payer des intérêts sur ma carte de crédit ?",
        answer:
          "Remboursez votre solde au complet avant la date d'échéance chaque mois. Les cartes de crédit offrent généralement une période de grâce sans intérêt sur les nouveaux achats tant que le solde précédent est payé en entier.",
      },
      {
        question: "Le bonus de bienvenue en vaut-il la peine ?",
        answer:
          "Souvent oui, s'il correspond à vos habitudes de dépenses normales. Méfiez-vous des offres qui vous pousseraient à dépenser plus que d'habitude uniquement pour atteindre le seuil du bonus.",
      },
      {
        question: "Carte avec frais annuels ou sans frais annuels : que choisir ?",
        answer:
          "Une carte avec frais annuels se justifie si la valeur des récompenses et des protections (assurance voyage, par exemple) dépasse clairement le coût des frais. Sinon, une carte sans frais annuels reste le choix le plus simple.",
      },
      {
        question: "Une carte de crédit affecte-t-elle mon dossier de crédit ?",
        answer:
          "Oui. La demande elle-même entraîne une enquête de crédit, et l'utilisation de la carte par la suite (paiements à temps, taux d'utilisation du crédit disponible) influence votre pointage à long terme, positivement ou négativement.",
      },
      {
        question: "Quelle est la différence entre une carte de crédit et une carte de débit ?",
        answer:
          "La carte de débit puise directement dans votre compte bancaire, sans emprunt. La carte de crédit vous prête de l'argent à rembourser, ce qui permet de bâtir un historique de crédit mais implique un risque d'intérêt si le solde n'est pas remboursé.",
      },
    ],
    authorId: "nicolas-leguen",
  },

  epargne: {
    heroTitle: "Meilleurs comptes d'épargne à intérêt élevé au Québec en 2026",
    heroIntro:
      "Le taux offert par votre compte d'épargne peut faire une différence de plusieurs centaines de dollars par année sur un fonds d'urgence. Voici comment comparer les comptes d'épargne et les banques en ligne offertes aux Québécois.",
    metaTitle: "Meilleurs comptes d'épargne à intérêt élevé au Québec (2026)",
    metaDescription:
      "Comparatif indépendant des meilleurs comptes d'épargne à intérêt élevé au Québec en 2026 : taux, frais, assurance-dépôts, avis détaillés et FAQ.",
    pedagogicalSections: [
      {
        id: "marche-2026",
        heading: "Le marché de l'épargne à intérêt élevé au Québec en 2026",
        paragraphs: [
          "Les banques en ligne offrent généralement des taux d'intérêt plus élevés que les grandes banques traditionnelles, en l'absence de succursales physiques à entretenir. En contrepartie, les services bancaires offerts sont souvent plus limités (pas de guichets, service à la clientèle par téléphone ou clavardage seulement).",
        ],
      },
      {
        id: "comment-choisir",
        heading: "Comment choisir un compte d'épargne",
        paragraphs: [
          "Comparez le taux d'intérêt affiché, mais vérifiez aussi s'il s'agit d'un taux promotionnel temporaire ou d'un taux standard. Assurez-vous aussi qu'il n'y a aucuns frais mensuels ni exigence de solde minimum qui viendraient réduire vos gains.",
          "La protection de vos dépôts est un critère non négociable : privilégiez une institution membre de la Société d'assurance-dépôts du Canada (SADC), qui protège vos dépôts admissibles jusqu'à 100 000 $ par catégorie de compte en cas de faillite de l'institution.",
        ],
      },
      {
        id: "celi-vs-epargne",
        heading: "Compte d'épargne ou CELI pour votre épargne ?",
        paragraphs: [
          "Un compte d'épargne à intérêt élevé hors CELI est simple et liquide, mais les intérêts gagnés sont imposables. Loger votre épargne à l'intérieur d'un CELI (lorsque les droits de cotisation le permettent) vous permet de gagner ces mêmes intérêts à l'abri de l'impôt.",
        ],
      },
    ],
    faqs: [
      {
        question: "CELI ou compte d'épargne à intérêt élevé : lequel choisir ?",
        answer:
          "Ce n'est pas l'un ou l'autre : plusieurs institutions offrent un compte d'épargne à intérêt élevé qui peut être détenu à l'intérieur d'un CELI. Si vous avez des droits de cotisation CELI inutilisés, privilégiez cette option pour éviter l'impôt sur les intérêts gagnés.",
      },
      {
        question: "Mon argent est-il protégé dans une banque en ligne ?",
        answer:
          "Oui, si l'institution est membre de la Société d'assurance-dépôts du Canada (SADC). Vérifiez ce statut avant d'ouvrir un compte : c'est ce qui protège vos dépôts admissibles jusqu'à 100 000 $ par catégorie en cas de faillite.",
      },
      {
        question: "Comment fonctionne l'assurance-dépôts au Canada (SADC) ?",
        answer:
          "La SADC protège automatiquement, sans frais, les dépôts admissibles (comptes d'épargne, CELI, comptes chèques, CPG) jusqu'à 100 000 $ par catégorie de compte, par institution membre.",
      },
      {
        question: "Les taux d'intérêt élevés sont-ils garantis ?",
        answer:
          "Non. Plusieurs institutions offrent un taux promotionnel plus élevé pour une durée limitée (souvent 90 jours) avant de revenir au taux standard. Lisez toujours les conditions avant d'ouvrir un compte pour ce taux uniquement.",
      },
      {
        question: "Compte d'épargne ou CPG : quelle différence ?",
        answer:
          "Le compte d'épargne offre un accès immédiat à votre argent, avec un taux qui peut varier. Le certificat de placement garanti (CPG) verrouille votre argent pour une durée fixe en échange d'un taux généralement garanti, souvent plus élevé.",
      },
      {
        question: "Combien devrais-je garder dans mon fonds d'urgence ?",
        answer:
          "La recommandation courante est l'équivalent de 3 à 6 mois de dépenses essentielles, à conserver dans un compte liquide et sans risque comme un compte d'épargne à intérêt élevé plutôt que dans des placements volatils.",
      },
    ],
    authorId: "nicolas-leguen",
  },
};
