/**
 * Répartition en 8 postes (100 %) : règles d'allocation par défaut.
 * Chaque règle est soit liée à une catégorie de dépense (type "category"),
 * soit à un objectif d'épargne (type "saving").
 */
export const REPARTITION_RULES = [
  { label: "Essentiel", percentage: 40, type: "category" as const },
  { label: "Fonds d'urgence", percentage: 15, type: "saving" as const },
  { label: "Ecom", percentage: 10, type: "saving" as const },
  { label: "Déménagement", percentage: 10, type: "saving" as const },
  { label: "Mariage", percentage: 5, type: "saving" as const },
  {
    label: "BRVM Trading et autres investissement",
    percentage: 5,
    type: "saving" as const,
  },
  { label: "Dimes", percentage: 10, type: "category" as const },
  { label: "Loisirs", percentage: 5, type: "category" as const },
] as const;

/** Libellés des 5 objectifs d'épargne (un projet + un objectif par libellé). */
export const SAVING_GOAL_LABELS = [
  "Fonds d'urgence",
  "Ecom",
  "Déménagement",
  "Mariage",
  "BRVM Trading et autres investissement",
] as const;

/** Fonds d'urgence est de type EMERGENCY, les autres sont TARGET. */
export const SAVING_GOAL_EMERGENCY_LABEL = "Fonds d'urgence";

/** Items par défaut pour l'objectif d'épargne Déménagement (seed). */
export const DEMENAGEMENT_GOAL_ITEMS = [
  { title: "Lit 2 places", amount: 150000 },
  { title: "Matelas 2 places", amount: 90000 },
  { title: "Grande armoire à vêtements", amount: 195000 },
  { title: "Table de chevet", amount: 20000 },
  { title: "Rideaux de chambre", amount: 20000 },
  { title: "Salon 5 places", amount: 200000 },
  { title: "Table basse", amount: 50000 },
  { title: "TV (55 pouces)", amount: 50000 },
  { title: "Rideaux de salon", amount: 10000 },
  { title: "Tapis de salon (facultatif)", amount: 45000 },
  { title: "Réfrigérateur", amount: 190000 },
  { title: "Gaz", amount: 27000 },
  { title: "Four (facultatif)", amount: 90000 },
  { title: "Micro-ondes (facultatif)", amount: 75000 },
  { title: "Bouilloire électrique", amount: 12500 },
  {
    title:
      "Casseroles, chauffe-eau, assiettes, couteaux, cuillères, fourchettes, verres, torchons",
    amount: 30000,
  },
  { title: "Bureau et chaise de bureau (pas primordial au début)", amount: 150000 },
  { title: "Onduleur", amount: 30000 },
  { title: "Wi-Fi", amount: 15000 },
  { title: "Multiprises", amount: 10000 },
  { title: "Lampe de bureau (facultatif)", amount: 10000 },
  { title: "Fer à repasser", amount: 15000 },
  { title: "Balai + serpillière + seaux", amount: 15000 },
  { title: "Miroir", amount: 25000 },
  { title: "Poubelle", amount: 7500 },
  { title: "Trousse de premiers secours", amount: 18000 },
] as const;
