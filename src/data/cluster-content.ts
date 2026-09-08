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
  /** Note courte affichée sous la grille de boxes produit (ex. mention de produits additionnels). */
  additionalNote?: string;
}

// NOTE : contenu éditorial porté depuis la v1. À faire réviser par un éditeur avant
// publication — voir les avertissements "exemple" sur les fiches produits des
// clusters cartes-credit et epargne dans products.json.
export const clusterContent: Record<ClusterId, ClusterContent> = {
  investir: {
    heroTitle: "Meilleur courtier en ligne au Québec",
    heroIntro:
      "Le meilleur courtier en ligne au Québec dépend de votre profil : un débutant en FNB et un investisseur actif n'ont pas les mêmes besoins. Ces plateformes vous permettent d'investir vous-même (CELI, REER, CELIAPP) à des frais souvent bien inférieurs à ceux d'un conseiller. Nous comparons ici les courtiers offerts au Québec selon des critères clairs : commissions, comptes, service en français et encadrement (OCRI, FCPE). Trouvez ci-dessous celui qui vous convient.",
    metaTitle: "Meilleur courtier en ligne au Québec (2026) | Fructo Finance",
    metaDescription:
      "Comparez tous les courtiers en ligne offerts au Québec : frais, comptes (CELI, REER, CELIAPP), service en français. Comparatif indépendant et à jour.",
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
        question: "Quel est le meilleur courtier en ligne au Québec pour un débutant ?",
        answer:
          "Pour un débutant qui investit dans des FNB, une plateforme sans commission et en français comme Wealthsimple est souvent citée comme la plus simple pour commencer. Le « meilleur » dépend toutefois de votre profil : comptes recherchés (CELI, REER, CELIAPP), type de placements et niveau d'autonomie.",
      },
      {
        question: "Quels courtiers offrent 0 $ de commission au Québec ?",
        answer:
          "Plusieurs plateformes n'exigent aucune commission sur les actions et FNB canadiens, notamment Wealthsimple (depuis 2018), la Banque Nationale Courtage direct et Desjardins (depuis 2021), ainsi que des acteurs comme moomoo et Webull. Les grandes banques (RBC, TD, BMO, Scotia) facturent généralement entre 5 $ et 10 $ par opération.",
      },
      {
        question: "Un courtier en ligne au Québec est-il sécuritaire ?",
        answer:
          "Les courtiers légitimes sont encadrés par l'OCRI et membres du Fonds canadien de protection des investisseurs (FCPE), qui protège les avoirs jusqu'à un certain plafond en cas de faillite du courtier (ce qui ne couvre pas les pertes liées au marché). Vérifiez toujours l'inscription du courtier.",
      },
      {
        question: "Quels comptes puis-je ouvrir : CELI, REER ou CELIAPP ?",
        answer:
          "La plupart des courtiers offrent le CELI, le REER, le CELIAPP et le compte non enregistré; le REEE et le FERR ne sont pas offerts partout. Le CELIAPP, par exemple, n'est pas disponible chez Interactive Brokers. Vérifiez la liste des comptes avant d'ouvrir.",
      },
      {
        question: "Puis-je investir en français avec ces plateformes ?",
        answer:
          "Plusieurs plateformes offrent un service en français, en particulier les institutions québécoises (Desjardins, Banque Nationale). Pour certains acteurs internationaux, l'interface et le support peuvent être surtout en anglais.",
      },
      {
        question: "Quels sont les frais cachés à surveiller ?",
        answer:
          "Au-delà de la commission par transaction, surveillez les frais de change USD/CAD (souvent ~1,5 %), les frais d'administration ou d'inactivité (souvent ~25 $/trimestre sous un solde minimal) et les frais de transfert de compte.",
      },
    ],
    authorId: "nicolas-leguen",
    additionalNote:
      "Courtiers additionnels à mentionner : CI Investissement direct, Canaccord Genuity Direct.",
  },

  "cartes-credit": {
    heroTitle: "Meilleure carte de crédit au Québec",
    heroIntro:
      "La meilleure carte de crédit au Québec dépend de votre profil : ce qui compte vraiment, c'est la valeur nette, soit les récompenses générées moins les frais annuels. Une carte à 5 % sur l'épicerie avec 120 $ de frais peut rapporter moins qu'une carte à 2 % sans frais, selon vos dépenses réelles. Fructo Finance compare ici les cartes offertes au Québec selon des critères clairs : récompenses, frais annuels, taux d'intérêt, primes de bienvenue et frais de conversion. Rappel : payer le solde en entier chaque mois reste la meilleure stratégie.",
    metaTitle: "Meilleure carte de crédit au Québec (2026) | Fructo Finance",
    metaDescription:
      "Comparez les meilleures cartes de crédit au Québec : remises en argent, voyage, sans frais annuels. Récompenses, frais et primes comparés, en français.",
    pedagogicalSections: [
      {
        id: "reperes-utiles",
        heading: "Quelques repères utiles",
        paragraphs: [
          "La plupart des cartes canadiennes facturent environ 2,5 % de frais sur les transactions en devises étrangères; quelques cartes les éliminent complètement.",
          "Les points Aéroplan valent généralement entre 1,5 et 2,5 ¢ chacun selon la façon dont ils sont échangés.",
          "Les points Scène+ valent 1 ¢ chacun (1 000 points = 10 $) et peuvent notamment être utilisés à l'épicerie chez IGA et Sobeys.",
        ],
      },
    ],
    faqs: [
      {
        question: "Quelle est la meilleure carte de crédit au Québec ?",
        answer:
          "Il n'y a pas de réponse unique : la meilleure carte dépend de vos habitudes de dépenses. Le bon critère est la valeur nette annuelle (récompenses générées moins frais annuels). Comparez selon votre budget épicerie, essence, voyage et le type de récompenses souhaité.",
      },
      {
        question: "Remise en argent ou points de voyage : que choisir ?",
        answer:
          "La remise en argent est la plus simple (un crédit sur votre relevé). Les points de voyage peuvent offrir plus de valeur si vous voyagez, mais demandent plus de gestion. Choisissez selon votre volonté d'optimiser et vos habitudes de voyage.",
      },
      {
        question:
          "Quel est le paiement minimum obligatoire sur une carte de crédit au Québec ?",
        answer:
          "Depuis le 1er août 2025, le paiement minimum mensuel est d'au moins 5 % du solde pour toutes les cartes au Québec (les cartes émises après août 2019 y étaient déjà soumises). Cette règle découle de la Loi sur la protection du consommateur (projet de loi 134) et vise à réduire l'endettement. Ailleurs au Canada, le minimum peut être aussi bas que 3 % ou 10 $. Payer plus que le minimum, idéalement le solde en entier, réduit fortement les frais d'intérêt.",
      },
      {
        question: "Y a-t-il des frais sur les achats en devises étrangères ?",
        answer:
          "La plupart des cartes canadiennes facturent environ 2,5 % sur les transactions en devises étrangères. Certaines cartes éliminent ces frais : utiles si vous voyagez ou magasinez en ligne à l'étranger.",
      },
      {
        question: "Une carte sans frais annuels vaut-elle le coup ?",
        answer:
          "Souvent oui, surtout si vos dépenses sont modérées : une carte à 2 % sans frais peut rapporter plus qu'une carte à récompenses élevées avec 120 $ de frais. Faites le calcul selon vos dépenses réelles.",
      },
      {
        question: "Comment bâtir ou améliorer son crédit avec une carte au Québec ?",
        answer:
          "Utilisez la carte régulièrement pour de petits achats, payez le solde en entier et à temps, et gardez votre taux d'utilisation bas. Les cartes sans frais annuels sont souvent un bon point de départ pour un premier historique.",
      },
      {
        question:
          "Comment se présente le marché des cartes de crédit au Québec ?",
        answer:
          "Les grandes institutions financières canadiennes se font une forte concurrence sur les programmes de récompenses — remises en argent, points voyage ou points échangeables — ce qui rend la comparaison indispensable avant de faire une demande. À noter aussi : chaque demande de carte de crédit entraîne une enquête de crédit qui peut avoir un effet temporaire sur votre pointage, donc mieux vaut comparer soigneusement avant de postuler plutôt que de faire plusieurs demandes rapprochées.",
      },
      {
        question: "Comment choisir sa carte de crédit ?",
        answer:
          "Commencez par identifier votre priorité : remises en argent sur l'épicerie et l'essence, points voyage, ou simplement aucuns frais annuels si vous utilisez peu votre carte. Si vous remboursez votre solde au complet chaque mois, le taux d'intérêt importe peu : concentrez-vous plutôt sur les frais annuels et la valeur du programme de récompenses. Si vous risquez de reporter un solde, priorisez un taux d'intérêt bas avant tout le reste.",
      },
      {
        question: "À quoi faire attention avec un bonus de bienvenue ?",
        answer:
          "Un bonus de bienvenue généreux peut valoir plusieurs centaines de dollars, mais il est souvent conditionnel à un montant minimum de dépenses dans les premiers mois. Assurez-vous de pouvoir atteindre ce seuil sans dépenser au-delà de votre budget habituel. Les primes de bienvenue changent très souvent : confirmez toujours l'offre en vigueur sur le site de l'émetteur avant de faire une demande.",
      },
    ],
    authorId: "nicolas-leguen",
    additionalNote:
      "Cartes additionnelles à évaluer pour un ajout futur : CIBC Dividende, Amex Aéroplan Reserve, Rogers Red World Elite Mastercard, Neo Financial.",
  },

  epargne: {
    heroTitle: "Meilleur compte d'épargne au Québec",
    heroIntro:
      "Le meilleur compte d'épargne au Québec est celui qui offre un taux élevé et durable, sans frais ni solde minimum. Attention au piège du taux promotionnel : certaines banques affichent près de 5 % pendant quelques mois, puis retombent sous 1 %. Fructo Finance compare ici les comptes offerts au Québec selon le taux de base, les frais, l'assurance-dépôts (SADC ou AMF) et le type de compte. Rappel utile : logés dans un CELI, vos intérêts sont à l'abri de l'impôt.",
    metaTitle: "Meilleur compte d'épargne au Québec (2026) | Fructo Finance",
    metaDescription:
      "Comparez les meilleurs comptes d'épargne à intérêt élevé offerts au Québec : taux, frais, CELI et assurance-dépôts (SADC, AMF). Comparatif indépendant, en français.",
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
        question: "Quel est le meilleur compte d'épargne au Québec ?",
        answer:
          "Le meilleur compte offre un taux de base élevé et durable, sans frais ni solde minimum. Pour une épargne conservée longtemps, un taux de base stable (Banque EQ, Oaken) vaut souvent mieux qu'un taux promotionnel temporaire. Le bon choix dépend de votre horizon et de votre besoin d'accès.",
      },
      {
        question: "Quelle différence entre un taux promotionnel et un taux de base ?",
        answer:
          "Un taux promotionnel (par exemple près de 5 %) s'applique aux nouveaux dépôts pour une durée limitée, souvent 3 à 5 mois, puis le solde retombe au taux de base, parfois sous 1 %. Un taux de base élevé s'applique en continu. Pour une épargne à long terme, le taux de base compte davantage.",
      },
      {
        question: "Mon argent est-il protégé dans un compte d'épargne au Québec ?",
        answer:
          "Oui, jusqu'à certaines limites. La plupart des banques en ligne (Banque EQ, Tangerine, Wealthsimple, Neo, Oaken) sont membres de la SADC, qui protège les dépôts admissibles jusqu'à 100 000 $ par catégorie et par institution. Au Québec, les dépôts chez Desjardins sont plutôt protégés par l'Autorité des marchés financiers (AMF). Oaken peut atteindre 200 000 $ en répartissant les dépôts entre deux entités.",
      },
      {
        question: "Quelles banques en ligne sont offertes au Québec ?",
        answer:
          "Banque EQ, Tangerine, Wealthsimple, Neo Financial, Oaken et KOHO sont accessibles au Québec. À noter : Simplii Financial n'est pas offert au Québec, contrairement à ce qu'indiquent plusieurs comparateurs canadiens.",
      },
      {
        question: "Vaut-il mieux un compte d'épargne ordinaire ou un CELI ?",
        answer:
          "Si votre argent risque d'être imposé, un CELI est souvent préférable : les intérêts y sont à l'abri de l'impôt. Plusieurs institutions offrent un compte d'épargne CELI. Pour un fonds d'urgence, un CELI d'épargne combine accès rapide et intérêts non imposables.",
      },
      {
        question: "Les intérêts d'un compte d'épargne sont-ils imposables ?",
        answer:
          "Oui. Hors d'un compte enregistré (CELI, REER, CELIAPP), les intérêts gagnés sont pleinement imposables et doivent être déclarés. Dans un CELI, ils ne le sont pas. (Voir les règles de l'ARC.)",
      },
    ],
    authorId: "nicolas-leguen",
  },
};
